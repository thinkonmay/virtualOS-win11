import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordModel } from 'pocketbase';
import { RootState } from '.';
import { getDomain, GLOBAL, LOCAL, POCKETBASE } from '../../../src-tauri/api';
import { addDays } from '../utils/dateHandler';
import { BuilderHelper } from './helper';

export type PaymentStatus =
    | {
        status: 'PAID' | 'IMPORTED';
        plan: string;
        cluster: string;
        node: string;

        total_usage: number;
        created_at: string;

        limit_hour?: number;
        ended_at?: string;
        template?: string;
        local_metadata?: {
            ram?: string;
            vcpu?: string;
        };
    }
    | {
        status: 'NO_ACTION';
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
            const {
                user: { email, volume_id }
            } = getState() as RootState;

            const { data: sub1, error: errr1 } = await GLOBAL()
                .from('subscriptions')
                .select(
                    'id,plan,cluster,local_metadata,created_at,ended_at,local_metadata->>template'
                )
                .eq('user', email)
                .gt('ended_at', new Date().toISOString())
                .is('cancelled_at', null)
                .order('created_at', { ascending: false })
                .limit(1);
            const { data: sub2, error: errr2 } = await GLOBAL()
                .from('subscriptions')
                .select(
                    'id,plan,cluster,local_metadata,created_at,ended_at,local_metadata->>template'
                )
                .eq('user', email)
                .is('ended_at', null)
                .is('cancelled_at', null)
                .order('created_at', { ascending: false })
                .limit(1);

            if (errr1) throw new Error(errr1.message);
            else if (errr2) throw new Error(errr2.message);

            const sub = [...sub1, ...sub2];
            if (sub.length == 0) return { status: 'NO_ACTION' };

            const [
                {
                    id: subscription_id,
                    plan: plan_id,
                    cluster: cluster_id,
                    created_at,
                    ended_at,
                    template,
                    local_metadata
                }
            ] = sub;
            const { data, error: err } = await GLOBAL()
                .from('payment_request')
                .select('status')
                .eq('subscription', subscription_id);
            if (err) throw new Error(err.message);

            const [{ status }] = data as { status: string }[];
            let result = { status: 'NO_ACTION' } as PaymentStatus;

            if (status == 'PENDING') {
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

                const { data, error } = await LOCAL().rpc('get_volume_usage', {
                    volume_id,
                    _to: new Date().toISOString(),
                    _from: created_at
                });
                if (error) throw error;

                const { data: map, error: errr } = await LOCAL()
                    .from('volume_map')
                    .select('node')
                    .eq('id', volume_id)
                    .limit(1);
                if (errr) throw errr;
                const node = map.at(0)?.node;

                result = {
                    status,
                    cluster,
                    node,
                    plan,
                    local_metadata,
                    limit_hour,
                    created_at,
                    ended_at,
                    template,
                    total_usage: data
                } as PaymentStatus;
            }

            return result;
        }
    ),
    get_payment: createAsyncThunk(
        'get_payment',
        async (
            { plan: plan_name, template }: { plan: string; template?: string },
            { getState }
        ): Promise<string> => {
            const {
                data: [_plans],
                error: errrr
            } = await GLOBAL().from('plans').select('id').eq('name', plan_name);
            if (errrr) throw new Error(errrr.message);
            else if (_plans == undefined)
                throw new Error('gói dịch vụ hiện đang tạm đóng');
            const { id: plan } = _plans;

            const {
                data: [cluster_ele],
                error: errrrr
            } = await GLOBAL()
                .from('clusters')
                .select('id')
                .eq('domain', getDomain());
            if (errrrr) throw new Error(errrrr.message);
            else if (cluster_ele == undefined)
                throw new Error('dịch vụ hiện chưa triển khai trên domain');
            const { id: cluster } = cluster_ele;

            const expire_at = new Date(
                new Date().getTime() + 1000 * 60 * 15
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

            const {
                data: [{ id: subscription }],
                error
            } = await GLOBAL()
                .from('subscriptions')
                .insert({
                    user: email,
                    plan,
                    cluster,
                    local_metadata: { template },
                    ended_at: addDays(new Date(), 30).toISOString()
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
            }
        );
    }
});
