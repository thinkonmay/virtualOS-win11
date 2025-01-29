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
    LOCAL,
    LoginSteamOnVM,
    LogoutSteamOnVM,
    MountOnVM,
    ParseRequest,
    POCKETBASE,
    Session,
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

    currentAddress: '',
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
        async (): Promise<void> => {
            const addr = '127.0.0.1';
            await appDispatch(workerAsync.fetch_local_worker(addr));
            appDispatch(workerSlice.actions.set_current_address(addr));
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

            let session: Session | undefined = undefined;
            if (info.virtReady) {
                info.Sessions?.forEach(
                    (x) =>
                        x.vm?.Sessions?.forEach(
                            (y) =>
                                (session =
                                    session != undefined ||
                                    y.thinkmay == undefined
                                        ? session
                                        : y)
                        )
                );
                if (session == undefined) {
                    const resp = await StartThinkmay(
                        currentAddress,
                        { HideVM: HideVM },
                        workerAsync.showPosition
                    );
                    if (resp instanceof Error) throw resp;
                    else
                        session = resp.vm.Sessions?.find(
                            (x) => x.thinkmay != undefined
                        );
                }
            } else if (info.remoteReady) {
                session = info.Sessions?.find((x) => x.thinkmay != undefined);
                if (session == undefined) {
                    const resp = await StartThinkmay(currentAddress);
                    if (resp instanceof Error) throw resp;
                    else session = resp;
                }
            }

            if (session == undefined)
                throw new Error(
                    `no remote capability on address ${currentAddress}`
                );

            const result = ParseRequest(currentAddress, session);
            if (result instanceof Error) throw result;
            await appDispatch(save_reference(result));
            showConnect();
            appDispatch(remote_connect(result));
            if (!(await ready())) appDispatch(close_remote());
            else appDispatch(remote_ready());
            appDispatch(popup_close());
            appDispatch(worker_refresh());
            return;
        }
    ),
    fetch_local_worker: createAsyncThunk(
        'fetch_local_worker',
        async (
            address: string,
            { getState }
        ): Promise<{ [address: string]: innerComputer }> => {
            const { bucket_name } = (getState() as RootState).user;
            const accounts =
                await POCKETBASE.collection('thirdparty_account').getFullList();

            const result = await GetInfo(address);
            if (result instanceof Error)
                return {
                    [address]: {
                        availability: 'not_ready'
                    }
                };

            const computer = result as innerComputer;

            if (computer.remoteReady) {
                if (computer.Sessions?.length > 0)
                    computer.availability = 'started';
                else computer.availability = 'ready';
            } else if (computer.virtReady) {
                if (
                    computer.Sessions?.find((x) => x.thinkmay != undefined) !=
                    undefined
                )
                    computer.availability = 'started';
                else if (computer.Volumes?.length == 0) {
                    computer.availability = undefined;
                } else {
                    const { data, error: err } = await LOCAL()
                        .from('job')
                        .select('result')
                        .in('arguments->>id', computer.Volumes ?? [])
                        .order('created_at', { ascending: false })
                        .limit(1);

                    if (err) throw new Error(err.message);
                    else if (data.length == 0) computer.availability = 'ready';
                    else if (data.every((x) => x.result == 'success'))
                        computer.availability = 'ready';
                    else computer.availability = 'not_ready';
                }
            } else computer.availability = 'not_ready';

            if (accounts.length == 0) computer.steam = undefined;
            else if (
                computer.Sessions.find((x) => x.app?.Type == 'steam') !=
                undefined
            )
                computer.steam = false;
            else computer.steam = false;

            if (bucket_name == undefined) computer.storage = undefined;
            else if (
                computer.Sessions.find((x) => x.app != undefined) != undefined
            )
                computer.storage = false;
            else computer.storage = false;

            return { [address]: computer };
        }
    ),
    unclaim_volume: createAsyncThunk(
        'unclaim_volume',
        async (_: void, { getState }): Promise<any> => {
            const state = getState() as RootState;
            const computer = state.worker.data[state.worker.currentAddress];

            await CloseSession(
                state.worker.currentAddress,
                computer.Sessions.at(0)
            );

            await appDispatch(worker_refresh());
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
            await appDispatch(worker_refresh());
        }
    ),
    storage_session_login: createAsyncThunk(
        'storage_session_login',
        async (_, { getState }): Promise<any> => {
            const state = getState() as RootState;
            const bucket_name = state.user.bucket_name;
            const session =
                state.worker.data[state.worker.currentAddress]?.Sessions?.[0];
            if (bucket_name == undefined)
                throw new Error(`user dont have any associate bucket name`);
            return await MountOnVM(
                state.worker.currentAddress,
                session.id,
                bucket_name
            );
        }
    ),
    storage_session_logout: createAsyncThunk(
        'storage_session_logout',
        async (_, { getState }): Promise<any> => {
            const state = getState() as RootState;
            const session =
                state.worker.data[state.worker.currentAddress]?.Sessions?.[0];
            return await UnmountOnVM(state.worker.currentAddress, session);
        }
    ),
    app_session_toggle: createAsyncThunk(
        'app_session_toggle',
        async (_, { getState }): Promise<any> => {
            const state = getState() as RootState;
            const steam = state.worker.data[state.worker.currentAddress]?.steam;

            if (steam) await appDispatch(workerAsync.app_session_logout());
            else await appDispatch(workerAsync.app_session_login());
            await appDispatch(worker_refresh());
        }
    ),
    app_session_login: createAsyncThunk(
        'app_session_login',
        async (_, { getState }): Promise<any> => {
            const state = getState() as RootState;
            const session =
                state.worker.data[state.worker.currentAddress]?.Sessions?.[0];
            const accounts =
                await POCKETBASE.collection('thirdparty_account').getFullList();
            if (accounts.length == 0)
                throw new Error(`You have not link any steam account`);
            const [
                {
                    metadata: { username, password }
                }
            ] = accounts;

            return await LoginSteamOnVM(
                state.worker.currentAddress,
                session.id,
                username ?? '',
                password ?? ''
            );
        }
    ),
    app_session_logout: createAsyncThunk(
        'app_session_logout',
        async (_, { getState }): Promise<any> => {
            const state = getState() as RootState;
            const session =
                state.worker.data[state.worker.currentAddress]?.Sessions?.[0];
            return await LogoutSteamOnVM(state.worker.currentAddress, session);
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
                fetch: workerAsync.fetch_local_worker,
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
