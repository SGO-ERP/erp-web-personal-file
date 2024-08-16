/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ViolationCreate } from '../models/ViolationCreate';
import type { ViolationRead } from '../models/ViolationRead';
import type { ViolationUpdate } from '../models/ViolationUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ViolationService {
    /**
     * Get all Polygraph Check
     * Get all Abroad Travel
     *
     * - **skip**: int - The number of abroad travel to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of abroad travel to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ViolationRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AdditionalViolationGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ViolationRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/violation',
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
     * Create
     * Create new abroad travel
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns ViolationRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AdditionalViolationPost({
        requestBody,
    }: {
        requestBody: ViolationCreate;
    }): CancelablePromise<ViolationRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/additional/violation',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Abroad Travel by id
     * Update abroad travel by id
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns ViolationRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AdditionalViolationIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ViolationUpdate;
    }): CancelablePromise<ViolationRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/additional/violation/{id}/',
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
     * Delete Abroad Travel by id
     * Delete abroad travel by id
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns ViolationRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AdditionalViolationIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<ViolationRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/additional/violation/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
