import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordModel } from 'pocketbase';
import {
    app_toggle,
    appDispatch,
    fetch_subscription,
    RootState,
    worker_refresh
} from '.';
import { getDomain, GLOBAL, LOCAL, POCKETBASE } from '../../../src-tauri/api';
import { remotelogin } from '../actions';
import { addDays } from '../utils/dateHandler';
import { BuilderHelper } from './helper';

type Usage = {
    node: string;
    total_usage: number;
    template: {
        image: string | null;
        code: string;
        name: string;
    };
};

export type PaymentStatus =
    | {
          status: 'PAID';
          plan: string;
          cluster: string;
          correct_domain: boolean;
          created_at: string;
          limit_hour?: number;
          ended_at?: string;
          local_metadata: {
              ram?: string;
              vcpu?: string;
          };

          usage?: Usage;
      }
    | {
          status: 'NO_ACTION';
      }
    | {
          status: 'PENDING';
      };

type Data = RecordModel & {
    subscription: PaymentStatus;
    volume_id: string;
};

const notexpired = () =>
    `ended_at.gt.${new Date().toISOString()},ended_at.is.${null}`;
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
    fetch_usage: createAsyncThunk(
        'fetch_usage',
        async (_, { getState }): Promise<Usage | null> => {
            const { volume_id, subscription } = (getState() as RootState).user;
            if (subscription.status != 'PAID') return;

            const { created_at } = subscription;
            if (!isUUID(volume_id)) return null;

            const { data: total_usage, error } = await LOCAL().rpc(
                'get_volume_usage',
                {
                    volume_id,
                    _to: new Date().toISOString(),
                    _from: created_at
                }
            );
            if (error) throw error;

            const { data: map, error: errr } = await LOCAL()
                .from('volume_map')
                .select('node,template')
                .eq('id', volume_id)
                .limit(1);
            if (errr) throw errr;
            else if (map.length == 0) return null;
            const [{ node, template: tpl }] = map;
            const { data: stores, error: err } = await LOCAL()
                .from('stores')
                .select('metadata->screenshots,name')
                .eq('code_name', tpl)
                .limit(1);

            let template = null;
            if (err) throw err;
            else if (stores.length > 0) {
                const [{ screenshots, name }] = stores;
                template =
                    screenshots == null
                        ? {
                              image: null,
                              code: tpl,
                              name
                          }
                        : {
                              image:
                                  screenshots[
                                      Math.round(
                                          Math.random() *
                                              ((screenshots as any[]).length -
                                                  1)
                                      )
                                  ]?.path_full ?? null,
                              code: tpl,
                              name
                          };
            } else {
                template = {
                    image: null,
                    code: tpl,
                    name: tpl
                };
            }

            return {
                node,
                template,
                total_usage: total_usage ?? 0
            };
        }
    ),
    fetch_subscription: createAsyncThunk(
        'fetch_subscription',
        async (_: void, { getState }): Promise<PaymentStatus> => {
            const { id, email } = (getState() as RootState).user;
            if (id == 'unknown') return { status: 'NO_ACTION' };

            const { data: subs, error: errr1 } = await GLOBAL()
                .from('subscriptions')
                .select('id,plan,cluster,local_metadata,created_at,ended_at')
                .or(notexpired())
                .eq('user', email)
                .is('cancelled_at', null)
                .order('created_at', { ascending: false });
            if (errr1) throw new Error(errr1.message);
            else if (subs.length == 0) return { status: 'NO_ACTION' };

            let has_pending = false;
            for (const {
                id: subscription_id,
                plan: plan_id,
                cluster: cluster_id,
                created_at,
                ended_at,
                local_metadata
            } of subs) {
                const { data, error: err } = await GLOBAL()
                    .from('payment_request')
                    .select('id')
                    .or('status.eq.PAID,status.eq.IMPORTED')
                    .eq('subscription', subscription_id);
                if (err) continue;
                else if (data.length > 0) {
                    const {
                        data: [{ name: plan, limit_hour }],
                        error: errrr
                    } = await GLOBAL()
                        .from('plans')
                        .select('name,policy->limit_hour')
                        .eq('id', plan_id);
                    if (errrr) continue;

                    const {
                        data: [{ domain: cluster }],
                        error: errrrr
                    } = await GLOBAL()
                        .from('clusters')
                        .select('domain')
                        .eq('id', cluster_id);
                    if (errrrr) continue;

                    const origin = new URL(window.location.href).host;
                    return {
                        status: 'PAID',
                        cluster,
                        correct_domain:
                            origin.includes('localhost') || origin == cluster,
                        plan,
                        local_metadata,
                        limit_hour: limit_hour as number,
                        created_at,
                        ended_at
                    };
                }

                const { data: pendingsubs, error: errr } = await GLOBAL()
                    .from('payment_request')
                    .select('id')
                    .gt('expire_at', new Date().toISOString())
                    .eq('status', 'PENDING')
                    .eq('subscription', subscription_id);
                if (errr) continue;
                else if (pendingsubs.length > 0) has_pending = true;
            }

            return { status: !has_pending ? 'NO_ACTION' : 'PENDING' };
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
            const { email, volume_id } = (getState() as RootState).user;

            const { data: existSub, error: errr } = await GLOBAL()
                .from('subscriptions')
                .select('id,local_metadata->>volume_id')
                .or(notexpired())
                .eq('user', email)
                .is('cancelled_at', null)
                .order('created_at', { ascending: false });
            if (errr) throw new Error(errr.message);
            else if (existSub.length > 0) {
                for (const { id } of existSub) {
                    const { data, error: err } = await GLOBAL()
                        .from('payment_request')
                        .select('id')
                        .or('status.eq.PAID,status.eq.IMPORTED')
                        .eq('subscription', id);
                    if (err) continue;
                    else if (data.length > 0) {
                        const {
                            data: [{ checkoutUrl }],
                            error: err
                        } = await GLOBAL()
                            .from('payment_request')
                            .insert({ subscription: id, expire_at })
                            .select('result->data->>checkoutUrl');
                        if (err) continue;
                        else return checkoutUrl;
                    }
                }

                for (const { id } of existSub) {
                    const { data, error: errr } = await GLOBAL()
                        .from('payment_request')
                        .select('result->data->>checkoutUrl')
                        .gt('expire_at', new Date().toISOString())
                        .eq('status', 'PENDING')
                        .eq('subscription', id);
                    if (errr) continue;
                    else if (data.length != 0) return data[0].checkoutUrl;
                }

                const subscription =
                    existSub.find((x) => x.volume_id == volume_id)?.id ??
                    existSub[0].id;
                const {
                    data: [{ checkoutUrl }],
                    error: err
                } = await GLOBAL()
                    .from('payment_request')
                    .insert({ subscription, expire_at })
                    .select('result->data->>checkoutUrl');
                if (err) throw new Error(err.message);
                return checkoutUrl;
            } else if (input != undefined) {
                const { plan: plan_name, domain } = input;
                const {
                    data: [_plans],
                    error: errrr
                } = await GLOBAL()
                    .from('plans')
                    .select('id, policy->>total_days')
                    .eq('name', plan_name)
                    .limit(1);
                if (errrr) throw new Error(errrr.message);
                else if (_plans == undefined)
                    throw new Error('gói dịch vụ hiện đang tạm đóng');
                const { id: plan, total_days } = _plans;
                const ended_at = addDays(
                    new Date(),
                    Number.parseInt(total_days)
                ).toISOString();

                const {
                    data: [cluster_ele],
                    error: errrrr
                } = await GLOBAL()
                    .from('clusters')
                    .select('id')
                    .eq('domain', domain)
                    .limit(1);
                if (errrrr) throw new Error(errrrr.message);
                else if (cluster_ele == undefined)
                    throw new Error('dịch vụ hiện chưa triển khai trên domain');

                const { id: cluster } = cluster_ele;
                const {
                    data: [{ id: subscription }],
                    error
                } = await GLOBAL()
                    .from('subscriptions')
                    .insert({
                        user: email,
                        plan,
                        cluster,
                        ended_at,
                        local_metadata: {}
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

                if (domain != getDomain()) await remotelogin(domain, email);
                return checkoutUrl;
            } else throw new Error('Bạn đã đăng kí dịch vụ');
        }
    ),
    change_size: createAsyncThunk(
        'change_size',
        async ({ size }: { size: string }, { getState }): Promise<void> => {
            const { volume_id, subscription } = (getState() as RootState).user;
            if (isUUID(volume_id) && subscription.status == 'PAID') {
                const { error } = await LOCAL()
                    .from('volume_map')
                    .update({ size })
                    .eq('id', volume_id);
                if (error) throw new Error(error.message);

                await appDispatch(worker_refresh());
                await appDispatch(fetch_subscription());
                appDispatch(app_toggle('connectPc'));
            } else throw new Error('no volume available');
        }
    ),
    change_template: createAsyncThunk(
        'change_template',
        async (
            { template }: { template: string },
            { getState }
        ): Promise<void> => {
            const { volume_id, subscription } = (getState() as RootState).user;
            if (isUUID(volume_id) && subscription.status == 'PAID') {
                const { error } = await LOCAL()
                    .from('volume_map')
                    .update({ template, size: '300' })
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
                fetch: userAsync.fetch_usage,
                hander: (state, action) => {
                    if (state.subscription.status == 'PAID')
                        state.subscription.usage = action.payload;
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
