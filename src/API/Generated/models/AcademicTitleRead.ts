/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicTitleDegreeRead } from './AcademicTitleDegreeRead';
import type { SpecialtyRead } from './SpecialtyRead';

export type AcademicTitleRead = {
    profile_id?: string;
    degree_id?: string;
    specialty_id?: string;
    document_number: string;
    document_link?: string;
    assignment_date?: string;
    id?: string;
    degree?: AcademicTitleDegreeRead;
    specialty?: SpecialtyRead;
};
