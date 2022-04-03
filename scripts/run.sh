#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
set -e

"$DIR/scripts/build.sh"

cd "$DIR";
git submodule init

cd "$DIR/anki";
ANKI_BASE="$DIR/ankidata" "$DIR/anki/scripts/ts-run"
