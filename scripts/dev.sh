#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
set -e

"$DIR/scripts/build.sh" &

cd "$DIR"
git submodule init

cd "$DIR/anki"
(
  # Start Anki
  ANKI_BASE="$DIR/ankidata" "$DIR/anki/scripts/ts-run" &
  # Watch for changes in Anki TypeScript code
  "$DIR/anki/scripts/ts-watch" &
  # Watch for changes in Add-on TypeScript code
  yarn --cwd "$DIR/ts" dev
)
