import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordModel } from 'pocketbase';
import { pb, supabase } from './fetch/createClient';
import { BuilderHelper } from './helper';

type Data = RecordModel & {
    stat?: UsageTime;
    isExpired?: boolean;
    isNearbyEndTime?: boolean;
    isNearbyUsageHour?: boolean;
};
interface UsageTime {
    start_time: string;
    end_time: string;
    plan_name: string;
    usage_hour: number;
    remain_time: number;
    pre_remain_time: number;
    additional_time: string;
    plan_hour: string;
}

const initialState: Data = {
    id: 'unknown',
    collectionId: '',
    email: '',
    collectionName: '',
    created: '',
    updated: '',
    isExpired: false,
    isNearbyEndTime: false,
    isNearbyUsageHour: false
};

export const userAsync = {
    fetch_user: createAsyncThunk('fetch_user', async (): Promise<Data> => {
        let payloadUser: Data = initialState;
        const result = await pb.collection('users').getList(1);

        payloadUser = result.items.at(0) ?? initialState;

        const { data, error } = await supabase.rpc('get_user_infov2', {
            email: payloadUser.email
        });

        const userStats = await supabase.rpc('get_user_stats', {
            email: payloadUser.email
        });
        if (error != null) {
            console.log(`Not found infor subscription of ${payloadUser.email}`);
        }
        if (userStats.error != null) {
            console.log(`Not found stat subscription of ${payloadUser.email}`);
        }

        const stat = {
            ...data.at(0),
            ...userStats.data.at(0)
        };
        payloadUser.stat = stat;

        return payloadUser;
    })
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
        BuilderHelper(builder, {
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
        });
    }
});
