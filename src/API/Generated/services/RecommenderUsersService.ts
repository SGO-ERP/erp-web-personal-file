/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecommenderUserCreate } from '../models/RecommenderUserCreate';
import type { RecommenderUserRead } from '../models/RecommenderUserRead';
import type { RecommenderUserUpdate } from '../models/RecommenderUserUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RecommenderUsersService {
    /**
     * Get all Recommender Users
     * Get all Recommender Users
     *
     * - **skip**: int - The number of ranks
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ranks
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns RecommenderUserRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1RecommenderUsersGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<RecommenderUserRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/recommender_users',
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
     * Create Recommender User
     * Create Recommender User
     * @returns RecommenderUserRead Successful Response
     * @throws ApiError
     */
    public static createApiV1RecommenderUsersPost({
        requestBody,
    }: {
        requestBody: RecommenderUserCreate;
    }): CancelablePromise<RecommenderUserRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/recommender_users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Recommender User by id
     * Get Recommender User by id
     *
     * - **id**: UUID - required
     * @returns RecommenderUserRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1RecommenderUsersIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<RecommenderUserRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/recommender_users/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Recommender User
     * Update Recommender User
     *
     * - **id**: UUID - the ID of badge to update. This is required.
     * - **name**: required.
     * @returns RecommenderUserRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1RecommenderUsersIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: RecommenderUserUpdate;
    }): CancelablePromise<RecommenderUserRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/recommender_users/{id}/',
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
     * Delete Recommender User
     * Delete Recommender User
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1RecommenderUsersIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/recommender_users/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
