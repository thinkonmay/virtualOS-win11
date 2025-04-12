import md5 from 'md5';
import toast from 'react-hot-toast';
import { UserEvents, UserSession } from '../../../src-tauri/api';
import { getBrowser, getOS } from '../../../src-tauri/core/utils/platform.ts';
import { CLIENT } from '../../../src-tauri/singleton';
import {
    RootState,
    appDispatch,
    app_full,
    app_toggle,
    change_bitrate,
    change_framerate,
    check_worker,
    desk_remove,
    fetch_active_discounts,
    fetch_configuration,
    fetch_domain,
    fetch_payment_history,
    fetch_refund_request,
    fetch_store,
    fetch_subscription,
    fetch_subscription_metadata,
    fetch_user,
    fetch_wallet,
    get_deposit_status,
    get_payment_pocket,
    get_plans,
    get_resources,
    have_focus,
    load_setting,
    loose_focus,
    popup_open,
    set_current_address,
    show_tutorial,
    store,
    sync,
    worker_refresh
} from '../reducers';
import { Contents } from '../reducers/locales/index.ts';

export const originalurl = new URL(window.location.href);

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
const startAnalytics = async () => {
    const email = store.getState().user.email;
    if (
        email != 'unknown' &&
        email != '' &&
        email != undefined &&
        email != null
    )
        (window as any).LiveChatWidget.call('set_customer_email', email);
    await UserSession(email);
};

export const fetchPayment = () =>
    Promise.all([
        appDispatch(fetch_wallet()),
        appDispatch(fetch_payment_history()),
        appDispatch(fetch_refund_request()),
        appDispatch(get_payment_pocket()),
        appDispatch(get_deposit_status())
    ]);

const fetchStore = () => appDispatch(fetch_store());
const fetchSubscription = () => appDispatch(fetch_subscription());
const fetchSubMetadata = () => appDispatch(fetch_subscription_metadata());
const fetchConfiguration = () => appDispatch(fetch_configuration());
const fetchDomains = () => appDispatch(fetch_domain());
const fetchUser = () => appDispatch(fetch_user());
const fetchDiscounts = () => appDispatch(fetch_active_discounts());
const fetchApp = () => appDispatch(worker_refresh());
const fetchPlans = () => appDispatch(get_plans());
const fetchResources = () => appDispatch(get_resources());
const loadSettings = () => appDispatch(load_setting());

const updateUI = async () => {
    const {
        user: { subscription, email, discounts },
        worker: { currentAddress }
    } = store.getState();

    const unknown_user = email == undefined || email == 'unkown' || email == '';

    const rms = [];
    const ops = [];
    if (subscription != undefined) {
        const { cluster, metadata } = subscription;
        ops.push('connectPc');

        const {
            reach_time_limit,
            nearly_reach_time_limit,
            reach_date_limit,
            nearly_reach_date_limit
        } = metadata ?? {};

        if (cluster != currentAddress)
            appDispatch(
                popup_open({
                    type: 'redirectDomain',
                    data: {
                        domain: cluster
                    }
                })
            );
        else if (reach_time_limit)
            appDispatch(
                popup_open({
                    type: 'extendService',
                    data: {
                        type: 'time_limit'
                    }
                })
            );
        else if (reach_date_limit)
            appDispatch(
                popup_open({
                    type: 'extendService',
                    data: {
                        type: 'date_limit'
                    }
                })
            );
        else if (nearly_reach_date_limit)
            appDispatch(
                popup_open({
                    type: 'extendService',
                    data: {
                        type: 'near_date_limit',
                        available_time: nearly_reach_date_limit
                    }
                })
            );
        else if (nearly_reach_time_limit != undefined)
            appDispatch(
                popup_open({
                    type: 'extendService',
                    data: {
                        type: 'near_time_limit',
                        available_time: nearly_reach_time_limit
                    }
                })
            );
    } else if (
        originalurl.searchParams.get('tutorial') == 'on' &&
        !unknown_user
    )
        appDispatch(show_tutorial('open'));

    if (originalurl.searchParams.get('app') != null && !unknown_user) {
        ops.pop();
        appDispatch(
            app_full({
                id: 'store',
                value: {
                    app: originalurl.searchParams.get('app')
                }
            })
        );
    }

    ops.forEach((x) => appDispatch(app_toggle(x)));
    rms.forEach((x) => appDispatch(desk_remove(x)));

    const domain = store.getState().worker.currentAddress;
    const metadata = store.getState().user.subscription?.metadata;
    const template = store.getState().worker.metadata;
    const version = import.meta.env.__BUILD__;
    const device = getOS() + ' ' + getBrowser();
    const node = metadata?.node;
    const nodetext = node ? `\nNode ${node}` : '';
    const templatetext = template?.name ? `\nTemplate ${template.name}` : '';
    const volume = template?.local_id;
    const voltext = volume ? `\nVolume ${volume.split('-')?.[0]}` : '';
    const def = ['win11', '150', undefined];
    if (def.includes(template?.code))
        toast(store.getState().globals.translation[Contents.DEFAULT_TEMPLATE], {
            duration: 15000,
            icon: '🥸',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff'
            }
        });

    toast(
        `Device ${device}\nVersion ${version}\nServer ${domain}${nodetext}${voltext}${templatetext}`,
        {
            icon: 'ℹ️',
            duration: 5000,
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff'
            }
        }
    );

    if (discounts.length > 0) {
        const [{ start_at, end_at, multiply_rate }] = discounts;
        appDispatch(
            popup_open({
                type: 'discount',
                data: {
                    from: new Date(start_at).toLocaleDateString(),
                    to: new Date(end_at).toLocaleDateString(),
                    percentage: multiply_rate - 1
                }
            })
        );
    }
};

export const preloadSilent = async () => {
    await setDomain();
    await fetchUser();
    await Promise.all([
        fetchSubscription(),
        fetchDiscounts(),
        fetchConfiguration(),
        loadSettings(),
        fetchPayment(),
        startAnalytics(),
        fetchDomains(),
        fetchApp(),
        fetchPlans(),
        fetchResources()
    ]);
    await Promise.all([fetchSubMetadata(), fetchStore()]);
};

export const preload = async () => {
    try {
        await preloadSilent();
        await updateUI();
    } catch (e) {
        UserEvents({
            type: 'preload/rejected',
            payload: e
        });
    }
};

export const PreloadBackground = async () => {
    await preload();
    setInterval(check_worker, 10 * 1000);
    setInterval(handleClipboard, 300);
    setInterval(sync, 2 * 1000);
};
