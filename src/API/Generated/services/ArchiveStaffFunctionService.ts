/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllArchiveStaffFunctionsRead } from '../models/AllArchiveStaffFunctionsRead';
import type { ArchiveStaffFunctionRead } from '../models/ArchiveStaffFunctionRead';
import type { NewArchiveStaffFunctionCreate } from '../models/NewArchiveStaffFunctionCreate';
import type { NewArchiveStaffFunctionUpdate } from '../models/NewArchiveStaffFunctionUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ArchiveStaffFunctionService {
    /**
     * Get all StaffFunction
     * Get all StaffFunction
     *
     * - **skip**: int - The number of StaffFunction to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of StaffFunction to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AllArchiveStaffFunctionsRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ArchiveStaffFunctionGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<AllArchiveStaffFunctionsRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_function',
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
     * Create StaffFunction
     * Create StaffFunction
     *
     * - **name**: required
     * - **service_function_type_id**: UUID - required.
     * The id of service function type.
     * - **spend_hours_per_week**: int - optional.
     * @returns ArchiveStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ArchiveStaffFunctionPost({
        requestBody,
    }: {
        requestBody: NewArchiveStaffFunctionCreate;
    }): CancelablePromise<ArchiveStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/archive_staff_function',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get StaffFunction by id
     * Get StaffFunction by id
     *
     * - **id**: UUID - required
     * @returns ArchiveStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ArchiveStaffFunctionIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ArchiveStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_function/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update StaffFunction
     * Update StaffFunction
     *
     * - **name**: required
     * - **service_function_type_id**: UUID - required.
     * The id of service function type.
     * - **spend_hours_per_week**: int - optional.
     * @returns ArchiveStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ArchiveStaffFunctionIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: NewArchiveStaffFunctionUpdate;
    }): CancelablePromise<ArchiveStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/archive_staff_function/{id}/',
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
     * Delete StaffFunction
     * Delete StaffFunction
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1ArchiveStaffFunctionIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/archive_staff_function/{id}/',
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
     * Duplicate StaffFunction
     *
     * - **id**: UUID - required
     * @returns ArchiveStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static duplicateApiV1ArchiveStaffFunctionDuplicateIdPost({
        id,
    }: {
        id: string;
    }): CancelablePromise<ArchiveStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/archive_staff_function/duplicate/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
