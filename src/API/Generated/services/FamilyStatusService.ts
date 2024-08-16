/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FamilyStatusRead } from '../models/FamilyStatusRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FamilyStatusService {
    /**
     * Get all FamilyStatus
     * Get all FamilyStatus
     *
     * - **skip**: int - The number of FamilyStatus
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of FamilyStatus
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns FamilyStatusRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonalFamilyStatusGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<FamilyStatusRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/family_status',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get FamilyStatus by id
     * Get FamilyStatus by id
     *
     * - **id**: UUID - required.
     * @returns FamilyStatusRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonalFamilyStatusIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<FamilyStatusRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/family_status/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Profile By Id
     * @returns FamilyStatusRead Successful Response
     * @throws ApiError
     */
    public static getProfileByIdApiV1PersonalFamilyStatusUserUserIdGet({
        userId,
    }: {
        userId: string;
    }): CancelablePromise<FamilyStatusRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/family_status/user/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
