import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordModel } from 'pocketbase';
import { app_close, app_full, appDispatch, RootState, show_chat } from '.';
import { ChangeTemplate, GLOBAL, POCKETBASE } from '../../../src-tauri/api';
import { PlanName } from './../utils/constant';
import { BuilderHelper } from './helper';

type Metadata = {
    node: string;
    reach_time_limit: boolean;
    reach_date_limit: boolean;
    nearly_reach_time_limit?: number;
    nearly_reach_date_limit?: number;
    template: {
        local_id?: string;
        image?: string;
        code?: string;
        name?: string;
    };
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

type Discount = {
    code: string;
    start_at: string;
    end_at: string;
    discount_limit_per_user?: number;
    discount_limit?: number;
    multiply_rate?: number;
    apply_for: string[];
};

interface Deposit {
    amount: number;
    created_at: string;
    id: number;
    plan_name: PlanName;
}
interface Order {
    id: string;
    pay_at: string;
    plan_name: PlanName;
}

type RefundRequest = {
    id: number;
    created_at: string;
    amount: string;
};

interface DepositStatus {
    created_at: string;
    amount: number;
    status: string;
}

interface PlanStatus {
    created_at: string;
    amount: number;
    plan_name: string;
}

interface Wallet {
    money: number;
    historyDeposit: Deposit[];
    historyPayment: Deposit[];
    currentOrders?: Order[];
    depositStatus?: DepositStatus[];
    refundRequest?: RefundRequest[];
    planStatus?: PlanStatus[];
}
type Data = RecordModel & {
    subscription?: Subscription;
    bucket_name?: string;
    plans: Plan[];
    discounts: Discount[];
    wallet: Wallet;
};

const initialState: Data = {
    collectionId: '',
    collectionName: '',

    id: 'unknown',
    email: '',
    created: '',
    updated: '',
    plans: [],
    discounts: [],

    wallet: {
        money: 0,
        historyPayment: [],
        historyDeposit: [],
        currentOrders: [],
        depositStatus: [],
        planStatus: []
    }
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
            return { amount };
        }
    ),

    fetch_payment_history: createAsyncThunk(
        'fetch_payment_history',
        async (
            _,
            { getState }
        ): Promise<{
            paymentData: Deposit[];
            depositData: Deposit[];
        }> => {
            const { email } = (getState() as RootState).user;
            const { error: depositErr, data: depositData } = await GLOBAL().rpc(
                'get_deposit_history',
                {
                    email: email
                }
            );
            if (depositErr) throw depositErr;

            const { error: paymentErr, data: paymentData } = await GLOBAL().rpc(
                'get_payment_history',
                {
                    email: email
                }
            );
            if (paymentErr) throw paymentErr;

            return {
                paymentData,
                depositData
            };
        }
    ),

    fetch_subscription_metadata: createAsyncThunk(
        'fetch_subscription_metadata',
        async (_, { getState }): Promise<Metadata | undefined> => {
            const {
                user: { subscription, wallet, plans },
                worker: { data, currentAddress }
            } = getState() as RootState;
            if (subscription == undefined) return undefined;
            const { ended_at, total_usage, policy, next_plan } = subscription;
            let { limit_hour } = policy ?? { limit_hour: Infinity };
            const node = data[currentAddress]?.Volumes?.find(
                (x) => x.pool == 'user_data'
            )?.node;
            const sufficient =
                plans?.find((x) => x.name == next_plan)?.amount <=
                wallet?.money;

            // TODO : fetch template
            const volume = (
                await POCKETBASE().collection('volumes').getFullList<{
                    local_id: String;
                    configuration?: { template: string };
                }>()
            )?.[0];

            const local_id = volume?.local_id;
            const code = volume?.configuration?.template?.replaceAll(
                '.template',
                ''
            );

            let template = null;
            if (code != undefined) {
                const { data: stores, error: err } = await GLOBAL()
                    .from('stores')
                    .select('metadata->screenshots,name')
                    .eq('code_name', code)
                    .limit(1);

                if (err) throw err;
                else if (stores.length > 0) {
                    const [{ screenshots, name }] = stores;
                    template =
                        screenshots == null
                            ? {
                                  code,
                                  local_id,
                                  name
                              }
                            : {
                                  image:
                                      screenshots[
                                          Math.round(
                                              Math.random() *
                                                  ((screenshots as any[])
                                                      .length -
                                                      1)
                                          )
                                      ]?.path_full ?? undefined,
                                  code,
                                  local_id,
                                  name
                              };
                } else
                    template = {
                        code,
                        local_id,
                        name: code
                    };
            } else template = { local_id };

            return {
                node,
                template,

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

            const { data, error } = await GLOBAL().rpc('get_subscription', {
                email
            });

            if (error) throw error;
            else if (data.length == 0)
                throw new Error('no subscription available');
            else return data?.[0];
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

    get_deposit_status: createAsyncThunk(
        'get_deposit_status',
        async (_, { getState }) => {
            const { email } = (getState() as RootState).user;

            const { data: get_deposit_status, error: err } = await GLOBAL().rpc(
                'get_deposit_status',
                {
                    email
                }
            );

            if (err)
                throw new Error('Error when create payment link' + err.message);

            if (get_deposit_status != null) {
                return get_deposit_status;
            }
        }
    ),
    get_payment_pocket: createAsyncThunk(
        'get_payment_pocket',
        async (_, { getState }): Promise<string> => {
            const { email } = (getState() as RootState).user;
            const { data, error: err } = await GLOBAL().rpc(
                'get_payment_pocket',
                {
                    email
                }
            );

            if (err) throw new Error(err.message);
            else if (data != null) return data;
        }
    ),
    fetch_refund_request: createAsyncThunk(
        'fetch_refund_request',
        async (_, { getState }): Promise<RefundRequest[]> => {
            const { email } = (getState() as RootState).user;
            const { data, error: err } = await GLOBAL()
                .from('refund_request')
                .select('id,created_at,amount')
                .eq('user', email);

            if (err) throw new Error(err.message);
            return data;
        }
    ),
    refund_request: createAsyncThunk(
        'refund_request',
        async (_, { getState }): Promise<void> => {
            const { email } = (getState() as RootState).user;
            const { error: err } = await GLOBAL()
                .from('refund_request')
                .insert({
                    user: email
                });

            if (err) throw new Error(err.message);
            appDispatch(show_chat());
            await appDispatch(userAsync.fetch_refund_request());
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
                if (resp instanceof Error) throw resp;
                appDispatch(app_close('store'));
                appDispatch(app_full({ id: 'connectPc', page: null }));
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
                hander: (state, action) => {
                    state.wallet.money = action.payload.amount;
                }
            },
            {
                fetch: userAsync.refund_request,
                hander: (state, action) => {}
            },
            {
                fetch: userAsync.fetch_refund_request,
                hander: (state, action) => {
                    state.wallet.refundRequest = action.payload;
                }
            },
            {
                fetch: userAsync.fetch_active_discounts,
                hander: (state, action) => {
                    state.discounts = action.payload;
                }
            },
            {
                fetch: userAsync.fetch_payment_history,
                hander: (state, action) => {
                    state.wallet.historyDeposit = action.payload.depositData;
                    state.wallet.historyPayment = action.payload.paymentData;
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
                fetch: userAsync.get_plans,
                hander: (state, action) => {
                    state.plans = action.payload;
                }
            },
            {
                fetch: userAsync.get_deposit_status,
                hander: (state, action) => {
                    state.wallet.depositStatus = action.payload;
                }
            },
            {
                fetch: userAsync.get_payment_pocket,
                hander: (state, action) => {
                    state.wallet.currentOrders = action.payload;
                }
            },

            {
                fetch: userAsync.change_template,
                hander: (state, action) => {}
            }
        );
    }
});
