/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BadgeRead } from './BadgeRead';
import type { RankRead } from './RankRead';
import type { schemas__staff_unit__UserReplacingStaffUnitRead } from './schemas__staff_unit__UserReplacingStaffUnitRead';

export type schemas__staff_unit__UserReplacingRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    badges?: Array<BadgeRead>;
    rank?: RankRead;
    email?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    staff_unit_id?: string;
    call_sign?: string;
    id_number?: string;
    icon?: string | null;
    status?: string;
    status_till?: string;
    staff_unit?: schemas__staff_unit__UserReplacingStaffUnitRead;
};
