# Anki add-on template

Adds four buttons:

- Strike-through text
- Horizontal ruler
- Code block
- Paragraph

## Requirements

You'll need node and yarn installed.

## Tools

- Build with `tools/build.sh`. This makes a release build, so `console.log` lines are stripped out.
- Develop by changing your directory to `/ts`, and running `yarn run dev`. This ensures
  that any changes you make in `/ts` are immediately compiled to `/dist/web`.
- Zip built output with `bin/zip.sh`. Will be put into `zipped/`. This file can be uploaded to [Ankiweb](https://ankiweb.net/shared/addons/2.1).

## Develop

Built output will be put into `dist/`. This directory can be linked into your Anki add-on folder,
e.g.

```sh
ln -sf "$(pwd)/dist" ~/Library/Application\ Support/Anki2/addons21/myaddon
```

### Develop with Anki submodule

Alternatively, you can also use the anki submodule for development.

Advantages include:

- Add-on development does not interfere with your personal Anki installation.
- Add-ons do not interfere with each other. Of course you can still install other
  add-ons in this installation, if you want to check compatibilities.
- It's easy to tear down the Anki installation, if your add-on messed up the
  db or the settings.
- You can prepare PRs along with developing your add-on, e.g. new hooks.

Disadvantages include:

- You need to to be able to compile/run Anki from source. This requires installing
  some dependencies - please see the docs linked in the `anki/` section below before
  proceeding.

If you decide to use the anki submodule, you can run it with `tools/run.sh` or
`tools/dev.sh`, which combines `/anki/tools/ts-run` + `/anki/tools/ts-watch` + `yarn run dev`
(Might be fuzzy and make unnecessary compilations).

## Directories

### `dist/`

Contains the compiled output of python and typescript.

### `ts/`

Contains the Typescript and Svelte files which are used for Anki webviews.

### `anki/`

A submodule pointing to [ankitects/anki](https://github.com/ankitects/anki).

This can be used for [running the add-on](#develop-with-anki-submodule) or for (very) limited typechecking/IDE support, as this area
is still a work in progress. To set up:

```sh
cd anki && git submodule update
```

Read the [anki/docs/development.md](https://github.com/ankitects/anki/blob/main/docs/development.md) file, and ensure
you have the necessary dependencies (particularly Bazel).
Then build the ts portions of Anki, which will take some time:

```sh
bazel build ts/...
```

If the build completes successfully, you can then open the ../ts folder with VSCode.

Only a few explicit types can be imported at the moment. For example, this line
imports an object at runtime, and is not typed, and will show an error in the
editor (but will build):

```typescript
import * as NoteEditor from "anki/NoteEditor";
```

This line imports a type however:

```typescript
import type { NoteEditorAPI } from "@anki/editor/NoteEditor.svelte";
```

You can then tell the editor that a variable is that type, to be able to get code completion
on it:

```typescript
NoteEditor.lifecycle.onMount(({ toolbar }: NoteEditorAPI): void => {
  toolbar.inlineButtons.append({ component: StrikeThrough }, 2);
});
```

Typing "toolbar." will show the various available toolbar categories.

### `ankidata/`

This directory is only relevant if you [decide to develop with the Anki submodule](#develop-with-anki-submodule).
When invoking Anki through `tools/run`, it will be started with `$ANKI_BASE` pointing to this directory.
This means that all data related to profiles, collections, and decks will be saved here.

### `ankidata/addons21/dist`

A symlink pointing to `dist/`.
