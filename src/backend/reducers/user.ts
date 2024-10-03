import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordModel } from 'pocketbase';
import { RootState } from '.';
import { getDomain, pb, supabaseGlobal } from '../../../src-tauri/api';
import { BuilderHelper } from './helper';

type Data = RecordModel & {};

const initialState: Data = {
    collectionId: '',
    collectionName: '',

    id: 'unknown',
    email: '',
    created: '',
    updated: ''
};

export const userAsync = {
    fetch_user: createAsyncThunk('fetch_user', async (): Promise<Data> => {
        const {
            items: [result]
        } = await pb.collection('users').getList(1);

        return result ?? initialState;
    }),
    get_payment: createAsyncThunk(
        'get_payment',
        async (
            { plan: plan_name }: { plan: string },
            { getState }
        ): Promise<string> => {
            const expire_at = new Date(
                new Date().getTime() + 1000 * 60 * 15
            ).toISOString();
            const {
                user: { email }
            } = getState() as RootState;

            const { data: sub, error: errr } = await supabaseGlobal
                .from('subscriptions')
                .select('id')
                .eq('user', email);
            if (errr) throw new Error(errr.message);
            else if (sub.length > 0) {
                const {
                    data: [{ checkoutUrl }],
                    error: err
                } = await supabaseGlobal
                    .from('payment_request')
                    .select('result->data->>checkoutUrl')
                    .eq('subscription', sub[0]?.id);
                if (err) throw new Error(err.message);
                return checkoutUrl;
            } else {
                const {
                    data: [{ id: plan }],
                    error: errrr
                } = await supabaseGlobal
                    .from('plans')
                    .select('id')
                    .eq('name', plan_name);
                if (errrr) throw new Error(errrr.message);

                const {
                    data: [{ id: cluster }],
                    error: errrrr
                } = await supabaseGlobal
                    .from('clusters')
                    .select('id')
                    .eq('domain', getDomain());
                if (errrrr) throw new Error(errrrr.message);

                const {
                    data: [{ id: subscription }],
                    error
                } = await supabaseGlobal
                    .from('subscriptions')
                    .insert({ user: email, plan, cluster })
                    .select('id');
                if (error) throw new Error(error.message);

                const {
                    data: [{ checkoutUrl }],
                    error: err
                } = await supabaseGlobal
                    .from('payment_request')
                    .insert({ expire_at, subscription })
                    .select('result->data->>checkoutUrl');
                if (err) throw new Error(err.message);

                return checkoutUrl;
            }
        }
    )
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_update: (state, action: PayloadAction<RecordModel & Data>) => {
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
            pb.authStore.clear();
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
                fetch: userAsync.get_payment,
                hander: (state, action) => {
                    window.open(action.payload, '_self');
                }
            }
        );
    }
});
