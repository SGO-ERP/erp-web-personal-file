/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SurveyRepeatTypeEnum } from './SurveyRepeatTypeEnum';
import type { SurveyStatusEnum } from './SurveyStatusEnum';

export type SurveyUpdate = {
    name?: string;
    nameKZ?: string | null;
    description?: string;
    start_date?: string;
    end_date?: string;
    is_kz_translate_required?: boolean;
    is_anonymous?: boolean;
    repeat_type?: SurveyRepeatTypeEnum;
    comp_form_for_id?: string;
    status?: SurveyStatusEnum;
};
