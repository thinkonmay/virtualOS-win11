import { DevEnv } from '#/api/database';
import { getBrowser, getOS } from '#/core';
import { LogCallback } from '#/singleton';
import toast from 'react-hot-toast';
import {
    appDispatch,
    app_full,
    app_remove,
    app_toggle,
    check_worker,
    desk_remove,
    direct_access,
    fetch_active_discounts,
    fetch_app_access,
    fetch_banner,
    fetch_buckets,
    fetch_configuration,
    fetch_domain,
    fetch_error_message,
    fetch_store,
    fetch_subscription,
    fetch_user,
    fetch_wallet,
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
    update_game_tag,
    update_subscription_metadata,
    worker_refresh
} from '../reducers';

export const originalurl = new URL(window.location.href);

const whitelist = [
    {
        txt: 'log:shmsunshine info bitrate changed',
        replace: 'bitrate changed'
    },
    {
        txt: 'log:shmsunshine info framerate changed',
        replace: 'framerate changed'
    },
    {
        txt: 'closed:shmsunshine:',
        content: 'Encoder process has been closed',
        type: 'error'
    },
    {
        txt: 'Failed to create D3D11 device for DD test',
        content: 'GPU encoder is corrupted',
        type: 'error'
    },
    {
        txt: 'spawned:ludusavi:',
        content: 'Backup progress is starting'
    },
    {
        txt: 'closed:ludusavi:',
        content: 'Backup progress is finished'
    },
    {
        txt: 'log:backup   - ',
        replace: 'backup: '
    }
];

const setDomain = async () => {
    const defaultDomain = 'saigon2.thinkmay.net';
    const address = localStorage.getItem('thinkmay_domain');
    if (address == null) {
        localStorage.setItem('thinkmay_domain', defaultDomain);
        appDispatch(set_current_address(defaultDomain));
    } else appDispatch(set_current_address(address));
};

const fetchBanners = () => appDispatch(fetch_banner());
const fetchPayment = () => appDispatch(fetch_wallet());
const fetchStore = () => appDispatch(fetch_store());
const fetchSubscription = () => appDispatch(fetch_subscription());
const fetchConfiguration = () => appDispatch(fetch_configuration());
const fetchAppAccess = () => appDispatch(fetch_app_access());
const fetchBuckets = () => appDispatch(fetch_buckets());
const fetchDomains = () => appDispatch(fetch_domain());
const fetchErrorMessages = () => appDispatch(fetch_error_message());
const fetchUser = () => appDispatch(fetch_user());
const fetchDiscounts = () => appDispatch(fetch_active_discounts());
const fetchApp = () => appDispatch(worker_refresh());
const fetchPlans = () => appDispatch(get_plans());
const fetchResources = () => appDispatch(get_resources());
const loadSettings = () => appDispatch(load_setting());
const updateSubmetadata = () => appDispatch(update_subscription_metadata());
const updateGametag = () => appDispatch(update_game_tag());

const updateUI = async () => {
    const {
        user: { id, subscription, email, discounts },
        worker: { currentAddress, bucket, app_access }
    } = store.getState();

    window.rybbit.identify(id);
    if (bucket == undefined || getOS() != 'Windows')
        appDispatch(app_remove('storage'));
    if (app_access == undefined || getOS() != 'Windows')
        appDispatch(app_remove('steam'));
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

    if (originalurl.searchParams.get('plan') != null && !unknown_user) {
        ops.pop();
        appDispatch(
            app_full({
                id: 'payment',
                page: 'payment',
                value: {
                    plan: originalurl.searchParams.get('plan'),
                    cluster: currentAddress,
                    ...(originalurl.searchParams.get('app') != null
                        ? {
                              template: {
                                  code_name:
                                      originalurl.searchParams.get('app'),
                                  name: originalurl.searchParams.get('app')
                              }
                          }
                        : {})
                }
            })
        );
    } else if (
        originalurl.searchParams.get('resource') != null &&
        !unknown_user
    ) {
        ops.pop();
        appDispatch(
            app_full({
                id: 'payment',
                page: 'payment',
                value: {
                    resource: originalurl.searchParams.get('resource'),
                    plan: originalurl.searchParams.get('resource')
                }
            })
        );
    } else if (originalurl.searchParams.get('app') != null && !unknown_user) {
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

    toast(
        `Device ${device}\nVersion ${version}\nServer ${domain}${nodetext}${voltext}${templatetext}`,
        {
            icon: 'ℹ️',
            duration: 3000,
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff'
            }
        }
    );

    if (discounts.length > 0) {
        const [{ start_at, end_at, multiply_rate, code }] = discounts;
        appDispatch(
            popup_open({
                type: 'discount',
                data: {
                    code,
                    from: new Date(start_at).toLocaleDateString(),
                    to: new Date(end_at).toLocaleDateString(),
                    percentage: multiply_rate - 1
                }
            })
        );
    }

    if (
        !store
            .getState()
            .globals.domains.map((x) => x.domain)
            .includes(domain)
    )
        appDispatch(
            popup_open({
                type: 'maintainance',
                data: {}
            })
        );
    else
        appDispatch(
            popup_open({
                type: 'versionUpdate',
                data: {}
            })
        );
};

export const preloadSilent = async () => {
    await setDomain();
    await fetchUser();
    await Promise.all([
        fetchSubscription(),
        fetchDiscounts(),
        fetchConfiguration(),
        fetchAppAccess(),
        loadSettings(),
        fetchPayment(),
        fetchDomains(),
        fetchErrorMessages(),
        fetchBanners(),
        fetchApp(),
        fetchPlans(),
        fetchStore(),
        fetchBuckets(),
        fetchResources()
    ]);
    await Promise.all([updateSubmetadata(), updateGametag()]);
};

export const preload = async () => {
    try {
        await preloadSilent();
        await updateUI();
    } catch {}
};

export const PreloadBackground = async () => {
    appDispatch(direct_access(originalurl));
    const domain = originalurl.searchParams.get('server');
    if (domain != '' && domain != null)
        localStorage.setItem('thinkmay_domain', domain);

    await preload();
    setInterval(check_worker, 10 * 1000);
    setInterval(sync, 2 * 1000);
    window.onfocus = () => appDispatch(have_focus());
    window.onblur = () => appDispatch(loose_focus());
    LogCallback((log) => {
        if (DevEnv) console.log(log);
        const t = whitelist.find((x) => log.includes(x.txt));
        const data = log.split(':');

        if (t != undefined)
            toast(t.replace ? log.replaceAll(t.txt, t.replace) : t.content, {
                icon: 'ℹ️',
                duration: 2000,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff'
                }
            });
        if (['spawned', 'closed'].includes(data[0]))
            window.rybbit?.event(data[1], {
                content: data[0]
            });
    });
};
