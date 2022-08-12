import path from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";
import { presetAttributify, presetUno } from "unocss";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),
    Unocss({
      presets: [presetAttributify(), presetUno()],
    }),
  ],
});
