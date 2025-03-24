import md5 from 'md5';
import { POCKETBASE, UserEvents, UserSession } from '../../../src-tauri/api';
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
    fetch_subscription_metadata,
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
    sidepane_panethem,
    store,
    sync,
    worker_refresh
} from '../reducers';
import { formatDate } from '../utils/date.ts';
import { formatError } from '../utils/formatErr.ts';
import toast from 'react-hot-toast';
import { getBrowser, getOS } from '../../../src-tauri/core/utils/platform.ts';

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
    const email = store.getState().user.email;
    (window as any).LiveChatWidget.call('set_customer_email', email);
    await UserSession(email);
};
const fetchSubscription = async () => {
    await appDispatch(fetch_subscription());
};
const fetchSubMetadata = async () => {
    await appDispatch(fetch_subscription_metadata());
};
const fetchDomains = async () => {
    await appDispatch(fetch_domain());
};
const fetchUser = async () => {
    await appDispatch(fetch_user());
};
const fetchPayment = () =>
    Promise.all([
        appDispatch(fetch_wallet()),
        appDispatch(fetch_payment_history()),
        appDispatch(get_payment_pocket()),
        appDispatch(get_deposit_status())
    ]);

const fetchApp = async () => {
    await appDispatch(worker_refresh());
};
const fetchPlans = async () => {
    await appDispatch(get_plans());
};

const updateUI = async () => {
    const {
        user: { subscription },
        worker: { currentAddress }
    } = store.getState();

    const rms = [];
    const ops = [];
    let node = undefined;
    if (subscription != undefined) {
        const { ended_at, cluster, usage } = subscription;
        node = usage?.node;

        ops.push('connectPc');
        // TODO
        // if (subscription?.usage?.isNewUser) ops.push('store');

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

    ops.forEach((x) => appDispatch(app_toggle(x)));
    rms.forEach((x) => appDispatch(desk_remove(x)));

    const domain = store.getState().worker.currentAddress;
    const version = import.meta.env.__BUILD__;
    const device = getOS() + ' ' + getBrowser();
    const volume = (
        await POCKETBASE()
            .collection('volumes')
            .getFullList<{ local_id: string }>()
    )?.[0]?.local_id;
    const voltext = volume ? `\nVolume ${volume.split('-')?.[0]}` : '';
    const nodetext = node ? `\nNode ${node}` : '';
    toast(
        `Device ${device}\nVersion ${version}\nServer ${domain}${nodetext}${voltext}`,
        {
            icon: '👏',
            duration: 5000,
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff'
            }
        }
    );
};

export const preload = async (update_ui?: boolean) => {
    try {
        await setDomain();
        await fetchUser();
        await Promise.all([
            fetchSubscription(),
            loadSettings(),
            fetchPayment(),
            startAnalytics(),
            fetchDomains(),
            fetchSetting(),
            fetchApp(),
            fetchPlans()
        ]);
        await Promise.all([fetchSubMetadata(), fetchStore()]);

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
