import 'sweetalert2/src/sweetalert2.scss';
import { getDomainURL, POCKETBASE } from '../../../src-tauri/api';
import '../reducers/index';
import {
    appDispatch,
    close_remote,
    desk_hide,
    desk_show,
    desk_size,
    desk_sort,
    dispatch_generic,
    fetch_user,
    menu_chng,
    menu_hide,
    personal_worker_session_close,
    setting_theme,
    sidepane_panethem,
    store,
    user_update,
    wall_set
} from '../reducers/index';
import { keyboardCallback } from '../reducers/remote';
import { fetchApp } from './background';

export const refresh = async () => {
    appDispatch(desk_hide());
    await fetchApp();
    setTimeout(() => appDispatch(desk_show()), 200);
};

export const afterMath = (event: any) => {
    var ess = [
        ['START', 'startmenu/starthid', 'startmenu.hide'], // TODO
        ['BAND', 'sidepane/sidepane_bandhide', 'sidepane.banhide'],
        ['PANE', 'sidepane/sidepane_panehide', 'sidepane.hide'],
        ['MENU', 'menu/menu_hide', 'menus.hide']
    ];

    var actionType = '';
    try {
        actionType = event.target.dataset.action || '';
    } catch (err) {}

    var actionType0 = getComputedStyle(event.target).getPropertyValue(
        '--prefix'
    );

    const data = store.getState();
    ess.forEach((item) => {
        if (
            !actionType.startsWith(item[0]) &&
            !actionType0.startsWith(item[0]) &&
            !getTreeValue(data, item[2])
        )
            appDispatch({ type: item[1], payload: {} });
    });
};
export const changeIconSize = (size: string, menu: any) => {
    var tmpMenu = { ...menu };
    tmpMenu.menus.desk[0].opts[0].dot = false;
    tmpMenu.menus.desk[0].opts[1].dot = false;
    tmpMenu.menus.desk[0].opts[2].dot = false;
    var isize = 1;

    if (size == 'large') {
        tmpMenu.menus.desk[0].opts[0].dot = true;
        isize = 1.5;
    } else if (size == 'medium') {
        tmpMenu.menus.desk[0].opts[1].dot = true;
        isize = 1.2;
    } else {
        tmpMenu.menus.desk[0].opts[2].dot = true;
    }

    // refresh("", tmpMenu);
    appDispatch(desk_size(isize));
    appDispatch(menu_chng({}));
};

export const changeSort = (sort: string, menu: any) => {
    var tmpMenu = { ...menu };
    tmpMenu.menus.desk[1].opts[0].dot = false;
    tmpMenu.menus.desk[1].opts[1].dot = false;
    tmpMenu.menus.desk[1].opts[2].dot = false;
    if (sort == 'name') {
        tmpMenu.menus.desk[1].opts[0].dot = true;
    } else if (sort == 'size') {
        tmpMenu.menus.desk[1].opts[1].dot = true;
    } else {
        tmpMenu.menus.desk[1].opts[2].dot = true;
    }

    appDispatch(desk_sort(sort));
    appDispatch(menu_chng(tmpMenu));
};

export const changeTaskAlign = (align: string, menu: any) => {
    var tmpMenu = { ...menu };
    if (tmpMenu.menus.task[0].opts[align == 'left' ? 0 : 1].dot) return;

    tmpMenu.menus.task[0].opts[0].dot = false;
    tmpMenu.menus.task[0].opts[1].dot = false;

    if (align == 'left') {
        tmpMenu.menus.task[0].opts[0].dot = true;
    } else {
        tmpMenu.menus.task[0].opts[1].dot = true;
    }

    appDispatch({ type: 'TASKTOG', payload: {} });
    appDispatch({ type: 'MENUCHNG', payload: tmpMenu });
};

export const getTreeValue = (obj: any, path: any) => {
    if (path == null) return false;

    var tdir = { ...obj };
    path = path.split('.');
    for (var i = 0; i < path.length; i++) {
        tdir = tdir[path[i]];
    }

    return tdir;
};

export const changeTheme = () => {
    var thm = store.getState().setting.person.theme,
        thm = thm == 'light' ? 'dark' : 'light';
    var icon = thm == 'light' ? 'sun' : 'moon';
    localStorage.setItem('theme', thm);
    document.body.dataset.theme = thm;
    appDispatch(setting_theme(thm));
    appDispatch(sidepane_panethem(icon));
    appDispatch(wall_set(thm == 'light' ? 0 : 1));
};

export const menuDispatch = async (event: Event) => {
    const dataset = (event.target as any)?.dataset as {
        action: string;
        payload: any;
    };
    if (dataset.action == undefined) return;

    appDispatch(menu_hide());

    dispatch_generic({
        type: dataset.action,
        payload: store.getState().menus.dataset?.payload
    });
};

export const dispatchOutSide = (action: string, payload: any) => {
    appDispatch({ type: action, payload });
};

export const loginWithEmail = async (email: string, password: string) => {};

export const signUpWithEmail = async (email: string, password: string) => {};
export const login = async (provider: 'google' | 'facebook' | 'discord') => {
    let w = window.open();
    await POCKETBASE.collection('users').authWithOAuth2({
        provider: 'google',
        urlCallback: (url) => {
            w.location.href = url;
        }
    });
    await appDispatch(fetch_user());
};

export const shutDownVm = async () => {
    await appDispatch(personal_worker_session_close());
    appDispatch(close_remote());
};
export const clickShortCut = (keys = []) => {
    keys.forEach((k, i) => {
        keyboardCallback(k, 'down');
    });
    keys.forEach((k, i) => {
        keyboardCallback(k, 'up');
    });
};

export const bindStoreId = async (email: string, store_id: number) => {
    try {
        const data = await fetch(`${getDomainURL()}/access_store_volume`, {
            method: 'POST',
            headers: {
                Authorization: POCKETBASE.authStore.token
            },
            body: JSON.stringify({
                store_id,
                email
            })
        });
        if (data.ok === false) throw await data.text();

        return data;
    } catch (error) {
        throw error;
    }
};
