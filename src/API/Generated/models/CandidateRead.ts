/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CandidateEssayTypeRead } from './CandidateEssayTypeRead';
import type { CandidateUserRead } from './CandidateUserRead';
import type { StaffUnitCandidateRead } from './StaffUnitCandidateRead';

export type CandidateRead = {
    staff_unit_curator_id?: string;
    staff_unit_id?: string;
    id?: string;
    created_at?: string;
    updated_at?: string;
    status?: string;
    is_physical_passed?: boolean;
    attempt_number?: number;
    debarment_reason?: string;
    progress?: number;
    current_stage?: string;
    essay_id?: string;
    essay?: CandidateEssayTypeRead;
    last_edit_date?: string;
    staff_unit_curator?: StaffUnitCandidateRead;
    staff_unit?: StaffUnitCandidateRead;
    recommended_by?: string;
    recommended_by_user?: CandidateUserRead;
};
