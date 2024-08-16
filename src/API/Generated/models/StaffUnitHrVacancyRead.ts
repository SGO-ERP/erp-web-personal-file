/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HrVacancyCandidateRead } from './HrVacancyCandidateRead';
import type { HrVacancyRequirementsRead } from './HrVacancyRequirementsRead';

export type StaffUnitHrVacancyRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    staff_unit_id: string;
    is_active?: boolean;
    hr_vacancy_requirements?: Array<HrVacancyRequirementsRead>;
    candidates?: Array<HrVacancyCandidateRead>;
    is_responded?: boolean;
};
