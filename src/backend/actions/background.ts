import { LOCAL, UserSession } from '../../../src-tauri/api';
import { CLIENT } from '../../../src-tauri/singleton';
import {
    RootState,
    appDispatch,
    app_maximize,
    app_toggle,
    change_bitrate,
    change_framerate,
    check_worker,
    desk_remove,
    fetch_message,
    fetch_store,
    fetch_subscription,
    fetch_under_maintenance,
    fetch_user,
    have_focus,
    loose_focus,
    ping_session,
    setting_theme,
    show_tutorial,
    sidepane_panethem,
    store,
    sync,
    wall_set,
    worker_refresh
} from '../reducers';
import { PaymentStatus } from '../reducers/user.ts';

const loadSettings = async () => {
    let thm = localStorage.getItem('theme');
    thm = thm == 'light' ? 'light' : 'dark';
    var icon = thm == 'light' ? 'sun' : 'moon';

    if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        thm = 'dark';
    }

    document.body.dataset.theme = thm;
    appDispatch(setting_theme(thm));
    appDispatch(sidepane_panethem(icon));
    appDispatch(wall_set(thm == 'light' ? 0 : 1));
};

export const fetchUser = async () => {
    await appDispatch(fetch_user());
};
const checkMaintain = async () => {
    await appDispatch(fetch_under_maintenance());
    // const info = store.getState().globals.maintenance;
    //     appDispatch(
    //         popup_open({
    //             type: 'maintain',
    //             data: {
    //                 start: startText,
    //                 end: endText
    //             }
    //         })
    //     );
};
export const fetchApp = async () => {
    await appDispatch(worker_refresh());
};
const fetchSetting = async () => {
    let bitrateLocal: number = +localStorage.getItem('bitrate');
    let framerateLocal: number = +localStorage.getItem('framerate');

    if (
        bitrateLocal > 100 ||
        bitrateLocal <= 0 ||
        framerateLocal > 100 ||
        framerateLocal <= 0
    ) {
        bitrateLocal = 35;
        framerateLocal = 25;
    }

    appDispatch(change_bitrate(bitrateLocal));
    appDispatch(change_framerate(framerateLocal));
};

let old_clipboard = '';
const handleClipboard = async () => {
    try {
        if (CLIENT == null || !CLIENT?.ready()) return;

        const clipboard = await navigator.clipboard.readText();
        if (!(store.getState() as RootState).remote.focus)
            appDispatch(have_focus());
        if (clipboard == old_clipboard) return;

        old_clipboard = clipboard;
        CLIENT?.SetClipboard(clipboard);
    } catch {
        if ((store.getState() as RootState).remote.focus)
            appDispatch(loose_focus());
    }
};

const fetchMessage = async () => {
    const email = store.getState().user.email;
    await appDispatch(fetch_message(email));
};

const fetchStore = async () => {
    await appDispatch(fetch_store());
};

const startAnalytics = async () => {
    await UserSession(store.getState().user.email);
};

const fetchSubscription = async () => {
    const allowed_domains = 'thinkmay.net';
    const origin = new URL(window.location.href).host;
    await appDispatch(fetch_subscription());

    const subscription = store.getState().user.subscription as PaymentStatus;
    const { status } = subscription;
    if (status == 'PAID' || status == 'IMPORTED') {
        const { cluster } = subscription;

        if (origin != 'localhost' && origin != cluster) {
            //window.open(`https://${cluster}`, '_self');
        }
    } else if (status == 'NO_ACTION') {
        const { data, error } = await LOCAL()
            .from('constant')
            .select('value->>destination')
            .eq('name', 'redirect');
        if (error) throw error;
        else if (data.length == 1) {
            const [{ destination }] = data;
            if (origin != 'localhost' && origin != destination) {
                //window.open(destination, '_self');
            }
        }
    }

    let app: string = undefined;
    if (status == 'PENDING') app = 'payment';
    else if (status == 'PAID' || status == 'IMPORTED') {
        const { plan } = subscription;
        if (plan.includes('month')) {
            app = 'connectPc';
            appDispatch(desk_remove('store'));
        } else if (plan.includes('hour')) {
            app = 'store';
            appDispatch(desk_remove('connectPc'));
        }
    } else if (
        localStorage.getItem('shownTutorial') != 'true' &&
        !window.location.host.includes('localhost')
    ) {
        appDispatch(show_tutorial(true));
        localStorage.setItem('shownTutorial', 'true');
    }

    if (app != undefined) {
        appDispatch(app_toggle(app));
        appDispatch(app_maximize(app));
    }
};

export const preload = async () => {
    try {
        await fetchUser();
        await Promise.allSettled([
            startAnalytics(),
            loadSettings(),
            checkMaintain(),
            fetchApp(),
            fetchSubscription(),
            fetchSetting(),
            fetchMessage(),
            fetchStore()
        ]);
    } catch (e) {
        console.log(`error ${e} in preload function`);
    }

    setInterval(check_worker, 30 * 1000);
    setInterval(sync, 2 * 1000);
    setInterval(handleClipboard, 100);
    setInterval(ping_session, 1000 * 30);
};
