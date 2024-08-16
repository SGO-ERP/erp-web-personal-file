/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SurveyJurisdictionTypeEnum } from './SurveyJurisdictionTypeEnum';
import type { SurveyStaffPositionEnum } from './SurveyStaffPositionEnum';

export type SurveyJurisdictionRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    jurisdiction_type: SurveyJurisdictionTypeEnum;
    staff_position?: SurveyStaffPositionEnum;
    staff_division_id?: string;
    certain_member_id?: string;
    survey_id?: string;
};
