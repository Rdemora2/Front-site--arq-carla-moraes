import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import macrosPlugin from "vite-plugin-babel-macros";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      macrosPlugin(),

      react({
        jsxImportSource: "react",
        babel: {
          plugins: [
            "babel-plugin-macros",
            [
              "styled-components",
              {
                displayName: env.VITE_ENABLE_DEBUG_MODE === "true",
                fileName: env.VITE_ENABLE_DEBUG_MODE === "true",
                pure: true,
                ssr: false,
              },
            ],
          ],
        },
      }),

      svgr({
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: true,
          titleProp: true,
        },
        include: "**/*.svg",
      }),

      ...(env.VITE_ENABLE_ANALYZER === "true"
        ? [
            visualizer({
              filename: "stats.html",
              open: env.VITE_ENABLE_DEBUG_MODE === "true",
              gzipSize: true,
              brotliSize: env.VITE_ENABLE_BROTLI === "true",
            }),
          ]
        : []),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        backup: path.resolve(__dirname, "./src/backup"),
        components: path.resolve(__dirname, "./src/components"),
        images: path.resolve(__dirname, "./src/images"),
        pages: path.resolve(__dirname, "./src/pages"),
        styles: path.resolve(__dirname, "./src/styles"),
        helpers: path.resolve(__dirname, "./src/helpers"),
        hooks: path.resolve(__dirname, "./src/hooks"),
        constants: path.resolve(__dirname, "./src/constants"),
        utils: path.resolve(__dirname, "./src/utils"),
        config: path.resolve(__dirname, "./src/config"),
        assets: path.resolve(__dirname, "./src/assets"),
      },
      extensions: [".jsx", ".js", ".tsx", ".ts", ".json"],
    },

    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 1000,

      minify: env.VITE_BUILD_OPTIMIZATION === "true" ? "terser" : false,

      rollupOptions: {
        output: {
          manualChunks:
            env.VITE_ENABLE_CODE_SPLITTING === "true"
              ? {
                  "react-vendor": ["react", "react-dom", "react-router-dom"],
                  styled: ["styled-components"],
                  tw: ["tailwindcss", "twin.macro"],
                  "ui-components": [
                    "styled-components",
                    "twin.macro",
                    "framer-motion",
                  ],
                }
              : undefined,
          sourcemapExcludeSources: env.VITE_ENABLE_SOURCEMAP === "true",
        },
        onwarn(warning, warn) {
          if (warning.code === "SOURCEMAP_ERROR") {
            return;
          }
          warn(warning);
        },
      },

      cssCodeSplit: env.VITE_ENABLE_CODE_SPLITTING === "true",
      assetsInlineLimit: 4096,

      terserOptions:
        env.VITE_BUILD_OPTIMIZATION === "true"
          ? {
              compress: {
                drop_console: env.VITE_ENABLE_CONSOLE_LOGS !== "true",
                drop_debugger: env.VITE_ENABLE_DEBUG_MODE !== "true",
              },
            }
          : {},
    },

    server: {
      port: parseInt(env.VITE_DEV_PORT) || 3000,
      host: env.VITE_DEV_HOST || "localhost",
      open: env.VITE_ENABLE_HOT_RELOAD === "true",
      strictPort: false,

      proxy:
        env.VITE_ENABLE_PROXY === "true"
          ? {
              "/api": {
                target: env.VITE_PROXY_TARGET || "http://localhost:8000",
                changeOrigin: true,
                secure: false,
              },
            }
          : undefined,
    },

    esbuild: {
      loader: "jsx",
      include: /\.(jsx|js)$/,
      logOverride: { "this-is-undefined-in-esm": "silent" },
      drop:
        env.VITE_ENABLE_CONSOLE_LOGS === "true" ? [] : ["console", "debugger"],
    },

    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
      include: [
        "react",
        "react-dom",
        "styled-components",
        "react-router-dom",
        "react-slick",
        "tailwindcss",
      ],
      force: env.VITE_BUILD_OPTIMIZATION === "true",
    },

    preview: {
      port: parseInt(env.VITE_DEV_PORT) || 4173,
      host: env.VITE_DEV_HOST || "localhost",
      open: env.VITE_ENABLE_PREVIEW_MODE === "true",
    },

    define: {
      __DEV__: env.VITE_ENABLE_DEBUG_MODE === "true",
      __PROD__: mode === "production",
      __STAGING__: mode === "staging",
    },
  };
});
