/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HistoryNameChangeCreate } from '../models/HistoryNameChangeCreate';
import type { HistoryNameChangeRead } from '../models/HistoryNameChangeRead';
import type { HistoryNameChangeUpdate } from '../models/HistoryNameChangeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HistoryNameChangeService {
    /**
     * Get all History Name Changes
     * Get all History Name Changes
     *
     * - **skip**: int - The number of equipments to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of equipments to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns HistoryNameChangeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1HistoryNameChangeGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<HistoryNameChangeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/history/name_change',
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
     * Create History Name Change
     * Create History Name Change
     *
     * - **name**: str - required
     * - **type**: str - required
     * @returns HistoryNameChangeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1HistoryNameChangePost({
        requestBody,
    }: {
        requestBody: HistoryNameChangeCreate;
    }): CancelablePromise<HistoryNameChangeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/history/name_change',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get History by id
     * Get Equipment by id
     *
     * - **id**: UUID - required
     * @returns HistoryNameChangeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1HistoryNameChangeIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<HistoryNameChangeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/history/name_change/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update History
     * Update Equipment
     *
     * - **id**: UUID - the id of equipment to update. This parameter is required
     * - **name**: required
     * - **quantity**: required
     * @returns HistoryNameChangeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1HistoryNameChangeIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HistoryNameChangeUpdate;
    }): CancelablePromise<HistoryNameChangeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/history/name_change/{id}/',
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
     * Delete History Name Change
     * Delete History Name Change
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1HistoryNameChangeIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/history/name_change/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get History Name Changes by user id
     * Get History Name Changes by user id
     *
     * - **user_id**: UUID - required
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getByUserIdApiV1HistoryNameChangeUserUserIdGet({
        userId,
    }: {
        userId: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/history/name_change/user/{user_id}/',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
