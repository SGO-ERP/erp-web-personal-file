/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { schemas__user__UserRead } from './schemas__user__UserRead';

export type HrVacancyCandidateRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    user_id?: string;
    hr_vacancy_id?: string;
    user?: schemas__user__UserRead;
};
