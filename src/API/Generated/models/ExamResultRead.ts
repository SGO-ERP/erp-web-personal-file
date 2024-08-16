/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExamScheduleRead } from './ExamScheduleRead';
import type { UserShortReadAgeCategory } from './UserShortReadAgeCategory';

export type ExamResultRead = {
    exam_date?: string;
    grade?: number;
    user_id?: string;
    exam_id?: string;
    id?: string;
    user?: UserShortReadAgeCategory;
    exam?: ExamScheduleRead;
    results?: Record<string, any>;
};
