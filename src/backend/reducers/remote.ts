import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    appDispatch,
    close_remote,
    popup_close,
    popup_open,
    remote_connect,
    remote_ready,
    store,
    toggle_remote,
    worker_refresh
} from '.';
import {
    Computer,
    getDomainURL,
    POCKETBASE,
    RenderNode
} from '../../../src-tauri/api';
import { EventCode, isMobile } from '../../../src-tauri/core';
import {
    Assign,
    CLIENT,
    MAX_BITRATE,
    MAX_FRAMERATE,
    MIN_BITRATE,
    MIN_FRAMERATE,
    PINGER,
    ready,
    SIZE
} from '../../../src-tauri/singleton';
import { BuilderHelper } from './helper';

export type AuthSessionResp = {
    id: string;
    webrtc: RTCConfiguration;
    signaling: {
        audioUrl: string;
        videoUrl: string;
    };
};

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
    local: boolean;

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

    auth?: AuthSessionResp;
    ref?: string;
};

const initialState: Data = {
    local: false,
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
    realbitrate: 0
};

export function WindowD() {
    if (CLIENT == null) return;
    CLIENT.VirtualKeyboard(
        { code: EventCode.KeyDown, jsKey: 'lwin' },
        { code: EventCode.KeyDown, jsKey: 'd' },
        { code: EventCode.KeyUp, jsKey: 'd' },
        { code: EventCode.KeyUp, jsKey: 'lwin' }
    );
}

export const setClipBoard = async (content: string) => {
    await CLIENT?.SetClipboard(content);
};
export const remoteAsync = {
    check_worker: async () => {
        if (!store.getState().remote.active) return;
        else if (store.getState().remote.local) return;
        else if (CLIENT == null) return;
        else if (
            CLIENT.Metrics.audio.status == 'connected' ||
            CLIENT.Metrics.video.status == 'connected'
        )
            return;

        await appDispatch(worker_refresh());
        if (
            (
                new RenderNode(store.getState().worker.data).data[0]
                    ?.info as Computer
            )?.available != 'started'
        )
            appDispatch(close_remote());
    },
    ping_session: async () => {
        const active = store.getState().remote.active;
        const data_stack = store.getState().popup.data_stack;

        if (!active || CLIENT == null) return;

        const lastactive = () =>
            Math.min(CLIENT?.hid?.last_active(), CLIENT?.touch?.last_active());

        if (lastactive() > 5 * 60) {
            if (data_stack.length > 0) return;

            appDispatch(
                popup_open({
                    type: 'notify',
                    data: {
                        loading: false,
                        tips: false,
                        title: 'Please move your mouse!'
                    }
                })
            );

            while (lastactive() > 2)
                await new Promise((r) => setTimeout(r, 1000));

            appDispatch(popup_close());
        }

        PINGER();
    },
    sync: () => {
        const {
            active,
            bitrate,
            framerate,
            prev_bitrate,
            prev_framerate,
            prev_size
        } = store.getState().remote;
        if (!active) return;
        else if (CLIENT == null || !CLIENT?.ready()) return;
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
                fps: CLIENT.Metrics.video.frame.persecond
            })
        );

        if (
            prev_bitrate != bitrate ||
            prev_framerate != framerate ||
            prev_size != SIZE()
        )
            appDispatch(remoteSlice.actions.internal_sync());
    },
    direct_access: createAsyncThunk(
        'direct_access',
        async ({ ref }: { ref: string }) => {
            const resp = await fetch(
                `${window.location.origin}/api/collections/reference/records?page=1&perPage=1&filter=token="${ref}"&skipTotal=1`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: POCKETBASE.authStore.token,
                        'Content-type': 'application/json'
                    }
                }
            );

            const data = await resp.json();

            if (data.items.length == 0) throw new Error('not found any query');

            appDispatch(remote_connect({ ...(data.items[0] as any) }));
            if (!(await ready())) appDispatch(close_remote());
            else appDispatch(remote_ready());
        }
    ),
    save_reference: createAsyncThunk(
        'save_reference',
        async (info: {
            audioUrl: string;
            videoUrl: string;
            rtc_config: RTCConfiguration;
        }): Promise<string> => {
            const token = crypto.randomUUID();
            await POCKETBASE.collection('reference').create({ ...info, token });
            return token;
        }
    ),
    cache_setting: createAsyncThunk(
        'cache_setting',
        async (_: void, { getState }) => {
            // TODO
        }
    ),
    load_setting: createAsyncThunk('load_setting', async (_: void) => {
        // TODO
    }),
    toggle_remote_async: createAsyncThunk(
        'toggle_remote_async',
        async (_: void, {}) => {
            appDispatch(toggle_remote());
        }
    ),
    hard_reset_async: createAsyncThunk(
        'hard_reset_async',
        async (_: void, { getState }) => {
            if (CLIENT == null) return;

            appDispatch(
                popup_open({
                    type: 'notify',
                    data: { loading: true, title: 'Connect to PC' }
                })
            );
            await CLIENT.HardReset();
            await ready();
            appDispatch(popup_close());
        }
    )
};

export const remoteSlice = createSlice({
    name: 'remote',
    initialState,
    reducers: {
        remote_connect: (
            state,
            {
                payload: { audioUrl, videoUrl, rtc_config }
            }: PayloadAction<{
                audioUrl: string;
                videoUrl: string;
                rtc_config: RTCConfiguration;
            }>
        ) => {
            state.auth = {
                id: undefined,
                webrtc: rtc_config,
                signaling: {
                    audioUrl,
                    videoUrl
                }
            };

            state.active = true;
            state.fullscreen = true;
            state.ready = false;
        },
        remote_ready: (state) => {
            state.ready = true;
        },
        share_reference: (state) => {
            const token = state.ref;
            if (token == undefined) return;

            navigator.clipboard.writeText(`${getDomainURL()}/?ref=${token}`);
        },
        loose_focus: (state) => {
            state.focus = false;
            CLIENT?.hid?.ResetKeyStuck();
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
        },
        framedrop: (state, action: PayloadAction<boolean>) => {
            if (state.active) state.frame_drop = action.payload;
        },
        homescreen: () => {
            WindowD();
        },
        set_fullscreen: (state, action: PayloadAction<boolean>) => {
            state.fullscreen = action.payload;
        },
        toggle_fullscreen: (state) => {
            state.fullscreen = !state.fullscreen;
        },
        pointer_lock: (state, action: PayloadAction<boolean>) => {
            state.pointer_lock = action.payload;
            if (CLIENT == null) return;
            CLIENT.PointerVisible(action.payload);
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
            }>
        ) => {
            state.idrcount = action.payload.idrcount;
            state.packetLoss = action.payload.packetloss;
            state.realbitrate = action.payload.bitrate;
            state.realfps = action.payload.fps;
        },
        internal_sync: (state) => {
            if (
                (state.bitrate != state.prev_bitrate ||
                    state.prev_size != SIZE()) &&
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
        }
    },
    extraReducers: (builder) => {
        BuilderHelper<Data, any, any>(
            builder,
            {
                fetch: remoteAsync.load_setting,
                hander: (state, action: PayloadAction<any>) => {
                    const { bitrate, framerate } = action.payload;
                    state.bitrate = bitrate;
                    state.framerate = framerate;
                }
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
                fetch: remoteAsync.hard_reset_async,
                hander: (state, action: PayloadAction<void>) => {}
            }
        );
    }
});
