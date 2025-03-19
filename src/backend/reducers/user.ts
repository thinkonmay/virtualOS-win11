import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { RecordModel } from 'pocketbase';
import { app_close, app_full, appDispatch, popup_open, RootState } from '.';
import { ChangeTemplate, GLOBAL, POCKETBASE } from '../../../src-tauri/api';
import { formatDate } from '../utils/date';
import { PlanName } from './../utils/constant';
import { BuilderHelper } from './helper';
type Usage = {
    node: string;
    total_usage: number;
    template: {
        image: string | null;
        code: string;
        name: string;
    };
    isExpired?: boolean;
    isNewUser: boolean;
};

export type PaymentStatus =
    | {
          status: 'PAID';
          cluster: string;
          created_at: string;
          ended_at?: string;
          policy?: {
              size: string;
              limit_hour: number;
              total_days: number;
          };
          usage?: Usage;
      }
    | {
          status: 'NO_ACTION';
      }
    | {
          status: 'PENDING';
      };

type Plan = {
    name: string;
    size: number;
    limit_hour: number;
    total_days: number;
    amount: number;
    allow_payment: boolean;
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
    planStatus?: PlanStatus[];
}
type Data = RecordModel & {
    subscription: PaymentStatus;
    bucket_name?: string;
    plans: Plan[];
    wallet: Wallet;
};

const initialState: Data = {
    collectionId: '',
    collectionName: '',

    id: 'unknown',
    email: '',
    created: '',
    updated: '',
    subscription: {
        status: 'NO_ACTION'
    },
    plans: [],

    wallet: {
        historyPayment: [],
        historyDeposit: [],
        money: 0,
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

    fetch_wallet: createAsyncThunk(
        'fetch_wallet',
        async (
            _,
            { getState }
        ): Promise<{
            amount;
        }> => {
            const { email } = (getState() as RootState).user;

            const { error, data } = await GLOBAL().rpc('get_pocket_balance', {
                email
            });

            const { amount } = data[0];
            return {
                amount
            };
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

    fetch_usage: createAsyncThunk(
        'fetch_usage',
        async (_, { getState }): Promise<Usage | null> => {
            const {
                user: { subscription, email },
                worker: { data, currentAddress }
            } = getState() as RootState;
            if (subscription.status != 'PAID') return;
            const { ended_at, policy } = subscription;
            let { limit_hour } = policy ?? { limit_hour: Infinity };
            const node = data[currentAddress]?.Volumes?.find(
                (x) => x.pool == 'user_data'
            )?.node;

            // Adjust sub after 30-12
            const oldPaidUser = dayjs('2024-12-30');
            const endedAtFormat = dayjs(ended_at);
            if (
                endedAtFormat.isBefore(oldPaidUser, 'day') &&
                limit_hour == 120
            ) {
                limit_hour = 150;
            }

            const { data: usageData, error: usageErr } = await GLOBAL().rpc(
                'get_subscription',
                {
                    email
                }
            );
            if (usageErr) throw usageErr;
            const { data: total_usage, error } = await GLOBAL().rpc(
                'query_user_usage_v3',
                {
                    email,
                    start: usageData[0]?.created_at,
                    stop: usageData[0]?.ended_at
                }
            );
            if (error) throw error;

            // TODO : fetch template
            const tpl = '';

            const { data: stores, error: err } = await GLOBAL()
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

            const available = limit_hour - total_usage;
            const targetDate = dayjs(ended_at);
            const currentDate = dayjs();
            const isExpired =
                targetDate.isBefore(currentDate, 'day') ||
                total_usage > limit_hour;

            if (available < 20 && available >= 0)
                appDispatch(
                    popup_open({
                        type: 'extendService',
                        data: {
                            type: 'hour_limit',
                            available_time: available,
                            to: formatDate(ended_at)
                        }
                    })
                );
            if (isExpired)
                appDispatch(
                    popup_open({
                        type: 'extendService',
                        data: {
                            type: 'expired',
                            to: ''
                        }
                    })
                );

            return {
                node,
                template,
                total_usage,
                isExpired,
                isNewUser: usageData[0]?.new_user
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
                .select('id,cluster,ended_at')
                .gt('ended_at', new Date().toISOString())
                .eq('user', email)
                .is('cancelled_at', null)
                .order('created_at', { ascending: false });
            if (errr1) throw new Error(errr1.message);
            else if (subs.length == 0) return { status: 'NO_ACTION' };

            for (const { id: subscription_id } of subs) {
                const { data, error } = await GLOBAL().rpc(
                    'get_subscription_verify',
                    {
                        sub_id: subscription_id
                    }
                );
                if (error) continue;
                else if (data.length == 0) continue;
                const [sub_verify_data] = data;

                if (sub_verify_data.verified_at != null)
                    return {
                        status: 'PAID',
                        cluster: sub_verify_data.domain,
                        policy: sub_verify_data.policy,
                        created_at: sub_verify_data.created_at,
                        ended_at: sub_verify_data.ended_at
                    };
                else return { status: 'PENDING' };
            }

            return { status: 'NO_ACTION' };
        }
    ),
    get_plans: createAsyncThunk(
        'get_plans',
        async (_: void, { getState }): Promise<Plan[]> => {
            const plans = [];
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

            data.forEach((e) => {
                plans.push({
                    name: e.name,
                    size: Number(e.size),
                    limit_hour: Number(e.limit_hour),
                    total_days: Number(e.total_days),
                    amount: Number(e.amount),
                    allow_payment: Boolean(e.allow_payment)
                } as Plan);
            });
            return plans;
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
    get_payment_pocket_status: createAsyncThunk(
        'get_payment_pocket_status',
        async (_, { getState }) => {
            const { email } = (getState() as RootState).user;

            const { data: get_payment_pocket_status, error: err } =
                await GLOBAL().rpc('get_payment_pocket_status', {
                    email
                });

            if (err)
                throw new Error('Error when create payment link' + err.message);

            if (get_payment_pocket_status != null) {
                return get_payment_pocket_status;
            }
        }
    ),
    cancel_payment_pocket: createAsyncThunk(
        'cancel_payment_pocket',
        async (
            input: {
                id: string;
            },
            { getState }
        ) => {
            const { email } = (getState() as RootState).user;
            const { id } = input;

            const { data, error: err } = await GLOBAL().rpc(
                'cancel_payment_pocket',
                {
                    id
                }
            );

            if (err)
                throw new Error(
                    'Error when cancel_payment_pocket' + err.message
                );

            if (!data) {
                throw new Error('Can not cancel sub' + err.message);
            }
            return id;
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
    change_size: createAsyncThunk(
        'change_size',
        async ({ size }: { size: string }, { getState }): Promise<void> => {
            const [vol] = await POCKETBASE().collection('volumes').getFullList<{
                local_id: string;
            }>();

            // TODO implement installation job inside pocketbase
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
        user_check_sub: (state, action) => {
            state.isExpired = action.payload.isExpired;
            state.isNearbyEndTime = action.payload.isNearbyEndTime;
            state.isNearbyUsageHour = action.payload.isNearbyUsageHour;
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
                fetch: userAsync.fetch_payment_history,
                hander: (state, action) => {
                    state.wallet.historyDeposit = action.payload.depositData;
                    state.wallet.historyPayment = action.payload.paymentData;
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
                fetch: userAsync.get_payment_pocket_status,
                hander: (state, action) => {
                    state.wallet.planStatus = action.payload;
                }
            },
            {
                fetch: userAsync.cancel_payment_pocket,
                hander: (state, action) => {
                    if (action.payload) {
                        // delete Id\
                        const cloneData = [...state.wallet.currentOrders];
                        state.wallet.currentOrders = cloneData.filter(
                            (i) => i.id != action.payload
                        );
                    }
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
