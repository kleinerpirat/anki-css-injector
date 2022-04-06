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



const cssDir = `src/styles/${production ? "prod" : "test"}`

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
    target: "es6",
    bundle: true,
    minify: production,
    treeShaking: production,
    sourcemap: !production,
    pure: production ? ["console.log", "console.time", "console.timeEnd"] : [],
    watch,
    external: ["anki"],
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
