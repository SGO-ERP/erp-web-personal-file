/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { schemas__staff_unit__StaffUnitRequirements } from './schemas__staff_unit__StaffUnitRequirements';

export type StaffUnitCreate = {
    position_id: string;
    staff_division_id?: string | null;
    is_active?: boolean;
    requirements?: Array<schemas__staff_unit__StaffUnitRequirements> | null;
    curator_of_id?: string | null;
};
