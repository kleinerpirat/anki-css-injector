import json
from aqt import mw
from aqt.editor import Editor
from aqt.addcards import AddCards
from anki.notes import Note
from aqt.gui_hooks import (
    editor_did_load_note,
)
from .utils import get_point_version

addon_package = mw.addonManager.addonFromModule(__name__)

def inject(editor: Editor) -> None:
    note = editor.note
    point_version = get_point_version()

    args = {
        "editor": "svelte" if point_version >= 50 else "legacy",
        "pointVersion": point_version,
        "notetype": note.note_type()["name"],
        "mid": note.mid,
    }

    editor.web.eval(f"""StyleInjector.update("{addon_package}", {json.dumps(args)}); """)


def init_editor() -> None:
    editor_did_load_note.append(inject)
