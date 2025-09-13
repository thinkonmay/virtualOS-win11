import { APIError, POCKETBASE, RemoteCredential } from '#/api';
import { isMobile } from '#/core';
import {
    AuthFailed,
    ChangeBitrate,
    ChangeFramerate,
    CloseStreaming,
    Connected,
    GetVideoMetric,
    MAX_BITRATE,
    MAX_FRAMERATE,
    MIN_BITRATE,
    MIN_FRAMERATE,
    NotReady,
    PointerVisible,
    ready,
    ResetKeyStuck,
    set_hq,
    SetClipboard,
    SetScancode,
    Size
} from '#/singleton';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import {
    appDispatch,
    change_bitrate,
    change_framerate,
    change_preferred_codec,
    change_preferred_proto,
    close_remote,
    remote_connect,
    remote_ready,
    RootState,
    scancode,
    store,
    toggle_hide_vm,
    toggle_high_mtu,
    toggle_high_queue,
    toggle_hq,
    toggle_microphone,
    toggle_remote,
    worker_refresh
} from '.';
import { originalurl } from '../actions/background';
import { BuilderHelper } from './helper';

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
    preferred_codec: 'h264' | 'h265';
    preferred_proto: 'quic' | 'udp';
    enable_microphone: boolean;

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
    preferred_codec: 'h264',
    preferred_proto: 'udp',
    enable_microphone: false,

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

export const remoteAsync = {
    handleClipboard: async () => {
        const clipboard = await navigator.clipboard.readText();
        await SetClipboard(clipboard);
    },
    check_worker: async () => {
        const {
            remote: { active, direct_access }
        } = store.getState();
        if (!active || direct_access || Connected()) return;

        await appDispatch(worker_refresh());
        const {
            worker: { data, currentAddress }
        } = store.getState();
        switch (data[currentAddress].availability) {
            case 'started':
            case 'closable':
                const session = data[currentAddress].Sessions.find(
                    (x) => x.vm != undefined
                )?.id;
                if (session == undefined)
                    throw new APIError('empty vm sessions');
                else if (AuthFailed()) {
                    appDispatch(close_remote());
                    toast(`Streaming auth failure`, {
                        icon: 'ℹ️',
                        duration: 15000,
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff'
                        }
                    });
                }
                break;
            case 'no_node':
                appDispatch(close_remote());
                toast(`Your node is down`, {
                    icon: 'ℹ️',
                    duration: 15000,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff'
                    }
                });
                break;
            case 'ready':
                appDispatch(close_remote());
                toast(`Your PC was shutted down`, {
                    icon: 'ℹ️',
                    duration: 15000,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff'
                    }
                });
                break;
            default:
                break;
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
            scancode,
            hq,
            prev_size
        } = store.getState().remote;
        if (!active) return;
        else if (NotReady()) return;
        if (isMobile()) PointerVisible(true);

        const metric = GetVideoMetric();
        appDispatch(
            remoteSlice.actions.metrics({
                packetloss: metric.packetloss.last,
                idrcount: metric.idrcount.last,
                bitrate: metric.bitrate.persecond,
                fps: metric.frame.persecond,
                decodetime: metric.frame.decodetime,
                delay: metric.frame.delay
            })
        );

        if (
            prev_bitrate != bitrate ||
            prev_framerate != framerate ||
            prev_hq != hq ||
            prev_size != Size()
        )
            appDispatch(remoteSlice.actions.internal_sync());

        SetScancode(scancode);
    },
    direct_access: createAsyncThunk('direct_access', async (url: URL) => {
        const address = url.searchParams.get('host');
        const audio = url.searchParams.get('audio');
        const mic = url.searchParams.get('mic');
        const video = url.searchParams.get('video');
        const data = url.searchParams.get('data');
        const high_queue = store.getState().worker.HighQueue;
        const high_mtu = store.getState().worker.HighMTU;
        if (address == null || audio == null || video == null || data == null)
            return false;

        // add demo ref here
        const record = await POCKETBASE()
            .collection('users')
            .getOne(POCKETBASE().authStore.model.id);

        await POCKETBASE()
            .collection('users')
            .update(POCKETBASE().authStore.model.id, {
                metadata: {
                    ...record.metadata,
                    demo: originalurl.searchParams.get('demo')
                }
            });

        const opt = `&queue_size=${high_queue ? 64 : 16}&mtu=${
            high_mtu ? 1400 : 1200
        }`;
        appDispatch(
            remote_connect({
                videoUrl: `wss://${address}:444/broadcasters/webrtc?token=${video}${opt}`,
                audioUrl: `wss://${address}:444/broadcasters/webrtc?token=${audio}`,
                microUrl: `wss://${address}:444/broadcasters/microphone?token=${mic}`,
                hidUrl: `wss://${address}:444/broadcasters/websocket?token=${data}`
            })
        );
        if ((await ready()) instanceof Error) appDispatch(close_remote());
        else appDispatch(remote_ready());
        return true;
    }),
    save_reference: createAsyncThunk(
        'save_reference',
        async (info: RemoteCredential): Promise<string> => {
            const audio = new URL(info.audioUrl).searchParams.get('token');
            const video = new URL(info.videoUrl).searchParams.get('token');
            const mic = new URL(info.microUrl).searchParams.get('token');
            const data = new URL(info.hidUrl).searchParams.get('token');
            const host = new URL(info.hidUrl).hostname;

            const url = new URL(originalurl.toString());
            url.searchParams.set('audio', audio);
            url.searchParams.set('video', video);
            url.searchParams.set('mic', mic);
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
            const {
                hq,
                bitrate,
                framerate,
                scancode,
                preferred_codec,
                preferred_proto,
                enable_microphone
            } = (getState() as RootState).remote;

            const setting = {
                hq,
                preferred_codec,
                preferred_proto,
                enable_microphone,
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
                preferred_codec?: 'h264' | 'h265';
                preferred_proto?: 'udp' | 'quic';
                enable_microphone?: boolean;
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
                        preferred_codec,
                        preferred_proto,
                        enable_microphone,
                        scancode: _scancode
                    }
                }
            ] = settings;
            appDispatch(toggle_hide_vm(HideVM));
            appDispatch(toggle_high_mtu(HighMTU));
            appDispatch(toggle_high_queue(HighQueue));
            appDispatch(toggle_microphone(enable_microphone));
            appDispatch(toggle_hq(hq));
            if (['h264', 'h265'].includes(preferred_codec))
                appDispatch(change_preferred_codec(preferred_codec));
            if (['quic', 'udp'].includes(preferred_proto))
                appDispatch(change_preferred_proto(preferred_proto));
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
            if (!state.enable_microphone) state.auth.microUrl = undefined;
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
            ResetKeyStuck();
        },
        have_focus: (state) => {
            state.focus = true;
            remoteAsync.handleClipboard();
        },
        close_remote: (state) => {
            state.active = false;
            state.auth = undefined;
            state.fullscreen = false;
            CloseStreaming();
        },
        toggle_remote: (state) => {
            if (!state.active) {
                state.fullscreen = true;
            } else {
                state.fullscreen = false;
                CloseStreaming();
            }
            state.active = !state.active;
        },
        strict_timing: (state, action: PayloadAction<boolean>) => {
            state.no_strict_timing = action.payload;
        },
        scancode_toggle: (
            state,
            action: PayloadAction<boolean | undefined>
        ) => {
            action.payload =
                typeof action.payload == 'boolean' ? action.payload : undefined;
            state.scancode = action.payload ?? !state.scancode;
        },
        scancode: (state, action: PayloadAction<boolean>) => {
            state.scancode = action.payload;
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
            PointerVisible(action.payload);
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
                    state.prev_size != Size() ||
                    state.prev_hq != state.hq) &&
                Size() > 0
            ) {
                ChangeBitrate(
                    Math.round(
                        ((MAX_BITRATE() - MIN_BITRATE()) / 100) *
                            state.bitrate +
                            MIN_BITRATE()
                    )
                );
                state.prev_bitrate = state.bitrate;
                state.prev_size = Size();
                state.prev_hq = state.hq;
            }

            if (state.framerate != state.prev_framerate) {
                ChangeFramerate(
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
        toggle_microphone: (
            state,
            action: PayloadAction<boolean | undefined>
        ) => {
            state.enable_microphone =
                action.payload ?? !state.enable_microphone;
        },
        change_preferred_proto: (
            state,
            action: PayloadAction<'udp' | 'quic'>
        ) => {
            state.preferred_proto = action.payload;
        },
        change_preferred_codec: (
            state,
            action: PayloadAction<'h264' | 'h265'>
        ) => {
            state.preferred_codec = action.payload;
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
