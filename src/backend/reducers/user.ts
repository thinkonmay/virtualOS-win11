import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { RecordModel } from 'pocketbase';
import { appDispatch, popup_open, RootState } from '.';
import { ChangeTemplate, GLOBAL, POCKETBASE } from '../../../src-tauri/api';
import { remotelogin } from '../actions';
import { formatDate } from '../utils/date';
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
    plan_name: 'month1' | 'month2' | 'week1' | 'week2';
}

interface Wallet {
    money: number;
    historyDeposit: Deposit[];
    historyPayment: Deposit[];
}
type Data = RecordModel & {
    subscription: PaymentStatus;
    volume_id: string;
    bucket_name?: string;
    plans: Plan[];
    wallet: Wallet;
};

const notexpired = () =>
    `ended_at.gt.${new Date().toISOString()},ended_at.is.${null}`;
export const isUUID = (uuid) =>
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
    },
    plans: [],

    wallet: {
        historyPayment: [],
        historyDeposit: [],
        money: 0
    }
};

export const userAsync = {
    fetch_user: createAsyncThunk(
        'fetch_user',
        async (): Promise<
            RecordModel & {
                volume_id: string;
            }
        > => {
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
                user: { volume_id, subscription, email },
                worker: { data, currentAddress }
            } = getState() as RootState;
            if (!isUUID(volume_id)) return null;
            else if (subscription.status != 'PAID') return;
            const {
                ended_at,
                policy,
                local_metadata: {}
            } = subscription;
            let { limit_hour } = policy ?? { limit_hour: Infinity };
            const node = data[currentAddress].Volumes.find(
                (x) => x.name == volume_id
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

            // TODO : fetch user usage and template
            const total_usage = 0;
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

            const available = limit_hour - (total_usage as number) / 60;
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

            const targetDate = dayjs(ended_at);
            const currentDate = dayjs();
            const isExpired =
                targetDate.isBefore(currentDate, 'day') ||
                ((total_usage as number) ?? 0) / 60 > +limit_hour;
            if (isExpired) {
                appDispatch(
                    popup_open({
                        type: 'extendService',
                        data: {
                            type: 'expired',
                            to: ''
                        }
                    })
                );
            }
            return {
                node,
                template,
                total_usage: ((total_usage as number) ?? 0) / 60,
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
                .select('id,cluster,local_metadata,ended_at')
                .or(notexpired())
                .eq('user', email)
                .is('cancelled_at', null)
                .order('created_at', { ascending: false });
            if (errr1) throw new Error(errr1.message);
            else if (subs.length == 0) return { status: 'NO_ACTION' };

            for (const {
                id: subscription_id,
                cluster: cluster_id,
                ended_at,
                local_metadata
            } of subs) {
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
                        local_metadata: sub_verify_data.local_metadata,
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
    get_payment: createAsyncThunk(
        'get_payment',
        async (
            input: { plan_name: string; domain?: string },
            { getState }
        ): Promise<string> => {
            const {
                data: [_plans],
                error: errrr
            } = await GLOBAL()
                .from('plans')
                .select('id')
                .eq('name', input.plan_name)
                .limit(1);
            if (errrr) throw new Error(errrr.message);
            else if (_plans == undefined)
                throw new Error('gói dịch vụ hiện đang tạm đóng');
            const { id: plan } = _plans;

            const expire_at = new Date(
                new Date().getTime() + 1000 * 60 * 10 * 1
            ).toISOString();
            const { email, volume_id } = (getState() as RootState).user;
            const currentAddr = (getState() as RootState).worker.currentAddress;

            const { data: existSub, error: errr } = await GLOBAL()
                .from('subscriptions')
                .select('id,local_metadata->>volume_id')
                .or(notexpired())
                .eq('user', email)
                .is('cancelled_at', null)
                .order('created_at', { ascending: false });
            if (errr) throw new Error(errr.message);
            else if (existSub.length > 0) {
                const { data: get_payment_link, error } = await GLOBAL().rpc(
                    'get_payment_link',
                    {
                        email
                    }
                );

                if (error)
                    throw new Error(
                        'Error when get payment link' + error.message
                    );

                if (get_payment_link != null) {
                    return get_payment_link;
                }

                const { data: create_payment_link, error: err } =
                    await GLOBAL().rpc('create_payment_link', {
                        email,
                        plan,
                        provider: 'PAYOS',
                        currency: 'VND'
                    });

                if (err)
                    throw new Error(
                        'Error when create payment link' + error.message
                    );

                if (create_payment_link != null) {
                    return create_payment_link;
                }
            } else if (input.domain != undefined) {
                // new users

                const { domain } = input;

                const {
                    data: [cluster_ele],
                    error: errrrr
                } = await GLOBAL()
                    .from('clusters')
                    .select('id')
                    .eq('domain', domain)
                    .eq('active', true)
                    .limit(1);
                if (errrrr) throw new Error(errrrr.message);
                else if (cluster_ele == undefined)
                    throw new Error('dịch vụ hiện chưa triển khai trên domain');

                const { id: cluster } = cluster_ele;
                const { data, error } = await GLOBAL()
                    .from('subscriptions')
                    .insert({ user: email, cluster })
                    .select('id');
                if (error) throw new Error(error.message);

                const { data: create_payment_link, error: err } =
                    await GLOBAL().rpc('create_payment_link', {
                        email,
                        plan,
                        provider: 'PAYOS',
                        currency: 'VND'
                    });

                if (err)
                    throw new Error(
                        'Error when create payment link' + error.message
                    );

                if (domain != currentAddr) await remotelogin(domain, email);

                if (create_payment_link != null) {
                    return create_payment_link;
                }

                throw new Error('Failed to create payment link');
            } else throw new Error('Bạn đã đăng kí dịch vụ');
        }
    ),
    create_payment_link: createAsyncThunk(
        'create_payment_link',
        async (input: any, { getState }) => {
            const { email } = (getState() as RootState).user;
            const { amount } = input;

            const { data: create_payment_link, error: err } =
                await GLOBAL().rpc('create_pocket_deposit', {
                    email,
                    amount: +amount,
                    provider: 'PAYOS',
                    currency: 'VND'
                });

            if (err)
                throw new Error('Error when create payment link' + err.message);

            if (create_payment_link != null) {
                return create_payment_link;
            }
        }
    ),
    change_size: createAsyncThunk(
        'change_size',
        async ({ size }: { size: string }, { getState }): Promise<void> => {
            const { volume_id, subscription } = (getState() as RootState).user;
            if (isUUID(volume_id) && subscription.status == 'PAID') {
                // TODO implement installation job inside pocketbase
            } else throw new Error('no volume available');
        }
    ),
    change_template: createAsyncThunk(
        'change_template',
        async (
            { template }: { template: string },
            { getState }
        ): Promise<void> => {
            const {
                user: { volume_id },
                worker: { currentAddress, data }
            } = getState() as RootState;
            const vol = data[currentAddress]?.Volumes?.find(
                (x) => x.name == volume_id
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
                    volume_id
                );
                if (resp instanceof Error) throw resp;
            }
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
                fetch: userAsync.get_payment,
                hander: (state, action) => {
                    window.open(action.payload, '_self');
                }
            },
            {
                fetch: userAsync.create_payment_link,
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
