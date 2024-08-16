/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActivityRead } from './ActivityRead';
import type { PlaceRead } from './PlaceRead';
import type { ScheduleDayRead } from './ScheduleDayRead';
import type { schemas__bsp__schedule_month__MonthRead } from './schemas__bsp__schedule_month__MonthRead';
import type { StaffDivisionReadWithoutStaffUnit } from './StaffDivisionReadWithoutStaffUnit';
import type { UserShortReadStatus } from './UserShortReadStatus';

export type ScheduleMonthRead = {
    start_date: string;
    end_date: string;
    place_id: string;
    schedule_id: string;
    id?: string;
    instructors?: Array<UserShortReadStatus>;
    place?: PlaceRead;
    days?: Array<ScheduleDayRead>;
    activity?: ActivityRead;
    staff_divisions?: Array<StaffDivisionReadWithoutStaffUnit>;
    activity_months?: Array<schemas__bsp__schedule_month__MonthRead>;
    nearest_date?: string;
};
