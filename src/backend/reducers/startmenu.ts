import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
    hide: true
};

export const menuSlice = createSlice({
    name: 'startmenu',
    initialState,
    reducers: {
        startshw: (state) => {
            state.hide = false;
        },
        starthid: (state) => {
            state.hide = true;
        },
        startogg: (state) => {
            state.hide = !state.hide;
        }
    }
});
