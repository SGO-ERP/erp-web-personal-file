/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActivityRead } from './ActivityRead';
import type { PlaceRead } from './PlaceRead';
import type { StaffDivisionReadWithoutStaffUnit } from './StaffDivisionReadWithoutStaffUnit';
import type { UserShortReadStatus } from './UserShortReadStatus';

export type ExamScheduleRead = {
    start_date?: string;
    end_date?: string;
    start_time?: string;
    end_time?: string;
    place_id?: string;
    schedule_id?: string;
    id?: string;
    instructors?: Array<UserShortReadStatus>;
    place?: PlaceRead;
    activity?: ActivityRead;
    class_status?: string;
    staff_divisions?: Array<StaffDivisionReadWithoutStaffUnit>;
    exam_dates: Array<Record<string, string>>;
};
