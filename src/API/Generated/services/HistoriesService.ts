/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HistoryCreate } from '../models/HistoryCreate';
import type { HistoryRead } from '../models/HistoryRead';
import type { HistoryServiceDetailRead } from '../models/HistoryServiceDetailRead';
import type { HistoryUpdate } from '../models/HistoryUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HistoriesService {
    /**
     * Get all Histories
     * Get all Histories
     *
     * - **skip**: int - The number of equipments to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of equipments to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns HistoryRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1HistoriesGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<HistoryRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/histories',
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
     * Create Equipment
     * Create Equipment
     *
     * - **name**: required
     * - **quantity**: required
     * @returns HistoryRead Successful Response
     * @throws ApiError
     */
    public static createApiV1HistoriesPost({
        requestBody,
    }: {
        requestBody: HistoryCreate;
    }): CancelablePromise<HistoryRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/histories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all History Enums
     * Get all History Enums
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getAllEnumsApiV1HistoriesEnumsGet(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/histories/enums',
        });
    }

    /**
     * Get all Histories by user id
     * Get all Histories by user id
     *
     * - **user_id**: UUID - required
     * - **date_from**: date - format (YYYY-MM). This parameter is optional.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllPersonalApiV1HistoriesPersonalUserIdGet({
        userId,
        dateFrom,
        skip,
        limit = 10,
    }: {
        userId: string;
        dateFrom?: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/histories/personal/{user_id}',
            path: {
                'user_id': userId,
            },
            query: {
                'date_from': dateFrom,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Service and Details by user id
     * Get all Histories by user id
     *
     * - **user_id**: UUID - required
     * @returns HistoryServiceDetailRead Successful Response
     * @throws ApiError
     */
    public static getAllByUserIdApiV1HistoriesUserUserIdGet({
        userId,
    }: {
        userId: string;
    }): CancelablePromise<HistoryServiceDetailRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/histories/user/{user_id}/',
            path: {
                'user_id': userId,
            },
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
     * @returns HistoryRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1HistoriesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<HistoryRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/histories/{id}/',
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
     * @returns HistoryRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1HistoriesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HistoryUpdate;
    }): CancelablePromise<HistoryRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/histories/{id}/',
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
     * Delete History
     * Delete Equipment
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1HistoriesIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/histories/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Histories by type
     * Get all Histories by type
     *
     * - **type**: str - required
     * - **skip**: int - The number of equipments to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of equipments to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllByTypeApiV1HistoriesTypeTypeGet({
        type,
        skip,
        limit = 10,
    }: {
        type: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/histories/type/{type}/',
            path: {
                'type': type,
            },
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
     * Get all Histories by type and user id
     * Get all Histories by type and user id
     *
     * - **type**: str - required
     * - **user_id**: UUID - required
     * - **skip**: int - The number of equipments to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of equipments to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllByTypeAndUserIdApiV1HistoriesAllTypeTypeUserIdGet({
        type,
        userId,
        skip,
        limit = 10,
    }: {
        type: string;
        userId: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/histories/all/type/{type}/{user_id}',
            path: {
                'type': type,
                'user_id': userId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
