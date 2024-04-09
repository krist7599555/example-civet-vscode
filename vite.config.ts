import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import { civet } from "./vite-plugin-civet";

export default defineConfig({
  plugins: [inspect(), civet(), sveltekit()],
});
