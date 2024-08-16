/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentStaffFunctionStep } from './DocumentStaffFunctionStep';
import type { DocumentStaffFunctionTypeRead } from './DocumentStaffFunctionTypeRead';
import type { JurisdictionRead } from './JurisdictionRead';

export type DocumentStaffFunctionRead = {
    name: string;
    nameKZ?: string | null;
    is_active?: boolean | null;
    hours_per_week?: number | null;
    priority?: number | null;
    role_id?: string | null;
    jurisdiction_id?: string | null;
    id?: string;
    created_at?: string;
    updated_at?: string;
    discriminator?: string | null;
    role?: DocumentStaffFunctionTypeRead;
    hr_document_step?: DocumentStaffFunctionStep;
    jurisdiction?: JurisdictionRead;
};
