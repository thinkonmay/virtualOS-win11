var wps = 0;
import { createSlice } from '@reduxjs/toolkit';
const walls = ['wallpaper.jpg'];

const themes = ['default', 'dark', 'ThemeA', 'ThemeB', 'ThemeD', 'ThemeC'];

const initialState = {
    themes: themes,
    src: walls[wps]
};

export const wallSlice = createSlice({
    name: 'wall',
    initialState,
    reducers: {}
});
