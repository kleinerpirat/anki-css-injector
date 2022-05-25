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
mw.addonManager.setWebExports(__name__, r"user_files/.*\.(css|js|png|jpg|svg)|(web)/.*\.(js)")


def load_packages(webcontent: WebContent, context: Any) -> None:
    if isinstance(context, Editor):
        base_path = f"/_addons/{addon_package}"

        webcontent.js.append(f"{base_path}/web/injector.js")
        webcontent.css.append(f"{base_path}/user_files/editor.css")


def init_webview() -> None:
    webview_will_set_content.append(load_packages)
