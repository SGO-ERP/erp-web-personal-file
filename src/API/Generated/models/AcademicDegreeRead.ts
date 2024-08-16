/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicDegreeDegreeRead } from './AcademicDegreeDegreeRead';
import type { ScienceRead } from './ScienceRead';
import type { SpecialtyRead } from './SpecialtyRead';

export type AcademicDegreeRead = {
    profile_id?: string;
    degree_id?: string;
    science_id?: string;
    specialty_id?: string;
    document_number?: string;
    document_link?: string;
    assignment_date?: string;
    id?: string;
    specialty?: SpecialtyRead;
    degree?: AcademicDegreeDegreeRead;
    science?: ScienceRead;
};
