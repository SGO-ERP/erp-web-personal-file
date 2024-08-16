/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PositionRead } from './PositionRead';
import type { ShortStaffUnitDivisionRead } from './ShortStaffUnitDivisionRead';

export type ShortUserStaffUnitRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
    staff_division_id?: string;
    staff_division?: ShortStaffUnitDivisionRead;
    position_id?: string;
    position?: PositionRead;
};
