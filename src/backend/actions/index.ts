import { APIError, GetInfo, POCKETBASE } from '#/api';
import { GLOBAL } from '#/api';
import { keyboard } from '#/singleton';
import toast from 'react-hot-toast';
import '../reducers/index';
import {
    app_full,
    appDispatch,
    backup_game,
    close_remote,
    desk_hide,
    desk_show,
    desk_size,
    desk_sort,
    dispatch_generic,
    fetch_app_access,
    fetch_configuration,
    fetch_wallet,
    menu_chng,
    menu_hide,
    popup_close,
    popup_open,
    RootState,
    store,
    unclaim_volume,
    worker_refresh
} from '../reducers/index';
import { Contents } from '../reducers/locales';
import { formatError } from '../utils/formatErr';
import { originalurl, preload, preloadSilent } from './background';

export const refresh = async () => {
    appDispatch(desk_hide());
    await appDispatch(worker_refresh());
    appDispatch(desk_show());
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

export const loginWithEmail = (email: string, password: string) => {
    return POCKETBASE().collection('users').authWithPassword(email, password);
};

const tagref = async () => {
    const isNewUser =
        (new Date().getTime() -
            new Date(POCKETBASE().authStore.model.created).getTime()) /
            60000 <
        5; //
    if (!isNewUser) return;
    await POCKETBASE()
        .collection('users')
        .update(POCKETBASE().authStore.model.id, {
            metadata: { reference: originalurl.searchParams.get('ref') }
        });
};

export const signUpWithEmail = async (
    email: string,
    password: string,
    passwordConfirm: string
) => {
    if (!email.includes('@gmail.com'))
        throw new Error('email must have @gmail.com');

    return POCKETBASE()
        .collection('users')
        .create({
            email,
            password,
            passwordConfirm,
            metadata: {
                reference: originalurl.searchParams.get('ref')
            }
        });
};

export const loginAction = (
    provider: 'google' | 'facebook' | 'discord',
    finish_callback?: () => {}
) => {
    window.oncontextmenu = (ev) => ev.preventDefault();

    const w = window.open();
    POCKETBASE()
        .collection('users')
        .authWithOAuth2({
            provider: provider,
            urlCallback: (url) => {
                w.location.href = url;
            }
        })
        .then(tagref)
        .finally(async () => {
            await preload();
            finish_callback();
        });
};
export const remotelogin = async (domain: string, email: string) => {
    const { data, error } = await GLOBAL().rpc('generate_account', {
        email,
        domain
    });
    if (error) throw new Error('Failed to generate account');
    if (data == null) return 'Existed Account';
};

export const shutDownVm = async () => {
    const {
        worker: { currentAddress, data }
    } = store.getState();
    const session = data[currentAddress]?.Sessions?.find(
        (x) => x.vm != undefined
    )?.vm?.Sessions?.find((x) => x.backup != undefined);
    if (session != undefined) await appDispatch(backup_game());

    await appDispatch(unclaim_volume());
    appDispatch(close_remote());
};
export const clickShortCut = (keys = []) => {
    const sends = [];
    for (const k of keys) sends.push({ val: k, isDown: true });
    keys.reverse();
    for (const k of keys) sends.push({ val: k, isDown: false });
    keyboard(...sends);
};

export const showLinkShare = () =>
    appDispatch(
        popup_open({
            type: 'share',
            data: {
                discount_code:
                    store.getState().user.email?.split('@')?.[0] ?? 'share',
                ref: store.getState().remote.ref
            }
        })
    );

export const showConnect = () => {
    appDispatch(popup_close());
    appDispatch(
        popup_open({
            type: 'notify',
            data: {
                loading: false,
                tips: false,
                title: 'Connecting video & audio',
                text: store.getState().globals.translation[
                    Contents.CA_CONNECT_NOTIFY
                ]
            }
        })
    );
};

export const cancel_transaction = async ({ id }: { id: number }) => {
    const { error } = await GLOBAL().rpc('cancel_transaction', {
        id
    });

    if (error)
        throw new Error('Error when cancellled transaction:' + error.message);
};

export const verify_transaction = async ({ id }: { id: number }) => {
    const { data, error } = await GLOBAL().rpc('get_transaction_status', {
        id
    });
    if (error)
        throw new Error(
            'Error when try to verify transaction:' + error.message
        );
    else return data == 'PAID';
};

export const create_payment_pocket = async (args: {
    email: string;
    plan_name: string;
    cluster_domain: string;
    template?: string;
}) => {
    appDispatch(
        popup_open({
            type: 'notify',
            data: {
                loading: true
            }
        })
    );

    const allowed_games = ['fc_online', 'win11', 'wukong', 'gta5vn', 'inzoi'];
    args.template = allowed_games.includes(args?.template)
        ? args.template
        : undefined;
    const { error } = await GLOBAL().rpc('create_or_replace_payment', args);
    if (error) {
        appDispatch(popup_close());
        toast(`Failed ${error.message}`);
        return;
    }

    await GLOBAL().rpc('verify_all_payment_v2');

    let info = undefined;
    while (!(info?.virtReady ?? false)) {
        await new Promise((r) => setTimeout(r, 20000));
        const result = await GetInfo();
        if (result instanceof APIError) throw formatError(error);
        else info = result;
    }

    await preloadSilent();
    appDispatch(popup_close());
};

export const replace_payment_pocket = async ({
    email,
    plan_name
}: {
    email: string;
    plan_name: string;
}) => {
    appDispatch(
        popup_open({
            type: 'notify',
            data: { loading: true }
        })
    );

    const { error } = await GLOBAL().rpc('create_or_replace_payment', {
        email,
        plan_name,
        cluster_domain: 'unknown'
    });

    if (error) {
        appDispatch(popup_close());
        toast(`Failed ${error.message}`);
        return;
    }

    await GLOBAL().rpc('verify_all_payment_v2');
    await preloadSilent();
    appDispatch(popup_close());
};

export const create_or_replace_resources = async (resource_name: string) => {
    appDispatch(
        popup_open({
            type: 'notify',
            data: { loading: true }
        })
    );
    const email = store.getState().user.email;
    const { error } = await GLOBAL().rpc('create_or_replace_resource_payment', {
        email,
        resource_name
    });

    Promise.all([
        appDispatch(fetch_app_access()),
        appDispatch(fetch_configuration()),
        appDispatch(fetch_wallet())
    ]);
    if (resource_name == 'steam15') {
        await preload();
        await Promise.all([
            appDispatch(popup_close()),
            appDispatch(
                app_full({
                    id: 'store',
                    page: 'store',
                    value: {
                        app: 'steam15'
                    }
                })
            )
        ]);
    }
    appDispatch(popup_close());
    if (error) return new Error(error.message);
    return undefined;
};

export const openVNC = () => {
    const vnc = (store.getState() as RootState).remote.auth?.vncUrl;
    appDispatch(popup_open({ type: 'vnc', data: { vnc } }));
};
