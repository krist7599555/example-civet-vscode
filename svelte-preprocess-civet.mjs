import sveltePreprocess from "svelte-preprocess";
import { compile } from "@danielx/civet";

export const civetPreprocess = () =>
  sveltePreprocess({
    /** @type {import("svelte-preprocess/dist/types").Transformer<any>} */
    async civet(arg) {
      const code = compile(arg.content, { js: true });
      return { code };
    },
  });
