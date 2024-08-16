/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceStaffFunctionTypeCreate } from '../models/ServiceStaffFunctionTypeCreate';
import type { ServiceStaffFunctionTypeRead } from '../models/ServiceStaffFunctionTypeRead';
import type { ServiceStaffFunctionTypeUpdate } from '../models/ServiceStaffFunctionTypeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServiceStaffFunctionTypeService {
    /**
     * Get all ServiceStaffFunctionType
     * Get all ServiceStaffFunctionType
     *
     * - **skip**: int - The number of ServiceStaffFunctionType
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ServiceStaffFunctionType
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ServiceStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ServiceStaffFunctionTypeGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ServiceStaffFunctionTypeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service_staff_function_type',
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
     * Create ServiceStaffFunctionType
     * Create ServiceStaffFunctionType
     *
     * - **name**: required
     * @returns ServiceStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ServiceStaffFunctionTypePost({
        requestBody,
    }: {
        requestBody: ServiceStaffFunctionTypeCreate;
    }): CancelablePromise<ServiceStaffFunctionTypeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service_staff_function_type',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get ServiceStaffFunctionType by id
     * Get ServiceStaffFunctionType by id
     *
     * - **id**: UUID - required
     * @returns ServiceStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ServiceStaffFunctionTypeIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ServiceStaffFunctionTypeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service_staff_function_type/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update ServiceFunction
     * Update ServiceFunction
     *
     * - **id**: UUID - the ID of ServiceStaffFunctionType to update. This is required.
     * - **name**: required.
     * @returns ServiceStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ServiceStaffFunctionTypeIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ServiceStaffFunctionTypeUpdate;
    }): CancelablePromise<ServiceStaffFunctionTypeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/service_staff_function_type/{id}/',
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
     * Delete ServiceStaffFunctionType
     * Delete ServiceStaffFunctionType
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1ServiceStaffFunctionTypeIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/service_staff_function_type/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
