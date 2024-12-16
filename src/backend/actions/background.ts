import { UserEvents, UserSession } from '../../../src-tauri/api';
import { CLIENT } from '../../../src-tauri/singleton';
import {
    RootState,
    appDispatch,
    app_close,
    app_toggle,
    change_bitrate,
    change_framerate,
    check_worker,
    desk_remove,
    fetch_domain,
    fetch_store,
    fetch_subscription,
    fetch_under_maintenance,
    fetch_usage,
    fetch_user,
    get_plans,
    have_focus,
    loose_focus,
    ping_session,
    popup_open,
    setting_theme,
    show_tutorial,
    sidepane_panethem,
    store,
    sync,
    worker_refresh
} from '../reducers';
import { PaymentStatus } from '../reducers/user.ts';
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
const checkMaintain = async () => {
    await appDispatch(fetch_under_maintenance());
};
const fetchApp = async () => {
    await appDispatch(worker_refresh());
};
const fetchPlans = async () => {
    await appDispatch(get_plans());
};

const updateUI = async () => {
    store
        .getState()
        .apps.apps.filter((x) => !x.hide)
        .forEach((x) => appDispatch(app_close(x.id)));
    appDispatch(show_tutorial('close'));

    const subscription = store.getState().user.subscription as PaymentStatus;
    const { status } = subscription;
    if (status == 'PAID' && !subscription.correct_domain) {
        appDispatch(
            popup_open({
                type: 'redirectDomain',
                data: {
                    domain: subscription.cluster,
                    from: origin
                }
            })
        );
    }

    const rms = [];
    const ops = [];
    if (status == 'PENDING') ops.push('payment');
    else if (status == 'PAID') {
        ops.push('connectPc');

        const { ended_at } = subscription;
        if (
            ended_at != null &&
            new Date(ended_at).getTime() - Date.now() < 7 * 24 * 3600 * 1000
        ) {
            appDispatch(
                popup_open({
                    type: 'extendService',
                    data: {
                        type: 'date_limit',
                        to: formatDate(ended_at)
                    }
                })
            );
        }
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
        await fetchUser();
        await Promise.all([
            startAnalytics(),
            loadSettings(),
            checkMaintain(),
            fetchApp(),
            fetchSubscription(),
            fetchSetting(),
            fetchDomains(),
            fetchPlans()
        ]);
        await fetchUsage();
        await fetchStore();
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

    if (update_ui ?? true) await updateUI();
};

export const PreloadBackground = async (update_ui?: boolean) => {
    await preload(update_ui);
    setInterval(check_worker, 10 * 1000);
    setInterval(sync, 2 * 1000);
    setInterval(handleClipboard, 1000);
    setInterval(ping_session, 1000 * 30);
};
