import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DevEnv } from '../../../src-tauri/api/database';
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
    btnSizes: IGamePadBtnSize;
    currentSelected: ICurrentSelectedGamepadBtn | '';
};
type DesktopControl = {
    buttons: any[];
    shortcuts: any[];
};
type MobileControl = {
    hide: boolean;
    buttons: any[];
    shortcuts: any[];
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

type ICurrentSelectedGamepadBtn = keyof IGamePadBtnSize;
interface IGamePadBtnSize {
    leftJt: number;
    dpad: number;
    ls: number;
    lt: number;
    lb: number;

    rightJt: number;
    rs: number;
    btnY: number;
    btnA: number;
    btnX: number;
    btnB: number;
    rt: number;
    rb: number;
}
const btnGamepadSizes: IGamePadBtnSize = {
    leftJt: 1,
    dpad: 0.7,
    ls: 1,
    lt: 1,
    lb: 1,

    rightJt: 1,
    rs: 1,
    btnY: 1,
    btnA: 1,
    btnX: 1,
    btnB: 1,
    rt: 1,
    rb: 1
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
        src: 'FaSteam',
        name: [Contents.STEAM_LOGIN],
        state: 'steam',
        action: 'app_session_toggle',
        explain: [Contents.STEAM_LOGIN_EXPlAIN]
    },
    {
        src: 'MdCloudUpload',
        name: [Contents.MOUNT_STORAGE],
        state: 'storage',
        action: 'storage_session_toggle',
        explain: [Contents.MOUNT_STORAGE_EXPlAIN]
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
    },
    {
        src: 'MdVideogameAsset',
        name: [Contents.HIDE_VM],
        state: 'HideVM',
        action: 'worker/toggle_hide_vm',
        explain: [Contents.HIDE_VM_EXPLAIN]
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
        src: 'FaSteam',
        name: [Contents.STEAM_LOGIN],
        state: 'steam',
        action: 'app_session_toggle',
        explain: [Contents.STEAM_LOGIN_EXPlAIN]
    },
    {
        src: 'MdCloudUpload',
        name: [Contents.MOUNT_STORAGE],
        state: 'storage',
        action: 'storage_session_toggle',
        explain: [Contents.MOUNT_STORAGE_EXPlAIN]
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
    {
        src: 'MdVideogameAsset',
        name: [Contents.HIDE_VM],
        state: 'HideVM',
        action: 'worker/toggle_hide_vm',
        explain: [Contents.HIDE_VM_EXPLAIN]
    },
    ...(!DevEnv
        ? []
        : [
              //   {
              //       ui: true,
              //       id: 'toggle_remote_async',
              //       src: 'FiVideoOff',
              //       name: [Contents.VIDEO_TOGGLE],
              //       state: 'active',
              //       action: 'toggle_remote_async'
              //   },
              //   {
              //       ui: true,
              //       id: 'reset',
              //       src: 'MdResetTv',
              //       name: [Contents.RESET_APP],
              //       state: 'hard_reset_async',
              //       action: 'hard_reset_async'
              //   }
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
        gamePadHide: true,
        keyboardHide: true,
        gamepadSetting: {
            btnSize: 1,
            draggable: false,
            open: false,
            isDefaultPos: false,
            btnSizes: btnGamepadSizes,
            currentSelected: ''
        }
    },

    notifications: [],
    message: [],

    hide: true,
    banhide: true,
    statusConnection: false
};

export const sidepaneAsync = {};

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
        set_gamepad_button_size: (state, action) => {
            const parsePayload = JSON.parse(action.payload);
            state.mobileControl.gamepadSetting.btnSizes = parsePayload;
        },
        select_btn_gamepad: (state, action) => {
            state.mobileControl.gamepadSetting.currentSelected = action.payload;
        },
        increase_btn_gamepad: (state, action) => {
            const key = action.payload;
            const current = state.mobileControl.gamepadSetting.btnSizes[key];
            if (current >= 1.9) {
                state.mobileControl.gamepadSetting.btnSizes[key] = 2;
            } else {
                state.mobileControl.gamepadSetting.btnSizes[key] =
                    current + 0.1;
            }
        },
        decrease_btn_gamepad: (state, action) => {
            const key = action.payload;
            const current = state.mobileControl.gamepadSetting.btnSizes[key];
            if (current <= 0.1) {
                state.mobileControl.gamepadSetting.btnSizes[key] = 0.1;
            } else {
                state.mobileControl.gamepadSetting.btnSizes[key] =
                    current - 0.1;
            }
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
    }
});
