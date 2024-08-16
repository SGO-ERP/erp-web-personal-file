/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DocumentStaffFunctionAdd = {
    name: string;
    nameKZ?: string | null;
    is_active?: boolean | null;
    hours_per_week: number;
    priority: number;
    role_id: string;
    jurisdiction_id: string;
    hr_document_template_id: string;
    is_direct_supervisor?: boolean | null;
    category?: number | null;
};
