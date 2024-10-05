import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordModel } from 'pocketbase';
import { RootState } from '.';
import { getDomain, GLOBAL, POCKETBASE } from '../../../src-tauri/api';
import { BuilderHelper } from './helper';

type PaymentStatus =
    | {
          status: 'PAID';
          plan: string;
          cluster: string;

          local_metadata: {};
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
    subscription: PaymentStatus | {};
};

const initialState: Data = {
    collectionId: '',
    collectionName: '',

    id: 'unknown',
    email: '',
    created: '',
    updated: '',
    subscription: {}
};

export const userAsync = {
    fetch_user: createAsyncThunk(
        'fetch_user',
        async (): Promise<RecordModel> => {
            const {
                items: [result]
            } = await POCKETBASE.collection('users').getList(1);

            return result ?? initialState;
        }
    ),
    fetch_subscription: createAsyncThunk(
        'fetch_subscription',
        async (_: void, { getState }): Promise<PaymentStatus> => {
            const {
                user: { email }
            } = getState() as RootState;

            const { data: sub, error: errr } = await GLOBAL()
                .from('subscriptions')
                .select('id,plan,cluster,local_metadata')
                .eq('user', email)
                .order('created_at', { ascending: false })
                .limit(1);
            if (errr) throw new Error(errr.message);
            else if (sub.length == 0) return { status: 'NO_ACTION' };

            const [
                {
                    id: subscription_id,
                    plan: plan_id,
                    cluster: cluster_id,
                    local_metadata
                }
            ] = sub;
            const { data, error: err } = await GLOBAL()
                .from('payment_request')
                .select('status')
                .eq('subscription', subscription_id);
            if (err) throw new Error(err.message);

            const [{ status }] = data as { status: string }[];
            let result = {} as PaymentStatus;

            if (status == 'PENDING') {
                result = { status };
            } else if (status == 'PAID') {
                const {
                    data: [{ name: plan }],
                    error: errrr
                } = await GLOBAL()
                    .from('plans')
                    .select('name')
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

                result = {
                    status,
                    cluster,
                    plan,
                    local_metadata
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
            const expire_at = new Date(
                new Date().getTime() + 1000 * 60 * 15
            ).toISOString();
            const {
                user: { email }
            } = getState() as RootState;

            const { data: sub, error: errr } = await GLOBAL()
                .from('subscriptions')
                .select('id')
                .eq('user', email)
                .gt('ended_at', new Date().toISOString())
                .is('cancelled_at', null)
                .order('created_at', { ascending: false })
                .limit(1);
            if (errr) throw new Error(errr.message);
            else if (sub.length > 0) {
                const { data, error: err } = await GLOBAL()
                    .from('payment_request')
                    .select('result->data->>checkoutUrl,status')
                    .eq('subscription', sub[0]?.id);
                if (err) throw new Error(err.message);

                const [{ checkoutUrl, status }] = data;
                if (status == 'PENDING') return checkoutUrl;
                else if (status == 'PAID')
                    throw new Error('you already paid for our service');
            }

            const {
                data: [{ id: plan }],
                error: errrr
            } = await GLOBAL().from('plans').select('id').eq('name', plan_name);
            if (errrr) throw new Error(errrr.message);

            const {
                data: [{ id: cluster }],
                error: errrrr
            } = await GLOBAL()
                .from('clusters')
                .select('id')
                .eq('domain', getDomain());
            if (errrrr) throw new Error(errrrr.message);

            const {
                data: [{ id: subscription }],
                error
            } = await GLOBAL()
                .from('subscriptions')
                .insert({
                    user: email,
                    plan,
                    cluster,
                    local_metadata: { template }
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
        user_update: (state, action: PayloadAction<RecordModel>) => {
            state.id = action.payload.id;
            state.collectionId = action.payload.collectionId;
            state.collectionName = action.payload.collectionName;
            state.created = action.payload.created;
            state.updated = action.payload.updated;
            state.email = action.payload.email;
            state.expand = action.payload.expand;
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
