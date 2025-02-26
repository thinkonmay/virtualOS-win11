import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { RecordModel } from 'pocketbase';
import {
    app_toggle,
    appDispatch,
    fetch_subscription,
    popup_close,
    popup_open,
    RootState,
    worker_refresh
} from '.';
import { getDomain, GLOBAL, LOCAL, POCKETBASE } from '../../../src-tauri/api';
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
          correct_domain: boolean;
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

type Data = RecordModel & {
    subscription: PaymentStatus;
    volume_id: string;
    bucket_name?: string;
    plans: Plan[];
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
    },
    plans: []
};

export const userAsync = {
    fetch_user: createAsyncThunk(
        'fetch_user',
        async (): Promise<
            RecordModel & { volume_id: string; bucket_name?: string }
        > => {
            const {
                items: [result]
            } = await POCKETBASE.collection('users').getList(1);
            const [vol] = await POCKETBASE.collection('volumes').getFullList<{
                local_id: string;
            }>();
            const [bucket] = await POCKETBASE.collection(
                'buckets'
            ).getFullList<{
                bucket_name: string;
            }>();

            return result != undefined
                ? vol != undefined
                    ? bucket != undefined
                        ? {
                              ...result,
                              volume_id: vol.local_id,
                              bucket_name: bucket.bucket_name
                          }
                        : { ...result, volume_id: vol.local_id }
                    : { ...result, volume_id: '' }
                : initialState;
        }
    ),
    fetch_usage: createAsyncThunk(
        'fetch_usage',
        async (_, { getState }): Promise<Usage | null> => {
            const { volume_id, subscription, email } = (getState() as RootState)
                .user;
            if (!isUUID(volume_id)) return null;
            else if (subscription.status != 'PAID') return;
            const { created_at, ended_at, policy } = subscription;
            let { limit_hour } = policy ?? { limit_hour: Infinity };

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

            const { data: get_volume_usage, error } = await LOCAL().rpc(
                'get_volume_usage',
                {
                    volume_id: usageData[0].volume_id,
                    _to: usageData[0].ended_at,
                    _from: usageData[0].created_at
                }
            );
            if (error) throw error;

            const total_usage = get_volume_usage ?? 0;
            const isNewUser = usageData[0]?.new_user;

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
                isNewUser
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
                .gt('ended_at', new Date().toISOString())
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

                if (sub_verify_data.verified_at != null) {
                    const origin = new URL(window.location.href).host;
                    return {
                        status: 'PAID',
                        cluster: sub_verify_data.domain,
                        correct_domain:
                            origin.includes('localhost') ||
                            origin == sub_verify_data.domain,
                        local_metadata: sub_verify_data.local_metadata,
                        policy: sub_verify_data.policy,
                        created_at: sub_verify_data.created_at,
                        ended_at: sub_verify_data.ended_at
                    };
                } else return { status: 'PENDING' };
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

            const { email, volume_id } = (getState() as RootState).user;

            const { data: existSub, error: errr } = await GLOBAL()
                .from('subscriptions')
                .select('id,local_metadata->>volume_id')
                .gt('ended_at', new Date().toISOString())
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

                if (domain != getDomain()) await remotelogin(domain, email);

                if (create_payment_link != null) {
                    return create_payment_link;
                }

                throw new Error('Failed to create payment link');
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
                const { data, error: failed } = await LOCAL()
                    .from('job')
                    .select('result,command,created_at,arguments->base')
                    .eq('arguments->>id', volume_id)
                    .order('created_at', { ascending: false })
                    .limit(1);
                if (failed) throw new Error(failed.message);
                else if (data.length > 0 && data[0].result != 'success') {
                    appDispatch(
                        popup_open({
                            type: 'notify',
                            data: {
                                loading: true,
                                timeProcessing: 2,
                                tips: false,
                                title: `Đang cài đặt game ${
                                    data[0].base
                                } vào lúc ${new Date(
                                    data[0].created_at
                                ).toLocaleTimeString()}`,
                                text: 'Nếu cài đặt lâu hơn 20 phút. Vui lòng liên hệ Admin ở hỗ trợ ngay!'
                            }
                        })
                    );

                    await new Promise((r) => setTimeout(r, 5000));
                    await appDispatch(popup_close());

                    await appDispatch(worker_refresh());
                    await appDispatch(fetch_subscription());
                    await appDispatch(app_toggle('connectPc'));
                    return;
                }

                const { error } = await LOCAL()
                    .from('volume_map')
                    .update({ template, size: '300' })
                    .eq('id', volume_id);
                if (error) throw new Error(error.message);

                appDispatch(
                    popup_open({
                        type: 'notify',
                        data: {
                            loading: true,
                            tips: false,
                            timeProcessing: 2,
                            title: `Đang cài đặt game ${template} vào lúc ${new Date().toLocaleTimeString()}`,
                            text: 'Nếu cài đặt lâu hơn 20 phút. Vui lòng liên hệ Admin ở hỗ trợ ngay!'
                        }
                    })
                );

                while (true) {
                    const { data, error: failed } = await LOCAL()
                        .from('job')
                        .select('result,command,created_at,arguments->base')
                        .eq('arguments->>id', volume_id)
                        .is('result', null)
                        .order('created_at', { ascending: false })
                        .limit(1);
                    if (failed) throw new Error(failed.message);

                    if (data.length == 0) {
                        appDispatch(popup_close());
                        break;
                    }
                    await new Promise((r) => setTimeout(r, 20000));
                }

                appDispatch(
                    popup_open({
                        type: 'complete',
                        data: {
                            content: `Cài đặt hoàn tất, máy của bạn đã có sẵn ${template}!`,
                            success: true
                        }
                    })
                );
                await new Promise((r) => setTimeout(r, 5000));
                await appDispatch(popup_close());

                await appDispatch(worker_refresh());
                await appDispatch(fetch_subscription());
                await appDispatch(app_toggle('connectPc'));
            } else
                throw new Error(
                    'Hãy tắt máy trước khi cài đặt game. [Cài đặt -> Shutdown]'
                );
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
                fetch: userAsync.change_template,
                hander: (state, action) => {}
            }
        );
    }
});
