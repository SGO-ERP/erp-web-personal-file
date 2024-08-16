/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserFinancialInfoCreate } from '../models/UserFinancialInfoCreate';
import type { UserFinancialInfoRead } from '../models/UserFinancialInfoRead';
import type { UserFinancialInfoUpdate } from '../models/UserFinancialInfoUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserFinancialInfoService {
    /**
     * Get all UserFinancialInfo
     * Get all UserFinancialInfo
     *
     * - **skip**: int - The number of UserFinancialInfo
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of UserFinancialInfo
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns UserFinancialInfoRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonalUserFinancialInfoGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<UserFinancialInfoRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/user_financial_info',
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
     * Create UserFinancialInfo
     * Create new UserFinancialInfo
     *
     * - **iban**: str
     * - **housing_payments_iban**: str
     * - **profile_id**: str
     * @returns UserFinancialInfoRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PersonalUserFinancialInfoPost({
        requestBody,
    }: {
        requestBody: UserFinancialInfoCreate;
    }): CancelablePromise<UserFinancialInfoRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/personal/user_financial_info',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get UserFinancialInfo by id
     * Get UserFinancialInfo by id
     *
     * - **id**: UUID - required.
     * @returns UserFinancialInfoRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonalUserFinancialInfoIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<UserFinancialInfoRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/user_financial_info/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update UserFinancialInfo
     * Update UserFinancialInfo
     *
     * - **id**: UUID - the ID of UserFinancialInfo to update. This is required.
     * - **iban**: str
     * - **housing_payments_iban**: str
     * - **profile_id**: str
     * @returns UserFinancialInfoRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PersonalUserFinancialInfoIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: UserFinancialInfoUpdate;
    }): CancelablePromise<UserFinancialInfoRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/personal/user_financial_info/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete UserFinancialInfo
     * Delete UserFinancialInfo
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PersonalUserFinancialInfoIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/personal/user_financial_info/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
