/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PositionRead } from './PositionRead';
import type { schemas__staff_division__HrVacancyRead } from './schemas__staff_division__HrVacancyRead';
import type { schemas__staff_division__UserRead } from './schemas__staff_division__UserRead';
import type { schemas__staff_division__UserReplacingRead } from './schemas__staff_division__UserReplacingRead';
import type { StaffFunctionRead } from './StaffFunctionRead';

export type schemas__staff_division__StaffUnitRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    staff_division_id?: string;
    position_id?: string;
    position?: PositionRead;
    users?: Array<schemas__staff_division__UserRead>;
    actual_users?: Array<schemas__staff_division__UserRead>;
    hr_vacancy?: Array<schemas__staff_division__HrVacancyRead>;
    requirements?: Array<Record<string, any>>;
    staff_functions?: Array<StaffFunctionRead>;
    user_replacing?: schemas__staff_division__UserReplacingRead;
    user_replacing_id?: string;
};
