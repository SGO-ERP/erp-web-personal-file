/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CandidateRead } from './CandidateRead';
import type { CandidateStageTypeRead } from './CandidateStageTypeRead';

export type CandidateStageInfoRead = {
    candidate_id?: string;
    candidate_stage_type_id?: string;
    id?: string;
    access?: boolean;
    status?: string;
    candidate?: CandidateRead;
    is_waits?: boolean;
    candidate_stage_type?: CandidateStageTypeRead;
    date_sign?: string;
    created_at?: string;
    updated_at?: string;
};
