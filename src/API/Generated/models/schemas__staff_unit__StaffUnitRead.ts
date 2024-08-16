/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PositionRead } from './PositionRead';
import type { schemas__staff_unit__HrVacancyRead } from './schemas__staff_unit__HrVacancyRead';
import type { schemas__staff_unit__StaffUnitRequirements } from './schemas__staff_unit__StaffUnitRequirements';
import type { schemas__staff_unit__UserRead } from './schemas__staff_unit__UserRead';
import type { schemas__staff_unit__UserReplacingRead } from './schemas__staff_unit__UserReplacingRead';
import type { StaffFunctionRead } from './StaffFunctionRead';
import type { StaffUnitDivisionRead } from './StaffUnitDivisionRead';

export type schemas__staff_unit__StaffUnitRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    position_id?: string;
    staff_division_id?: string;
    is_active?: boolean;
    requirements?: Array<schemas__staff_unit__StaffUnitRequirements> | null;
    staff_division?: StaffUnitDivisionRead;
    staff_functions?: Array<StaffFunctionRead>;
    position?: PositionRead;
    users?: Array<schemas__staff_unit__UserRead>;
    actual_users?: Array<schemas__staff_unit__UserRead>;
    hr_vacancy?: Array<schemas__staff_unit__HrVacancyRead>;
    user_replacing?: schemas__staff_unit__UserReplacingRead | null;
    user_replacing_id?: string | null;
};
