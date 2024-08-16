/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OptionRead } from './OptionRead';
import type { QuestionRead } from './QuestionRead';

export type AnswerRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    question_id?: string;
    text?: string;
    user_id?: string;
    encrypted_used_id?: string;
    score?: number;
    question?: QuestionRead;
    options?: Array<OptionRead>;
};
