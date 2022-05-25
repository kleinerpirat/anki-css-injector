import { iterateAnkiEditables } from "./utils";

const StyleInjector = {
    initialized: false,
    addonPackage: "",
    init: async (addonPackage: string): Promise<void> => {
        if (addonPackage) StyleInjector.addonPackage = addonPackage;
        StyleInjector.initialized = true;
        await StyleInjector.injectCSS();
    },
    injectCSS: async (): Promise<void> => {
        let ord = 1;
        for await (const editable of iterateAnkiEditables()) {
            const root = editable.getRootNode() as ShadowRoot;
            editable.classList.add(...document.body.classList);
            editable.setAttribute("ord", (ord++).toString());
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
        }
    },
    refresh: async (notetype: string, mid: string): Promise<void> => {
        if (!StyleInjector.initialized) await StyleInjector.init("");
        else await StyleInjector.injectCSS();

        document.documentElement.setAttribute("notetype", notetype);
        document.documentElement.setAttribute("mid", mid);

        for await (const editable of iterateAnkiEditables()) {
            editable.setAttribute("notetype", notetype);
            editable.setAttribute("mid", mid);
        }
    },
};

globalThis.StyleInjector = StyleInjector;
