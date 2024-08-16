/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArchiveServiceStaffFunctionRead } from '../models/ArchiveServiceStaffFunctionRead';
import type { NewArchiveServiceStaffFunctionCreate } from '../models/NewArchiveServiceStaffFunctionCreate';
import type { NewArchiveServiceStaffFunctionUpdate } from '../models/NewArchiveServiceStaffFunctionUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ArchiveServiceStaffFunctionService {
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
     * @returns ArchiveServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ArchiveServiceStaffFunctionGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ArchiveServiceStaffFunctionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_service_staff_function',
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
     * @returns ArchiveServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ArchiveServiceStaffFunctionPost({
        requestBody,
    }: {
        requestBody: NewArchiveServiceStaffFunctionCreate;
    }): CancelablePromise<ArchiveServiceStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/archive_service_staff_function',
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
     * @returns ArchiveServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ArchiveServiceStaffFunctionIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ArchiveServiceStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_service_staff_function/{id}/',
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
     * @returns ArchiveServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ArchiveServiceStaffFunctionIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: NewArchiveServiceStaffFunctionUpdate;
    }): CancelablePromise<ArchiveServiceStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/archive_service_staff_function/{id}/',
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
    public static deleteApiV1ArchiveServiceStaffFunctionIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/archive_service_staff_function/{id}/',
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
     * @returns ArchiveServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static duplicateApiV1ArchiveServiceStaffFunctionDuplicateIdPost({
        id,
    }: {
        id: string;
    }): CancelablePromise<ArchiveServiceStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/archive_service_staff_function/duplicate/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
