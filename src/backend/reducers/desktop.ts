import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { desktopApps } from '../utils';

const initialState = {
    apps: desktopApps,
    hide: false,
    size: 3,
    sort: 'none',
    abOpen: false
};

export const deskSlice = createSlice({
    name: 'desk',
    initialState,
    reducers: {
        desk_remove: (state, action: PayloadAction<string>) => {
            state.apps = state.apps.filter((x) => x != action.payload);
        },
        desk_add: (state, action: PayloadAction<string[]>) => {
            state.apps = [
                ...state.apps.filter((x) => desktopApps.includes(x)),
                ...action.payload
            ];
        },
        desk_hide: (state) => {
            state.hide = true;
        },
        desk_show: (state) => {
            state.hide = false;
        },
        desk_size: (state, action: PayloadAction<number>) => {
            state.size = action.payload;
        },
        desk_sort: (state, action: PayloadAction<any>) => {
            state.sort = action.payload || 'none';
        }
    }
});
