import json
from aqt.editor import Editor
from anki.notes import Note
from aqt.gui_hooks import (
    editor_did_load_note,
)
from anki.utils import point_version

def inject(editor: Editor) -> None:
    note = editor.note
    version = point_version()

    attributes = {
        "editor": "svelte" if version >= 50 else "legacy",
        "pointVersion": version,
        "notetype": note.note_type()["name"],
        "mid": note.mid,
    }

    editor.web.eval(f"""StyleInjector.update({{
        fieldNames: {note.keys()},
        attrs: {json.dumps(attributes)}
    }}); """)


def init_editor() -> None:
    editor_did_load_note.append(inject)
