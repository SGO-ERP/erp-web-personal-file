/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { schemas__archive__archive_staff_unit__StaffUnitRequirements } from './schemas__archive__archive_staff_unit__StaffUnitRequirements';

export type NewArchiveStaffUnitUpdate = {
    position_id: string;
    staff_division_id: string;
    user_id?: string | null;
    actual_user_id?: string | null;
    user_replacing_id?: string | null;
    requirements?: Array<schemas__archive__archive_staff_unit__StaffUnitRequirements>;
    curator_of_id?: string | null;
};
