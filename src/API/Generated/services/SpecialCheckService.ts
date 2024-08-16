/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SpecialCheckCreate } from '../models/SpecialCheckCreate';
import type { SpecialCheckRead } from '../models/SpecialCheckRead';
import type { SpecialCheckUpdate } from '../models/SpecialCheckUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SpecialCheckService {
    /**
     * Get all Polygraph Check
     * Get all Abroad Travel
     *
     * - **skip**: int - The number of abroad travel to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of abroad travel to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns SpecialCheckRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AdditionalSpecialCheckGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<SpecialCheckRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/special-check',
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
     * @returns SpecialCheckRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AdditionalSpecialCheckPost({
        requestBody,
    }: {
        requestBody: SpecialCheckCreate;
    }): CancelablePromise<SpecialCheckRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/additional/special-check',
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
     * @returns SpecialCheckRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AdditionalSpecialCheckIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: SpecialCheckUpdate;
    }): CancelablePromise<SpecialCheckRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/additional/special-check/{id}/',
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
     * @returns SpecialCheckRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AdditionalSpecialCheckIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<SpecialCheckRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/additional/special-check/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
