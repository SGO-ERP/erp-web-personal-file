/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CandidateCategoryService {
    /**
     * Get all CandidateCategory
     * Get all CandidateCategory
     *
     * - **skip**: int - The number of CandidateCategory
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of CandidateCategory
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllApiV1CandidateCategoriesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_categories',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
