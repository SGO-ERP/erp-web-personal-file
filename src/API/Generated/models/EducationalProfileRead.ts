/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicDegreeRead } from './AcademicDegreeRead';
import type { AcademicTitleRead } from './AcademicTitleRead';
import type { CourseRead } from './CourseRead';
import type { EducationRead } from './EducationRead';
import type { LanguageProficiencyRead } from './LanguageProficiencyRead';

export type EducationalProfileRead = {
    profile_id?: string;
    id?: string;
    academic_degree?: Array<AcademicDegreeRead>;
    academic_title?: Array<AcademicTitleRead>;
    education?: Array<EducationRead>;
    course?: Array<CourseRead>;
    language_proficiency?: Array<LanguageProficiencyRead>;
};
