export interface EditorAttributes {
    pointVersion: number;
    notetype: string;
    mid: number;
}

export interface EditableAttributes extends EditorAttributes {
    class?: string,
    ord?: number;
    field?: string;
}
