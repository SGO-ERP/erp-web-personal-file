/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PositionCreate } from '../models/PositionCreate';
import type { PositionRead } from '../models/PositionRead';
import type { PositionUpdate } from '../models/PositionUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PositionsService {
    /**
     * Get all Positions
     * Get all Positions
     *
     * - **skip**: int - The number of Positions
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Positions
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns PositionRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PositionsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PositionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/positions',
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
     * Create Position
     * Create Position
     *
     * - **name**: required
     * @returns PositionRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PositionsPost({
        requestBody,
    }: {
        requestBody: PositionCreate;
    }): CancelablePromise<PositionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/positions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Position by id
     * Get Position by id
     *
     * - **id**: UUID - required
     * @returns PositionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PositionsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<PositionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/positions/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Position
     * Update Position
     *
     * - **id**: UUID - the ID of badge to update. This is required.
     * - **name**: required.
     * @returns PositionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PositionsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: PositionUpdate;
    }): CancelablePromise<PositionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/positions/{id}/',
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
     * Delete Position
     * Delete position
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PositionsIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/positions/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Category Codes
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCategoryCodesApiV1PositionsCategoryCodesGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/positions/category_codes',
        });
    }
}
