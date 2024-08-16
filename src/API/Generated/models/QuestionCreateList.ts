/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionTypeEnum } from './QuestionTypeEnum';
import type { schemas__survey__question__OptionCreate } from './schemas__survey__question__OptionCreate';

export type QuestionCreateList = {
    text: string;
    textKZ?: string | null;
    is_required?: boolean;
    question_type: QuestionTypeEnum;
    survey_id?: string;
    score?: number;
    options?: Array<schemas__survey__question__OptionCreate>;
};
