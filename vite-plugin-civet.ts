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

export function civet() {
  return {
    name: "vite-plugin-civet",
    enforce: "pre",

    async resolveId(source, importer, opt) {
      if (source.endsWith(".civet")) {
        const out = id2absPath(source, { importer, ssr: opt.ssr });
        if (!out) return;
        return out.replace(".civet", ".ts?civet");
      }
    },
    async load(id, opt) {
      if (id.endsWith(".ts?civet")) {
        const abs_id = id2absPath(id, { ssr: opt?.ssr });
        if (!abs_id) return;
        const civet_id = abs_id.replace(".ts?civet", ".civet");
        if (exists(civet_id)) {
          const code = fs.readFileSync(civet_id, { encoding: "utf-8" });
          await $`bunx civet -c ${civet_id} --output "/dev/null" --emit-declaration`;
          const { code: ts_code, sourceMap } = compile(code, {
            js: false,
            sourceMap: true,
          });
          return { code: ts_code, map: sourceMap as any };
        }
      }
    },
    handleHotUpdate(ctx) {
      if (ctx.file.endsWith(".ts?civet")) {
        console.log("RELOAD", ctx.file);
        ctx.server.config.logger("[civet-full-reload] " + ctx.file);
        ctx.server.hot.send({
          type: "full-reload",
        });
      }
    },
  } satisfies Plugin;
}
