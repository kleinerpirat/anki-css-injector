<script lang="ts">
    import { strikeThroughIcon } from "./assets/icons";
    import * as NoteEditor from "anki/NoteEditor";

    const {
        IconButton,
        WithState,
        //@ts-ignore
    } = components;

    const { focusedInput } = NoteEditor.context.get();
    const key = "strikeThrough";

    $: disabled = $focusedInput?.name !== "rich-text";
</script>

<WithState
    {key}
    update={() => document.queryCommandState(key)}
    let:state={active}
    let:updateState
>
    <IconButton
        {disabled}
        {active}
        tooltip="Strike-through text"
        on:click={(event) => {
            document.execCommand(key);
            updateState(event);
        }}
    >
        {@html strikeThroughIcon}
    </IconButton>
</WithState>
