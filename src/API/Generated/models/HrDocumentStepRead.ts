/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentStaffFunctionRead } from './DocumentStaffFunctionRead';
import type { JurisdictionRead } from './JurisdictionRead';

export type HrDocumentStepRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    hr_document_template_id?: string;
    staff_function_id?: string;
    is_direct_supervisor?: boolean;
    category?: number;
    staff_function?: DocumentStaffFunctionRead;
    jurisdiction_id?: string;
    jurisdiction?: JurisdictionRead;
};
