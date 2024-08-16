/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExamResultRead } from './ExamResultRead';
import type { ExamScheduleRead } from './ExamScheduleRead';

export type ExamTabletRead = {
    exams?: Array<ExamScheduleRead>;
    results?: Array<ExamResultRead>;
};
