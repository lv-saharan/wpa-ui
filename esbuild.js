import { sassPlugin } from "esbuild-sass-plugin";
import pkg from "./package.json" assert { type: "json" };
import esbuild from "esbuild";
import { dev } from "local-dev-server";
import fs from "fs";
import path from "path";
const [mode] = process.argv.splice(2) ?? "prod";

export const outputRoot = `./dist`;

const outfile = `${outputRoot}/wpa-ui.js`;

const defaultOptions = {
  jsxFactory: "h",
  jsxFragment: "h.f",
  format: "esm",
  bundle: true,
  sourcemap: true,
  minify: true,
  external: ["wpa"],
};

const buildOptions = {
  ...defaultOptions,
  entryPoints: ["src/index.jsx"],
  outfile,
  plugins: [
    sassPlugin({
      type: "css-text",
    }),
  ],
};
//minify sortablejs
esbuild.build({
  ...buildOptions,
  entryPoints: ["node_modules/sortablejs/modular/sortable.core.esm.js"],
  outfile: `${outputRoot}/sortablejs/sortable.core.esm.js`,
});

//tinymce copy

fs.cpSync("node_modules/tinymce", path.join("./dist", "tinymce"), {
  recursive: true,
});
fs.cpSync("src/tinymce/langs", path.join("./dist", "tinymce/langs"), {
  recursive: true,
});

//echarts copy
fs.cpSync("node_modules/echarts/dist", path.join("./dist", "echarts"), {
  recursive: true,
});

switch (mode) {
  case "prod":
    esbuild.build(buildOptions);
    // for (let editorOption of editorOptions) {
    //     esbuild.build({
    //         ...buildOptions,
    //         ...editorOption
    //     })
    // }
    break;
  case "dev":
    const { reload } = dev({ ...pkg.localDev.server, openBrowser: false });
    const watchPlugin = {
      name: "watch-plugin",
      setup(build) {
        console.log("watch plugin setup");
        build.onStart(() => {
          console.log("build starting....");
        });
        build.onEnd((result) => {
          if (result.errors.length == 0) {
            console.log("build ok");
          } else {
            console.log("build error");
          }
        });
      },
    };
    let ctx = await esbuild.context({
      ...buildOptions,
      write: false,
      plugins: [
        sassPlugin({
          type: "css-text",
        }),
        watchPlugin,
      ],
    });
    await ctx.watch();
    console.log("watching...");

    // for (let editorOption of editorOptions) {
    //     esbuild.build({
    //         ...buildOptions,
    //         ...editorOption,
    //         ...devOptions
    //     })
    // }
    break;
}
