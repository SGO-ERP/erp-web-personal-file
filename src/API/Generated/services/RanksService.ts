/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RankCreate } from '../models/RankCreate';
import type { RankRead } from '../models/RankRead';
import type { RankUpdate } from '../models/RankUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RanksService {
    /**
     * Get all Ranks
     * Get all Ranks
     *
     * - **skip**: int - The number of ranks
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ranks
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns RankRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1RanksGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<RankRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/ranks',
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
     * Create Rank
     * Create Rank
     *
     * - **name**: required
     * @returns RankRead Successful Response
     * @throws ApiError
     */
    public static createApiV1RanksPost({
        requestBody,
    }: {
        requestBody: RankCreate;
    }): CancelablePromise<RankRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ranks',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Rank by id
     * Get Rank by id
     *
     * - **id**: UUID - required
     * @returns RankRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1RanksIdGet({ id }: { id: string }): CancelablePromise<RankRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/ranks/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Rank
     * Update Rank
     *
     * - **id**: UUID - the ID of badge to update. This is required.
     * - **name**: required.
     * @returns RankRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1RanksIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: RankUpdate;
    }): CancelablePromise<RankRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/ranks/{id}/',
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
     * Delete Rank
     * Delete Rank
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1RanksIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/ranks/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
