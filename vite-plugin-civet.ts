import type { Plugin } from "vite";
import { compile } from "@danielx/civet";
import * as fs from "node:fs";
import * as path from "node:path";
import { $ } from "zx";

function exists(path_str: string) {
  try {
    return fs.existsSync(path_str);
  } catch {
    return false;
  }
}

function id2absPath(
  id: string,
  { importer = undefined, ssr = false }: { ssr?: boolean; importer?: string }
) {
  if (importer) {
    if (path.isAbsolute(importer)) {
      if (id.startsWith(".")) {
        return path.resolve(path.dirname(importer), id);
      } else {
        return undefined;
      }
    } else {
      throw new Error(`expect importer to be absolute but got ${importer}`);
    }
  }
  if (path.isAbsolute(id)) {
    if (id.startsWith(process.cwd())) {
      return id;
    } else {
      return process.cwd() + id;
    }
  }
  return undefined;
}

function toShadowPath(id: string) {
  return id.replace(process.cwd(), path.resolve(process.cwd(), "./.shadow"));
}

export function civet() {
  const EXT_CIVET = ".civet";
  // const EXT_VIRTUAL_CIVET = ".ts?civet";
  // const EXT_VIRTUAL_CIVET = ".civet";

  /**
   * {@see https://github.dev/sveltejs/kit/blob/f80ba75dfd967fb9d28d705d6891933bab603dc9/packages/kit/src/exports/vite/index.js}
   */
  return {
    name: "vite-plugin-civet",
    enforce: "pre",

    async resolveId(source, importer, opt) {
      const out = id2absPath(source, { importer, ssr: opt.ssr });
      if (!out) return;
      if (source.endsWith(EXT_CIVET)) {
        return out.replace(EXT_CIVET, EXT_CIVET);
      }
      // if (source.endsWith(EXT_VIRTUAL_CIVET)) {
      //   return out.replace(EXT_VIRTUAL_CIVET, EXT_VIRTUAL_CIVET);
      // }
    },
    async load(id, opt) {
      const abs_id = id2absPath(id, { ssr: opt?.ssr });
      if (!abs_id) return;

      if (id.endsWith(EXT_CIVET)) {
        const civet_id = abs_id.replace(EXT_CIVET, EXT_CIVET);
        if (exists(civet_id)) {
          const code = fs.readFileSync(civet_id, { encoding: "utf-8" });
          const shadow = /\+page|\+layout|\+server/.test(civet_id)
            ? civet_id.replace(EXT_CIVET, ".d.ts")
            : toShadowPath(civet_id).replace(EXT_CIVET, ".civet.d.ts");

          await $`bunx civet -c ${civet_id} --output "/dev/null" --emit-declaration`;
          await $`mkdir -p ${path.dirname(shadow)}`;
          await $`mv ${civet_id + ".d.ts"} ${shadow}`;

          return { code };
        }
      }
    },
    transform(code, id) {
      if (id.endsWith(EXT_CIVET)) {
        const { code: ts_code, sourceMap } = compile(code, {
          js: true,
          sourceMap: true,
        });
        return {
          code: ts_code,
        };
      }
    },
    handleHotUpdate(ctx) {
      if (ctx.file.endsWith(".civet")) {
        // ctx.server.config.logger("[civet-full-reload] " + ctx.file);
        ctx.server.hot.send({ type: "full-reload" });
      }
    },
    // https://vitejs.dev/guide/api-plugin.html#configureserver
    configureServer() {},
  } satisfies Plugin;
}
