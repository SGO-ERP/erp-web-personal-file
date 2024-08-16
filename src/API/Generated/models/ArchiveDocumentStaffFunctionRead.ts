/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArchiveDocumentStaffFunctionStep } from './ArchiveDocumentStaffFunctionStep';
import type { ArchiveStaffFunctionRead } from './ArchiveStaffFunctionRead';
import type { JurisdictionRead } from './JurisdictionRead';

export type ArchiveDocumentStaffFunctionRead = {
    name?: string;
    nameKZ?: string | null;
    hours_per_week?: number;
    priority?: number;
    role_id?: string;
    jurisdiction_id?: string;
    id?: string;
    discriminator?: string;
    role?: ArchiveStaffFunctionRead;
    jurisdiction?: JurisdictionRead;
    hr_document_step?: ArchiveDocumentStaffFunctionStep;
};
