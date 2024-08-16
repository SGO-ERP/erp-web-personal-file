/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { schemas__user_candidates__candidate_stage_answer__CandidateStageQuestionRead } from './schemas__user_candidates__candidate_stage_answer__CandidateStageQuestionRead';

export type CandidateStageAnswerRead = {
    type?: string;
    answer_str?: string;
    answer_bool?: boolean;
    answer?: string;
    document_link?: string;
    document_number?: string;
    candidate_essay_type_id?: string;
    candidate_id: string;
    category_id?: string;
    id?: string;
    is_sport_passed?: boolean;
    created_at?: string;
    updated_at?: string;
    candidate_stage_question_id?: string;
    candidate_stage_question?: schemas__user_candidates__candidate_stage_answer__CandidateStageQuestionRead;
};
