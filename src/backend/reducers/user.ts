import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordModel } from 'pocketbase';
import {
    app_toggle,
    appDispatch,
    fetch_subscription,
    RootState,
    worker_refresh
} from '.';
import {
    getDomain,
    GLOBAL,
    LOCAL,
    POCKETBASE,
    UserEvents
} from '../../../src-tauri/api';
import { remotelogin } from '../actions';
import { addDays } from '../utils/dateHandler';
import { BuilderHelper } from './helper';

export type PaymentStatus =
    | {
          status: 'PAID' | 'IMPORTED';
          plan: string;
          cluster: string;
          correct_domain: boolean;
          node: string;

          total_usage: number;
          created_at: string;

          limit_hour?: number;
          ended_at?: string;
          template: {
              image: string | null;
              code: string;
              name: string;
          };
          local_metadata?: {
              ram?: string;
              vcpu?: string;
          };
      }
    | {
          status: 'NO_ACTION';

          domains?: {
              domain: string;
              free: number;
          }[];
      }
    | {
          status: 'PENDING';
      }
    | {
          status: 'CANCEL';
      };

type Data = RecordModel & {
    subscription: PaymentStatus;
    volume_id: string;
};

const isUUID = (uuid) =>
    uuid.match(
        '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
    ) != null;
const initialState: Data = {
    collectionId: '',
    collectionName: '',

    id: 'unknown',
    email: '',
    volume_id: '',
    created: '',
    updated: '',
    subscription: {
        status: 'NO_ACTION'
    }
};

export const userAsync = {
    fetch_user: createAsyncThunk(
        'fetch_user',
        async (): Promise<RecordModel & { volume_id: string }> => {
            const {
                items: [result]
            } = await POCKETBASE.collection('users').getList(1);
            const [vol] = await POCKETBASE.collection('volumes').getFullList<{
                local_id: string;
            }>();

            return result != undefined
                ? vol != undefined
                    ? { ...result, volume_id: vol.local_id }
                    : { ...result, volume_id: '' }
                : initialState;
        }
    ),
    fetch_subscription: createAsyncThunk(
        'fetch_subscription',
        async (_: void, { getState }): Promise<PaymentStatus> => {
            const { id, email, volume_id } = (getState() as RootState).user;
            if (id == 'unknown') return { status: 'NO_ACTION' };

            const { data: sub, error: errr1 } = await GLOBAL()
                .from('subscriptions')
                .select(
                    'id,plan,cluster,local_metadata,created_at,ended_at,local_metadata->>template'
                )
                .or(
                    `ended_at.gt.${new Date().toISOString()}, ended_at.is.${null}`
                )
                .eq('user', email)
                .is('cancelled_at', null)
                .order('created_at', { ascending: false })
                .limit(1);
            if (errr1) throw new Error(errr1.message);

            let result = { status: 'NO_ACTION' } as PaymentStatus;
            if (sub.length == 0) result = { status: 'NO_ACTION' };
            else {
                const [
                    {
                        id: subscription_id,
                        plan: plan_id,
                        cluster: cluster_id,
                        created_at,
                        ended_at,
                        local_metadata
                    }
                ] = sub;
                const { data, error: err } = await GLOBAL()
                    .from('payment_request')
                    .select('status,expire_at')
                    .eq('subscription', subscription_id);
                if (err) throw new Error(err.message);
                else if (data.length == 0) result = { status: 'NO_ACTION' };
                else {
                    const [{ status, expire_at }] = data;
                    if (
                        status == 'PENDING' &&
                        new Date(expire_at) > new Date()
                    ) {
                        result = { status };
                    } else if (status == 'PAID' || status == 'IMPORTED') {
                        const {
                            data: [{ name: plan, limit_hour }],
                            error: errrr
                        } = await GLOBAL()
                            .from('plans')
                            .select('name,policy->limit_hour')
                            .eq('id', plan_id);
                        if (errrr) throw new Error(errrr.message);

                        const {
                            data: [{ domain: cluster }],
                            error: errrrr
                        } = await GLOBAL()
                            .from('clusters')
                            .select('domain')
                            .eq('id', cluster_id);
                        if (errrrr) throw new Error(errrrr.message);

                        const origin = new URL(window.location.href).host;
                        result = {
                            status,
                            cluster,
                            correct_domain:
                                origin.includes('localhost') ||
                                origin == cluster,
                            plan,
                            local_metadata,
                            limit_hour,
                            created_at,
                            ended_at
                        } as PaymentStatus;

                        if (
                            isUUID(volume_id) &&
                            (result.status == 'PAID' ||
                                result.status == 'IMPORTED')
                        ) {
                            const { data, error } = await LOCAL().rpc(
                                'get_volume_usage',
                                {
                                    volume_id,
                                    _to: new Date().toISOString(),
                                    _from: created_at
                                }
                            );
                            if (error) throw error;
                            result.total_usage = data ?? 0;

                            const { data: map, error: errr } = await LOCAL()
                                .from('volume_map')
                                .select('node,size')
                                .eq('id', volume_id)
                                .limit(1);
                            if (errr) throw errr;
                            else if (map.length == 0) return result;
                            const [{ node, size }] = map;

                            const { data: stores, error: err } = await LOCAL()
                                .from('stores')
                                .select('metadata->screenshots,name')
                                .eq('code_name', size)
                                .limit(1);
                            if (err) throw err;
                            else if (stores.length > 0) {
                                const [{ screenshots, name }] = stores;
                                if (screenshots == null)
                                    result.template = {
                                        image: null,
                                        code: size,
                                        name: name
                                    };
                                else
                                    result.template = {
                                        image:
                                            screenshots[
                                                Math.round(
                                                    Math.random() *
                                                        ((screenshots as any[])
                                                            .length -
                                                            1)
                                                )
                                            ]?.path_full ?? null,
                                        code: size,
                                        name: name
                                    };
                            } else {
                                result.template = {
                                    image: null,
                                    code: size,
                                    name: `${size}G`
                                };
                            }

                            result.node = node;
                        }
                    }
                }
            }

            if (result.status == 'NO_ACTION') {
                let { data: domains, error } = await GLOBAL().rpc(
                    'get_domains_availability'
                );
                if (error) throw error;

                domains = (
                    await Promise.all(
                        domains.map(async (dom) => {
                            try {
                                const { ok } = await fetch(
                                    `https://${dom.domain}`
                                );
                                if (!ok) throw new Error('not ok');
                            } catch (err) {
                                UserEvents({
                                    type: 'domain/test_fail',
                                    payload: { ...dom, error: err }
                                });
                                return null;
                            }
                            return dom;
                        })
                    )
                ).filter((dom) => dom != null);
                result = { domains, status: 'NO_ACTION' };
            }

            return result;
        }
    ),
    get_payment: createAsyncThunk(
        'get_payment',
        async (
            input: { plan: string; domain: string } | undefined,
            { getState }
        ): Promise<string> => {
            const expire_at = new Date(
                new Date().getTime() + 1000 * 60 * 60 * 3
            ).toISOString();
            const {
                user: { email }
            } = getState() as RootState;

            const { data: existSub, error: errr } = await GLOBAL()
                .from('subscriptions')
                .select('id')
                .eq('user', email)
                .or(
                    `ended_at.gt.${new Date().toISOString()}, ended_at.is.${null}`
                )
                .is('cancelled_at', null)
                .order('created_at', { ascending: false })
                .limit(1);
            if (errr) throw new Error(errr.message);
            if (existSub.length > 0) {
                const { data: payPending, error: errr } = await GLOBAL()
                    .from('payment_request')
                    .select('result->data->>checkoutUrl,status')
                    .gt('expire_at', new Date().toISOString())
                    .eq('status', 'PENDING')
                    .eq('subscription', existSub[0]?.id);
                if (errr) throw new Error(errr.message);
                else if (payPending.length != 0)
                    return payPending[0].checkoutUrl;

                const { data: paymentPaid, error: err } = await GLOBAL()
                    .from('payment_request')
                    .select('id')
                    .or('status.eq.PAID,status.eq.IMPORTED')
                    .eq('subscription', existSub[0]?.id);
                if (err) throw new Error(errr.message);
                else if (paymentPaid.length != 0) {
                    const {
                        data: [{ checkoutUrl }],
                        error: err
                    } = await GLOBAL()
                        .from('payment_request')
                        .insert({ subscription: existSub[0]?.id, expire_at })
                        .select('result->data->>checkoutUrl');
                    if (err) throw new Error(err.message);
                    return checkoutUrl;
                }
            }

            if (input == undefined) throw new Error('Bạn đã đăng kí dịch vụ');

            const { plan: plan_name, domain } = input;
            const {
                data: [_plans],
                error: errrr
            } = await GLOBAL().from('plans').select('id, policy->>total_days').eq('name', plan_name);
            if (errrr) throw new Error(errrr.message);
            else if (_plans == undefined)
                throw new Error('gói dịch vụ hiện đang tạm đóng');
            const { id: plan, total_days } = _plans;

            const {
                data: [cluster_ele],
                error: errrrr
            } = await GLOBAL()
                .from('clusters')
                .select('id')
                .eq('domain', domain);
            if (errrrr) throw new Error(errrrr.message);
            else if (cluster_ele == undefined)
                throw new Error('dịch vụ hiện chưa triển khai trên domain');
            const { id: cluster } = cluster_ele;

            if (domain != getDomain()) await remotelogin(domain, email);

            const {
                data: [{ id: subscription }],
                error
            } = await GLOBAL()
                .from('subscriptions')
                .insert({
                    user: email,
                    plan,
                    cluster,
                    local_metadata: {},
                    ended_at: addDays(new Date(), Number.parseInt(total_days)).toISOString()
                })
                .select('id');
            if (error) throw new Error(error.message);

            const {
                data: [{ checkoutUrl }],
                error: err
            } = await GLOBAL()
                .from('payment_request')
                .insert({ expire_at, subscription })
                .select('result->data->>checkoutUrl');
            if (err) throw new Error(err.message);

            return checkoutUrl;
        }
    ),
    change_template: createAsyncThunk(
        'change_template',
        async (
            { template }: { template: string } | undefined,
            { getState }
        ): Promise<void> => {
            const { volume_id, subscription } = (getState() as RootState).user;
            if (
                isUUID(volume_id) &&
                (subscription.status == 'PAID' ||
                    subscription.status == 'IMPORTED')
            ) {
                const { error } = await LOCAL()
                    .from('volume_map')
                    .update({ size: template })
                    .eq('id', volume_id);
                if (error) throw new Error(error.message);

                await appDispatch(worker_refresh());
                await appDispatch(fetch_subscription());
                appDispatch(app_toggle('connectPc'));
            } else throw new Error('no volume available');
        }
    )
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_update: (
            state,
            action: PayloadAction<RecordModel & { volume_id: string }>
        ) => {
            state.id = action.payload.id;
            state.collectionId = action.payload.collectionId;
            state.collectionName = action.payload.collectionName;
            state.created = action.payload.created;
            state.updated = action.payload.updated;
            state.email = action.payload.email;
            state.expand = action.payload.expand;
            state.volume_id = action.payload.volume_id;
        },
        user_check_sub: (state, action) => {
            state.isExpired = action.payload.isExpired;
            state.isNearbyEndTime = action.payload.isNearbyEndTime;
            state.isNearbyUsageHour = action.payload.isNearbyUsageHour;
        },
        user_delete: (state) => {
            state.id = initialState.id;
            state.stat = initialState.stat;
            POCKETBASE.authStore.clear();
        }
    },
    extraReducers: (builder) => {
        BuilderHelper<Data, any, any>(
            builder,
            {
                fetch: userAsync.fetch_user,
                hander: (state, action) => {
                    state.id = action.payload.id;
                    state.collectionId = action.payload.collectionId;
                    state.volume_id = action.payload.volume_id;
                    state.collectionName = action.payload.collectionName;
                    state.created = action.payload.created;
                    state.updated = action.payload.updated;
                    state.expand = action.payload.expand;
                    state.email = action.payload.email;
                    state.stat = action.payload.stat;
                }
            },
            {
                fetch: userAsync.fetch_subscription,
                hander: (state, action) => {
                    state.subscription = action.payload;
                }
            },
            {
                fetch: userAsync.get_payment,
                hander: (state, action) => {
                    window.open(action.payload, '_self');
                }
            },
            {
                fetch: userAsync.change_template,
                hander: (state, action) => {}
            }
        );
    }
});
