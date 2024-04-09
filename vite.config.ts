import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import { compile } from "@danielx/civet";
import * as fs from "node:fs";
import * as path from "node:path";
import * as fsp from "node:fs/promises";

function exists(path_str: string) {
  try {
    return fs.existsSync(path_str);
  } catch {
    return false;
  }
}

export default defineConfig({
  plugins: [
    inspect(),
    {
      name: "vite-plugin-civet",
      enforce: "pre",
      resolveId(source, importer, opt) {
        if (source.includes("node_modules")) return;
        const source_abs = importer
          ? path.resolve(importer, "../", source)
          : path.resolve(process.cwd(), source);

        if (exists(source_abs + ".civet")) {
          console.log({ source_abs, ssr: opt.ssr, importer });
          return source_abs + ".ts?civet";
        }
      },
      async load(id, opt) {
        if (id.endsWith(".ts?civet") && path.isAbsolute(id)) {
          const civet_id = id.replace(".ts?civet", ".civet");

          if (exists(civet_id)) {
            const code = fs.readFileSync(civet_id, { encoding: "utf-8" });
            const ts_code = compile(code, { js: false, filename: id });
            // const civet_sveltekit_id = path.resolve(
            //   process.cwd(),
            //   "./.svelte-kit/types/",
            //   path.relative(process.cwd(), civet_id)
            // );
            // fs.writeFileSync(
            //   civet_id.replace(".civet", ".ts"),
            //   "// AUTH GENERATED\n" + ts_code
            // );
            // console.log("COUTER_TS", ts_code);
            return { code: ts_code };
          }
        }
        // if (id.includes("node_modules") || id.includes(".svelte-kit")) return;
        // console.log("TRANSFORM", { id });
        // const civet_id = id + ".civet";
        // if (exists(civet_id)) {
        // }
        // return undefined;
      },
    },
    sveltekit(),
    // civetVitePlugin({
    //   ts: "preserve",
    //   implicitExtension: true,
    //   outputExtension: ".ts",
    //   emitDeclaration: true,
    //   transformOutput(code, id) {
    //     return code;
    //   },
    // }),
  ],
});
