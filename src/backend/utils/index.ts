import { DevEnv } from '../../../src-tauri/api/database';
import { Contents } from '../reducers/locales';
import { MenuOption } from '../reducers/menu';
import { externalLink } from './constant';

export type AppData = {
    id: string;
    name: Contents[];
    action: string;
    payload?: any;

    page?: string; //sub - refund - storage -history;
    menu?: MenuOption;
    size?: string;
    hide?: boolean;
    max?: boolean | null;
    z?: number;
    dim?: any;
    url?: string | null;

    mono?: boolean;
    icon?: string;
    image?: string;
};

const apps: AppData[] = [
    {
        name: [Contents.TEMPLATE_APP],
        id: 'store',
        action: 'apps/app_toggle',
        payload: 'store',
        size: 'full'
    },
    {
        name: [Contents.CONNECT_APP],
        id: 'connectPc',
        action: 'apps/app_toggle',
        image: 'worker',
        payload: 'connectPc',
        size: 'mini'
    },
];
var { taskbar, desktop } = {
    taskbar: [],
    desktop: [
        //'Local Connect',
        'discord',
        'guideline',
        'facebook',
        'store',
        'connectPc',
        'payment',
        'facebook',
        ...(DevEnv ? ['worker'] : [])
    ]
};

apps.map((x) => {
    x.size = x.size ?? 'full';
    x.hide = true;
    x.max = x.max ?? null;
    x.z = 0;
});

export const taskApps = apps
    .filter((x) => taskbar.includes(x.id))
    .map((x) => x.id);

export const desktopApps = apps
    .filter((x) => desktop.includes(x.id))
    .sort((a, b) => (desktop.indexOf(a.id) > desktop.indexOf(b.id) ? 1 : -1))
    .map((x) => x.id);

export const allApps = apps;
