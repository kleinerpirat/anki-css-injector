from aqt.editor import Editor
from anki.models import NoteType
from aqt.addcards import AddCards
from aqt.gui_hooks import (
    add_cards_did_init,
    add_cards_did_change_note_type,
)
from .editor import inject

editor : Editor = None

def on_add_cards_did_init(addcards: AddCards):
    global editor
    editor = addcards.editor

def on_add_cards_did_change_note_type(old: NoteType, new: NoteType):
    inject(editor)


def init_addcards():
    add_cards_did_init.append(on_add_cards_did_init)
    add_cards_did_change_note_type.append(on_add_cards_did_change_note_type)
