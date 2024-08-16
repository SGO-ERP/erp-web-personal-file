/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BiographicInfoCreate } from '../models/BiographicInfoCreate';
import type { BiographicInfoRead } from '../models/BiographicInfoRead';
import type { BiographicInfoUpdate } from '../models/BiographicInfoUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BiographicInfoService {
    /**
     * Get all BiographicInfo
     * Get all BiographicInfo
     *
     * - **skip**: int - The number of BiographicInfo
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of BiographicInfo
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns BiographicInfoRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonalBiographicInfoGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<BiographicInfoRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/biographic_info',
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
     * Create BiographicInfo
     * Create new BiographicInfo
     *
     * - **place_birth**: datetime.date -
     * - **gender**: bool
     * - **citizenship**: str
     * - **nationality**: str
     * - **family_status**: str
     * - **address**: str
     * - **profile_id**: str
     * @returns BiographicInfoRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PersonalBiographicInfoPost({
        requestBody,
    }: {
        requestBody: BiographicInfoCreate;
    }): CancelablePromise<BiographicInfoRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/personal/biographic_info',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get BiographicInfo by id
     * Get BiographicInfo by id
     *
     * - **id**: UUID - required.
     * @returns BiographicInfoRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonalBiographicInfoIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<BiographicInfoRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/biographic_info/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update BiographicInfo
     * Update BiographicInfo
     *
     * - **id**: UUID - the ID of BiographicInfo to update. This is required.
     * - **residence_address**: str
     * @returns BiographicInfoRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PersonalBiographicInfoIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: BiographicInfoUpdate;
    }): CancelablePromise<BiographicInfoRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/personal/biographic_info/{id}/',
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
     * Delete BiographicInfo
     * Delete BiographicInfo
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PersonalBiographicInfoIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/personal/biographic_info/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
