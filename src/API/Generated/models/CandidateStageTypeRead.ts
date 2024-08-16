/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead } from './schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead';

export type CandidateStageTypeRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    nameKZ?: string | null;
    cand_stage_questions?: Array<schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead>;
};
