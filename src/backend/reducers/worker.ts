import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
    appDispatch,
    close_remote,
    fetch_local_worker,
    popup_close,
    popup_open,
    remote_connect,
    remote_ready,
    RootState,
    save_reference,
    unclaim_volume,
    vm_session_access,
    vm_session_create,
    wait_and_claim_volume,
    worker_refresh,
    worker_session_close
} from '.';
import {
    CloseSession,
    Computer,
    fromComputer,
    getDomain,
    GetInfo,
    KeepaliveVolume,
    LOCAL,
    ParseRequest,
    ParseVMRequest,
    PingSession,
    RenderNode,
    StartRequest,
    StartThinkmay,
    StartThinkmayOnPeer,
    StartThinkmayOnVM,
    StartVirtdaemon,
    UserEvents
} from '../../../src-tauri/api';
import { ready, SetPinger } from '../../../src-tauri/singleton';
import { BuilderHelper } from './helper';

type WorkerType = {
    data: any;
    cpath: string;
    cdata: any[];

    hist: any[];
    hid: number;
};

const initialState: WorkerType = {
    data: new RenderNode<{}>().any(),

    cpath: '',
    cdata: [],

    hist: [],
    hid: 0
};

export const workerAsync = {
    worker_refresh: createAsyncThunk(
        'worker_refresh',
        async (): Promise<void> => {
            await appDispatch(fetch_local_worker(getDomain()));
        }
    ),
    worker_reload: createAsyncThunk(
        'worker_reload',
        async (): Promise<void> => {
            await appDispatch(worker_refresh());
        }
    ),
    wait_and_claim_volume: createAsyncThunk(
        'wait_and_claim_volume',
        async (_: void, { getState }) => {
            const { email, subscription } = (getState() as RootState).user;
            const { status } = subscription;
            const { vcpu, ram } =
                status == 'PAID' || status == 'IMPORTED'
                    ? subscription.local_metadata
                    : { vcpu: '16', ram: '16' };

            await appDispatch(worker_refresh());
            appDispatch(
                popup_open({
                    type: 'notify',
                    data: { loading: true, title: 'Connect to PC' }
                })
            );

            const volume_id = (getState() as RootState).user.volume_id;
            const now = () => new Date().getTime() / 1000 / 60;
            const start = now();
            while (now() - start < 180) {
                // 3 hours
                const node = new RenderNode(
                    (getState() as RootState).worker.data
                );

                let result: RenderNode<Computer> | undefined = undefined;
                node.iterate((x) => {
                    if (
                        result == undefined &&
                        (x.info as Computer)?.Volumes?.includes(volume_id)
                    )
                        result = x;
                });

                if (result == undefined) {
                    appDispatch(popup_close());
                    throw new Error(
                        'Không tìm thấy ổ cứng, đợi 5 - 10p hoặc liên hệ Admin ở Hỗ trợ ngay!'
                    );
                }
                const computer: Computer = node.findParent<Computer>(
                    result.id,
                    'host_worker'
                )?.info;
                if (computer == undefined) {
                    appDispatch(popup_close());
                    throw new Error('invalid tree');
                }

                const keepalive = KeepaliveVolume(
                    computer,
                    volume_id,
                    PingSession
                );
                if (result.type == 'vm_worker' && result.data.length > 0) {
                    appDispatch(popup_close());
                    appDispatch(
                        popup_open({
                            type: 'notify',
                            data: {
                                loading: false,
                                tips: false,
                                title: 'Connecting video & audio',
                                text: 'Vui lòng giữ tab cho tới khi connect xong!'
                            }
                        })
                    );
                    const [{ id }] = result.data;
                    const interval = setInterval(keepalive, 30 * 1000);
                    await appDispatch(
                        vm_session_access({ id, retry_method: 'claim' })
                    );
                    clearInterval(interval);

                    SetPinger(keepalive);
                    appDispatch(popup_close());
                    return;
                } else if (
                    result.type == 'vm_worker' &&
                    result.data.length == 0
                ) {
                    appDispatch(popup_close());
                    appDispatch(
                        popup_open({
                            type: 'notify',
                            data: {
                                loading: false,
                                tips: false,
                                title: 'Connecting video & audio',
                                text: 'Vui lòng giữ tab cho tới khi connect xong!'
                            }
                        })
                    );
                    const { id } = result;
                    const interval = setInterval(keepalive, 30 * 1000);
                    await appDispatch(
                        vm_session_create({ id, retry_method: 'claim' })
                    );
                    clearInterval(interval);

                    SetPinger(keepalive);
                    appDispatch(popup_close());
                    return;
                }

                const id = uuidv4();
                UserEvents({
                    type: 'remote/requesting_vm',
                    payload: {
                        id,
                        email
                    }
                });

                const resp = await StartVirtdaemon(
                    computer,
                    volume_id,
                    `${ram ?? 16}`,
                    `${vcpu ?? 16}`
                );
                if (resp instanceof Error) {
                    UserEvents({
                        type: 'remote/request_vm_failure',
                        payload: {
                            id,
                            email,
                            error: resp.message
                        }
                    });
                    appDispatch(popup_close());
                    throw resp;
                }

                UserEvents({
                    type: 'remote/request_vm_success',
                    payload: {
                        id,
                        email
                    }
                });

                await appDispatch(worker_refresh());
            }

            appDispatch(popup_close());
            return;
        }
    ),
    fetch_local_worker: createAsyncThunk(
        'fetch_local_worker',
        async (address: string, { getState }): Promise<any> => {
            const result = await GetInfo(address);
            if (result instanceof Error) {
                const node = new RenderNode<{}>();
                node.id = address;
                return node.any();
            }

            const volume_id = (getState() as RootState).user.volume_id;

            let found: RenderNode<Computer> | undefined = undefined;
            const node = fromComputer(address, result);
            node.iterate((x) => {
                if (
                    found == undefined &&
                    (x.info as Computer)?.Volumes?.includes(volume_id)
                )
                    found = x;
            });

            if (found != undefined) {
                const { data, error: errr } = await LOCAL()
                    .from('volume_map')
                    .select('id')
                    .eq('id', volume_id)
                    .eq('status', 'IMPORTED')
                    .limit(1);
                if (errr) throw new Error(errr.message);
                else if (data.length == 1) node.info.available = 'ready';
                else {
                    const { data, error: err } = await LOCAL()
                        .from('job')
                        .select('result')
                        .eq('arguments->>id', volume_id)
                        .limit(1);
                    if (err) throw new Error(err.message);
                    else if (data.length > 0 && data[0].result == 'success')
                        node.info.available = 'ready';
                    else node.info.available = 'not_ready';
                }

                if (found.type == 'vm_worker' && node.info.available == 'ready')
                    node.info.available = 'started';
            }

            return node.any();
        }
    ),
    worker_session_create: createAsyncThunk(
        'worker_session_create',
        async (input: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            const computer = node.findParent<Computer>(input, 'local_worker')
                ?.info;

            const result = await StartThinkmay(computer);
            if (result instanceof Error) throw result;
            appDispatch(fetch_local_worker(computer.address));
            appDispatch(remote_connect(result));
            await appDispatch(save_reference(result));
            if (!(await ready())) appDispatch(close_remote());
            else appDispatch(remote_ready());
        }
    ),
    worker_session_access: createAsyncThunk(
        'worker_session_access',
        async (input: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            const computer = node.findParent<Computer>(input, 'local_worker')
                ?.info;
            const session = node.findParent<StartRequest>(
                input,
                'local_session'
            )?.info;

            if (computer == undefined) throw new Error('invalid tree');
            if (session == undefined) throw new Error('invalid tree');

            const result = ParseRequest(computer, session);
            if (result instanceof Error) throw result;
            appDispatch(remote_connect(result));
            await appDispatch(save_reference(result));
            if (!(await ready())) appDispatch(close_remote());
            else appDispatch(remote_ready());
        }
    ),
    retry_volume_claim: createAsyncThunk(
        'retry_volume_claim',
        async (_: void, {}): Promise<any> => {
            appDispatch(close_remote());
            await appDispatch(unclaim_volume());
            await appDispatch(wait_and_claim_volume());
        }
    ),
    unclaim_volume: createAsyncThunk(
        'unclaim_volume',
        async (_: void, { getState }): Promise<any> => {
            const volume_id = (getState() as RootState).user.volume_id;

            const node = new RenderNode((getState() as RootState).worker.data);

            let volumeFound: RenderNode<Computer> | undefined = undefined;
            node.iterate((x) => {
                if (
                    volumeFound == undefined &&
                    x.info?.Volumes?.includes(volume_id)
                )
                    volumeFound = x;
            });

            if (volumeFound == undefined)
                throw new Error('user do not have available volume');

            const host_session = node.findParent(
                volumeFound.id,
                'host_session'
            );
            await appDispatch(worker_session_close(host_session.id ?? ''));
        }
    ),
    worker_session_close: createAsyncThunk(
        'worker_session_close',
        async (input: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            const computer =
                node.findParent<Computer>(input, 'host_worker')?.info ??
                node.findParent<Computer>(input, 'local_worker')?.info;
            const session = node.find<StartRequest>(input)?.info;

            if (computer == undefined) throw new Error('invalid tree');
            if (session == undefined) throw new Error('invalid tree');

            await CloseSession(computer, session);
            await appDispatch(fetch_local_worker(computer.address));
        }
    ),
    worker_vm_create: createAsyncThunk(
        'worker_vm_create',
        async (input: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            const computer: Computer = node.find<Computer>(input).info;
            if (computer == undefined) throw new Error('invalid tree');

            await StartVirtdaemon(computer);
            await appDispatch(fetch_local_worker(computer.address));
        }
    ),
    worker_vm_create_from_volume: createAsyncThunk(
        'worker_vm_create_from_volume',
        async (input: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            const computer: Computer = node.findParent<Computer>(
                input,
                'host_worker'
            ).info;
            if (computer == undefined) throw new Error('invalid tree');

            const resp = await StartVirtdaemon(computer, input);
            if (resp instanceof Error) {
                throw resp.message;
            }
            await appDispatch(fetch_local_worker(computer.address));
            return resp;
        }
    ),
    vm_session_create: createAsyncThunk(
        'vm_session_create',
        async (
            {
                id: id,
                retry_method
            }: { id: string; retry_method: 'claim' | 'ignore' },
            { getState }
        ): Promise<any> => {
            await appDispatch(worker_refresh());

            const node = new RenderNode((getState() as RootState).worker.data);

            const host = node.findParent<Computer>(id, 'host_worker');
            const vm_session = node.findParent<StartRequest>(
                id,
                'host_session'
            );

            if (host == undefined) throw new Error('invalid tree');
            else if (vm_session == undefined) throw new Error('invalid tree');

            const result = await (async () => {
                for (let index = 0; index < 5; index++) {
                    const result = await StartThinkmayOnVM(
                        host.info,
                        vm_session.id
                    );
                    if (result instanceof Error) continue;
                    else return result;
                }

                return new Error('failed to start vm session after 5 retries');
            })();
            if (result instanceof Error) throw result;
            appDispatch(fetch_local_worker(host.info.address));
            appDispatch(remote_connect(result));
            await appDispatch(save_reference(result));
            const success = await ready();
            if (!success && retry_method == 'claim')
                appDispatch(workerAsync.retry_volume_claim());
            else if (!success && retry_method == 'ignore')
                appDispatch(close_remote());
            else appDispatch(remote_ready());
        }
    ),
    vm_session_access: createAsyncThunk(
        'vm_session_access',
        async (
            {
                id,
                retry_method
            }: { id: string; retry_method: 'claim' | 'ignore' },
            { getState }
        ): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            const computer = node.findParent<Computer>(id, 'host_worker')?.info;
            const session = node.find<StartRequest>(id)?.info;
            const vm_session_id = node.findParent<StartRequest>(
                id,
                'host_session'
            )?.info.id;

            if (computer == undefined) throw new Error('invalid tree');
            if (session == undefined) throw new Error('invalid tree');
            if (vm_session_id == undefined) throw new Error('invalid tree');

            const result = ParseVMRequest(computer, {
                ...session,
                target: vm_session_id
            });

            appDispatch(remote_connect(result));
            await appDispatch(save_reference(result));
            const success = await ready();
            if (!success && retry_method == 'claim')
                appDispatch(workerAsync.retry_volume_claim());
            else if (!success && retry_method == 'ignore')
                appDispatch(close_remote());
            else appDispatch(remote_ready());
        }
    ),
    vm_session_close: createAsyncThunk(
        'vm_session_close',
        async (id: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            const computer =
                node.findParent<Computer>(id, 'host_worker')?.info ??
                node.findParent<Computer>(id, 'local_worker')?.info;
            if (computer == undefined) throw new Error('invalid tree');

            const session = node.find<StartRequest>(id)?.info;
            if (session == undefined) throw new Error('invalid tree');

            const vm_session_id = node.findParent<StartRequest>(
                id,
                'host_session'
            )?.info.id;
            if (vm_session_id == undefined) throw new Error('invalid tree');

            await CloseSession(computer, { ...session, target: vm_session_id });
            await appDispatch(fetch_local_worker(computer.address));
        }
    ),
    peer_session_create: createAsyncThunk(
        'peer_session_create',
        async (ip: string, { getState }): Promise<any> => {
            await appDispatch(worker_refresh());

            const node = new RenderNode((getState() as RootState).worker.data);

            const host = node.findParent<Computer>(ip, 'host_worker');
            if (host == undefined) throw new Error('invalid tree');

            const result = await StartThinkmayOnPeer(host.info, ip);
            if (result instanceof Error) throw result;

            appDispatch(fetch_local_worker(host.info.address));
            appDispatch(remote_connect(result));
            await appDispatch(save_reference(result));
            if (!(await ready())) appDispatch(close_remote());
            else appDispatch(remote_ready());
        }
    ),
    peer_session_access: createAsyncThunk(
        'peer_session_access',
        async (input: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            const computer = node.findParent<Computer>(input, 'host_worker')
                ?.info;
            const session = node.find<StartRequest>(input)?.info;
            const target = node.findParent<Computer>(input, 'peer_worker')?.info
                .PrivateIP;

            if (computer == undefined) throw new Error('invalid tree');
            if (session == undefined) throw new Error('invalid tree');
            if (target == undefined) throw new Error('invalid tree');

            const result = ParseVMRequest(computer, { ...session, target });
            appDispatch(remote_connect(result));
            await appDispatch(save_reference(result));
            if (!(await ready())) appDispatch(close_remote());
            else appDispatch(remote_ready());
        }
    ),
    peer_session_close: createAsyncThunk(
        'peer_session_close',
        async (id: string, { getState }): Promise<any> => {
            const node = new RenderNode((getState() as RootState).worker.data);
            const computer =
                node.findParent<Computer>(id, 'host_worker')?.info ??
                node.findParent<Computer>(id, 'local_worker')?.info;
            if (computer == undefined) throw new Error('invalid tree');

            const session = node.find<StartRequest>(id)?.info;
            if (session == undefined) throw new Error('invalid tree');

            await CloseSession(computer, { ...session });
            await appDispatch(fetch_local_worker(computer.address));
        }
    )
};

export const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        worker_view: (state, action: PayloadAction<string | number>) => {
            const paths = state.cpath.split('/').filter((x) => x.length > 0);
            paths.push(`${action.payload}`);
            state.cpath = paths.join('/');

            let temp: RenderNode<any>[] = [];
            let target: RenderNode<any> = state.data;
            paths.forEach((x) => {
                temp = new RenderNode(target).data;
                target = temp.find((y) => y.id == x) ?? target;
            });

            state.cdata = target.data.map((x) => x.any());
        },
        worker_prev: (state, action: PayloadAction<any>) => {
            const paths = state.cpath.split('/').filter((x) => x.length > 0);
            paths.pop();
            state.cpath = paths.join('/');
            if (paths.length == 0) {
                state.cdata = new RenderNode(state.data).data.map((x) =>
                    x.any()
                );
                return;
            }

            let temp: RenderNode<any>[] = [];
            let target: RenderNode<any> = state.data;
            paths.forEach((x) => {
                temp = new RenderNode(target).data;
                target = temp.find((y) => y.id == x) ?? target;
            });

            state.cdata = target.data.map((x) => x.any());
        }
    },
    extraReducers: (build) => {
        BuilderHelper<WorkerType, any, any>(
            build,
            {
                fetch: workerAsync.fetch_local_worker,
                hander: (state, action) => {
                    let target = new RenderNode<any>(state.data);

                    const node = new RenderNode<Computer>(action.payload);

                    const overlapp = target.data.findIndex(
                        (x) => x.id == node.id
                    );
                    if (overlapp == -1 && node.type != 'reject')
                        target.data.push(node);
                    else if (overlapp == -1 && node.type == 'reject') return;
                    else if (node.type == 'reject')
                        target.data = target.data.filter(
                            (v, i) => i != overlapp
                        );
                    else target.data[overlapp] = node;

                    state.data = target.any();

                    const paths = state.cpath
                        .split('/')
                        .filter((x) => x.length > 0);
                    if (paths.length == 0) {
                        state.cdata = target.data.map((x) => x.any());
                    } else {
                        paths.forEach(
                            (x) =>
                                (target =
                                    new RenderNode(target).data.find(
                                        (y) => y.id == x
                                    ) ?? target)
                        );
                        state.cdata = target.data.map((x) => x.any());
                    }
                }
            },
            {
                fetch: workerAsync.unclaim_volume,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.worker_session_close,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.worker_reload,
                hander: (state, action) => {}
            }
            //{
            //    fetch: workerAsync.wait_and_claim_volume,
            //    hander: (state, action) => { }
            //}
        );
    }
});
