import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
const ReactCompilerConfig = { /* ... */ };

// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
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
    )]
});
