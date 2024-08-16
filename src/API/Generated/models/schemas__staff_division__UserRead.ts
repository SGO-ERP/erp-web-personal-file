/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BadgeRead } from './BadgeRead';
import type { RankRead } from './RankRead';
import type { StatusRead } from './StatusRead';

export type schemas__staff_division__UserRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    badges?: Array<BadgeRead>;
    icon?: string | null;
    address?: string | null;
    cabinet?: string;
    service_phone_number?: string;
    supervised_by?: string;
    is_military?: boolean;
    rank?: RankRead;
    email?: string;
    first_name?: string;
    last_name?: string;
    last_signed_at?: string;
    staff_unit_id?: string;
    call_sign?: string;
    id_number?: string;
    personal_id?: string;
    date_birth?: string;
    iin?: string;
    statuses?: Array<StatusRead>;
    status_till?: string;
};
