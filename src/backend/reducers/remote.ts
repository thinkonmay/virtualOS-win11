import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    appDispatch,
    change_bitrate,
    change_framerate,
    close_remote,
    popup_close,
    popup_open,
    remote_connect,
    remote_ready,
    RootState,
    scancode,
    store,
    toggle_hide_vm,
    toggle_high_mtu,
    toggle_high_queue,
    toggle_hq,
    toggle_remote,
    worker_refresh
} from '.';
import { POCKETBASE, RemoteCredential } from '../../../src-tauri/api';
import { isMobile } from '../../../src-tauri/core';
import {
    Assign,
    CLIENT,
    MAX_BITRATE,
    MAX_FRAMERATE,
    MIN_BITRATE,
    MIN_FRAMERATE,
    ready,
    set_hq,
    SIZE
} from '../../../src-tauri/singleton';
import { BuilderHelper } from './helper';
import { originalurl } from '../actions/background';
import toast from 'react-hot-toast';

export type Metric = {
    receivefps: number[];
    decodefps: number[];
    packetloss: number[];
    bandwidth: number[];
    buffer: number[];
};

type Data = {
    tracker_id?: string;

    active: boolean;
    ready: boolean;
    fullscreen: boolean;
    pointer_lock: boolean;
    relative_mouse: boolean;
    focus: boolean;
    hq: boolean;
    prev_hq: boolean;
    direct_access: boolean;

    scancode: boolean;
    no_strict_timing: boolean;
    frame_drop: boolean;

    bitrate: number;
    prev_bitrate: number;
    framerate: number;
    prev_framerate: number;
    prev_size: number;

    packetLoss: number;
    idrcount: number;
    realfps: number;
    realbitrate: number;
    realdecodetime: number;
    realdelay: number;

    auth?: RemoteCredential;
    ref?: string;

    objectFit: 'fill' | 'contain';
};

const initialState: Data = {
    hq: false,
    prev_hq: false,
    direct_access: false,
    focus: true,
    active: false,
    ready: false,
    scancode: false,
    no_strict_timing: false,
    fullscreen: false,
    pointer_lock: false,
    relative_mouse: false,

    frame_drop: false,
    bitrate: 0,
    prev_bitrate: 0,
    framerate: 0,
    prev_framerate: 0,
    prev_size: 0,
    idrcount: 0,
    realfps: 0,
    packetLoss: 0,
    realbitrate: 0,
    realdelay: 0,
    realdecodetime: 0,
    objectFit: 'fill'
};

export const setClipBoard = async (content: string) => {
    await CLIENT?.SetClipboard(content);
};
export const remoteAsync = {
    check_worker: async () => {
        const {
            remote: { active, direct_access }
        } = store.getState();
        if (!active) return;
        else if (direct_access) return;
        else if (CLIENT == undefined) return;
        else if (CLIENT.Metrics.video.status == 'connected') return;

        await appDispatch(worker_refresh());
        const {
            worker: { data, currentAddress }
        } = store.getState();
        if (data[currentAddress].availability != 'started') {
            appDispatch(close_remote());
            toast(`Your PC was shutted down`, {
                icon: 'ℹ️',
                duration: 5000,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff'
                }
            });
        }
    },
    sync: () => {
        const {
            active,
            bitrate,
            framerate,
            prev_bitrate,
            prev_framerate,
            prev_hq,
            hq,
            prev_size
        } = store.getState().remote;
        if (!active) return;
        else if (CLIENT == undefined || !CLIENT?.ready()) return;
        if (isMobile()) CLIENT.PointerVisible(true);

        const {
            gamePadHide,
            keyboardHide,
            gamepadSetting: { draggable }
        } = store.getState().sidepane.mobileControl;
        CLIENT.touch.mode =
            gamePadHide && keyboardHide && !draggable ? 'trackpad' : 'none';

        appDispatch(
            remoteSlice.actions.metrics({
                packetloss: CLIENT.Metrics.video.packetloss.last,
                idrcount: CLIENT.Metrics.video.idrcount.last,
                bitrate: CLIENT.Metrics.video.bitrate.persecond,
                fps: CLIENT.Metrics.video.frame.persecond,
                decodetime: CLIENT.Metrics.video.frame.decodetime,
                delay: CLIENT.Metrics.video.frame.delay
            })
        );

        if (
            prev_bitrate != bitrate ||
            prev_framerate != framerate ||
            prev_hq != hq ||
            prev_size != SIZE()
        )
            appDispatch(remoteSlice.actions.internal_sync());
    },
    direct_access: createAsyncThunk('direct_access', async (url: URL) => {
        const address = url.searchParams.get('host');
        const audio = url.searchParams.get('audio');
        const video = url.searchParams.get('video');
        const data = url.searchParams.get('data');
        const high_queue = store.getState().worker.HighQueue;
        const high_mtu = store.getState().worker.HighMTU;
        if (address == null || audio == null || video == null || data == null)
            return false;

        const opt = `&queue_size=${high_queue ? 16 : 4}&mtu=${
            high_mtu ? 1400 : 1200
        }`;
        appDispatch(
            remote_connect({
                videoUrl: `wss://${address}:444/broadcasters/webrtc?token=${video}${opt}`,
                audioUrl: `wss://${address}:444/broadcasters/webrtc?token=${audio}`,
                dataUrl: `wss://${address}:444/broadcasters/websocket?token=${data}`
            })
        );
        if (!(await ready())) appDispatch(close_remote());
        else appDispatch(remote_ready());
        return true;
    }),
    save_reference: createAsyncThunk(
        'save_reference',
        async (info: RemoteCredential): Promise<string> => {
            const audio = new URL(info.audioUrl).searchParams.get('token');
            const video = new URL(info.videoUrl).searchParams.get('token');
            const data = new URL(info.dataUrl).searchParams.get('token');
            const host = new URL(info.dataUrl).hostname;

            const url = new URL(originalurl.toString());
            url.searchParams.set('audio', audio);
            url.searchParams.set('video', video);
            url.searchParams.set('data', data);
            url.searchParams.set('host', host);
            return url.toString();
        }
    ),
    cache_setting: createAsyncThunk(
        'cache_setting',
        async (_: {}, { getState }) => {
            const user = (getState() as RootState).user.id;
            const { HideVM, HighMTU, HighQueue } = (getState() as RootState)
                .worker;
            const { hq, bitrate, framerate, scancode } = (
                getState() as RootState
            ).remote;

            const setting = {
                hq,
                HideVM,
                HighMTU,
                scancode,
                HighQueue,
                bitrate,
                framerate
            };
            const settings = await POCKETBASE()
                .collection('setting')
                .getFullList();
            if (settings.length == 0)
                await POCKETBASE()
                    .collection('setting')
                    .create({ user, setting });
            else
                await POCKETBASE()
                    .collection('setting')
                    .update(settings[0]?.id, { setting });
        }
    ),
    _load_setting: createAsyncThunk('load_setting', async (_: void) => {
        let bitrateLocal: number = +localStorage.getItem('bitrate');
        let framerateLocal: number = +localStorage.getItem('framerate');

        if (
            bitrateLocal > 100 ||
            bitrateLocal <= 0 ||
            framerateLocal > 100 ||
            framerateLocal <= 0
        ) {
            bitrateLocal = 35;
            framerateLocal = 25;
        }

        appDispatch(change_bitrate(bitrateLocal));
        appDispatch(change_framerate(framerateLocal));

        const settings = await POCKETBASE().collection('setting').getFullList<{
            setting: {
                hq?: boolean;
                HideVM?: boolean;
                HighMTU?: boolean;
                HighQueue?: boolean;
                scancode?: boolean;
                bitrate?: number;
                framerate?: number;
            };
        }>();
        if (settings.length > 0) {
            const [
                {
                    setting: {
                        hq,
                        HideVM,
                        HighMTU,
                        HighQueue,
                        scancode: _scancode
                    }
                }
            ] = settings;
            appDispatch(toggle_hide_vm(HideVM));
            appDispatch(toggle_high_mtu(HighMTU));
            appDispatch(toggle_high_queue(HighQueue));
            appDispatch(toggle_hq(hq));
            if (_scancode) appDispatch(scancode(_scancode));
        }
    }),
    get load_setting() {
        return this._load_setting;
    },
    set load_setting(value) {
        this._load_setting = value;
    },
    toggle_remote_async: createAsyncThunk(
        'toggle_remote_async',
        async (_: void, {}) => {
            appDispatch(toggle_remote());
        }
    )
};

export const remoteSlice = createSlice({
    name: 'remote',
    initialState,
    reducers: {
        remote_connect: (
            state,
            { payload: data }: PayloadAction<RemoteCredential>
        ) => {
            state.auth = data;
            state.active = true;
            state.fullscreen = true;
            state.ready = false;
        },
        remote_ready: (state) => {
            state.ready = true;
        },
        toggle_hq: (state, action: PayloadAction<boolean | undefined>) => {
            const newstate = action.payload ?? !state.hq;
            set_hq(newstate);
            state.hq = newstate;
        },
        loose_focus: (state) => {
            state.focus = false;
            if (CLIENT) CLIENT?.hid?.ResetKeyStuck();
        },
        have_focus: (state) => {
            state.focus = true;
        },
        close_remote: (state) => {
            state.active = false;
            state.auth = undefined;
            state.fullscreen = false;
            CLIENT?.Close();
            Assign(null);
        },
        toggle_remote: (state) => {
            if (!state.active) {
                state.fullscreen = true;
            } else {
                state.fullscreen = false;
                CLIENT?.Close();
            }
            state.active = !state.active;
        },
        strict_timing: (state, action: PayloadAction<boolean>) => {
            state.no_strict_timing = action.payload;
        },
        scancode_toggle: (state) => {
            state.scancode = !state.scancode;
            if (CLIENT) CLIENT.hid.scancode = state.scancode;
        },
        scancode: (state, action: PayloadAction<boolean>) => {
            state.scancode = action.payload;
            if (CLIENT) CLIENT.hid.scancode = state.scancode;
        },
        framedrop: (state, action: PayloadAction<boolean>) => {
            if (state.active) state.frame_drop = action.payload;
        },
        set_fullscreen: (state, action: PayloadAction<boolean>) => {
            state.fullscreen = action.payload;
        },
        toggle_fullscreen: (state) => {
            state.fullscreen = !state.fullscreen;
        },
        pointer_lock: (state, action: PayloadAction<boolean>) => {
            state.pointer_lock = action.payload;
            CLIENT?.PointerVisible(action.payload);
        },
        relative_mouse: (state) => {
            state.relative_mouse = !state.relative_mouse;
        },
        metrics: (
            state,
            action: PayloadAction<{
                packetloss: number;
                idrcount: number;
                bitrate: number;
                fps: number;
                decodetime: number;
                delay: number;
            }>
        ) => {
            state.idrcount = action.payload.idrcount;
            state.packetLoss = action.payload.packetloss;
            state.realbitrate = action.payload.bitrate;
            state.realfps = action.payload.fps;
            state.realdecodetime = action.payload.decodetime;
            state.realdelay = action.payload.delay;
        },
        internal_sync: (state) => {
            if (
                (state.bitrate != state.prev_bitrate ||
                    state.prev_size != SIZE() ||
                    state.prev_hq != state.hq) &&
                SIZE() > 0
            ) {
                CLIENT?.ChangeBitrate(
                    Math.round(
                        ((MAX_BITRATE() - MIN_BITRATE()) / 100) *
                            state.bitrate +
                            MIN_BITRATE()
                    )
                );
                state.prev_bitrate = state.bitrate;
                state.prev_size = SIZE();
                state.prev_hq = state.hq;
            }

            if (state.framerate != state.prev_framerate) {
                CLIENT?.ChangeFramerate(
                    Math.round(
                        ((MAX_FRAMERATE - MIN_FRAMERATE) / 100) *
                            state.framerate +
                            MIN_FRAMERATE
                    )
                );
                state.prev_framerate = state.framerate;
            }
        },
        change_framerate: (state, action: PayloadAction<number>) => {
            state.framerate = action.payload;
        },
        change_bitrate: (state, action: PayloadAction<number>) => {
            state.bitrate = action.payload;
        },
        toggle_objectfit: (state) => {
            const currentState = state.objectFit;
            state.objectFit = currentState == 'fill' ? 'contain' : 'fill';
        }
    },
    extraReducers: (builder) => {
        BuilderHelper<Data, any, any>(
            builder,
            {
                fetch: remoteAsync.load_setting,
                hander: (state, action: PayloadAction<any>) => {}
            },
            {
                fetch: remoteAsync.cache_setting,
                hander: (state, action: PayloadAction<void>) => {}
            },
            {
                fetch: remoteAsync.save_reference,
                hander: (state, action: PayloadAction<string>) => {
                    state.ref = action.payload;
                }
            },
            {
                fetch: remoteAsync.toggle_remote_async,
                hander: (state, action: PayloadAction<void>) => {}
            },
            {
                fetch: remoteAsync.direct_access,
                hander: (state, action: PayloadAction<boolean>) => {
                    state.direct_access = action.payload;
                }
            }
        );
    }
});
