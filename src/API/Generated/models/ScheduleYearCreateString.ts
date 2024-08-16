/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ScheduleYearCreateString = {
    is_exam_required?: boolean;
    retry_count?: number;
    plan_id?: string;
    activity_id?: string;
    activity_months?: Array<string>;
    exam_months?: Array<string>;
    staff_division_ids: Array<string>;
};
