import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = "./";

  return {
    resolve: {
      alias: [
        {
          find: "@root",
          replacement: resolve(__dirname, root),
        },
        {
          find: "@",
          replacement: resolve(__dirname, `${root}/src`),
        },
        {
          find: "@nodes",
          replacement: resolve(__dirname, `${root}/node_modules`),
        },
      ],
    },

    plugins: [react()],

    build: {
      outDir: "./dist",
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
          },
        },
      },
    },

    optimizeDeps: {
      include: ["react/jsx-runtime"],
    },

    compilerOptions: {
      baseUrl: ".",
      paths: {
        "@root/*": [`${root}/*`],
        "@/*": [`${root}/src/*`],
        "@nodes/*": [`${root}/node_modules/*`],
      },
    },
  };
});
