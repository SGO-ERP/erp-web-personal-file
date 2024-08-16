/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MilitaryUnitCreate } from '../models/MilitaryUnitCreate';
import type { MilitaryUnitRead } from '../models/MilitaryUnitRead';
import type { MilitaryUnitUpdate } from '../models/MilitaryUnitUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MilitaryUnitService {
    /**
     * Get all Military Units
     * Get all Military Units
     *
     * - **skip**: int - The number of Military Units
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Military Units
     * to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns MilitaryUnitRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1MilitaryUnitsGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<MilitaryUnitRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/military_units',
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
     * Create Military Unit
     * Create Military Unit
     *
     * **name** - required - str
     * @returns MilitaryUnitRead Successful Response
     * @throws ApiError
     */
    public static createApiV1MilitaryUnitsPost({
        requestBody,
    }: {
        requestBody: MilitaryUnitCreate;
    }): CancelablePromise<MilitaryUnitRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/military_units',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Military Unit by id
     * Get Military Unit by id
     *
     * - **id** - UUID - required
     * @returns MilitaryUnitRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1MilitaryUnitsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<MilitaryUnitRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/military_units/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Military Unit
     * Update Military Unit
     *
     * **name** - required - str
     * @returns MilitaryUnitRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1MilitaryUnitsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: MilitaryUnitUpdate;
    }): CancelablePromise<MilitaryUnitRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/military_units/{id}/',
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
     * Delete Military Unit
     * Delete Military Unit
     *
     * - **id** - UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1MilitaryUnitsIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/military_units/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
