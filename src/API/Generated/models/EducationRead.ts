/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InstitutionDegreeTypeRead } from './InstitutionDegreeTypeRead';
import type { InstitutionRead } from './InstitutionRead';
import type { SpecialtyRead } from './SpecialtyRead';

export type EducationRead = {
    profile_id?: string;
    institution_id?: string;
    degree_id?: string;
    start_date?: string;
    end_date?: string;
    document_link?: string;
    school_type?: string
    specialty_id?: string;
    type_of_top?: string;
    document_number?: string;
    date_of_issue?: string;
    id?: string;
    specialty?: SpecialtyRead;
    institution?: InstitutionRead;
    degree?: InstitutionDegreeTypeRead;
};
