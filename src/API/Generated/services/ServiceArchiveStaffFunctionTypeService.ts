/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NewServiceArchiveStaffFunctionTypeCreate } from '../models/NewServiceArchiveStaffFunctionTypeCreate';
import type { NewServiceArchiveStaffFunctionTypeUpdate } from '../models/NewServiceArchiveStaffFunctionTypeUpdate';
import type { ServiceArchiveStaffFunctionTypeRead } from '../models/ServiceArchiveStaffFunctionTypeRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServiceArchiveStaffFunctionTypeService {
    /**
     * Get all ArchiveStaffFunction
     * Get all ArchiveStaffFunction
     *
     * - **skip**: int - The number of ArchiveStaffFunction
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ArchiveStaffFunction
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ServiceArchiveStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ServiceArchiveStaffFunctionTypeGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ServiceArchiveStaffFunctionTypeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service_archive_staff_function_type',
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
     * Create ArchiveStaffFunction
     * Create ArchiveStaffFunction
     *
     * - **parent_group_id**: the id of the parent group.
     * This parameter is optional.
     * - **name**: required
     * - **description**: a long description. This parameter is optional.
     * @returns ServiceArchiveStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ServiceArchiveStaffFunctionTypePost({
        requestBody,
    }: {
        requestBody: NewServiceArchiveStaffFunctionTypeCreate;
    }): CancelablePromise<ServiceArchiveStaffFunctionTypeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service_archive_staff_function_type',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get ArchiveStaffFunction by id
     * Get ArchiveStaffFunction by id
     *
     * - **id**: UUID - required
     * @returns ServiceArchiveStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ServiceArchiveStaffFunctionTypeIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ServiceArchiveStaffFunctionTypeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service_archive_staff_function_type/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update ArchiveStaffFunction
     * Update ArchiveStaffFunction
     *
     * - **id**: UUID - id of the ArchiveStaffFunction.
     * - **parent_group_id**: the id of the parent group.
     * This parameter is optional.
     * - **name**: required
     * - **description**: a long description.
     * This parameter is optional.
     * @returns ServiceArchiveStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ServiceArchiveStaffFunctionTypeIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: NewServiceArchiveStaffFunctionTypeUpdate;
    }): CancelablePromise<ServiceArchiveStaffFunctionTypeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/service_archive_staff_function_type/{id}/',
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
     * Delete ArchiveStaffFunction
     * Delete ArchiveStaffFunction
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1ServiceArchiveStaffFunctionTypeIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/service_archive_staff_function_type/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
