import * as NoteEditor from "anki/NoteEditor";
import { get } from "svelte/store";
import type { PlainTextInputAPI } from "@anki/editor/plain-text-input";
import type { RichTextInputAPI } from "@anki/editor/rich-text-input";

function isRichTextInputApi(
    input: RichTextInputAPI | PlainTextInputAPI,
): input is RichTextInputAPI {
    return input.name === "rich-text";
}

/**
 * Asynchronous Generator to fetch <anki-editable>
 * (slightly modified to yield index)
 * @author Hikaru Yoshiga <github.com/hikaru-y/>
 */
export default async function* iterateAnkiEditables(): AsyncGenerator<
    [HTMLElement, number]
> {
    while (!NoteEditor.instances[0]?.fields?.length) {
        await new Promise(requestAnimationFrame);
    }
    for (const [i, fieldApi] of NoteEditor.instances[0].fields.entries()) {
        const inputs = get(fieldApi.editingArea.editingInputs) as (
            | PlainTextInputAPI
            | RichTextInputAPI
        )[];
        const richTextInputApi = inputs.find(isRichTextInputApi)!;
        const ankiEditable = await richTextInputApi.element;
        yield [ankiEditable, i];
    }
}
