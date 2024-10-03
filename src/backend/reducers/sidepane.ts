import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { appDispatch, render_message, store } from '.';
import { supabaseLocal } from '../../../src-tauri/api';
import { BuilderHelper, CacheRequest } from './helper';
import { Contents } from './locales';

export type Notification = {
    urlToImage?: string;
    url?: string;
    name?: string;
    title: string;
    type: 'pending' | 'fulfilled' | 'rejected';
    content?: string;
};

export type Message = {
    type: 'private' | 'public';
    recipient: 'everyone' | 'thinkmay' | string;
    content: string;
};
type IGamePadSetting = {
    open: boolean;
    btnSize: 1 | 2 | 3;
    draggable: 'static' | 'draggable';
    isDefaultPos: boolean;
};
type MobileControl = {
    hide: boolean;
    buttons: any[];
    shortcuts: any[];
    setting: ISettingState;
    gamePadHide: boolean;
    keyboardHide: boolean;
    gamepadSetting: IGamePadSetting;
};
type Data = {
    notifications: Notification[];
    message: Message[];

    quicks: any[];
    shortcuts: any[];
    mobileControl: MobileControl;
    hide: boolean;
    banhide: boolean;
};
interface ISettingState {
    gamePad: IGamePadValue;
    virtMouse: any;
}
interface IGamePadValue {
    leftScale: number;
    rightScale: number;
    leftJt: number;
    rightJt: number;
    dpad: number;
    ybxa: number;
    rbRt: number;
    lbLt: number;
    subBtn: number;
    ls: number;
    rs: number;
}
const initialSetting: ISettingState = {
    gamePad: {
        leftScale: 1,
        rightScale: 1,
        leftJt: 1,
        rightJt: 1,
        dpad: 1,
        ybxa: 1,
        rbRt: 1,
        lbLt: 1,
        subBtn: 1,
        ls: 1,
        rs: 1
    },
    virtMouse: {}
};
const listMobileShortCut = [
    {
        name: 'Esc',
        val: ['Escape']
    },
    {
        name: 'Win+D',
        val: ['lwin', 'd']
    },
    {
        name: 'Ctrl C',
        val: ['control', 'c']
    },
    {
        name: 'Ctrl V',
        val: ['control', 'v']
    },
    {
        name: 'Back',
        val: ['Backspace']
    }
];
const listDesktopShortCut = [
    {
        name: 'Win+D',
        val: ['lwin', 'd']
    }
];

const initialState: Data = {
    quicks: [
        {
            ui: true,
            src: 'FiVideoOff',
            name: [Contents.VIDEO_TOGGLE],
            state: 'active',
            action: 'toggle_remote_async'
        },
        {
            ui: true,
            src: 'MdOutlineResetTv',
            name: [Contents.RESET_VIDEO],
            state: 'network.airplane',
            action: 'hard_reset_async'
        },
        //{
        //    ui: true,
        //    src: 'FaWindows',
        //    name: [Contents.HOMESCREEN],
        //    action: 'remote/homescreen'
        //},
        {
            ui: true,
            src: 'MdFullscreen',
            name: [Contents.FULLSCREEN],
            state: 'fullscreen',
            action: 'remote/toggle_fullscreen'
        },
        {
            ui: true,
            src: 'MdOutlineKeyboard',
            name: [Contents.SCAN_CODE],
            state: 'scancode',
            action: 'remote/scancode_toggle'
        },
        {
            ui: true,
            src: 'MdOutlineLink',
            name: [Contents.EXTERNAL_TAB],
            state: 'share_reference',
            action: 'remote/share_reference'
        },
        {
            ui: true,
            src: 'FaMousePointer',
            name: [Contents.RELATIVE_MOUSE],
            state: 'relative_mouse',
            action: 'remote/relative_mouse'
        },
        {
            ui: true,
            src: 'MdOutlinePowerSettingsNew',
            name: [Contents.SHUT_DOWN],
            state: 'shutdown',
            action: 'shutDownVm',
            style: { backgroundColor: '#d92d20', color: '#f3f4f5' }
        },
        {
            ui: true,
            src: 'MdNetworkWifi2Bar',
            name: [Contents.STRICT_TIMING],
            state: 'no_strict_timing',
            action: 'remote/strict_timing_toggle'
        }
    ],
    shortcuts: listDesktopShortCut,

    mobileControl: {
        hide: true,
        buttons: [
            {
                ui: true,
                src: 'MdOutlineResetTv',
                name: [Contents.RESET_VIDEO],
                state: 'network.airplane',
                action: 'hard_reset_async'
            },
            {
                ui: true,
                src: 'MdFullscreen',
                name: [Contents.FULLSCREEN],
                state: 'fullscreen',
                action: 'remote/toggle_fullscreen'
            },
            {
                ui: true,
                src: 'MdOutlineKeyboard',
                name: [Contents.OPEN_KEYBOARD],
                state: 'keyboardOpen',
                action: 'sidepane/toggle_keyboard'
            },
            {
                ui: true,
                src: 'MdOutlineSportsEsports',
                name: [Contents.OPEN_GAMEPAD],
                state: 'gamePadOpen',
                //action: 'sidepane/toggle_gamepad'
                action: 'sidepane/toggle_gamepad_setting'
            },
            //{
            //    ui: true,
            //    src: 'MdOutlineSettingsInputComponent',
            //    name: [Contents.ADJUST_GAMEPAD],
            //    state: 'network.airplane',
            //    action: 'sidepane/toggle_gamepad_setting'
            //},
            {
                ui: true,
                src: 'MdOutlineLink',
                name: [Contents.EXTERNAL_TAB],
                state: 'network.airplane',
                action: 'remote/share_reference'
            },

            {
                ui: true,
                src: 'MdOutlinePowerSettingsNew',
                name: [Contents.SHUT_DOWN],
                state: 'shutdown',
                action: 'shutDownVm',
                style: { backgroundColor: '#d92d20', color: '#f3f4f5' }
            }
        ],
        shortcuts: listMobileShortCut,
        setting: initialSetting,
        gamePadHide: true,
        keyboardHide: true,
        gamepadSetting: {
            btnSize: 1,
            draggable: 'static',
            open: false,
            isDefaultPos: false
        }
    },

    notifications: [],
    message: [],

    hide: true,
    banhide: true
};

export const sidepaneAsync = {
    push_message: createAsyncThunk(
        'push_message',
        async (input: Message, { getState }): Promise<void> => {
            const email = store.getState().user.email;
            await supabaseLocal.from('user_message').insert({
                metadata: {
                    email,
                    type: input.type,
                    recipient: input.recipient
                },
                value: { content: input.content }
            });
        }
    ),
    handle_message: async (payload: any) => {
        if (payload.new.metadata.email != store.getState().user.email) return;
        appDispatch(
            render_message({
                ...payload.new.value,
                ...payload.new.metadata,
                timestamp: payload.new.timestamp
            })
        );
    },
    fetch_message: createAsyncThunk(
        'fetch_message',
        async (email: string, { getState }): Promise<Message[]> => {
            supabaseLocal
                .channel('schema-message-changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'user_message'
                    },
                    sidepaneAsync.handle_message
                )
                .subscribe();

            return await CacheRequest('message', 30, async () => {
                const { data, error } = await supabaseLocal
                    .from('user_message')
                    .select('timestamp,value,metadata')
                    .order('timestamp', { ascending: false })
                    .eq(`metadata->>email`, email)
                    .limit(10);

                if (error) throw error;

                return data.map((x) => {
                    return {
                        ...x.value,
                        ...x.metadata,
                        timestamp: x.timestamp
                    };
                });
            });
        }
    )
};

export const sidepaneSlice = createSlice({
    name: 'sidepane',
    initialState,
    reducers: {
        sidepane_bandtogg: (state) => {
            state.banhide = !state.banhide;
        },
        sidepane_bandhide: (state) => {
            state.banhide = true;
        },
        sidepane_panetogg: (state) => {
            state.hide = !state.hide;
        },
        sidepane_panehide: (state) => {
            state.hide = true;
        },
        sidepane_panethem: (state, action: PayloadAction<any>) => {
            // state.quicks[4].src = action.payload;
        },
        render_message: (state, action: PayloadAction<Message>) => {
            state.message = [action.payload, ...state.message];
            state.banhide = false;
        },
        push_notification: (state, action: PayloadAction<Notification>) => {
            state.notifications = [action.payload, ...state.notifications];
            state.banhide = false;
        },
        toggle_gamepad: (state) => {
            state.mobileControl.gamePadHide = !state.mobileControl.gamePadHide;
            state.mobileControl.keyboardHide = true;
        },
        toggle_gamepad_setting: (state) => {
            state.mobileControl.gamepadSetting.open =
                !state.mobileControl.gamepadSetting.open!;
        },
        change_btnGp_size: (state, action) => {
            state.mobileControl.gamepadSetting.btnSize = action.payload;
        },
        toggle_gamepad_draggable: (state, action) => {
            state.mobileControl.gamePadHide = false;
            const prev = state.mobileControl.gamepadSetting.draggable;
            if (prev == 'static') {
                state.mobileControl.gamepadSetting.draggable = 'draggable';
            } else if (prev == 'draggable') {
                state.mobileControl.gamepadSetting.draggable = 'static';
            }
        },
        toggle_default_gamepad_position: (state) => {
            state.mobileControl.gamepadSetting.isDefaultPos =
                !state.mobileControl.gamepadSetting.isDefaultPos;
        },
        toggle_keyboard: (state) => {
            let oldState = state.mobileControl.keyboardHide;
            state.mobileControl.keyboardHide = !oldState;
            state.hide = true;
            state.banhide = true;
            state.mobileControl.gamePadHide = true;
        }
    },
    extraReducers: (builder) => {
        BuilderHelper(builder, {
            fetch: sidepaneAsync.fetch_message,
            hander: (state, action: PayloadAction<Message[]>) => {
                state.message = [...state.message, ...action.payload];
            }
        });
    }
});
