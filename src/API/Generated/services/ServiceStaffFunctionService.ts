/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceStaffFunctionCreate } from '../models/ServiceStaffFunctionCreate';
import type { ServiceStaffFunctionRead } from '../models/ServiceStaffFunctionRead';
import type { ServiceStaffFunctionUpdate } from '../models/ServiceStaffFunctionUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServiceStaffFunctionService {
    /**
     * Get all ServiceStaffFunction
     * Get all ServiceStaffFunction
     *
     * - **skip**: int - The number of ServiceStaffFunction
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ServiceStaffFunction
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ServiceStaffFunctionGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ServiceStaffFunctionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service_staff_function',
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
     * Create ServiceStaffFunction
     * Create ServiceStaffFunction
     *
     * - **name**: required
     * - **service_function_type_id**: UUID - required.
     * The id of service function type.
     * - **spend_hours_per_week**: int - optional.
     * @returns ServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ServiceStaffFunctionPost({
        requestBody,
    }: {
        requestBody: ServiceStaffFunctionCreate;
    }): CancelablePromise<ServiceStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service_staff_function',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get ServiceStaffFunction by id
     * Get ServiceStaffFunction by id
     *
     * - **id**: UUID - required
     * @returns ServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ServiceStaffFunctionIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ServiceStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service_staff_function/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update ServiceStaffFunction
     * Update ServiceStaffFunction
     *
     * - **name**: required
     * - **service_function_type_id**: UUID - required.
     * The id of service function type.
     * - **spend_hours_per_week**: int - optional.
     * @returns ServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ServiceStaffFunctionIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ServiceStaffFunctionUpdate;
    }): CancelablePromise<ServiceStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/service_staff_function/{id}/',
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
     * Delete ServiceStaffFunction
     * Delete ServiceStaffFunction
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1ServiceStaffFunctionIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/service_staff_function/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Duplicate
     * Duplicate ServiceStaffFunction
     *
     * - **id**: UUID - required
     * @returns ServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static duplicateApiV1ServiceStaffFunctionDuplicateIdPost({
        id,
    }: {
        id: string;
    }): CancelablePromise<ServiceStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service_staff_function/duplicate/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
