/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnthropometricDataCreate } from '../models/AnthropometricDataCreate';
import type { AnthropometricDataRead } from '../models/AnthropometricDataRead';
import type { AnthropometricDataUpdate } from '../models/AnthropometricDataUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AnthropometricDataService {
    /**
     * Get all AnthropometricData
     * Get all AnthropometricData
     *
     * - **skip**: int - The number of AnthropometricData
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of AnthropometricData
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AnthropometricDataRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1MedicalAnthropometricDataGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<AnthropometricDataRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/anthropometric_data',
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
     * Create AnthropometricData
     * Create new AnthropometricData
     *
     * - **head_circumference**: int
     * - **shoe_size**: int
     * - **neck_circumference**: int
     * - **shape_size**: int
     * - **bust_size**: int
     * - **profile_id**: str
     * @returns AnthropometricDataRead Successful Response
     * @throws ApiError
     */
    public static createApiV1MedicalAnthropometricDataPost({
        requestBody,
    }: {
        requestBody: AnthropometricDataCreate;
    }): CancelablePromise<AnthropometricDataRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/medical/anthropometric_data',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get AnthropometricData by id
     * Get Anthropometric Data by id
     * - **id**: UUID - required.
     * @returns AnthropometricDataRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1MedicalAnthropometricDataIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<AnthropometricDataRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/anthropometric_data/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update AnthropometricData
     * Update AnthropometricData
     *
     * - **id**: UUID - the ID of AnthropometricData to update. This is required.
     * - **head_circumference**: int
     * - **shoe_size**: int
     * - **neck_circumference**: int
     * - **shape_size**: int
     * - **bust_size**: int
     * - **profile_id**: str
     * @returns AnthropometricDataRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1MedicalAnthropometricDataIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: AnthropometricDataUpdate;
    }): CancelablePromise<AnthropometricDataRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/medical/anthropometric_data/{id}/',
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
     * Delete AnthropometricData
     * Delete AnthropometricData
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1MedicalAnthropometricDataIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/medical/anthropometric_data/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
