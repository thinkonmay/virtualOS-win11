import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { localStorageKey } from '../utils/constant';
import {
    IGamingKey,
    SidePaneData,
    btnGamepadSizes,
    initialGamingKeyboard,
    listDesktopSettings,
    listDesktopShortCut,
    listMobileSettings,
    listMobileShortCut
} from './sidepaneData';

type Notification = {
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

const initialState: SidePaneData = {
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
        },
        gamingKeyBoard: initialGamingKeyboard
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
            //@ts-expect-error
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

        toggle_gaming_keyboard: (state) => {
            state.mobileControl.gamingKeyBoard.open =
                !state.mobileControl.gamingKeyBoard.open;
            state.hide = true;
            state.banhide = true;
        },

        set_keyboard_edit_state: (state, action) => {
            state.mobileControl.gamingKeyBoard.editState = action.payload;
        },

        select_key_gamingKeyboard: (state, action) => {
            const id = action.payload;
            const currentData = state.mobileControl.gamingKeyBoard.data;
            const keyFound = currentData.find((key) => key.id == id);

            state.mobileControl.gamingKeyBoard.currentSelected = keyFound;
        },
        move_key_gamingKeyboard: (
            state,
            action: PayloadAction<Partial<IGamingKey>>
        ) => {
            const { position, id } = action.payload;
            const currentData = state.mobileControl.gamingKeyBoard.data;
            state.mobileControl.gamingKeyBoard.data = currentData.map((key) => {
                if (key.id == id) {
                    return {
                        ...key,
                        position
                    };
                } else {
                    return key;
                }
            });
        },

        add_key_gamingKeyboard: (state, action) => {
            const {
                name,
                value,
                position,
                size = '1',
                type = 'key'
            } = action.payload;

            const currentState = state.mobileControl.gamingKeyBoard.data;
            currentState.push({
                value,
                name,
                position,
                size,
                id: uuidv4(),
                type
            });
            state.mobileControl.gamingKeyBoard.data = currentState;
        },

        delete_key_gamingKeyboard: (state, action) => {
            const currentState = state.mobileControl.gamingKeyBoard;
            const currentSelected = currentState.currentSelected;
            if (currentSelected) {
                state.mobileControl.gamingKeyBoard.data =
                    currentState.data.filter(
                        (key) => key.id != currentSelected.id
                    );
                state.mobileControl.gamingKeyBoard.currentSelected = null;
            }
        },

        save_gamingKeyboard_to_local: (state, action) => {
            localStorage.setItem(
                localStorageKey.gamingKeyboardData,
                JSON.stringify(state.mobileControl.gamingKeyBoard.data)
            );
        },
        set_gamingKeyboard_data: (state, action) => {
            const parsePayload = JSON.parse(action.payload);
            state.mobileControl.gamingKeyBoard.data = parsePayload;
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
