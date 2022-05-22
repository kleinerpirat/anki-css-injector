import * as NoteEditor from "anki/NoteEditor";
import type { EditorFieldAPI } from "@anki/editor/EditorField.svelte";

export async function shadowRoots(): Promise<ShadowRoot[]> {
    return await Promise.all(
        NoteEditor.instances[0]?.fields.map(async (field: EditorFieldAPI) => {
            const element = await field.element;
            return element?.querySelector(".rich-text-editable")?.shadowRoot;
        }),
    );
}
