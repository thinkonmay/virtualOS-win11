import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/play',
    build: { outDir: '../public/play' },
    define: {
        'import.meta.env.__BUILD__': `"${new Date().toUTCString()}"`
    },
    plugins: [react()]
});
