/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BadgeCreate } from '../models/BadgeCreate';
import type { BadgeRead } from '../models/BadgeRead';
import type { BadgeTypeRead } from '../models/BadgeTypeRead';
import type { BadgeUpdate } from '../models/BadgeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BadgesService {
    /**
     * Get all Badges
     * Get all Badges
     *
     * - **skip**: int - The number of badges to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of badges to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns BadgeTypeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1BadgesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<BadgeTypeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/badges',
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
     * Create new badge
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns BadgeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1BadgesPost({
        requestBody,
    }: {
        requestBody: BadgeCreate;
    }): CancelablePromise<BadgeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/badges',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Badge by id
     * Get badge by id
     *
     * - **id**: UUID - required.
     * @returns BadgeTypeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1BadgesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<BadgeTypeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/badges/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Badge
     * Update badge
     *
     * - **id**: UUID - the ID of badge to update. This is required.
     * - **name**: required.
     * - **url**: image url. This parameter is required.
     * @returns BadgeTypeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1BadgesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: BadgeUpdate;
    }): CancelablePromise<BadgeTypeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/badges/{id}/',
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
     * Delete Badge
     * Delete badge
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1BadgesIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/badges/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Black Beret
     * Get black beret badge
     * @returns any Successful Response
     * @throws ApiError
     */
    public static blackBeretApiV1BadgesBlackBeretGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/badges/black-beret',
        });
    }
}
