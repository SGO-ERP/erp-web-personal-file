/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HrVacancyCandidateRead } from './HrVacancyCandidateRead';
import type { HrVacancyRequirementsRead } from './HrVacancyRequirementsRead';
import type { schemas__staff_unit__StaffUnitRead } from './schemas__staff_unit__StaffUnitRead';

export type schemas__hr_vacancy__HrVacancyRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    staff_unit_id?: string;
    is_active?: boolean;
    archive_staff_unit_id?: string;
    hr_vacancy_requirements?: Array<HrVacancyRequirementsRead>;
    staff_unit?: schemas__staff_unit__StaffUnitRead;
    archive_staff_unit?: schemas__staff_unit__StaffUnitRead;
    candidates?: Array<HrVacancyCandidateRead>;
    is_responded?: boolean;
};
