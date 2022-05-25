from aqt import mw
from aqt.editor import Editor
from aqt.addcards import AddCards
from anki.notes import Note
from aqt.gui_hooks import (
    editor_did_load_note,
)

addon_package = mw.addonManager.addonFromModule(__name__)

def inject(editor: Editor):
    note = editor.note
    editor.web.eval(f"""StyleInjector.injectCSS('{addon_package}', '{note.note_type()["name"]}', '{note.mid}'); """)


def init_editor():
    editor_did_load_note.append(inject)
