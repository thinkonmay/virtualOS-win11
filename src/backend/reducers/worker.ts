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
    ParseRequest,
    StartThinkmay
} from '../../../src-tauri/api';
import { ready } from '../../../src-tauri/singleton';
import { formatWaitingLog } from '../utils/formatWatingLog';
import { BuilderHelper } from './helper';
import { isUUID } from './user';
import { showConnect } from '../actions';

type innerComputer = Computer & {
    availability?: 'not_ready' | 'ready' | 'started'; // private
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
            const {
                worker: { HideVM, currentAddress }
            } = getState() as RootState;

            const info = await GetInfo(currentAddress);
            if (info instanceof Error) throw info;
            else if (!info.virtReady && !info.remoteReady)
                throw new Error(`no remote capability on ${currentAddress}`);

            let session = getRemoteSession(info);
            if (session == undefined) {
                if (
                    info?.Volumes?.filter(
                        (x) => x.pool == 'user_data' 
                    ).length == 0
                )
                    throw new Error(`you don't have any volume available`);

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
                if (info.Volumes?.length == 0) availability = undefined;
                else if (info.Sessions?.length > 0) availability = 'started';
                else availability = 'ready';
            } else availability = 'not_ready';

            return { [currentAddress]: { ...info, availability } };
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
