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

import { DevEnv } from '#/api/database';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

const blacklist = ['remote/metrics', 'popup/popup_open', 'popup/popup_close'];
const middleware: ThunkMiddleware = () => (next) => async (a) => {
    const { type } = a as { type: string };
    if (DevEnv && !blacklist.includes(type)) logAction(a);
    if (!blacklist.includes(type)) logRybbit(a);
    return await next(a);
};

const logAction = async (a: any) => {
    const { type, payload, error } = a as {
        type: string;
        payload: any;
        error: { message: string };
    };
    const t = type.split('/').reverse();
    if (!['rejected', 'fulfilled', 'pending'].includes(t[0]))
        console.log(type.replaceAll('/', ' '));
    else if (t[0] == 'rejected') console.log(t.join(' '), error.message);
    else if (t[0] == 'fulfilled' && payload != undefined)
        console.log(t.join(' '), payload);
    else console.log(t.join(' '));
};

const logRybbit = async (a: any) => {
    const { type, error } = a as {
        type: string;
        error: { message: string };
    };
    const t = type.split('/').reverse();
    if (!['rejected', 'fulfilled', 'pending'].includes(t[0]))
        window.rybbit.event(t[0]);
    else if (t[0] == 'rejected')
        window.rybbit.event(t[1], { error: error.message });
    else window.rybbit.event(t[1], { result: t[0] });
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
        sidepane: sidepaneSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export const appDispatch = store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const { update_language, show_tutorial, show_chat, open_game } =
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
    app_payload,
    app_remove,
    app_minimize
} = appSlice.actions;
export const { menu_chng, menu_hide, menu_show } = menusSlice.actions;
export const { setting_load, setting_setv, setting_theme, setting_togg } =
    settSlice.actions;
export const {
    toggle_hide_vm,
    toggle_high_mtu,
    toggle_high_queue,
    set_current_address
} = workerSlice.actions;
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
    set_gamepad_button_size,
    toggle_gamepad_draggable,
    toggle_default_gamepad_position,
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
    change_preferred_codec,
    change_preferred_proto,
    toggle_microphone,
    toggle_fullscreen,
    set_fullscreen,
    pointer_lock,
    toggle_hq,
    relative_mouse,
    toggle_objectfit
} = remoteSlice.actions;

export const {
    worker_refresh,
    worker_refresh_ui,
    fetch_configuration,
    fetch_app_access,
    fetch_buckets,
    change_app_access,
    wait_and_claim_volume,
    claim_steam,
    claim_storage,
    restore_game,
    backup_game,
    unclaim_steam,
    unclaim_storage,
    unclaim_volume
} = workerAsync;
export const {
    fetch_user,
    fetch_wallet,
    fetch_active_discounts,
    fetch_subscription,
    update_subscription_metadata,
    get_plans,
    get_resources,
    change_template
} = userAsync;
export const {
    check_worker,
    sync,
    direct_access,
    save_reference,
    load_setting,
    cache_setting,
    toggle_remote_async
} = remoteAsync;

export const {
    fetch_store,
    fetch_domain,
    update_game_tag,
    fetch_error_message,
    fetch_banner
} = globalAsync;

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
