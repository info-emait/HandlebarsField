import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const isDebug = mode === "debug";

    return {
        base: env.VITE_APP_BASE_URL || "./",
        build: {
            outDir: "dist",
            emptyOutDir: true,
            sourcemap: isDebug,
            minify: isDebug ? false : "esbuild",
            cssMinify: isDebug ? false : "esbuild",
            rolldownOptions: {
                input: {
                    "control": resolve(__dirname, "control.html")
                }
            }
        },
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
                "@utils": resolve(__dirname, "src/utils"),
                "@styles": resolve(__dirname, "src/styles")
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    quietDeps: true
                }
            }
        }
    };
});