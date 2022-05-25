import { iterateAnkiEditables } from "./utils";

const StyleInjector = {
    injectCSS: async (addonPackage: string, notetype: string, mid: string): Promise<void> => {
        document.documentElement.setAttribute("notetype", notetype);
        document.documentElement.setAttribute("mid", mid);

        let ord = 1;
        for await (const editable of iterateAnkiEditables()) {
            const root = editable.getRootNode() as ShadowRoot;
            editable.classList.add(...document.body.classList);
            editable.setAttribute("notetype", notetype);
            editable.setAttribute("mid", mid);
            editable.setAttribute("ord", (ord++).toString());
            editable.setAttribute(
                "field",
                root.host.closest(".editor-field")?.querySelector(".label-name")
                    ?.innerHTML || "",
            );

            if (!editable.hasAttribute("has-css-injected")) {
                const link = document.createElement("link");
                link.href = `/_addons/${addonPackage}/user_files/field.css`;
                link.type = "text/css";
                link.rel = "stylesheet";
                root.insertBefore(link, editable);
                editable.setAttribute("has-css-injected", "");
            }
        }
    },
};

globalThis.StyleInjector = StyleInjector;
