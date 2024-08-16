/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AgeGroupService {
    /**
     * Get all AgeGroup
     * Get all AgeGroupEnum
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllApiV1MedicalAgeGroupGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/age_group',
        });
    }
}
