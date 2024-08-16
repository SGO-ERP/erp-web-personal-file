/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PolygraphCheckCreate } from '../models/PolygraphCheckCreate';
import type { PolygraphCheckRead } from '../models/PolygraphCheckRead';
import type { PolygraphCheckUpdate } from '../models/PolygraphCheckUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PolygraphCheckService {
    /**
     * Get all Polygraph Check
     * Get all Abroad Travel
     *
     * - **skip**: int - The number of abroad travel to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of abroad travel to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns PolygraphCheckRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AdditionalPolygraphCheckGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PolygraphCheckRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/polygraph-check',
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
     * @returns PolygraphCheckRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AdditionalPolygraphCheckPost({
        requestBody,
    }: {
        requestBody: PolygraphCheckCreate;
    }): CancelablePromise<PolygraphCheckRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/additional/polygraph-check',
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
     * @returns PolygraphCheckRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AdditionalPolygraphCheckIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: PolygraphCheckUpdate;
    }): CancelablePromise<PolygraphCheckRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/additional/polygraph-check/{id}/',
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
     * @returns PolygraphCheckRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AdditionalPolygraphCheckIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<PolygraphCheckRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/additional/polygraph-check/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
