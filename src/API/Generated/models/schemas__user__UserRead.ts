/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BadgeRead } from './BadgeRead';
import type { RankRead } from './RankRead';
import type { ShortUserStaffUnitRead } from './ShortUserStaffUnitRead';
import type { StatusRead } from './StatusRead';

export type schemas__user__UserRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    father_name?: string;
    staff_unit_id?: string;
    actual_staff_unit_id?: string;
    icon?: string;
    call_sign?: string;
    id_number?: string;
    phone_number?: string;
    address?: string;
    cabinet?: string;
    service_phone_number?: string;
    supervised_by?: string;
    is_military?: boolean;
    personal_id?: string;
    date_birth?: string;
    iin?: string;
    is_active?: boolean;
    description?: string;
    badges?: Array<BadgeRead>;
    staff_unit?: ShortUserStaffUnitRead;
    actual_staff_unit?: ShortUserStaffUnitRead;
    rank?: RankRead;
    last_signed_at?: string;
    status_till?: string;
    statuses?: Array<StatusRead>;
};
