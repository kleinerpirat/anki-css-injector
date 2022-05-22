from aqt import mw
from aqt.editor import Editor
from aqt.addcards import AddCards
from anki.notes import Note
from aqt.gui_hooks import (
    editor_did_init,
    editor_did_load_note,
)

addon_package = mw.addonManager.addonFromModule(__name__)

def init_injector(editor: Editor):
    editor.web.eval(f"StyleInjector.init('{addon_package}'); ")


def refresh(editor: Editor):
    note = editor.note
    editor.web.eval(f"""StyleInjector.refresh('{note.note_type()["name"]}', '{note.mid}'); """)


def init_editor():
    editor_did_init.append(init_injector)
    editor_did_load_note.append(refresh)
