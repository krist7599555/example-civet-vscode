# Civet with SvelteKit VSCode

1. copy `vite-plugin-civet.ts` for .svelte
1. add `svelte.config.js` to

```mjs
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
  kit: {
    //! UNDOCUMENT CODE allow +page.server.civet
    // https://github.com/sveltejs/kit/blob/f80ba75dfd967fb9d28d705d6891933bab603dc9/packages/migrate/migrations/routes/index.js#L81C9-L81C19
    moduleExtensions: [".js", ".ts", ".civet"],
  },
};
```

and now everything work as it is 😎
