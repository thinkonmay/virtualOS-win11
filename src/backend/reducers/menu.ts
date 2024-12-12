import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NodeType } from '../../../src-tauri/api';

type Opts =
    | {
          type: 'hr';
      }
    | {
          name: string;
          action?: string;
          type?: string;
          icon?: string;

          opts?: Opts[];

          dot?: boolean;
          payload?: any;
      };

export type MenuOpt = {
    width: string;
    secwid: string;
    ispace?: boolean;
    data: Opts[];
};

type Data = {
    hide: boolean;
    top: number;
    left: number;
    opts: string;
    attr: any;
    dataset: any;
    data: MenuOpt;
};

const initialState: Data = {
    hide: true,
    top: 80,
    left: 360,
    opts: 'desk',
    attr: {},
    dataset: {},

    data: {
        width: '310px',
        secwid: '200px',
        data: []
    }
};

export type MenuOption = 'desk' | NodeType;
function menu_conversion(menu: MenuOption): MenuOpt {
    switch (menu) {
        case 'desk':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Refresh',
                        action: 'refresh',
                        type: 'svg',
                        icon: 'refresh'
                    },
                    {
                        type: 'hr'
                    },
                    {
                        name: 'Display settings',
                        icon: 'display',
                        type: 'svg',
                        action: 'sidepane_panetogg',
                        payload: 'full'
                    },
                    {
                        type: 'hr'
                    },
                    {
                        name: 'Guideline',
                        icon: 'info',
                        type: 'svg',
                        action: 'open_guideline'
                    }
                ]
            };
        case 'peer_worker':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Thinkmay remote desktop',
                        action: 'peer_session_create'
                    }
                ]
            };
        case 'vm_worker':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Thinkmay remote desktop',
                        action: 'vm_session_create'
                    }
                ]
            };
        case 'local_worker':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Thinkmay remote desktop',
                        action: 'worker_session_create'
                    }
                ]
            };
        case 'peer_session':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Access session',
                        action: 'peer_session_access'
                    },
                    {
                        name: 'Close session',
                        action: 'peer_session_close'
                    }
                ]
            };
        case 'vm_session':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Access session',
                        action: 'vm_session_access'
                    },
                    {
                        name: 'Close session',
                        action: 'vm_session_close'
                    }
                ]
            };
        case 'host_session':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Close session',
                        action: 'worker_session_close'
                    }
                ]
            };
        case 'local_session':
            return {
                width: '200px',
                secwid: '200px',
                data: [
                    {
                        name: 'Access session',
                        action: 'worker_session_access'
                    },
                    {
                        name: 'Close session',
                        action: 'worker_session_close'
                    }
                ]
            };
        default:
            return {
                width: '310px',
                secwid: '200px',
                data: []
            };
    }
}

export const menusSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        menu_hide: (state) => {
            state.hide = true;
        },
        menu_show: (state, action: PayloadAction<any>) => {
            state.hide = false;
            state.top = action.payload.top || 272;
            state.left = action.payload.left || 430;
            state.opts = action.payload.menu || 'desk';
            state.dataset = action.payload.dataset;
            state.data = menu_conversion(action.payload.menu);
        },
        menu_chng: (state, action: PayloadAction<any>) => {
            state = { ...action.payload };
        }
    }
});
