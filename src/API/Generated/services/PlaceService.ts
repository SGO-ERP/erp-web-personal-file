/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaceCreate } from '../models/PlaceCreate';
import type { PlaceRead } from '../models/PlaceRead';
import type { PlaceUpdate } from '../models/PlaceUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PlaceService {
    /**
     * Get all Places
     * Get all Places
     *
     * - **skip**: int - The number of Place
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Place
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns PlaceRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PlaceGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PlaceRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/place',
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
     * Get Place by id
     * Get Place by id
     *
     * - **id**: UUID - required
     * @returns PlaceRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PlaceIdGet({ id }: { id: string }): CancelablePromise<PlaceRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/place/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Place
     * Update Place
     * @returns PlaceRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PlaceIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: PlaceUpdate;
    }): CancelablePromise<PlaceRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/place/{id}/',
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
     * Delete Place
     * Delete Place
     * @returns PlaceRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1PlaceIdDelete({ id }: { id: string }): CancelablePromise<PlaceRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/place/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Place
     * Create Place
     * @returns PlaceRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PlacePost({
        requestBody,
    }: {
        requestBody: PlaceCreate;
    }): CancelablePromise<PlaceRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/place/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
