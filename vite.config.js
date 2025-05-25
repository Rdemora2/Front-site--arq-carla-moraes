import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import macrosPlugin from "vite-plugin-babel-macros";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    macrosPlugin(),

    react({
      jsxImportSource: "react",
      babel: {
        plugins: [
          [
            "styled-components",
            {
              displayName: true,
              fileName: false,
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
    }),    ...(process.env.NODE_ENV === "development" && process.env.VITE_ENABLE_ANALYZER === "true"
      ? [
          visualizer({
            filename: "stats.html",
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      backup: path.resolve(__dirname, "./src/backup"),
      components: path.resolve(__dirname, "./src/components"),
      images: path.resolve(__dirname, "./src/images"),
      pages: path.resolve(__dirname, "./src/pages"),
      styles: path.resolve(__dirname, "./src/styles"),
      helpers: path.resolve(__dirname, "./src/helpers"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      constants: path.resolve(__dirname, "./src/constants"),
    },
    extensions: [".jsx", ".js", ".tsx", ".ts", ".json"],
  },
  build: {
    sourcemap: process.env.VITE_ENABLE_SOURCEMAP === "true",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          styled: ["styled-components"],
          tw: ["tailwindcss", "twin.macro"],
        },
      },
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  server: {
    port: 3000,
    open: true,
    host: true,
  },

  esbuild: {
    loader: "jsx",
    include: /\.(jsx|js)$/,
    logOverride: { "this-is-undefined-in-esm": "silent" },
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
  },
});
