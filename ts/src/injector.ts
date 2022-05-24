import { iterateAnkiEditables } from "./utils";

const StyleInjector = {
    editables: <HTMLElement[]>[],
    initialized: false,
    addonPackage: "",
    init: async (addonPackage: string): Promise<void> => {
        if (addonPackage) StyleInjector.addonPackage = addonPackage;

        /* Thanks to Hikaru Yoshiga for kindly providing this generator! */
        for await (const editable of iterateAnkiEditables()) {
            StyleInjector.editables.push(editable);
        }

        await StyleInjector.injectCSS();
        StyleInjector.initialized = true;
    },
    injectCSS: async (): Promise<void> => {
        StyleInjector.editables.forEach((editable, i) => {
            const root = editable.getRootNode() as ShadowRoot;
            editable.classList.add(...document.body.classList);
            editable.setAttribute("ord", (i + 1).toString());
            editable.setAttribute(
                "field",
                root.host.closest(".editor-field")?.querySelector(".label-name")
                    ?.innerHTML || "",
            );

            if (!editable.hasAttribute("has-css-injected")) {
                const link = document.createElement("link");
                link.href = `/_addons/${StyleInjector.addonPackage}/user_files/field.css`;
                link.type = "text/css";
                link.rel = "stylesheet";
                root.insertBefore(link, editable);
                editable.setAttribute("has-css-injected", "");
            }
        });
    },
    refresh: async (notetype: string, mid: string): Promise<void> => {
        if (!StyleInjector.initialized) await StyleInjector.init("");
        else await StyleInjector.injectCSS();

        document.documentElement.setAttribute("notetype", notetype);
        document.documentElement.setAttribute("mid", mid);

        StyleInjector.editables.forEach((editable) => {
            editable.setAttribute("notetype", notetype);
            editable.setAttribute("mid", mid);
        });
    },
};

globalThis.StyleInjector = StyleInjector;
