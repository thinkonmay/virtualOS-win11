import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, appDispatch, render_message, store } from '.';
import { LOCAL } from '../../../src-tauri/api';
import { DevEnv } from '../../../src-tauri/api/database';
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
    draggable: boolean;
    isDefaultPos: boolean;
};
type DesktopControl = {
    buttons: any[];
    shortcuts: any[];
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

    desktopControl: DesktopControl;
    mobileControl: MobileControl;
    hide: boolean;
    banhide: boolean;
    statusConnection: boolean;
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
        name: 'Win D',
        val: ['lwin', 'd'],
        explain: [Contents.WIN_D_SHORTCUT]
    },
    {
        name: 'Ctrl C',
        val: ['control', 'c']
    },
    {
        name: 'Ctrl V',
        val: ['control', 'v']
    }
];
const listMobileSettings = [
    {
        ui: true,
        id: 'fullscrenBtn',
        src: 'MdFullscreen',
        name: [Contents.FULLSCREEN],
        state: 'fullscreen',
        action: 'remote/toggle_fullscreen'
    },
    {
        ui: true,
        id: 'virtKeyboardBtn',
        src: 'MdOutlineKeyboard',
        name: [Contents.OPEN_KEYBOARD],
        state: 'keyboardOpen',
        action: 'sidepane/toggle_keyboard'
    },
    {
        ui: true,
        id: 'virtGamepadBtn',
        src: 'MdOutlineSportsEsports',
        name: [Contents.OPEN_GAMEPAD],
        state: 'gamePadOpen',
        action: 'sidepane/toggle_gamepad_setting'
    },
    {
        ui: true,
        id: 'shareLinkBtn',
        src: 'MdOutlineLink',
        name: [Contents.EXTERNAL_TAB],
        state: 'network.airplane',
        action: 'showLinkShare',
        explain: [Contents.EXTERNAL_TAB_EXPlAIN]
    },
    {
        ui: true,
        id: 'shutdownBtn',

        src: 'MdOutlinePowerSettingsNew',
        name: [Contents.SHUT_DOWN],
        state: 'shutdown',
        action: 'shutDownVm',
        style: { backgroundColor: '#d92d20', color: '#f3f4f5' }
    },
    {
        ui: true,
        id: 'loggerBtn',
        src: 'MdTextSnippet',
        name: [Contents.DEBUGGER],
        state: 'copy_log',
        action: 'copy_log',
        explain: [Contents.DEBUGGER_EXPLAIN]
    },
    {
        ui: true,
        id: 'loggerBtn',
        src: 'MdHighQuality',
        name: [Contents.MAXIMUM_QUALITY],
        state: 'hq',
        action: 'toggle_hq',
        explain: [Contents.MAXIMUM_QUALITY_EXPLAIN]
    },
    {
        id: 'fixKeyboardBtnMobile',
        src: 'MdAutoFixHigh',
        name: [Contents.SCAN_CODE],
        state: 'scancode',
        action: 'remote/scancode_toggle',
        explain: [Contents.SCAN_CODE_EXPLAIN]
    }
];
const listDesktopShortCut = [
    {
        name: 'Win D',
        val: ['lwin', 'd'],
        explain: [Contents.WIN_D_SHORTCUT]
    }
];
const listDesktopSettings = [
    {
        ui: true,
        id: 'fullscrenBtn',
        src: 'MdFullscreen',
        name: [Contents.FULLSCREEN],
        state: 'fullscreen',
        action: 'remote/toggle_fullscreen'
    },
    {
        ui: true,
        id: 'fixKeyboardBtn',

        src: 'MdOutlineKeyboard',
        name: [Contents.SCAN_CODE],
        state: 'scancode',
        action: 'remote/scancode_toggle',
        explain: [Contents.SCAN_CODE_EXPLAIN]
    },
    {
        ui: true,
        id: 'shareLinkBtn',

        src: 'MdOutlineLink',
        name: [Contents.EXTERNAL_TAB],
        state: 'share_reference',
        action: 'showLinkShare',
        explain: [Contents.EXTERNAL_TAB_EXPlAIN]
    },
    {
        ui: true,
        id: 'gamingMouseBtn',

        src: 'FaMousePointer',
        name: [Contents.RELATIVE_MOUSE],
        state: 'relative_mouse',
        action: 'remote/relative_mouse',
        explain: [Contents.RELATIVE_MOUSE_EXPLAIN]
    },
    {
        ui: true,
        id: 'shutdownBtn',

        src: 'MdOutlinePowerSettingsNew',
        name: [Contents.SHUT_DOWN],
        state: 'shutdown',
        action: 'shutDownVm',
        style: { backgroundColor: '#d92d20', color: '#f3f4f5' }
    },
    {
        ui: true,
        id: 'loggerBtn',
        src: 'MdTextSnippet',
        name: [Contents.DEBUGGER],
        state: 'copy_log',
        action: 'copy_log',
        explain: [Contents.DEBUGGER_EXPLAIN]
    },
    {
        ui: true,
        id: 'loggerBtn',
        src: 'MdHighQuality',
        name: [Contents.MAXIMUM_QUALITY],
        state: 'hq',
        action: 'toggle_hq',
        explain: [Contents.MAXIMUM_QUALITY_EXPLAIN]
    },
    ...(!DevEnv
        ? []
        : [
              {
                  ui: true,
                  id: 'toggle_remote_async',
                  src: 'FiVideoOff',
                  name: [Contents.VIDEO_TOGGLE],
                  state: 'active',
                  action: 'toggle_remote_async'
              },
              {
                  ui: true,
                  id: 'reset',
                  src: 'MdResetTv',
                  name: [Contents.RESET_APP],
                  state: 'hard_reset_async',
                  action: 'hard_reset_async'
              }
          ])
];

const initialState: Data = {
    desktopControl: {
        buttons: listDesktopSettings,
        shortcuts: listDesktopShortCut
    },
    mobileControl: {
        hide: true,
        buttons: listMobileSettings,
        shortcuts: listMobileShortCut,
        setting: initialSetting,
        gamePadHide: true,
        keyboardHide: true,
        gamepadSetting: {
            btnSize: 1,
            draggable: false,
            open: false,
            isDefaultPos: false
        }
    },

    notifications: [],
    message: [],

    hide: true,
    banhide: true,
    statusConnection: false
};

export const sidepaneAsync = {
    push_message: createAsyncThunk(
        'push_message',
        async (input: Message, { getState }): Promise<void> => {
            const email = store.getState().user.email;
            await LOCAL()
                .from('user_message')
                .insert({
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
        async (_, { getState }): Promise<Message[]> => {
            const email = (getState() as RootState).user.email;
            LOCAL()
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
                const { data, error } = await LOCAL()
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
        sidepane_paneopen: (state) => {
            state.hide = false;
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
            state.hide = true;
            state.banhide = true;
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
            state.mobileControl.gamepadSetting.draggable =
                !state.mobileControl.gamepadSetting.draggable;
        },
        toggle_default_gamepad_position: (state) => {
            state.mobileControl.gamepadSetting.isDefaultPos =
                !state.mobileControl.gamepadSetting.isDefaultPos;
        },
        toggle_keyboard: (state) => {
            state.mobileControl.keyboardHide =
                !state.mobileControl.keyboardHide;
            state.hide = true;
            state.banhide = true;
        },
        toggle_status_connection: (state) => {
            state.statusConnection = !state.statusConnection;
        },
        hide_status_connection: (state) => {
            state.statusConnection = false;
        },
        open_status_connection: (state) => {
            state.statusConnection = true;
        },
        set_status_connection: (state, action) => {
            console.log(action.payload);
            state.statusConnection = action.payload;
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
