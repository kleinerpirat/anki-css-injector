from aqt import mw

from aqt.gui_hooks import webview_will_set_content
from aqt.editor import Editor

mw.addonManager.setWebExports(__name__, r"(web|icons)/.*\.(js|css|png)")


def load_package(webcontent, context):
    if isinstance(context, Editor):
        addon_package = context.mw.addonManager.addonFromModule(__name__)
        base_path = f"/_addons/{addon_package}/web"

        webcontent.js.append(f"{base_path}/editor.js")
        webcontent.css.append(f"{base_path}/editor.css")


def init_webview():
    webview_will_set_content.append(load_package)
