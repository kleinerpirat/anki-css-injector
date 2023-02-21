import { get } from "svelte/store";
import { EditableAttributes } from "./types";
import { setAttributes, injectStylesheet } from "./utils";

import type { EditorFieldAPI } from "@anki/editor/EditorField.svelte";
// @ts-ignore
import * as NoteEditor from "anki/NoteEditor";

const addonPackage = document
    .currentScript!.getAttribute("src")!
    .match(/_addons\/(.+?)\//)![1];

const StyleInjector: Record<string, any> = {
    update: async function ({ fieldNames, attrs }): Promise<void> {
        setAttributes(document.documentElement, { ...attrs });

        if (attrs.pointVersion < 50) {
            [...document.getElementById("fields")!.children].forEach(
                (field: any, i) => {
                    const editable = field.editingArea.editable;
                    inject(editable, { field: fieldNames[i], ord: i + 1, ...attrs });
                },
            );
        } else {
            while (!NoteEditor.instances[0]?.fields?.length) {
                await new Promise(requestAnimationFrame);
            }
            NoteEditor.instances[0].fields.forEach(
                async (field: EditorFieldAPI, i: number) => {
                    const richText = get(field.editingArea.editingInputs)[0];
                    inject(await richText.element, {
                        field: fieldNames[i],
                        ord: i + 1,
                        ...attrs,
                    });
                },
            );
        }
    },
};

function inject(editable: HTMLElement, attrs: EditableAttributes) {
    editable.classList.add(...document.body.classList);
    setAttributes(editable, attrs);

    const root = editable.getRootNode() as ShadowRoot;

    if (!root.querySelector("link[title*='CSS Injector']")) {
        injectStylesheet(
            root,
            editable,
            `/_addons/${addonPackage}/user_files/field.css`,
        );
    }
}

globalThis.StyleInjector = StyleInjector;
