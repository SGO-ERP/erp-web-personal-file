/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SurveyJurisdictionTypeService {
    /**
     * Get all SurveyJurisdictionType
     * Get all SurveyJurisdictionTypeEnum (Опрос проводится в рамках)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllApiV1SurveyJurisdictionTypeGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/survey_jurisdiction_type',
        });
    }
}
