import { shadowRoots } from "./utils";

const StyleInjector = {
    addonPackage: "",
    roots: <ShadowRoot[]>[],
    init: async (addonPackage: string): Promise<void> => {
        StyleInjector.addonPackage = addonPackage;
        StyleInjector.roots = await shadowRoots();
        // timeout required because shadowRoots are not yet populated with editables
        setTimeout(() => StyleInjector.injectCSS());
    },
    injectCSS: (): void => {
        StyleInjector.roots.forEach((root, i) => {
            const editable = root.querySelector("anki-editable") as HTMLElement;

            if (!editable.hasAttribute("has-css-injected")) {
                editable.classList.add(...document.body.classList);
                editable.setAttribute("ord", (i + 1).toString());
                editable.setAttribute(
                    "field",
                    root.host.closest(".editor-field")?.querySelector(".label-name")
                        ?.innerHTML || "",
                );

                const link = document.createElement("link");
                link.href = `/_addons/${StyleInjector.addonPackage}/user_files/field.css`;
                link.type = "text/css";
                link.rel = "stylesheet";

                root.insertBefore(link, editable);
                editable.setAttribute("has-css-injected", "");
            }
        });
    },
    updateMid: async (notetype: string, mid: string): Promise<void> => {
        document.documentElement.setAttribute("notetype", notetype);
        document.documentElement.setAttribute("mid", mid);

        setTimeout(() => {
            StyleInjector.roots.forEach((root) => {
                const editable = root.querySelector("anki-editable") as HTMLElement;
                editable.setAttribute("notetype", notetype);
                editable.setAttribute("mid", mid);
            });
        });
    },
};

globalThis.StyleInjector = StyleInjector;
