/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArchiveStaffFunctionRead } from './ArchiveStaffFunctionRead';
import type { PositionRead } from './PositionRead';
import type { schemas__archive__archive_staff_unit__StaffUnitRequirements } from './schemas__archive__archive_staff_unit__StaffUnitRequirements';
import type { schemas__archive__archive_staff_unit__UserRead } from './schemas__archive__archive_staff_unit__UserRead';
import type { StaffUnitHrVacancyRead } from './StaffUnitHrVacancyRead';

export type UserReplacingArchiveStaffUnitRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    position_id?: string;
    staff_division_id?: string;
    user_id?: string | null;
    actual_user_id?: string | null;
    user_replacing_id?: string | null;
    requirements?: Array<schemas__archive__archive_staff_unit__StaffUnitRequirements>;
    staff_functions?: Array<ArchiveStaffFunctionRead>;
    position?: PositionRead;
    user?: schemas__archive__archive_staff_unit__UserRead | null;
    actual_user?: schemas__archive__archive_staff_unit__UserRead | null;
    hr_vacancy?: Array<StaffUnitHrVacancyRead>;
};
