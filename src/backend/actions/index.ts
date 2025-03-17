import 'sweetalert2/src/sweetalert2.scss';
import { POCKETBASE } from '../../../src-tauri/api';
import { GLOBAL } from '../../../src-tauri/api/database';
import { keyboard } from '../../../src-tauri/singleton';
import '../reducers/index';
import {
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
import { PlanName } from '../utils/constant';
import { preload } from './background';

export const refresh = async () => {
    appDispatch(desk_hide());
    await appDispatch(worker_refresh());
    appDispatch(desk_show());
};

export const open_guideline = () => {
    appDispatch(app_toggle('guideline'));
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
export const login = async (
    provider: 'google' | 'facebook' | 'discord',
    update_ui?: boolean
) => {
    const w = window.open();
    await POCKETBASE.collection('users').authWithOAuth2({
        provider,
        urlCallback: (url) => {
            w.location.href = url;
        }
    });
    await POCKETBASE.collection('users').update(POCKETBASE.authStore.model.id, {
        emailVisibility: true
    });

    await preload(update_ui);
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

interface WrapperCreatePaymentPocket {
    plan_name: PlanName;
    cluster_domain?: string;
    plan_price: number;
    plan_title: string;
}
export const createPaymentPocket = ({
    plan_name,
    cluster_domain,
    plan_price,
    plan_title
}: WrapperCreatePaymentPocket) => {
    const wallet = store.getState().user.wallet;

    const listPlan = {
        week1: true,
        week2: true,
        month1: true,
        month2: true
    };

    const isHavingPlan = () =>
        wallet?.currentOrders.find((o) => listPlan[o.plan_name]);

    if (cluster_domain == undefined)
        appDispatch(
            popup_open({
                type: 'complete',
                data: {
                    success: false,
                    content: 'unknown cluster'
                }
            })
        );
    if (wallet.money < plan_price)
        appDispatch(
            popup_open({
                type: 'pocketNotEnoughMoney',
                data: {
                    plan_name: plan_title,
                    plan_price: plan_price
                }
            })
        );
    else if (store.getState().user.subscription != undefined)
        appDispatch(
            popup_open({
                type: 'pocketBuyConfirm',
                data: {
                    plan_name,
                    cluster_domain
                }
            })
        );
    else
        appDispatch(
            popup_open({
                type: 'pocketChangePlan',
                data: {
                    plan_name,
                    plan_price,
                    plan_title,
                    oldPlanId: isHavingPlan().id,
                    isRenew: true
                }
            })
        );
};

export const create_payment_qr = async ({ amount }: { amount: string }) => {
    const email = store.getState().user.email;
    const { data, error } = await GLOBAL().rpc('create_pocket_deposit_v3', {
        email,
        amount: +amount,
        provider: 'PAYOS',
        currency: 'VND'
    });

    if (error)
        throw new Error('Error when create payment link' + error.message);
    else {
        appDispatch(
            popup_open({
                type: 'paymentQR',
                data: {
                    id: data[0].id,
                    code: data[0].qrcode,
                    url: data[0].payment_url,
                    accountName: data[0].data.data.accountName,
                    amount: Number.parseInt(data[0].data.data.amount),
                    description: data[0].data.data.description.split(' ')[1]
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

    return true;
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
    }

    return false;
};

export const create_payment_pocket = async ({
    plan_name,
    cluster_domain
}: {
    plan_name: string;
    cluster_domain: string;
}) => {
    appDispatch(
        popup_open({
            type: 'notify',
            data: { loading: true }
        })
    );

    const {
        user: { email },
        globals: { translation: t }
    } = store.getState();
    const { data, error: err } = await GLOBAL().rpc('create_payment_pocket', {
        email,
        plan_name,
        cluster_domain
    });

    if (err) {
        appDispatch(popup_close(true));
        appDispatch(
            popup_open({
                type: 'complete',
                data: {
                    success: false,
                    content: err.message
                }
            })
        );
    } else if (!data) {
        appDispatch(popup_close(true));
        appDispatch(
            popup_open({
                type: 'complete',
                data: {
                    success: false,
                    content: 'you already registered for this plan'
                }
            })
        );
    } else {
        await GLOBAL().rpc('verify_all_pocket_payment');
        await preload(false);

        appDispatch(popup_close(true));
        appDispatch(
            popup_open({
                type: 'complete',
                data: {
                    success: true,
                    content: t[Contents.PAYMENT_POCKET_SUCCESS]
                }
            })
        );
    }
};

export const modify_payment_pocket = async ({
    id,
    plan_name,
    renew = false
}) => {
    appDispatch(
        popup_open({
            type: 'notify',
            data: { loading: true }
        })
    );

    const t = store.getState().globals.translation;

    const { data, error: err } = await GLOBAL().rpc('modify_payment_pocket', {
        id,
        plan_name,
        renew
    });
    if (err) {
        appDispatch(popup_close(true));
        appDispatch(
            popup_open({
                type: 'complete',
                data: {
                    success: false,
                    content: err.message
                }
            })
        );
    } else if (!data) {
        appDispatch(popup_close(true));
        appDispatch(
            popup_open({
                type: 'complete',
                data: {
                    success: false,
                    content: 'You have not register for this plan before'
                }
            })
        );
    } else {
        await GLOBAL().rpc('verify_all_pocket_payment');
        await preload(false);

        appDispatch(popup_close());
        appDispatch(
            popup_open({
                type: 'complete',
                data: {
                    success: true,
                    content: t[Contents.PAYMENT_POCKET_SUCCESS]
                }
            })
        );
    }
};
