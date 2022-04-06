import * as NoteEditor from "anki/NoteEditor";
import type { EditorFieldAPI } from "@anki/editor/EditorField.svelte";
import { tick } from "svelte/internal";

export async function shadowRoots(): Promise<ShadowRoot[]> {
    return new Promise(async (resolve) => {
        NoteEditor.lifecycle.onMount(async () => {
            while (!NoteEditor?.instances[0]?.fields[0]?.element) {
                await tick();
            }
            resolve(
                await Promise.all(
                    NoteEditor.instances[0]?.fields.map(
                        async (field: EditorFieldAPI) => {
                            const element = await field.element;
                            return element.querySelector(".rich-text-editable")
                                ?.shadowRoot;
                        },
                    ),
                ),
            );
        });
    });
}
