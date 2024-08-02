import {
    RootState,
    appDispatch,
    app_toggle,
    change_bitrate,
    change_framerate,
    check_worker,
    fetch_message,
    fetch_store,
    fetch_under_maintenance,
    fetch_user,
    have_focus,
    loose_focus,
    ping_session,
    popup_open,
    setting_theme,
    sidepane_panethem,
    store,
    sync,
    user_check_sub,
    wall_set,
    worker_refresh
} from '../reducers';
import { client } from '../reducers/remote';

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

    const stat = store.getState().user.stat;

    appDispatch(app_toggle('usermanager'));

    if (stat.plan_name == 'hour_02' || !stat.plan_name) {
        appDispatch(app_toggle('store'));
    } else {
        appDispatch(app_toggle('connectPc'));
    }
    checkMaintain();
};
const checkMaintain = async () => {
    await appDispatch(fetch_under_maintenance());

    const info = store.getState().globals.maintenance;
    const startAt = new Date(info.created_at);
    const endAt = new Date(info.ended_at);

    // Extract hour, day, and month
    const hourStart = startAt.getUTCHours();
    const dayStart = startAt.getUTCDate();
    const monthStart = startAt.getUTCMonth() + 1;

    const startText = `${hourStart}h ${dayStart}/${monthStart}`;

    const hourEnd = endAt.getUTCHours();
    const dayEnd = endAt.getUTCDate();
    const monthEnd = endAt.getUTCMonth() + 1;

    const endText = `${hourEnd}h ${dayEnd}/${monthEnd}`;

    if (new Date() < endAt) {
        appDispatch(
            popup_open({
                type: 'maintain',
                data: {
                    start: startText,
                    end: endText
                }
            })
        );
    }
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
        if (client == null || !client?.ready()) return;

        const clipboard = await navigator.clipboard.readText();
        if (!(store.getState() as RootState).remote.focus)
            appDispatch(have_focus());
        if (clipboard == old_clipboard) return;

        old_clipboard = clipboard;
        client?.SetClipboard(clipboard);
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
export const checkTimeUsage = () => {
    const subInfo = store.getState().user?.stat;

    const totalTime = +(subInfo?.plan_hour + subInfo?.additional_time);
    let isExpired = false;
    const now = new Date();

    // Check if now is within 2 days of end_time
    const endTime = new Date(subInfo?.end_time);
    const twoDaysBeforeEndTime = new Date(endTime);
    twoDaysBeforeEndTime.setDate(endTime.getDate() - 2);

    // Check if now is between twoDaysBeforeEndTime and endTime
    const isNearbyEndTime = now >= twoDaysBeforeEndTime && now <= endTime;

    // Check if usage_hour is within 2 hours of 2 * plan_hour
    const isNearbyUsageHour = subInfo?.remain_time <= 2;

    if (now > endTime || subInfo?.remain_time == 0) {
        isExpired = true;
    }

    appDispatch(
        user_check_sub({
            isNearbyEndTime,
            isNearbyUsageHour,
            isExpired
        })
    );
    return {
        isNearbyEndTime: isNearbyEndTime,
        isNearbyUsageHour: isNearbyUsageHour,
        isExpired
    };
};

export const preload = async () => {
    await fetchUser(),
        await Promise.all([
            loadSettings(),
            fetchApp(),
            fetchSetting(),
            fetchMessage(),
            fetchStore()
        ]);

    checkTimeUsage();
    setInterval(check_worker, 30 * 1000);
    setInterval(sync, 2 * 1000);
    setInterval(handleClipboard, 100);
    setInterval(ping_session, 1000 * 10);
};
