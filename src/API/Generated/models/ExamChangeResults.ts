/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExamUserResult } from './ExamUserResult';

export type ExamChangeResults = {
    exam_id: string;
    users_results?: Array<ExamUserResult>;
};
