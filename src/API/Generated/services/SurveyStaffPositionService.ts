/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SurveyStaffPositionService {
    /**
     * Get all SurveyStaffPosition
     * Get all SurveyStaffPosition (Служебное положение опроса)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllApiV1SurveyStaffPositionGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/survey_staff_position',
        });
    }
}
