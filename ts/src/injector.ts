import * as NoteEditor from "anki/NoteEditor";

const StyleInjector = {
    addonPackage: "",
    injectCSS: (): void => {
        [...document.getElementsByClassName("rich-text-editable")].forEach(
            (richText) => {
                const root = <ShadowRoot>richText!.shadowRoot;
                const editable = <HTMLElement>root!.querySelector("anki-editable");

                if (!richText.hasAttribute("has-css-injected")) {
                    editable.classList.add(...document.body.classList);

                    const link = document.createElement("link");
                    link.href = `/_addons/${StyleInjector.addonPackage}/user_files/field.css`;
                    link.type = "text/css";
                    link.rel = "stylesheet";

                    root.insertBefore(link, editable);
                    richText.setAttribute("has-css-injected", "");
                }
            },
        );
    },
    updateMid: (mid: string): void => {
        setTimeout(() => {
            document.documentElement.setAttribute("mid", mid);
            [...document.getElementsByClassName("rich-text-editable")].forEach(
                (richText) => {
                    const root = <ShadowRoot>richText!.shadowRoot;
                    const editable = <HTMLElement>root!.querySelector("anki-editable");
                    editable.setAttribute("mid", mid);
                },
            );
        })
    },
};

NoteEditor.lifecycle.onMount((): void => {
    setTimeout(() => StyleInjector.injectCSS());
});

globalThis.StyleInjector = StyleInjector;
