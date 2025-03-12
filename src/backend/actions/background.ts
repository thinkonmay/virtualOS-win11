import md5 from 'md5';
import { UserEvents, UserSession } from '../../../src-tauri/api';
import { CLIENT } from '../../../src-tauri/singleton';
import {
    RootState,
    appDispatch,
    app_toggle,
    change_bitrate,
    change_framerate,
    check_worker,
    desk_remove,
    fetch_domain,
    fetch_payment_history,
    fetch_store,
    fetch_subscription,
    fetch_usage,
    fetch_user,
    fetch_wallet,
    get_deposit_status,
    get_payment_pocket,
    get_plans,
    have_focus,
    loose_focus,
    popup_open,
    set_current_address,
    setting_theme,
    show_tutorial,
    sidepane_panethem,
    store,
    sync,
    worker_refresh
} from '../reducers';
import { localStorageKey } from '../utils/constant';
import { formatDate } from '../utils/date.ts';
import { formatError } from '../utils/formatErr.ts';

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
        if (CLIENT == undefined || !CLIENT?.ready()) return;

        const clipboard = await navigator.clipboard.readText();
        const clipboardHash = md5(clipboard);
        if (!(store.getState() as RootState).remote.focus)
            appDispatch(have_focus());
        if (clipboardHash == old_clipboard) return;

        old_clipboard = clipboardHash;
        CLIENT?.SetClipboard(clipboard);
    } catch {
        if ((store.getState() as RootState).remote.focus)
            appDispatch(loose_focus());
    }
};

const setDomain = async () => {
    const defaultDomain = 'play.2.thinkmay.net';
    const address = localStorage.getItem('thinkmay_domain');
    if (address == null) {
        localStorage.setItem('thinkmay_domain', defaultDomain);
        appDispatch(set_current_address(defaultDomain));
    } else appDispatch(set_current_address(address));
};
const fetchStore = async () => {
    await appDispatch(fetch_store());
};
const startAnalytics = async () => {
    await UserSession(store.getState().user.email);
};
const fetchSubscription = async () => {
    await appDispatch(fetch_subscription());
};
const fetchUsage = async () => {
    await appDispatch(fetch_usage());
};
const fetchDomains = async () => {
    await appDispatch(fetch_domain());
};
const fetchUser = async () => {
    await appDispatch(fetch_user());
};
const fetchPayment = async () => {
    await appDispatch(fetch_wallet());
    await appDispatch(fetch_payment_history());
    await appDispatch(get_payment_pocket());
    await appDispatch(get_deposit_status());
};
const fetchApp = async () => {
    await appDispatch(worker_refresh());
};
const fetchPlans = async () => {
    await appDispatch(get_plans());
};

const updateUI = async () => {
    appDispatch(show_tutorial('close'));
    const {
        user: { subscription },
        worker: { currentAddress }
    } = store.getState();

    const { status } = subscription;
    const rms = [];
    const ops = [];
    if (status == 'PENDING') ops.push('payment');
    else if (status == 'PAID') {
        const { ended_at, cluster } = subscription;

        ops.push('connectPc');
        if (subscription?.usage?.isNewUser) ops.push('store');

        if (
            ended_at != null &&
            new Date(ended_at).getTime() - Date.now() < 3 * 24 * 3600 * 1000
        )
            appDispatch(
                popup_open({
                    type: 'extendService',
                    data: {
                        type: 'date_limit',
                        to: formatDate(ended_at)
                    }
                })
            );

        if (cluster != currentAddress)
            appDispatch(
                popup_open({
                    type: 'redirectDomain',
                    data: {
                        domain: cluster
                    }
                })
            );
    }
    if (
        localStorage.getItem(localStorageKey.shownTutorial) != 'true' &&
        !localStorage.getItem(localStorageKey.shownPaidUserTutorial) &&
        status != 'PAID'
    ) {
        appDispatch(show_tutorial('NewTutorial'));
        localStorage.setItem(localStorageKey.shownTutorial, 'true');
    }

    ops.forEach((x) => appDispatch(app_toggle(x)));
    rms.forEach((x) => appDispatch(desk_remove(x)));
};

export const preload = async (update_ui?: boolean) => {
    try {
        await setDomain();
        await fetchUser();
        await Promise.all([fetchSubscription(), fetchApp()]);
        await Promise.all([
            startAnalytics(),
            loadSettings(),
            fetchPayment(),
            fetchSetting(),
            fetchDomains(),
            fetchUsage(),
            fetchStore(),
            fetchPlans()
        ]);

        if (update_ui ?? true) await updateUI();
    } catch (e) {
        UserEvents({
            type: 'preload/rejected',
            payload: e
        });

        appDispatch(
            popup_open({
                type: 'complete',
                data: {
                    content: formatError(e),
                    success: false
                }
            })
        );
    }
};

export const PreloadBackground = async (update_ui?: boolean) => {
    await preload(update_ui);
    setInterval(check_worker, 10 * 1000);
    setInterval(sync, 2 * 1000);
    setInterval(handleClipboard, 300);
};
