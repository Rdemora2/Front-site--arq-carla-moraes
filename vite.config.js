import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import macrosPlugin from "vite-plugin-babel-macros";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const isProd = mode === "production";

  return {
    plugins: [
      macrosPlugin(),

      react({
        jsxImportSource: "react",
        babel: {
          plugins: [
            [
              "styled-components",
              {
                displayName: isDev,
                fileName: isDev,
                pure: true,
                ssr: false,
                minify: isProd,
                transpileTemplateLiterals: isProd,
              },
            ],
          ],
        },
      }),

      svgr({
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: isProd,
          titleProp: true,
          replaceAttrValues: {
            "#000": "currentColor",
            "#000000": "currentColor",
          },
        },
        include: "**/*.svg",
      }),
      // Plugin PWA para cache inteligente
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png"],
        manifest: {
          name: "Carla Moraes Arquitetura",
          short_name: "CarlaArq",
          description: "Projetos arquitetônicos exclusivos e personalizados",
          theme_color: "#ffffff",
          icons: [
            {
              src: "images/favicon/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "images/favicon/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        },
      }),

      // Plugin HTML com otimizações
      createHtmlPlugin({
        inject: {
          data: {
            title: "Carla Moraes Arquitetura",
            description: "Projetos arquitetônicos exclusivos e personalizados",
          },
        },
        minify: isProd && {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true,
        },
      }),

      // Bundle analyzer apenas em desenvolvimento quando solicitado
      ...(isDev && process.env.VITE_ENABLE_ANALYZER === "true"
        ? [
            visualizer({
              filename: "bundle-analysis.html",
              open: true,
              gzipSize: true,
              brotliSize: true,
              template: "treemap", // treemap, sunburst, network
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
      },
      extensions: [".jsx", ".js", ".tsx", ".ts", ".json"],
    },
    build: {
      sourcemap: isDev || process.env.VITE_ENABLE_SOURCEMAP === "true",
      chunkSizeWarningLimit: 500,

      rollupOptions: {
        output: {
          // Estratégia avançada de chunk splitting
          manualChunks: (id) => {
            // Vendor chunks por categoria
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "react-vendor";
              }
              if (id.includes("react-router")) {
                return "router-vendor";
              }
              if (id.includes("styled-components") || id.includes("emotion")) {
                return "styled-vendor";
              }
              if (id.includes("framer-motion")) {
                return "animation-vendor";
              }
              if (id.includes("tailwindcss") || id.includes("twin.macro")) {
                return "css-vendor";
              }
              // Outras bibliotecas pequenas agrupadas
              return "vendor";
            }

            // Chunks por funcionalidade
            if (id.includes("/pages/")) {
              return "pages";
            }
            if (id.includes("/components/")) {
              return "components";
            }
            if (id.includes("/hooks/")) {
              return "hooks";
            }
          },

          // Nomes de arquivo otimizados
          chunkFileNames: isProd ? "js/[name]-[hash].js" : "js/[name].js",
          entryFileNames: isProd ? "js/[name]-[hash].js" : "js/[name].js",
          assetFileNames: isProd
            ? "assets/[name]-[hash][extname]"
            : "assets/[name][extname]",
        },
      },

      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      minify: isProd ? "terser" : false,

      ...(isProd && {
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ["console.log", "console.info"],
            dead_code: true,
            unused: true,
          },
          mangle: {
            safari10: true,
          },
          format: {
            comments: false,
          },
        },
      }),
      // Otimizações de build
      target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
      modulePreload: {
        polyfill: false,
      },
      // Compressão mais agressiva
      reportCompressedSize: isProd,
    },

    server: {
      port: 3000,
      open: true,
      host: true,
      hmr: {
        overlay: true,
      },
    },

    preview: {
      port: 3001,
      open: true,
      host: true,
    },

    esbuild: {
      loader: "jsx",
      include: /\.(jsx|js)$/,
      logOverride: { "this-is-undefined-in-esm": "silent" },
      ...(isProd && {
        drop: ["console", "debugger"],
      }),
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
        target: "es2020",
      },
      include: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "styled-components",
        "react-router-dom",
        "react-slick",
        "framer-motion",
        "react-intersection-observer",
        "prop-types",
      ],
      exclude: ["@testing-library/react", "jest"],
      force: false, // Set to true only when dependencies change
    },

    // Performance otimizations
    define: {
      ...(isProd && {
        "process.env.NODE_ENV": '"production"',
      }),
    },

    // CSS otimizations
    css: {
      postcss: {
        plugins: [
          require("autoprefixer"),
          ...(isProd ? [require("cssnano")({ preset: "default" })] : []),
        ],
      },
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
  };
});
