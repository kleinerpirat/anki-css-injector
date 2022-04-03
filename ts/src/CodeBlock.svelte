<script lang="ts">
    import { bracesIcon } from "./assets/icons";
    import * as NoteEditor from "anki/NoteEditor";

    const { focusedInput } = NoteEditor.context.get();
    //@ts-ignore
    const { IconButton } = components;

    $: disabled = $focusedInput?.name !== "rich-text";
</script>

<IconButton
    {disabled}
    tooltip="Code block"
    on:click={() => document.execCommand("formatBlock", false, "pre")}
>
    {@html bracesIcon}
</IconButton>
