/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RankRead } from './RankRead';

export type UserShortReadAgeCategory = {
    id?: string;
    first_name?: string;
    last_name?: string;
    father_name?: string;
    icon?: string;
    rank?: RankRead;
    date_birth?: string;
    staff_division?: Record<string, any>;
    age_category?: number;
};
