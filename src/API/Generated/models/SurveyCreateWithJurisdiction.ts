/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SurveyJurisdictionBase } from './SurveyJurisdictionBase';
import type { SurveyRepeatTypeEnum } from './SurveyRepeatTypeEnum';
import type { SurveyTypeEnum } from './SurveyTypeEnum';

export type SurveyCreateWithJurisdiction = {
    name: string;
    nameKZ?: string | null;
    description?: string;
    start_date?: string;
    end_date?: string;
    is_kz_translate_required?: boolean;
    is_anonymous?: boolean;
    repeat_type?: SurveyRepeatTypeEnum;
    comp_form_for_id?: string;
    type: SurveyTypeEnum;
    jurisdictions: Array<SurveyJurisdictionBase>;
};
