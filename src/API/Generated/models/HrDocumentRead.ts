/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HrDocumentStatusRead } from './HrDocumentStatusRead';
import type { HrDocumentStepRead } from './HrDocumentStepRead';
import type { HrDocumentTemplateRead } from './HrDocumentTemplateRead';
import type { schemas__user__UserRead } from './schemas__user__UserRead';

export type HrDocumentRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    hr_document_template_id?: string;
    due_date?: string;
    parent_id?: string | null;
    properties?: Record<string, any>;
    initial_comment?: string;
    document_template?: HrDocumentTemplateRead;
    status_id?: string;
    status?: HrDocumentStatusRead;
    initialized_by_id?: string;
    initialized_by?: schemas__user__UserRead;
    can_cancel?: boolean;
    users?: Array<schemas__user__UserRead>;
    last_step?: HrDocumentStepRead;
    new_value?: Array<any>;
    old_history_id?: string;
    children?: Array<HrDocumentRead>;
};
