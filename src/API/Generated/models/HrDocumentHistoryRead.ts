/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HrDocumentRead } from './HrDocumentRead';
import type { HrDocumentStepRead } from './HrDocumentStepRead';
import type { schemas__user__UserRead } from './schemas__user__UserRead';

export type HrDocumentHistoryRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    hr_document_step_id?: string;
    signed_by_id?: string;
    assigned_to_id?: string;
    comment?: string;
    is_signed?: boolean;
    hr_document_id?: string;
    signed_at?: string;
    order?: number;
    hr_document_step?: HrDocumentStepRead;
    hr_document?: HrDocumentRead;
    signed_by?: schemas__user__UserRead;
    assigned_to?: schemas__user__UserRead;
};
