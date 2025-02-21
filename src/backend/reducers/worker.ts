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
    CloseSession,
    Computer,
    GetInfo,
    getRemoteSession,
    LoginSteamOnVM,
    LogoutSteamOnVM,
    MountOnVM,
    ParseRequest,
    StartThinkmay,
    UnmountOnVM
} from '../../../src-tauri/api';
import { ready } from '../../../src-tauri/singleton';
import { formatWaitingLog } from '../utils/formatWatingLog';
import { BuilderHelper } from './helper';
import { Contents } from './locales';

const now = () => new Date().getTime() / 1000 / 60;

type innerComputer = Computer & {
    address?: string; // private
    availability?: 'not_ready' | 'ready' | 'started'; // private
    steam?: boolean; // private
    storage?: boolean; // private
};

type WorkerType = {
    data: {
        [address: string]: innerComputer;
    };

    currentAddress: string;
    HideVM: boolean;
};

const initialState: WorkerType = {
    data: {},

    currentAddress: 'play.2.thinkmay.net',
    HideVM: true
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
            const { HideVM, currentAddress } = (getState() as RootState).worker;

            const showConnect = () => {
                appDispatch(popup_close());
                appDispatch(
                    popup_open({
                        type: 'notify',
                        data: {
                            loading: false,
                            tips: false,
                            title: 'Connecting video & audio',
                            text: (getState() as RootState).globals.translation[
                                Contents.CA_CONNECT_NOTIFY
                            ]
                        }
                    })
                );
            };

            const info = await GetInfo(currentAddress);
            if (info instanceof Error) throw info;
            else if (!info.virtReady && !info.remoteReady)
                throw new Error(`no remote capability on ${currentAddress}`);

            let session = getRemoteSession(info);
            if (session == undefined) {
                const resp = await StartThinkmay(
                    currentAddress,
                    info.virtReady ? { HideVM: HideVM } : undefined,
                    info.virtReady ? workerAsync.showPosition : undefined
                );
                if (resp instanceof Error) throw resp;
                appDispatch(
                    workerAsync.update_local_worker({
                        currentAddress,
                        info: resp
                    })
                );
                session = getRemoteSession(resp);
            }

            const result = ParseRequest(currentAddress, session);
            if (result instanceof Error) throw result;
            await appDispatch(save_reference(result));

            showConnect();
            appDispatch(remote_connect(result));
            if (!(await ready())) appDispatch(close_remote());
            else appDispatch(remote_ready());
            appDispatch(popup_close());
        }
    ),
    update_local_worker: createAsyncThunk(
        'update_local_worker',
        async (
            {
                info,
                currentAddress
            }: {
                info: Computer;
                currentAddress: string;
            },

            { getState }
        ): Promise<{ [address: string]: innerComputer }> => {
            const { bucket_name, accounts } = (getState() as RootState).user;
            const computer = info as innerComputer;

            if (computer.remoteReady) {
                if (computer.Sessions?.length > 0)
                    computer.availability = 'started';
                else computer.availability = 'ready';
            } else if (computer.virtReady) {
                if (computer.Volumes?.length == 0)
                    computer.availability = undefined;
                else if (computer.Volumes.find((x) => x.inuse) != undefined)
                    computer.availability = 'started';
                else computer.availability = 'ready';
            } else computer.availability = 'not_ready';

            if (accounts.length == 0) computer.steam = undefined;
            else if (
                computer.Sessions?.find((x) => x.app?.Type == 'steam') !=
                undefined
            )
                computer.steam = false;
            else computer.steam = false;

            if (bucket_name == undefined) computer.storage = undefined;
            else if (
                computer.Sessions?.find((x) => x.app != undefined) != undefined
            )
                computer.storage = false;
            else computer.storage = false;

            return { [currentAddress]: computer };
        }
    ),
    fetch_local_worker: createAsyncThunk(
        'fetch_local_worker',
        async (address: string): Promise<void> => {
            const result = await GetInfo(address);
            await appDispatch(
                workerAsync.update_local_worker(
                    result instanceof Error
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
            if (info instanceof Error) throw info;
            await appDispatch(
                workerAsync.update_local_worker({
                    info,
                    currentAddress: currentAddress
                })
            );
        }
    ),
    storage_session_toggle: createAsyncThunk(
        'storage_session_toggle',
        async (_, { getState }): Promise<any> => {
            const state = getState() as RootState;
            const storage =
                state.worker.data[state.worker.currentAddress]?.storage;

            if (storage)
                await appDispatch(workerAsync.storage_session_logout());
            else await appDispatch(workerAsync.storage_session_login());
        }
    ),
    storage_session_login: createAsyncThunk(
        'storage_session_login',
        async (_, { getState }): Promise<any> => {
            const {
                user: { bucket_name },
                worker: { data, currentAddress }
            } = getState() as RootState;
            const session = data[currentAddress]?.Sessions?.[0];
            if (bucket_name == undefined)
                throw new Error(`user dont have any associate bucket name`);
            const info = await MountOnVM(
                currentAddress,
                session.id,
                bucket_name
            );
            if (info instanceof Error) throw info;
            appDispatch(
                workerAsync.update_local_worker({
                    info,
                    currentAddress
                })
            );
        }
    ),
    storage_session_logout: createAsyncThunk(
        'storage_session_logout',
        async (_, { getState }): Promise<any> => {
            const {
                worker: { data, currentAddress }
            } = getState() as RootState;
            const session = data[
                currentAddress
            ]?.Sessions?.[0]?.vm?.Sessions.find((x) => x.s3bucket != undefined);
            return await UnmountOnVM(currentAddress, session);
        }
    ),
    app_session_toggle: createAsyncThunk(
        'app_session_toggle',
        async (_, { getState }): Promise<any> => {
            const {
                worker: { data, currentAddress }
            } = getState() as RootState;
            const steam = data[currentAddress]?.steam;

            if (steam) await appDispatch(workerAsync.app_session_logout());
            else await appDispatch(workerAsync.app_session_login());
        }
    ),
    app_session_login: createAsyncThunk(
        'app_session_login',
        async (_, { getState }): Promise<void> => {
            const {
                worker: { data, currentAddress },
                user: { accounts }
            } = getState() as RootState;
            const session = data[currentAddress]?.Sessions?.[0];
            if (accounts.length == 0)
                throw new Error(`You have not link any steam account`);
            const [
                {
                    metadata: { username, password }
                }
            ] = accounts;

            const info = await LoginSteamOnVM(
                currentAddress,
                session.id,
                username ?? '',
                password ?? ''
            );
            if (info instanceof Error) throw info;
            appDispatch(
                workerAsync.update_local_worker({
                    info,
                    currentAddress
                })
            );
        }
    ),
    app_session_logout: createAsyncThunk(
        'app_session_logout',
        async (_, { getState }): Promise<any> => {
            const {
                worker: { data, currentAddress }
            } = getState() as RootState;
            const session = data[
                currentAddress
            ]?.Sessions?.[0]?.vm?.Sessions.find((x) => x.app != undefined);
            return await LogoutSteamOnVM(currentAddress, session);
        }
    )
};

export const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        toggle_hide_vm: (state) => {
            state.HideVM = !state.HideVM;
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
                fetch: workerAsync.wait_and_claim_volume,
                hander: (state, action) => {}
            }
        );
    }
});
