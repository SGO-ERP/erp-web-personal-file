/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BadgeRead } from './BadgeRead';
import type { RankRead } from './RankRead';
import type { UserReplacingArchiveStaffUnitRead } from './UserReplacingArchiveStaffUnitRead';

export type schemas__archive__archive_staff_unit__UserReplacingRead = {
    id?: string;
    badges?: Array<BadgeRead>;
    rank?: RankRead;
    email?: string;
    first_name?: string;
    last_name?: string;
    father_name?: string;
    staff_unit_id?: string;
    call_sign?: string;
    id_number?: string;
    status?: string;
    status_till?: string;
    icon?: string;
    is_military?: boolean;
    staff_unit?: UserReplacingArchiveStaffUnitRead;
};
