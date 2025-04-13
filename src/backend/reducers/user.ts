import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordModel } from 'pocketbase';
import { app_close, app_full, appDispatch, RootState, show_chat } from '.';
import {
    APIError,
    ChangeTemplate,
    GLOBAL,
    POCKETBASE
} from '../../../src-tauri/api';
import { BuilderHelper } from './helper';

type Metadata = {
    node: string;
    reach_time_limit: boolean;
    reach_date_limit: boolean;
    nearly_reach_time_limit?: number;
    nearly_reach_date_limit?: number;
};

export type Subscription = {
    cluster: string;
    created_at: string;
    last_payment: string;
    ended_at?: string;
    total_usage: number;
    policy: {
        size: string;
        limit_hour: number;
        total_days: number;
        name: string;
    };
    plan_name: string;
    next_plan?: string;
    metadata?: Metadata;
};

type Plan = {
    name: string;
    size: number;
    limit_hour: number;
    total_days: number;
    amount: number;
    allow_payment: boolean;
};

type Resource = {
    name: string;
    amount: number;
    configuration: {
        cpu?: string;
        ram?: string;
    };
};

type Discount = {
    code: string;
    start_at: string;
    end_at: string;
    discount_limit_per_user?: number;
    discount_limit?: number;
    multiply_rate?: number;
    apply_for: string[];
};

type Data = RecordModel & {
    subscription?: Subscription;
    bucket_name?: string;
    plans: Plan[];
    resources: Resource[];
    discounts: Discount[];
    balance: number;
};

const initialState: Data = {
    collectionId: '',
    collectionName: '',

    id: 'unknown',
    email: '',
    balance: 0,
    created: '',
    updated: '',
    plans: [],
    resources: [],
    discounts: []
};

export const userAsync = {
    fetch_user: createAsyncThunk(
        'fetch_user',
        async (): Promise<RecordModel> => {
            const {
                items: [result]
            } = await POCKETBASE().collection('users').getList(1);

            return result != undefined ? { ...result } : initialState;
        }
    ),
    fetch_active_discounts: createAsyncThunk(
        'fetch_active_discounts',
        async (): Promise<Discount[]> => {
            const { error, data } = await GLOBAL()
                .from('discounts')
                .select(
                    'code,start_at,end_at,' +
                        'discount_limit_per_user,discount_limit,' +
                        'multiply_rate,apply_for'
                );
            if (error) throw error;
            else return data as any[];
        }
    ),
    fetch_wallet: createAsyncThunk(
        'fetch_wallet',
        async (
            _,
            { getState }
        ): Promise<{
            amount: number;
        }> => {
            const { error, data } = await GLOBAL().rpc('get_pocket_balance', {
                email: (getState() as RootState).user.email
            });
            if (error) throw error;
            else if (data.length == 0) throw new Error('pocket not exist');
            const [{ amount }] = data;
            return amount;
        }
    ),
    fetch_subscription_metadata: createAsyncThunk(
        'fetch_subscription_metadata',
        async (_, { getState }): Promise<Metadata | undefined> => {
            const {
                user: { subscription, balance, plans },
                worker: { data, currentAddress }
            } = getState() as RootState;
            if (subscription == undefined) return undefined;
            const { ended_at, total_usage, policy, next_plan } = subscription;
            let { limit_hour } = policy ?? { limit_hour: Infinity };
            const node = data[currentAddress]?.Volumes?.find(
                (x) => x.pool == 'user_data'
            )?.node;
            const sufficient =
                plans?.find((x) => x.name == next_plan)?.amount <= balance;

            return {
                node,

                reach_time_limit: sufficient ? false : total_usage > limit_hour,
                reach_date_limit: sufficient
                    ? false
                    : Date.now() > new Date(ended_at).getTime(),
                nearly_reach_time_limit: sufficient
                    ? undefined
                    : total_usage + 20 > limit_hour
                      ? limit_hour - total_usage
                      : undefined,
                nearly_reach_date_limit: sufficient
                    ? undefined
                    : Date.now() + 7 * 24 * 3600 * 1000 >
                        new Date(ended_at).getTime()
                      ? Math.round(
                            (new Date(ended_at).getTime() -
                                new Date().getTime()) /
                                (24 * 3600 * 1000)
                        )
                      : undefined
            };
        }
    ),
    fetch_subscription: createAsyncThunk(
        'fetch_subscription',
        async (_: void, { getState }): Promise<Subscription> => {
            const { id, email } = (getState() as RootState).user;
            if (id == 'unknown') return undefined;

            const { data, error } = await GLOBAL().rpc('get_subscription_v2', {
                email
            });

            if (error) throw error;
            else if (data.length == 0)
                throw new Error('no subscription available');
            else return data?.[0];
        }
    ),
    get_resources: createAsyncThunk(
        'get_resources',
        async (_: void): Promise<Resource[]> => {
            const { data, error } = await GLOBAL()
                .from('resources')
                .select('price->>amount,name,configuration,type')
                .eq('active', true);
            if (error != null)
                throw new Error(
                    `Failed to query plan table + ${error.message}`
                );
            else return data.map((x) => ({ ...x, amount: parseInt(x.amount) }));
        }
    ),
    get_plans: createAsyncThunk(
        'get_plans',
        async (_: void, { getState }): Promise<Plan[]> => {
            const { data, error } = await GLOBAL()
                .from('plans')
                .select(
                    'name, policy->size, policy->limit_hour, policy->total_days , price->amount, metadata->allow_payment'
                )
                .eq('active', true);

            if (error != null)
                throw new Error(
                    `Failed to query plan table + ${error.message}`
                );
            else
                return data.map(
                    (e) =>
                        ({
                            name: e.name,
                            size: Number(e.size),
                            limit_hour: Number(e.limit_hour),
                            total_days: Number(e.total_days),
                            amount: Number(e.amount),
                            allow_payment: Boolean(e.allow_payment)
                        }) as Plan
                );
        }
    ),
    change_template: createAsyncThunk(
        'change_template',
        async (
            { template }: { template: string },
            { getState }
        ): Promise<void> => {
            const {
                worker: { currentAddress, data }
            } = getState() as RootState;
            const vol = data[currentAddress]?.Volumes?.find(
                (x) => x.pool == 'user_data'
            );

            if (vol == undefined) throw new Error('volume is not available');
            else if (vol.inuse)
                throw new Error(
                    'Hãy tắt máy trước khi cài đặt game. [Cài đặt -> Shutdown]'
                );
            else {
                const resp = await ChangeTemplate(
                    currentAddress,
                    template,
                    vol.name
                );
                if (resp instanceof APIError) throw resp;
                appDispatch(app_close('store'));
                appDispatch(app_full({ id: 'connectPc' }));
            }
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
        user_delete: (state) => {
            state.id = initialState.id;
            state.stat = initialState.stat;
            POCKETBASE().authStore.clear();
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
                    state.bucket_name = action.payload.bucket_name;
                    state.collectionName = action.payload.collectionName;
                    state.created = action.payload.created;
                    state.updated = action.payload.updated;
                    state.expand = action.payload.expand;
                    state.email = action.payload.email;
                    state.stat = action.payload.stat;
                }
            },
            {
                fetch: userAsync.fetch_wallet,
                hander: (state, action: PayloadAction<number>) => {
                    state.balance = action.payload;
                }
            },
            {
                fetch: userAsync.fetch_active_discounts,
                hander: (state, action) => {
                    state.discounts = action.payload;
                }
            },
            {
                fetch: userAsync.fetch_subscription_metadata,
                hander: (state, action) => {
                    if (state.subscription != undefined)
                        state.subscription.metadata = action.payload;
                }
            },
            {
                fetch: userAsync.fetch_subscription,
                hander: (state, action) => {
                    state.subscription = action.payload;
                }
            },
            {
                fetch: userAsync.get_resources,
                hander: (state, action) => {
                    state.resources = action.payload;
                }
            },
            {
                fetch: userAsync.get_plans,
                hander: (state, action) => {
                    state.plans = action.payload;
                }
            },
            {
                fetch: userAsync.change_template,
                hander: (state, action) => { }
            }
        );
    }
});
