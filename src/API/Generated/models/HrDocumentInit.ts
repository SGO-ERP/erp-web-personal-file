/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type HrDocumentInit = {
    document_step_users_ids: Record<string, any>;
    hr_document_template_id: string;
    due_date?: string;
    parent_id?: string | null;
    properties?: Record<string, any>;
    initial_comment?: string;
    user_ids?: Array<string>;
};
