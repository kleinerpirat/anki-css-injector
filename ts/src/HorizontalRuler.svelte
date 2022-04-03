<script lang="ts">
    import { hrIcon } from "./assets/icons";
    import * as NoteEditor from "anki/NoteEditor";

    //@ts-ignore
    const { IconButton } = components;
    const { focusedInput } = NoteEditor.context.get();

    $: disabled = $focusedInput?.name !== "rich-text";
</script>

<IconButton
    {disabled}
    tooltip="Horizontal ruler"
    on:click={() => document.execCommand("insertHorizontalRule")}
>
    {@html hrIcon}
</IconButton>
