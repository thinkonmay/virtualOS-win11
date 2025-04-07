import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import flowbiteReact from "flowbite-react/plugin/vite";

const ReactCompilerConfig = { /* ... */ };

// https://vitejs.dev/config/
export default defineConfig({
    base: "/play",
    build: { outDir: '../public/play' },
    define: {
        'import.meta.env.__BUILD__' :  `"${new Date().toUTCString()}"`
    },
    plugins: [react(
        {
            //@ts-expect-error
            babel: {
                plugins: [
                    ["babel-plugin-react-compiler", ReactCompilerConfig],
                ],
            },
        }
    ), flowbiteReact()]
});