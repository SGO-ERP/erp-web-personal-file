/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionRead } from './QuestionRead';
import type { SurveyJurisdictionRead } from './SurveyJurisdictionRead';
import type { SurveyRepeatTypeEnum } from './SurveyRepeatTypeEnum';
import type { SurveyStatusEnum } from './SurveyStatusEnum';
import type { SurveyTypeEnum } from './SurveyTypeEnum';
import type { UserShortRead } from './UserShortRead';

export type SurveyRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    nameKZ?: string | null;
    description?: string;
    start_date?: string;
    end_date?: string;
    is_kz_translate_required?: boolean;
    is_anonymous?: boolean;
    repeat_type?: SurveyRepeatTypeEnum;
    comp_form_for_id?: string;
    status?: SurveyStatusEnum;
    questions?: Array<QuestionRead>;
    type?: SurveyTypeEnum;
    jurisdictions?: Array<SurveyJurisdictionRead>;
    comp_form_for?: UserShortRead;
};
