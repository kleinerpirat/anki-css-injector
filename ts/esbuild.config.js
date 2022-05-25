const fs = require("fs");
const { build } = require("esbuild");

for (const dir of ["../dist", "../dist/web"]) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

const production = process.env.NODE_ENV === "production";
const development = process.env.NODE_ENV === "development";

const watch = development
    ? {
          onRebuild(error) {
              console.timeLog;

              if (error) {
                  console.error(
                      new Date(),
                      "esbuild: build failed:",
                      error.getMessage(),
                  );
              } else {
                  console.log(new Date(), "esbuild: build succeeded");
              }
          },
      }
    : false;



const cssDir = `src/styles/${development ? "test" : "prod"}`
/**
 * Stylesheets for user_files
 */
build({
    entryPoints: [`${cssDir}/editor.css`, `${cssDir}/field.css`],
    outdir: "../dist/user_files",
});

const entryPoints = ["src/injector.ts"];

const options = {
    entryPoints,
    outdir: "../dist/web",
    format: "iife",
    target: "esnext",
    bundle: true,
    minify: false,
    treeShaking: production,
    sourcemap: !production,
    pure: [],
    watch,
    external: ["anki", "svelte"],
    loader: {
        ".png": "dataurl",
        ".svg": "text",
    },
};

build(options).catch((err) => {
    console.error(err);
    process.exit(1);
});

if (watch) {
    console.log("Watching for changes...");
}
