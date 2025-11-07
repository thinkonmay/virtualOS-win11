import {
    APIError,
    CancelDeployment,
    ClaimSteam,
    ClaimStorage,
    CloseSession,
    Computer,
    GetInfo,
    getRemoteSession,
    getVmSession,
    GLOBAL,
    ListObjects,
    ParseRequest,
    POCKETBASE,
    StartThinkmay,
    UnclaimResource
} from '#/api';
import { DevEnv } from '#/api/database';
import { BackupGame, ready, RestoreGame } from '#/singleton';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { validate } from 'uuid';
import {
    app_full,
    appDispatch,
    close_remote,
    fetch_app_access,
    popup_close,
    popup_open,
    remote_connect,
    remote_ready,
    RootState,
    save_reference,
    worker_refresh
} from '.';
import { create_or_replace_resources, openVNC, showConnect } from '../actions';
import { formatError } from '../utils/formatErr';
import { BuilderHelper } from './helper';

type innerComputer = Computer & {
    availability?:
        | 'no_node'
        | 'ready'
        | 'started'
        | 'waiting_shutdown'
        | 'closable';
    backup?: 'capable' | 'ongoing';
    network_disk: boolean;
};

type Backup = {
    timestamp: string;
    game: string;
};

type ResourceSession = {
    id: string;
    internal: any;
};

type Metadata = {
    configuration?: {
        disk?: number;
        template: string;
        transient: boolean;
    };
    local_id?: string;
    image?: string;
    code?: string;
    name?: string;
};

type WorkerType = {
    data: {
        [address: string]: innerComputer;
    };

    currentAddress: string;
    HighMTU: boolean;

    sessions?: ResourceSession[];
    backups?: Backup[];
    progress?: string[];
    metadata: Metadata;
    bucket?: string;
    app_access?: {
        id: string;
        app_id: string;
    };
};

const initialState: WorkerType = {
    data: {},

    currentAddress: 'saigon2.thinkmay.net',
    metadata: {},
    HighMTU: false
};

export const workerAsync = {
    showPosition: async (text: string[]) => {
        appDispatch(popup_close());
        const prefShow = ['started deployment on', 'claimed GPU'];

        const formatText = text
            .filter((x) => prefShow.find((y) => x.includes(y)) != undefined)
            .concat(text.slice(-1))
            .map((z) => z.replace("you are in", "Bạn đang trong hàng chờ vào máy, STT: "))
            .map((z1) => z1.replace(" position", "/ 30"))
            .map((w) => w.replace("deployed vm", "Đang chờ mở máy"));

        appDispatch(
            popup_open({
                type: 'notify',
                data: {
                    loading: false,
                    tips: true,
                    title: 'Booting up PC',
                    timeCounter: 15,
                    textArray: formatText
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
                remote: { preferred_codec, preferred_proto, domain },
                worker: {
                    HighMTU,
                    currentAddress,
                    metadata: { configuration }
                }
            } = getState() as RootState;

            let vncURL = undefined;
            let logURL = undefined;
            const callback = async (status: string, code?: number) => {
                appDispatch(workerSlice.actions.update_progress(status));
                const progress = (getState() as RootState).worker.progress;
                if (DevEnv) console.log(status);
                if (status.includes('broadcasters/websocket')) logURL = status;
                else if (status.includes('broadcasters/vnc')) vncURL = status;
                else if (logURL == undefined || vncURL == undefined)
                    if (code != undefined)
                        CancelDeployment(new APIError(status, code));
                    else await workerAsync.showPosition(progress);
                if (logURL != undefined && vncURL != undefined)
                    appDispatch(
                        popup_open({
                            type: 'deployWatch',
                            data: {
                                vnc: vncURL,
                                log: logURL
                            }
                        })
                    );
            };

            const info = await GetInfo();
            if (info instanceof APIError) throw formatError(info);
            let session = getRemoteSession(info);
            let vmss = getVmSession(info);

            if (!info.virtReady && !info.remoteReady)
                throw new Error(`no remote capability on ${currentAddress}`);
            else if (
                info?.Volumes?.find((x) => validate(x.name)) == undefined &&
                configuration?.transient != true
            )
                throw new Error(`you don't have any volume available`);
            else if (session == undefined) {
                appDispatch(workerSlice.actions.clean_progress());
                const h265capable =
                    RTCRtpReceiver.getCapabilities('video')?.codecs?.find(
                        ({ mimeType }) =>
                            mimeType.toLowerCase().includes('h265')
                    ) != undefined;

                const resp = await StartThinkmay(
                    h265capable ? preferred_codec : 'h264',
                    preferred_proto,
                    callback
                );
                if (resp instanceof APIError) throw resp;
                session = getRemoteSession(resp);
                vmss = getVmSession(resp);
                appDispatch(
                    workerAsync.update_local_worker({
                        currentAddress,
                        info: resp
                    })
                );
            }

            if (vmss == undefined || session == undefined)
                throw new Error('invalid session');

            const result = ParseRequest(vmss.id, session, {
                addr_override: domain,
                high_mtu: HighMTU
            });
            if (result instanceof Error) throw formatError(result);
            await appDispatch(save_reference(result));
            appDispatch(remote_connect(result));
            if (false) openVNC();
            else showConnect();
            const readyState = await ready();
            if (readyState instanceof Error) {
                appDispatch(close_remote());
                throw readyState;
            } else appDispatch(remote_ready());
        }
    ),
    claim_steam: createAsyncThunk('claim_steam', async (): Promise<string> => {
        const session = await ClaimSteam();
        if (session instanceof APIError) throw session;
        else return session;
    }),
    claim_storage: createAsyncThunk(
        'claim_storage',
        async (): Promise<string> => {
            const session = await ClaimStorage();
            if (session instanceof APIError) throw session;
            else return session;
        }
    ),
    restore_game: createAsyncThunk('restore_game', async (): Promise<void> => {
        RestoreGame();
    }),
    backup_game: createAsyncThunk('backup_game', async (): Promise<void> => {
        BackupGame();
    }),
    list_backups: createAsyncThunk(
        'list_backups',
        async (_: void, { getState }): Promise<Backup[]> => {
            if ((getState() as RootState).worker.bucket == undefined) return [];
            const files = await ListObjects('gamebackup/');
            if (files instanceof APIError) throw files;

            const result: Backup[] = [];
            for (const file of files) {
                const backupContent = await ListObjects(file.key);
                if (backupContent instanceof APIError) continue;
                const mapping = backupContent.find((x) =>
                    x.key.includes('mapping.yaml')
                );
                if (mapping == undefined) continue;

                result.push({
                    game: file.key.split('/')[1],
                    timestamp: mapping.created
                        ? new Date(mapping.created).toUTCString()
                        : undefined
                });
            }

            return result;
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
            let backup = undefined;
            const network_disk =
                info.Sessions?.find((x) => x.ndisk != undefined) != undefined;

            if (info.remoteReady) {
                if (info.Sessions?.length > 0) availability = 'started';
                else availability = 'ready';
            } else if (info.virtReady) {
                const volume = info.Volumes?.find((x) => validate(x.name));
                const inuse = volume?.inuse;
                const has_vm =
                    info.Sessions?.find((x) => x.vm != undefined) != undefined;

                if (volume == undefined) availability = 'no_node';
                else if (inuse && has_vm) availability = 'started';
                else if (inuse && !has_vm)
                    availability = network_disk
                        ? 'closable'
                        : 'waiting_shutdown';
                else availability = 'ready';

                if (
                    info.Sessions?.find(
                        (x) => x.vm != undefined
                    )?.vm?.Sessions?.find((x) => x.s3bucket != undefined) !=
                    undefined
                )
                    backup = 'capable';
            } else availability = undefined;

            return {
                [currentAddress]: {
                    ...info,
                    network_disk,
                    availability,
                    backup
                }
            };
        }
    ),
    fetch_local_worker: createAsyncThunk(
        'fetch_local_worker',
        async (address: string): Promise<void> => {
            const result = await GetInfo();
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
            if (app_id == 'none') {
                await create_or_replace_resources('kickey_none');
                return;
            }

            let id = (getState() as RootState).worker.app_access?.id;
            if (id == undefined) {
                const error = await create_or_replace_resources('kickey');
                if (error && error.message.includes('405')) {
                    appDispatch(
                        app_full({
                            id: 'payment',
                            page: 'payment',
                            value: {
                                account: {
                                    id: app_id
                                }
                            }
                        })
                    );

                    return;
                } else if (error) throw error;
                id = (getState() as RootState).worker.app_access?.id;
            }

            await POCKETBASE().collection('app_access').update(id, { app_id });
            await appDispatch(fetch_app_access());
        }
    ),
    fetch_buckets: createAsyncThunk(
        'fetch_buckets',
        async (): Promise<string | undefined> => {
            const volumes = await POCKETBASE()
                .collection('buckets')
                .getFullList<{
                    bucket_name: string;
                }>();

            return volumes?.[0]?.bucket_name;
        }
    ),
    fetch_resource_session: createAsyncThunk(
        'fetch_resource_session',
        async (): Promise<ResourceSession[]> => {
            const volumes = await POCKETBASE()
                .collection('sessions')
                .getFullList<ResourceSession>();

            return volumes;
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
                        transient?: boolean;
                        template?: string;
                        disk?: number;
                    };
                }>();
            if (volumes.length == 0) return {};
            const [{ local_id, configuration: conf }] = volumes;
            const configuration = {
                disk: conf?.disk,
                transient: conf?.transient ?? false,
                template: conf?.template ?? 'win11.template'
            };

            let result = {
                configuration,
                local_id,
                code: configuration.template.replaceAll('.template', '')
            } as Metadata;
            const { data: stores, error: err } = await GLOBAL()
                .from('stores')
                .select('metadata->screenshots->0->>path_full,name')
                .eq('code_name', result.code)
                .limit(1);
            if (err) throw err;
            else if (stores.length > 0) {
                const [{ path_full: image, name }] = stores;
                result = { ...result, image, name };
            }

            return result;
        }
    ),
    unclaim_volume: createAsyncThunk(
        'unclaim_volume',
        async (_: void, { getState }): Promise<any> => {
            const {
                worker: { data, currentAddress, sessions }
            } = getState() as RootState;
            const computer = data[currentAddress] as innerComputer;

            for (const session of computer.Sessions.filter(
                (x) => x.thinkmay != undefined || x.vm != undefined
            ).concat(computer.Sessions.filter((x) => x.ndisk != undefined))) {
                const info = await CloseSession(session);
                if (!(info instanceof APIError)) {
                    await appDispatch(
                        workerAsync.update_local_worker({
                            info,
                            currentAddress: currentAddress
                        })
                    );
                }
            }

            if (sessions?.length > 0) await UnclaimResource();
        }
    )
};

export const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        toggle_high_mtu: (
            state,
            action: PayloadAction<boolean | undefined>
        ) => {
            state.HighMTU = action.payload ?? !state.HighMTU;
        },
        clean_progress: (state) => {
            state.progress = [];
        },
        update_progress: (state, payload: PayloadAction<string>) => {
            state?.progress.push(payload.payload);
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
                fetch: workerAsync.claim_steam,
                hander: (state, action) => {
                    window.open(`thinkmay:${action.payload}`, '_top');
                }
            },
            {
                fetch: workerAsync.claim_storage,
                hander: (state, action) => {
                    window.open(`thinkmay:${action.payload}`, '_top');
                }
            },
            {
                fetch: workerAsync.worker_refresh_ui,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.fetch_resource_session,
                hander: (state, action) => {
                    state.sessions = action.payload;
                }
            },
            {
                fetch: workerAsync.list_backups,
                hander: (state, action) => {
                    state.backups = action.payload;
                }
            },
            {
                fetch: workerAsync.wait_and_claim_volume,
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
            },
            {
                fetch: workerAsync.fetch_buckets,
                hander: (state, action) => {
                    state.bucket = action.payload;
                }
            },
            {
                fetch: workerAsync.change_app_access,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.restore_game,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.backup_game,
                hander: (state, action) => {}
            }
        );
    }
});
