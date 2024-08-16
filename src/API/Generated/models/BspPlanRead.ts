/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Enum } from './Enum';
import type { ScheduleYearRead } from './ScheduleYearRead';
import type { UserShortReadStatus } from './UserShortReadStatus';

export type BspPlanRead = {
    year?: number;
    creator_id?: string;
    status?: Enum;
    signed_at?: string;
    created_at?: string;
    id?: string;
    creator?: UserShortReadStatus;
    schedule_years?: Array<ScheduleYearRead>;
};
