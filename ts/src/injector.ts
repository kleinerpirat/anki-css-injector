import { shadowRoots } from "./utils";
import * as NoteEditor from "anki/NoteEditor";
import { tick } from "svelte/internal";

const StyleInjector = {
    initialized: false,
    prevMid: "",
    addonPackage: "",
    roots: <ShadowRoot[]>[],
    init: async (addonPackage: string): Promise<void> => {
        return new Promise((resolve) => {
            if (addonPackage) StyleInjector.addonPackage = addonPackage;
            NoteEditor.lifecycle.onMount(async () => {
                let ticks = 0;
                while (!NoteEditor?.instances[0]?.fields[0]?.element && ticks < 10) {
                    await tick();
                    ticks++;
                }
                await StyleInjector.injectCSS();
                StyleInjector.initialized = true;
                resolve();
            });
        })
    },
    injectCSS: async (): Promise<void> => {
        return new Promise(async (resolve) => {
            StyleInjector.roots = await shadowRoots();
            // timeout required because shadowRoots are not yet populated with editables
            setTimeout(() => {
                StyleInjector.roots.forEach((root, i) => {
                    const editable = root.querySelector("anki-editable") as HTMLElement;
    
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
                resolve();
            });
        })
    },
    refresh: async (notetype: string, mid: string): Promise<void> => {
        if (!StyleInjector.initialized) await StyleInjector.init("");
        else await StyleInjector.injectCSS();

        document.documentElement.setAttribute("notetype", notetype);
        document.documentElement.setAttribute("mid", mid);

        StyleInjector.roots.forEach((root) => {
            const editable = root.querySelector("anki-editable") as HTMLElement;
            editable.setAttribute("notetype", notetype);
            editable.setAttribute("mid", mid);
        });
    },
};

globalThis.StyleInjector = StyleInjector;
