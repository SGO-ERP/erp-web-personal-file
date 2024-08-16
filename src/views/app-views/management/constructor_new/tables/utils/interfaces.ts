export interface RowItemType {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    nameKZ: string;
    path: null | string;
    pathKZ: string;
    subject_type: number;
    maintainer_id: string;
    properties: any;
    description: {
        name: string;
        nameKZ: string;
    };
    actions: any;
    is_visible: boolean;
    is_due_date_required: boolean;
    is_initial_comment_required: boolean;
    is_draft: boolean;
    is_active: boolean;
}
