import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { civetPreprocess } from "./svelte-preprocess-civet.mjs";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  vitePlugin: {
    experimental: {
      compileModule: {
        //! UNDOCUMENT CODE .svelte.ts runes with $state
        // https://github.com/sveltejs/vite-plugin-svelte/blob/main/packages/vite-plugin-svelte/src/utils/id.js#L192
        // https://github.com/sveltejs/vite-plugin-svelte/blob/8ae3dc8cf415355f406f23d6104cb6153d75dfc8/packages/vite-plugin-svelte/src/utils/id.js#L193
        extensions: [".svelte.ts", ".svelte.civet"],
      },
    },
  },
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [civetPreprocess(), vitePreprocess()],
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    //! UNDOCUMENT CODE allow +page.server.civet
    // https://github.com/sveltejs/kit/blob/f80ba75dfd967fb9d28d705d6891933bab603dc9/packages/migrate/migrations/routes/index.js#L81C9-L81C19
    moduleExtensions: [".js", ".ts", ".civet"],
  },
};

export default config;
