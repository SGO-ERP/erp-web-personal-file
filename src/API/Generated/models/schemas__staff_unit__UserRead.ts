/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BadgeRead } from './BadgeRead';
import type { RankRead } from './RankRead';

export type schemas__staff_unit__UserRead = {
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
};
