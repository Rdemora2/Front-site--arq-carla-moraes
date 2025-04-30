import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import macrosPlugin from "vite-plugin-babel-macros";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Suporte a macros do Babel (necessário para twin.macro)
    macrosPlugin(),

    // Configuração do React com suporte ao styled-components
    react({
      jsxImportSource: "react",
      babel: {
        plugins: [
          [
            "styled-components",
            {
              displayName: true,
              fileName: false,
              pure: true, // Otimização para produção
              ssr: false,
            },
          ],
        ],
      },
    }),

    // Permite importar SVGs como componentes React
    svgr({
      svgrOptions: {
        exportType: "default",
        ref: true,
        svgo: true,
        titleProp: true,
      },
      include: "**/*.svg",
    }),
  ],

  resolve: {
    alias: {
      // Aliases de importação para simplificar caminhos no código
      components: path.resolve(__dirname, "./src/components"),
      images: path.resolve(__dirname, "./src/images"),
      pages: path.resolve(__dirname, "./src/pages"),
      styles: path.resolve(__dirname, "./src/styles"),
      helpers: path.resolve(__dirname, "./src/helpers"),
      constants: path.resolve(__dirname, "./src/constants"),
    },
    extensions: [".jsx", ".js", ".tsx", ".ts", ".json"],
  },

  // Configuração de build e otimização
  build: {
    sourcemap: process.env.NODE_ENV !== "production", // Sourcemaps apenas em desenvolvimento
    chunkSizeWarningLimit: 1000, // Aumenta o limite de aviso para chunks grandes
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa as dependências principais em chunks separados
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          styled: ["styled-components"],
          tw: ["tailwindcss", "twin.macro"],
        },
      },
    },
    // Otimização para CSS
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // 4kb
  },

  // Configurações para o servidor de desenvolvimento
  server: {
    port: 3000,
    open: true,
    host: true, // Permite acesso via rede local
  },

  // Configura o esbuild para processar corretamente JSX em arquivos .js
  esbuild: {
    loader: "jsx",
    include: /\.(jsx|js)$/,
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },

  // Otimização de dependências
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
