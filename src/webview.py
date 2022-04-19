from typing import Any
from aqt import mw
from aqt.webview import AnkiWebView, WebContent
from aqt.editor import Editor
from anki.notes import Note
from aqt.gui_hooks import (
    webview_will_set_content,
    editor_did_init,
    editor_will_load_note
)
addon_package = mw.addonManager.addonFromModule(__name__)
mw.addonManager.setWebExports(__name__, r"user_files/.*\.(css|js)|(web)/.*\.(js)")


def load_packages(webcontent: WebContent, context: Any):
    if isinstance(context, Editor):
        base_path = f"/_addons/{addon_package}"

        webcontent.js.append(f"{base_path}/web/injector.js")
        webcontent.css.append(f"{base_path}/user_files/editor.css")


def init_injector(editor: Editor):
    editor.web.eval(f"StyleInjector.init('{addon_package}'); ")


def update_mid(js: str, note: Note, editor: Editor):
    return js + f"""StyleInjector.updateMid('{note.note_type()["name"]}', '{note.mid}');"""


def init_webview():
    webview_will_set_content.append(load_packages)
    editor_did_init.append(init_injector)
    editor_will_load_note.append(update_mid)
