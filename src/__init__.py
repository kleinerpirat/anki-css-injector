from .webview import init_webview
from .editor import init_editor

def init() -> None:
    init_webview()
    init_editor()
