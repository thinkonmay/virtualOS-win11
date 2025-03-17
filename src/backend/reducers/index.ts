import { ThunkMiddleware, configureStore } from '@reduxjs/toolkit';
import * as actions from '.';
import * as Actions from '../actions/index.js';
import { appSlice } from './apps';
import { deskSlice } from './desktop';
import { globalAsync, globalSlice } from './globals';
import { menusSlice } from './menu';
import { modalSlice as popupSlice } from './modal';
import { remoteAsync, remoteSlice } from './remote.js';
import { settSlice } from './settings.js';
import { sidepaneSlice } from './sidepane';
import { menuSlice } from './startmenu';
import { taskSlice } from './taskbar';
import { userAsync, userSlice } from './user';
import { wallSlice } from './wallpaper';
import { workerAsync, workerSlice } from './worker';

import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { UserEvents } from '../../../src-tauri/api';
import { DevEnv } from '../../../src-tauri/api/database';
import { qaSlices } from './listQa';

const blacklist = ['framerate', 'bitrate', 'metrics'];
const middleware: ThunkMiddleware = () => (next) => async (action) => {
    if (DevEnv) console.log({ ...(action as any) });
    else if (
        blacklist.filter((x) => (action as any).type.includes(x)).length == 0
    )
        UserEvents(action as any);

    return await next(action);
};

export const store = configureStore({
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    reducer: {
        user: userSlice.reducer,
        wallpaper: wallSlice.reducer,
        taskbar: taskSlice.reducer,
        desktop: deskSlice.reducer,
        startmenu: menuSlice.reducer,
        apps: appSlice.reducer,
        menus: menusSlice.reducer,
        globals: globalSlice.reducer,
        setting: settSlice.reducer,
        worker: workerSlice.reducer,
        popup: popupSlice.reducer,
        remote: remoteSlice.reducer,
        sidepane: sidepaneSlice.reducer,
        listQa: qaSlices.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export const appDispatch = store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const { update_language, show_tutorial, open_game } =
    globalSlice.actions;
export const { user_delete, user_update } = userSlice.actions;
export const { task_audo, task_hide, task_show, task_toggle } =
    taskSlice.actions;
export const {
    desk_add,
    desk_hide,
    desk_show,
    desk_remove,
    desk_size,
    desk_sort
} = deskSlice.actions;
export const {
    startall,
    startalpha,
    starthid,
    startogg,
    startpwc,
    startshw,
    startsrc
} = menuSlice.actions;
export const {
    app_toggle,
    app_full,
    app_add,
    app_close,
    app_external,
    app_showdesk,
    app_maximize,
    app_metadata_change,
    app_minimize
} = appSlice.actions;
export const { menu_chng, menu_hide, menu_show } = menusSlice.actions;
export const { setting_load, setting_setv, setting_theme, setting_togg } =
    settSlice.actions;
export const { toggle_hide_vm, set_current_address } = workerSlice.actions;
export const { popup_close, popup_open } = popupSlice.actions;
export const {
    sidepane_bandhide,
    sidepane_bandtogg,
    sidepane_panetogg,
    sidepane_panehide,
    sidepane_paneopen,
    sidepane_panethem,
    render_message,
    push_notification,
    toggle_gamepad,
    toggle_keyboard,
    toggle_gamepad_setting,
    set_gamepad_button_size,
    toggle_gamepad_draggable,
    toggle_default_gamepad_position,
    toggle_status_connection,
    hide_status_connection,
    open_status_connection,
    set_status_connection,
    decrease_btn_gamepad,
    increase_btn_gamepad,
    select_btn_gamepad,
    add_key_gamingKeyboard,
    delete_key_gamingKeyboard,
    move_key_gamingKeyboard,
    select_key_gamingKeyboard,
    set_keyboard_edit_state,
    toggle_gaming_keyboard,
    hide_gaming_keyboard,
    open_gaming_keyboard,
    set_gamingKeyboard_data,
    set_default_gamingKeyboard,
    save_gamingKeyboard_to_local,
    decrease_key_gamingKeyboard,
    increase_key_gamingKeyboard
} = sidepaneSlice.actions;

export const {
    remote_connect,
    remote_ready,
    toggle_remote,
    loose_focus,
    have_focus,
    scancode,
    scancode_toggle,
    strict_timing,
    close_remote,
    change_bitrate,
    change_framerate,
    toggle_fullscreen,
    set_fullscreen,
    pointer_lock,
    toggle_hq,
    relative_mouse,
    toggle_objectfit
} = remoteSlice.actions;

export const { showQa, hideQa, toggleQa } = qaSlices.actions;

export const {
    worker_refresh,
    worker_refresh_ui,
    wait_and_claim_volume,
    unclaim_volume
} = workerAsync;
export const {
    fetch_user,
    fetch_wallet,
    fetch_payment_history,
    fetch_subscription,
    fetch_subscription_metadata,
    get_plans,
    change_template,
    get_payment_pocket,
    cancel_payment_pocket,
    get_deposit_status
} = userAsync;
export const {
    check_worker,
    sync,
    direct_access,
    save_reference,
    load_setting,
    cache_setting,
    toggle_remote_async,
    hard_reset_async
} = remoteAsync;

export const { fetch_store, fetch_domain } = globalAsync;

export const dispatch_generic = async ({
    type,
    payload
}: {
    type: string;
    payload: any;
}) => {
    if (Object.keys(Actions).includes(type))
        (Actions as Record<string, any>)[type](payload);
    else if (Object.keys(actions).includes(type))
        store.dispatch((actions as Record<string, any>)[type](payload));
    else store.dispatch({ type, payload });
};
