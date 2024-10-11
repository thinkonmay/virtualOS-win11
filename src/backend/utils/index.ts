import { MenuOption } from '../reducers/menu';
import { externalLink } from './constant';

export type AppData = {
    id: string;
    name: string;
    action: string;
    payload?: any;

    menu?: MenuOption;
    size?: string;
    ready?: boolean;
    installing?: boolean;
    hide?: boolean;
    max?: boolean | null;
    z?: number;
    dim?: any;
    url?: string | null;
};

const apps: AppData[] = [
    {
        name: 'Settings',
        id: 'settings',
        action: 'apps/app_toggle',
        payload: 'settings'
    },
    {
        name: 'Worker Profile',
        id: 'worker',
        action: 'apps/app_toggle',
        payload: 'worker'
    },
    {
        name: 'Browser',
        id: 'edge',
        action: 'apps/app_toggle',
        payload: 'edge'
    },
    {
        name: 'Thanh toán',
        id: 'payment',
        action: 'apps/app_toggle',
        payload: 'payment'
    },
    {
        name: 'Feedback',
        id: 'feedback',
        action: 'apps/app_toggle',
        payload: 'feedback'
    },

    {
        name: 'Game cho gói giờ',
        id: 'store',
        action: 'apps/app_toggle',
        payload: 'store',
    },
    {
        name: 'Máy tính cá nhân',
        id: 'connectPc',
        action: 'apps/app_toggle',
        payload: 'connectPc',
    },
    {
        name: 'Hướng dẫn',
        id: 'guideline',
        action: 'apps/app_toggle',
        //payload: externalLink.GUIDE_VIDEO
        payload: 'guideline',
        size: 'full'

    },
    {
        name: 'Discord',
        id: 'discord',
        action: 'apps/app_external',
        payload: externalLink.DISCORD_LINK
    },
    {
        name: 'Thinkmay Fanpage',
        id: 'facebook',
        action: 'apps/app_external',
        payload: externalLink.FACEBOOK_LINK
    }
];
var { taskbar, desktop } = {
    taskbar: [''],
    desktop: window.location.href.includes('localhost')
        ? [
            'Worker Profile',
            'Local Connect',
            'Discord',
            'Hướng dẫn',
            'Thinkmay Fanpage',
            'Game cho gói giờ',
            'Máy tính cá nhân',
            'Thanh toán'
        ]
        : [
            'Local Connect',
            'Discord',
            'Hướng dẫn',
            'Thinkmay Fanpage',
            'Game cho gói giờ',
            'Máy tính cá nhân',
            'Thanh toán'
        ]
};

apps.map((x) => {
    x.size = x.size ?? 'full';
    x.hide = true;
    x.max = x.max ?? null;
    x.z = 0;
});

export const taskApps = apps
    .filter((x) => taskbar.includes(x.name))
    .map((x) => x.id);

export const desktopApps = apps
    .filter((x) => desktop.includes(x.name))
    .sort((a, b) =>
        desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1
    )
    .map((x) => x.id);

export const allApps = apps;
