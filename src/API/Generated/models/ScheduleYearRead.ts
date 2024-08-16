/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActivityRead } from './ActivityRead';
import type { ExamScheduleRead } from './ExamScheduleRead';
import type { ScheduleMonthRead } from './ScheduleMonthRead';
import type { schemas__bsp__schedule_year__MonthRead } from './schemas__bsp__schedule_year__MonthRead';
import type { StaffDivisionReadWithoutStaffUnit } from './StaffDivisionReadWithoutStaffUnit';
import type { UserShortReadStatus } from './UserShortReadStatus';

export type ScheduleYearRead = {
    is_exam_required?: boolean;
    retry_count?: number;
    plan_id?: string;
    activity_id?: string;
    id?: string;
    created_at?: string;
    staff_divisions?: Array<StaffDivisionReadWithoutStaffUnit>;
    users?: Array<UserShortReadStatus>;
    activity?: ActivityRead;
    activity_months?: Array<schemas__bsp__schedule_year__MonthRead>;
    exam_months?: Array<schemas__bsp__schedule_year__MonthRead>;
    months?: Array<ScheduleMonthRead>;
    exams?: Array<ExamScheduleRead>;
};
