/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivityCreate } from '../models/ActivityCreate';
import type { ActivityRead } from '../models/ActivityRead';
import type { ActivityUpdate } from '../models/ActivityUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ActivityService {
    /**
     * Get all Activity
     * Get all Activity
     *
     * - **skip**: int - The number of Activity
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Activity
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ActivityRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ActivityGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ActivityRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/activity',
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
     * Get Activity by id
     * Get Activity by id
     *
     * - **id**: UUID - required
     * @returns ActivityRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ActivityIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ActivityRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/activity/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Activity
     * Update Activity
     * @returns ActivityRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ActivityIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ActivityUpdate;
    }): CancelablePromise<ActivityRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/activity/{id}/',
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
     * Delete Activity
     * Delete Activity
     * @returns ActivityRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1ActivityIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<ActivityRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/activity/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Activity
     * Create Activity
     * @returns ActivityRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ActivityPost({
        requestBody,
    }: {
        requestBody: ActivityCreate;
    }): CancelablePromise<ActivityRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/activity/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
