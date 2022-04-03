<script lang="ts">
    import { paragraphIcon } from "./assets/icons";
    import * as NoteEditor from "anki/NoteEditor";

    const {
        IconButton,
        WithState,
        //@ts-ignore
    } = components;

    function nodeIsElement(node: Node): node is Element {
        return node.nodeType === Node.ELEMENT_NODE;
    }

    const getAnchorParent =
        <T extends HTMLElement>(predicate: (element: Element) => element is T) =>
        (currentField: ShadowRoot): T | null => {
            const selection = currentField.getSelection();

            if (!selection) {
                return null;
            }

            const anchor = selection.anchorNode;

            if (!anchor) {
                return null;
            }

            let anchorParent: T | null = null;
            let element = nodeIsElement(anchor) ? anchor : anchor.parentElement;

            while (element) {
                anchorParent = anchorParent || (predicate(element) ? element : null);
                element = element.parentElement;
            }

            return anchorParent;
        };

    const isParagraph = (element: Element): element is HTMLParamElement =>
        element.tagName === "P";
    const getParagraph = getAnchorParent<HTMLParamElement>(isParagraph);

    function toggleParagraph() {
        const currentField = document.activeElement!;
        const paragraph = getParagraph(currentField.shadowRoot!);

        if (!paragraph) {
            document.execCommand("formatBlock", false, "p");
        } else {
            paragraph.insertAdjacentElement("beforeend", document.createElement("br"));
            paragraph.replaceWith(...paragraph.childNodes);
        }
    }

    function checkForParagraph() {
        const currentField = document.activeElement!;
        return Boolean(getParagraph(currentField.shadowRoot!));
    }

    const key = "paragraph";
    const { focusedInput } = NoteEditor.context.get();

    $: disabled = $focusedInput?.name !== "rich-text";
</script>

<WithState {key} update={checkForParagraph} let:state={active} let:updateState>
    <IconButton
        {disabled}
        {active}
        tooltip="Paragraph"
        on:click={(event) => {
            toggleParagraph();
            updateState(event);
        }}
    >
        {@html paragraphIcon}
    </IconButton>
</WithState>
