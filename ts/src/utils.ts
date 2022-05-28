import { EditableAttributes, EditorAttributes } from "./types";

export function setAttributes(
    el: HTMLElement,
    attrs: EditorAttributes | EditableAttributes,
) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

export function injectStylesheet(root: ShadowRoot, editable: HTMLElement, url: string) {
    const link = document.createElement("link");
    link.title = "CSS Injector Field Styles";
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    root.insertBefore(link, editable);
}
