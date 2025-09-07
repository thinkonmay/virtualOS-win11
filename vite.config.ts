import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '#': path.resolve(__dirname, './src-tauri'),
        },
    },
    base: '/play/',
    build: { outDir: '../public/play' },
    define: {
        'import.meta.env.__BUILD__': `"${new Date().toUTCString()}"`
    },
    plugins: [react()]
});
