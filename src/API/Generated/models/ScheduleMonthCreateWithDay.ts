/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ScheduleDayCreateWithString } from './ScheduleDayCreateWithString';

export type ScheduleMonthCreateWithDay = {
    start_date: string;
    end_date: string;
    place_id: string;
    schedule_id: string;
    days: Array<ScheduleDayCreateWithString>;
    instructor_ids?: Array<string>;
};
