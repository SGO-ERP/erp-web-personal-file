/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OptionRead } from './OptionRead';
import type { QuestionTypeEnum } from './QuestionTypeEnum';

export type QuestionRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    text: string;
    textKZ?: string | null;
    is_required?: boolean;
    question_type?: QuestionTypeEnum;
    survey_id?: string;
    score?: number;
    options?: Array<OptionRead>;
};
