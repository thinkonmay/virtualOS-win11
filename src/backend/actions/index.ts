import {
    APIError,
    Computer,
    GetInfo,
    POCKETBASE
} from '../../../src-tauri/api';
import { GLOBAL } from '../../../src-tauri/api/database';
import { keyboard } from '../../../src-tauri/singleton';
import '../reducers/index';
import {
    app_close,
    app_toggle,
    appDispatch,
    close_remote,
    desk_hide,
    desk_show,
    desk_size,
    desk_sort,
    dispatch_generic,
    fetch_wallet,
    menu_chng,
    menu_hide,
    popup_close,
    popup_open,
    setting_theme,
    sidepane_panethem,
    store,
    unclaim_volume,
    worker_refresh
} from '../reducers/index';
import { Contents } from '../reducers/locales';
import { originalurl, preload } from './background';

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
        ['MENU', 'menu/menu_hide', 'menus.hide'],
        ['QA', 'listQa/hideQa', 'listQa.hide']
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
export const login = (
    provider: 'google' | 'facebook' | 'discord',
    update_ui?: boolean,
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
        .then(() => {
            preload(update_ui);
            const isNewUser =
                (new Date().getTime() -
                    new Date(POCKETBASE().authStore.model.created).getTime()) /
                    60000 <
                5; //
            POCKETBASE()
                .collection('users')
                .update(POCKETBASE().authStore.model.id, {
                    metadata: {
                        reference: isNewUser
                            ? originalurl.searchParams.get('ref')
                            : POCKETBASE().authStore.model.metadata.reference
                    }
                });
        })
        .finally(() => finish_callback());
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
    await appDispatch(unclaim_volume());
    appDispatch(close_remote());
};
export const clickShortCut = (keys = []) => {
    for (const k of keys) keyboard({ val: k, isDown: true });
    for (let index = 0; index < keys.length; index++)
        keyboard({ val: keys[keys.length - 1 - index] });
};

export const showLinkShare = () =>
    appDispatch(
        popup_open({
            type: 'shareLink',
            data: {
                link: store.getState().remote.ref
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

export const create_payment_qr = async ({ amount }: { amount: string }) => {
    const { email, discounts } = store.getState().user;
    const discount_code = discounts.find((x) =>
        x.apply_for?.includes('deposit')
    )?.code;
    const { data, error } = await GLOBAL().rpc('create_pocket_deposit_v3', {
        email,
        amount: +amount,
        provider: 'PAYOS',
        currency: 'VND',
        discount_code
    });

    if (error)
        throw new Error('Error when create payment link' + error.message);
    else if (data.length == 0)
        throw new Error('Unable to create payment: transaction not found');
    else {
        const [
            {
                id,
                qrcode,
                payment_url,
                data: { data: subdata }
            }
        ] = data as any[];
        const actual_amount = Number.parseInt(subdata?.amount);
        const prediscount = +amount;
        appDispatch(
            popup_open({
                type: 'paymentQR',
                data: {
                    id,
                    code: qrcode,
                    url: payment_url,
                    accountName: subdata?.accountName,
                    amount: actual_amount,
                    description:
                        subdata?.description?.split(' ')[1] ??
                        subdata?.description,
                    discount_percent:
                        actual_amount != prediscount
                            ? Math.round(
                                  (prediscount / actual_amount - 1) * 100
                              )
                            : undefined
                }
            })
        );
    }
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
    else if (data == 'PAID') {
        await GLOBAL().rpc('verify_all_deposits');
        await appDispatch(fetch_wallet());
        return true;
    } else return false;
};

export const create_payment_pocket = async ({
    plan_name,
    cluster_domain = 'unknown',
    synchronous
}: {
    plan_name: string;
    cluster_domain?: string;
    synchronous?: boolean;
}) => {
    appDispatch(
        popup_open({
            type: 'notify',
            data: { loading: true }
        })
    );

    const email = store.getState().user.email;
    const { error } = await GLOBAL().rpc('create_or_replace_payment', {
        email,
        plan_name,
        cluster_domain
    });

    if (error) {
        appDispatch(popup_close(true));
        appDispatch(
            popup_open({
                type: 'complete',
                data: {
                    success: false,
                    content: error.message
                }
            })
        );
    } else {
        await GLOBAL().rpc('verify_all_payment');
        if (!synchronous) return await preload(false);

        appDispatch(app_close('payment'));
        if (store.getState().worker.currentAddress != cluster_domain) {
            await new Promise((r) => setTimeout(r, 90 * 1000));
            appDispatch(
                popup_open({
                    type: 'redirectDomain',
                    data: {
                        domain: cluster_domain
                    }
                })
            );
        } else {
            let info: Computer | undefined = undefined;
            while (!(info?.virtReady ?? false)) {
                await new Promise((r) => setTimeout(r, 20000));
                const result = await GetInfo(cluster_domain);
                if (result instanceof APIError) throw result;
                else info = result;
            }

            await preload();
        }
    }
};
