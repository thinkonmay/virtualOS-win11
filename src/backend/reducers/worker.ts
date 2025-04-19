import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    appDispatch,
    close_remote,
    popup_close,
    popup_open,
    remote_connect,
    remote_ready,
    RootState,
    save_reference,
    worker_refresh
} from '.';
import {
    APIError,
    CloseSession,
    Computer,
    GetInfo,
    getRemoteSession,
    GLOBAL,
    ParseRequest,
    POCKETBASE,
    StartThinkmay
} from '../../../src-tauri/api';
import { ready } from '../../../src-tauri/singleton';
import { formatWaitingLog } from '../utils/formatWatingLog';
import { BuilderHelper } from './helper';
import toast from 'react-hot-toast';
import { formatError } from '../utils/formatErr';

type innerComputer = Computer & {
    availability?: 'no_node' | 'ready' | 'started'; // private
};

type Metadata = {
    configuration?: {
        ram: number;
        cpu: number;
        disk: number;
        template: string;
    };
    pbid: string;
    local_id: string;
    image?: string;
    code?: string;
    name?: string;
};

type WorkerType = {
    data: {
        [address: string]: innerComputer;
    };

    currentAddress: string;
    HideVM: boolean;
    HighMTU: boolean;
    HighQueue: boolean;

    metadata?: Metadata;
    app_access?: {
        id: string;
        app_id: string;
    };
};

const initialState: WorkerType = {
    data: {},

    currentAddress: 'play.2.thinkmay.net',
    HideVM: true,
    HighMTU: false,
    HighQueue: false
};

export const workerAsync = {
    showPosition: async (text: string) => {
        appDispatch(popup_close());

        appDispatch(
            popup_open({
                type: 'notify',
                data: {
                    loading: false,
                    tips: true,
                    title: 'Connect to PC',
                    //text: `Progress: ${text}`
                    text: formatWaitingLog(text)
                }
            })
        );
    },
    worker_refresh: createAsyncThunk(
        'worker_refresh',
        async (_: void, { getState }): Promise<void> => {
            const addr = (getState() as RootState).worker.currentAddress;
            await appDispatch(workerAsync.fetch_local_worker(addr));
        }
    ),
    worker_refresh_ui: createAsyncThunk(
        'worker_refresh_ui',
        async (): Promise<void> => {
            await appDispatch(worker_refresh());
        }
    ),
    wait_and_claim_volume: createAsyncThunk(
        'wait_and_claim_volume',
        async (_: void, { getState }) => {
            const {
                worker: { HideVM, HighMTU, HighQueue, currentAddress }
            } = getState() as RootState;

            appDispatch(
                popup_open({ type: 'notify', data: { loading: true } })
            );

            const info = await GetInfo(currentAddress);
            if (info instanceof APIError) throw formatError(info);
            else if (!info.virtReady && !info.remoteReady)
                throw new Error(`no remote capability on ${currentAddress}`);

            let session = getRemoteSession(info);
            if (session == undefined) {
                if (
                    info?.Volumes?.filter((x) => x.pool == 'user_data')
                        .length == 0
                )
                    throw new Error(`you don't have any volume available`);

                const resp = await StartThinkmay(
                    currentAddress,
                    info.virtReady ? { HideVM: HideVM } : undefined,
                    info.virtReady ? workerAsync.showPosition : undefined
                );
                if (resp instanceof APIError) {
                    toast(formatError(resp));
                    appDispatch(popup_close());
                    return;
                }
                appDispatch(
                    workerAsync.update_local_worker({
                        currentAddress,
                        info: resp
                    })
                );
                session = getRemoteSession(resp);
            }

            const result = ParseRequest(currentAddress, session, {
                high_mtu: HighMTU,
                high_queue: HighQueue
            });
            if (result instanceof APIError) throw formatError(result);
            await appDispatch(save_reference(result));

            appDispatch(remote_connect(result));
            if (!(await ready())) appDispatch(close_remote());
            else appDispatch(remote_ready());
        }
    ),
    update_local_worker: createAsyncThunk(
        'update_local_worker',
        async ({
            info,
            currentAddress
        }: {
            info: Computer;
            currentAddress: string;
        }): Promise<{ [address: string]: innerComputer }> => {
            let availability = undefined;
            if (info.remoteReady) {
                if (info.Sessions?.length > 0) availability = 'started';
                else availability = 'ready';
            } else if (info.virtReady) {
                if (
                    info.Volumes?.filter((x) => x.pool == 'user_data')
                        ?.length == 0
                )
                    availability = 'no_node';
                else if (info.Sessions?.length > 0) availability = 'started';
                else availability = 'ready';
            } else availability = undefined;

            return { [currentAddress]: { ...info, availability } };
        }
    ),
    fetch_local_worker: createAsyncThunk(
        'fetch_local_worker',
        async (address: string): Promise<void> => {
            const result = await GetInfo(address);
            await appDispatch(
                workerAsync.update_local_worker(
                    result instanceof APIError
                        ? {
                              info: {},
                              currentAddress: address
                          }
                        : {
                              info: result,
                              currentAddress: address
                          }
                )
            );
        }
    ),
    change_app_access: createAsyncThunk(
        'change_app_access',
        async (app_id: string, { getState }): Promise<void> => {
            const id = (getState() as RootState).worker.app_access?.id;
            if (id == undefined)
                throw new Error('you do not have app access available');
            await POCKETBASE().collection('app_access').update(id, { app_id });
        }
    ),
    fetch_app_access: createAsyncThunk(
        'fetch_app_access',
        async (): Promise<
            | {
                  id: string;
                  app_id: string;
              }
            | undefined
        > => {
            const volumes = await POCKETBASE()
                .collection('app_access')
                .getFullList<{
                    id: string;
                    app_id: string;
                }>();

            return volumes?.[0];
        }
    ),
    fetch_configuration: createAsyncThunk(
        'fetch_configuration',
        async (): Promise<Metadata | undefined> => {
            const volumes = await POCKETBASE()
                .collection('volumes')
                .getFullList<{
                    id: string;
                    local_id: string;
                    configuration?: {
                        template: string;
                        cpu: string;
                        ram: string;
                        disk: string;
                    };
                }>();

            if (volumes.length == 0) return;

            const [{ id: pbid, local_id, configuration: _configuration }] =
                volumes;
            const configuration = {
                cpu: parseInt(_configuration?.cpu),
                ram: parseInt(_configuration?.ram),
                disk: parseInt(_configuration?.disk),
                template: _configuration?.template
            };
            if (Number.isNaN(configuration.cpu)) configuration.cpu = 8;
            if (Number.isNaN(configuration.ram)) configuration.ram = 16;
            if (Number.isNaN(configuration.disk)) configuration.disk = 150;
            if (configuration.template == undefined)
                configuration.template = 'win11.template';
            const code = configuration.template.replaceAll('.template', '');

            if (code != undefined) {
                const { data: stores, error: err } = await GLOBAL()
                    .from('stores')
                    .select('metadata->screenshots->0->>path_full,name')
                    .eq('code_name', code)
                    .limit(1);
                if (err) throw err;
                else if (stores.length > 0) {
                    const [{ path_full: image, name }] = stores;
                    return {
                        pbid,
                        configuration,
                        local_id,
                        image,
                        code,
                        name
                    };
                } else
                    return {
                        pbid,
                        configuration,
                        local_id,
                        code
                    };
            } else
                return {
                    pbid,
                    configuration,
                    local_id
                };
        }
    ),
    unclaim_volume: createAsyncThunk(
        'unclaim_volume',
        async (_: void, { getState }): Promise<any> => {
            const {
                worker: { data, currentAddress }
            } = getState() as RootState;
            const computer = data[currentAddress];

            let session = undefined;
            if (computer.remoteReady)
                session = computer.Sessions.find(
                    (x) => x.thinkmay != undefined
                );
            else if (computer.virtReady)
                session = computer.Sessions.find((x) => x.vm != undefined);
            if (session == undefined)
                throw new Error(`no session available on ${currentAddress}`);
            const info = await CloseSession(currentAddress, session);
            if (info instanceof APIError) throw formatError(info);
            await appDispatch(
                workerAsync.update_local_worker({
                    info,
                    currentAddress: currentAddress
                })
            );
        }
    )
};

export const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        toggle_high_queue: (
            state,
            action: PayloadAction<boolean | undefined>
        ) => {
            state.HighQueue = action.payload ?? !state.HighQueue;
        },
        toggle_high_mtu: (
            state,
            action: PayloadAction<boolean | undefined>
        ) => {
            state.HighMTU = action.payload ?? !state.HighMTU;
        },
        toggle_hide_vm: (state, action: PayloadAction<boolean | undefined>) => {
            state.HideVM = action.payload ?? !state.HideVM;
        },
        set_current_address: (state, payload: PayloadAction<string>) => {
            state.currentAddress = payload.payload;
        }
    },
    extraReducers: (build) => {
        BuilderHelper<WorkerType, any, any>(
            build,
            {
                fetch: workerAsync.update_local_worker,
                hander: (state, action) => {
                    state.data = {
                        ...state.data,
                        ...action.payload
                    };
                }
            },
            {
                fetch: workerAsync.unclaim_volume,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.worker_refresh_ui,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.fetch_configuration,
                hander: (state, action) => {
                    state.metadata = action.payload;
                }
            },
            {
                fetch: workerAsync.fetch_app_access,
                hander: (state, action) => {
                    state.app_access = action.payload;
                }
            }
        );
    }
});
