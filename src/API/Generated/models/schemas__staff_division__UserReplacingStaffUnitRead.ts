/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PositionRead } from './PositionRead';
import type { schemas__staff_division__HrVacancyRead } from './schemas__staff_division__HrVacancyRead';
import type { schemas__staff_division__UserRead } from './schemas__staff_division__UserRead';

export type schemas__staff_division__UserReplacingStaffUnitRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    position_id?: string;
    staff_division_id?: string;
    is_active?: boolean;
    requirements?: Array<Record<string, any>>;
    position?: PositionRead;
    users?: Array<schemas__staff_division__UserRead>;
    actual_users?: Array<schemas__staff_division__UserRead>;
    hr_vacancy?: Array<schemas__staff_division__HrVacancyRead>;
};
