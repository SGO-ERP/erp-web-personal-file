/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActivityDateRead } from './ActivityDateRead';
import type { DayRead } from './DayRead';
import type { schemas__bsp__schedule_day__MonthRead } from './schemas__bsp__schedule_day__MonthRead';

export type ScheduleDayRead = {
    day_id?: string;
    start_time?: string;
    end_time?: string;
    month_id?: string;
    activity_month_id?: string;
    id?: string;
    day?: DayRead;
    activity_dates?: Array<ActivityDateRead>;
    activity_month?: schemas__bsp__schedule_day__MonthRead;
};
