/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttendedUserRead } from './AttendedUserRead';
import type { ScheduleMonthRead } from './ScheduleMonthRead';

export type AttendanceRead = {
    attendance_date?: string;
    schedule_id?: string;
    id?: string;
    schedule?: ScheduleMonthRead;
    attended_users?: Array<AttendedUserRead>;
    class_status?: string;
};
