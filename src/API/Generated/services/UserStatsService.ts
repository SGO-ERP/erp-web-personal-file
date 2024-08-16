/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserStatCreate } from '../models/UserStatCreate';
import type { UserStatRead } from '../models/UserStatRead';
import type { UserStatUpdate } from '../models/UserStatUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserStatsService {
    /**
     * Get all UserStats
     * Get all UserStats
     *
     * - **skip**: int - The number of UserStats
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of UserStats
     * to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns UserStatRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1UserStatsGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<UserStatRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user-stats',
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
     * Create UserStat
     * Create UserStat
     *
     * - **user_id**: UUID - the ID of the user.
     * This parameter is required and should exist in database.
     * - **physical_training**: int - representing the user's
     * physical training score.
     * - **fire_training**: int - representing the user's fire training score.
     * - **attendance**: int - representing the user's attendance score.
     * - **activity**: int - representing the user's activity score.
     * - **opinion_of_colleagues**: int - representing the user's opinion
     * of colleagues score.
     * - **opinion_of_management**: int - representing the user's opinion
     * of management score.
     * @returns UserStatRead Successful Response
     * @throws ApiError
     */
    public static createApiV1UserStatsPost({
        requestBody,
    }: {
        requestBody: UserStatCreate;
    }): CancelablePromise<UserStatRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/user-stats',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get UserStat by id
     * Get UserStat by id
     *
     * - **id**: UUID - required
     * @returns UserStatRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1UserStatsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<UserStatRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user-stats/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update UserStat
     * Update UserStat
     *
     * - **id**: UUID - the ID of the UserStat.
     * This is required.
     * - **user_id**: UUID - the ID of the user.
     * This parameter is required and should exist in database.
     * - **physical_training**: int - representing the user's
     * physical training score.
     * This is required.
     * - **fire_training**: int - representing the user's fire
     * training score.
     * This is required.
     * - **attendance**: int - representing the user's attendance score.
     * This is required.
     * - **activity**: int - representing the user's activity score.
     * This is required.
     * - **opinion_of_colleagues**: int - representing the user's
     * opinion of colleagues score.
     * This is required.
     * - **opinion_of_management**: int - representing the user's
     * opinion of management score.
     * This is required.
     * @returns UserStatRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1UserStatsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: UserStatUpdate;
    }): CancelablePromise<UserStatRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/user-stats/{id}/',
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
     * Delete UserStat
     * Delete UserStat
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1UserStatsIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/user-stats/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
