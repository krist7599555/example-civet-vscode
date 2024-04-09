import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { civetPreprocess } from "./svelte-preprocess-civet.mjs";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  vitePlugin: {
    experimental: {
      compileModule: {
        // https://github.com/sveltejs/vite-plugin-svelte/blob/main/packages/vite-plugin-svelte/src/utils/id.js#L192
        extensions: [".svelte.ts", ".svelte.civet"],
      },
    },
  },
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [civetPreprocess(), vitePreprocess()],
  compilerOptions: {},
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    moduleExtensions: [".js", ".ts", ".civet"],
  },
};

export default config;
