/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttendanceUserStatus } from './AttendanceUserStatus';

export type AttendanceChangeStatus = {
    attendance_id: string;
    user_status?: Array<AttendanceUserStatus>;
};
