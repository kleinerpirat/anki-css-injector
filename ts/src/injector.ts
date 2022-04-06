import { shadowRoots } from "./utils";

const StyleInjector = {
    addonPackage: "",
    roots: <ShadowRoot[]>[],
    
    injectCSS: (): void => {
        StyleInjector.roots.forEach((root) => {
            const editable = root.querySelector("anki-editable") as HTMLElement;

            if (!editable.hasAttribute("has-css-injected")) {
                editable.classList.add(...document.body.classList);

                const link = document.createElement("link");
                link.href = `/_addons/${StyleInjector.addonPackage}/user_files/field.css`;
                link.type = "text/css";
                link.rel = "stylesheet";

                root.insertBefore(link, editable);
                editable.setAttribute("has-css-injected", "");
            }
        });
    },
    updateMid: async (mid: string): Promise<void> => {
        document.documentElement.setAttribute("mid", mid);

        setTimeout(() => {
            StyleInjector.roots.forEach((root) => {
                const editable = root.querySelector("anki-editable") as HTMLElement;
                editable.setAttribute("mid", mid);
            });
        });
    },
};

(async () => {
    StyleInjector.roots = await shadowRoots();
    // timeout required because shadowRoots are not yet populated with editables
    setTimeout(() => StyleInjector.injectCSS());
})();

globalThis.StyleInjector = StyleInjector;
