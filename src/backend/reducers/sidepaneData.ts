import { v4 as uuidv4 } from 'uuid';
import { DevEnv } from '../../../src-tauri/api/database';
import { Contents } from './locales';
import { Message } from './sidepane';

export type IGamePadSetting = {
    open: boolean;
    btnSize: 1 | 2 | 3;
    draggable: boolean;
    isDefaultPos: boolean;
    btnSizes: IGamePadBtnSize;
    currentSelected: ICurrentSelectedGamepadBtn | '';
};
export type DesktopControl = {
    buttons: any[];
    shortcuts: any[];
};
export type MobileControl = {
    hide: boolean;
    buttons: any[];
    shortcuts: any[];
    gamePadHide: boolean;
    keyboardHide: boolean;
    gamepadSetting: IGamePadSetting;
    gamingKeyBoard: IGamingKeyboard;
};
export type SidePaneData = {
    notifications: Notification[];
    message: Message[];

    desktopControl: DesktopControl;
    mobileControl: MobileControl;
    hide: boolean;
    banhide: boolean;
    statusConnection: boolean;
};

export type ICurrentSelectedGamepadBtn = keyof IGamePadBtnSize;
export interface IGamePadBtnSize {
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
export const btnGamepadSizes: IGamePadBtnSize = {
    leftJt: 1,
    dpad: 0.1,
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

export const listMobileShortCut = [
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
export const listMobileSettings = [
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
        id: 'objectfitBtn',
        src: 'MdAspectRatio',
        name: [Contents.SP_PULL_VIDEO],
        state: 'objectFit',
        explain: [Contents.SP_PULL_VIDEO_EXPLAIN],
        action: 'remote/toggle_objectfit'
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
    },
    {
        src: 'MdVideogameAsset',
        name: [Contents.HIDE_VM],
        state: 'HideVM',
        action: 'worker/toggle_hide_vm',
        explain: [Contents.HIDE_VM_EXPLAIN]
    }
];
export const listDesktopShortCut = [
    {
        name: 'Win D',
        val: ['lwin', 'd'],
        explain: [Contents.WIN_D_SHORTCUT]
    }
];

export const listDesktopSettings = [
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
        id: 'objectfitBtn',
        src: 'MdAspectRatio',
        name: [Contents.SP_PULL_VIDEO],
        state: 'objectFit',
        explain: [Contents.SP_PULL_VIDEO_EXPLAIN],
        action: 'remote/toggle_objectfit'
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

export interface IGamingKey {
    position: {
        x: number;
        y: number;
    };
    size: number;
    value: string;
    name: string;
    type: 'mouse' | 'key' | 'joystick';
    id: string;
}
interface IGamingKeyboard {
    open: boolean;
    data: Array<IGamingKey>;
    editState: 'draggable' | 'addingKey' | 'idle';
    currentSelected?: IGamingKey;
}

export const initialGamingKeyboard: IGamingKeyboard = {
    open: false,
    editState: 'idle',
    data: [
        {
            value: 'a',
            name: 'A',
            position: {
                x: 0.095,
                y: 0.6
            },
            type: 'key',
            size: 1,
            id: uuidv4()
        },
        {
            value: 'd',
            name: 'D',
            position: {
                x: 0.205,
                y: 0.6
            },
            type: 'key',
            size: 1,
            id: uuidv4()
        },
        {
            value: 'w',
            name: 'W',
            position: {
                x: 0.15,
                y: 0.485
            },
            type: 'key',
            size: 1,
            id: uuidv4()
        },
        {
            value: 's',
            name: 'S',
            position: {
                x: 0.15,
                y: 0.715
            },
            type: 'key',
            size: 1,
            id: uuidv4()
        },
        {
            value: 'j',
            name: 'J',
            position: {
                x: 0.8,
                y: 0.8
            },
            type: 'key',
            size: 1,
            id: uuidv4()
        },
        {
            value: 'k',
            name: 'K',
            position: {
                x: 0.835,
                y: 0.66
            },
            type: 'key',
            size: 1,
            id: uuidv4()
        },
        {
            value: 'l',
            id: uuidv4(),

            name: 'L',
            position: {
                x: 0.91,
                y: 0.56
            },
            type: 'key',
            size: 1
        },
        {
            value: 'x',
            id: uuidv4(),

            name: 'X',
            position: {
                x: 0.54,
                y: 0.8
            },
            type: 'key',
            size: 1
        },
        {
            value: 'c',
            id: uuidv4(),

            name: 'C',
            position: {
                x: 0.62,
                y: 0.8
            },
            type: 'key',
            size: 1
        },
        {
            value: 'b',
            id: uuidv4(),

            name: 'B',
            position: {
                x: 0.7,
                y: 0.8
            },
            type: 'key',
            size: 1
        },
        {
            value: 'Control',
            id: uuidv4(),

            name: 'Control',
            position: {
                x: 0.8,
                y: 0.2
            },
            type: 'key',
            size: 1
        },

        {
            value: 'shift',
            id: uuidv4(),

            name: 'Shift',
            position: {
                x: 0.73,
                y: 0.2
            },
            type: 'key',
            size: 1
        },

        //{
        //	value: 'jt',
        //id: uuidv4(),
        //	name: 'JOYSTICK',
        //	position: {
        //		x: 0.15,
        //		y: 0.7
        //	},
        //	type: 'joystick',
        //	size: 1
        //},
        {
            value: '2',
            id: uuidv4(),

            name: 'PiMouseRightClickFill',
            position: {
                x: 0.91,
                y: 0.4
            },
            type: 'mouse',
            size: 1
        },
        {
            value: '0',
            id: uuidv4(),

            name: 'PiMouseLeftClickFill',
            position: {
                x: 0.91,
                y: 0.75
            },
            type: 'mouse',
            size: 1.2
        }
    ]
};
