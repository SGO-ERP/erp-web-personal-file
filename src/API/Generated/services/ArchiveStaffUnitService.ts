/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArchiveDocumentStaffFunctionRead } from '../models/ArchiveDocumentStaffFunctionRead';
import type { ArchiveServiceStaffFunctionRead } from '../models/ArchiveServiceStaffFunctionRead';
import type { ArchiveStaffUnitFunctions } from '../models/ArchiveStaffUnitFunctions';
import type { ArchiveStaffUnitRead } from '../models/ArchiveStaffUnitRead';
import type { ArchiveStaffUnitUpdateDispose } from '../models/ArchiveStaffUnitUpdateDispose';
import type { NewArchiveStaffUnitCreate } from '../models/NewArchiveStaffUnitCreate';
import type { NewArchiveStaffUnitUpdate } from '../models/NewArchiveStaffUnitUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ArchiveStaffUnitService {
    /**
     * Get all Staff Units
     * Get all Staff Units
     *
     * - **skip**: int - The number of staff units to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of staff units to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns ArchiveStaffUnitRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ArchiveStaffUnitGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ArchiveStaffUnitRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_unit',
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
     * Create Staff Unit
     * Create Staff Unit
     *
     * - **name**: required
     * - **max_rank_id**: UUID - required and should exist in the database
     * - **description**: a long description. This parameter is optional.
     * @returns ArchiveStaffUnitRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ArchiveStaffUnitPost({
        requestBody,
    }: {
        requestBody: NewArchiveStaffUnitCreate;
    }): CancelablePromise<ArchiveStaffUnitRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/archive_staff_unit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Staff Unit by id
     * Get Staff Unit by id
     *
     * - **id** - UUID - required
     * @returns ArchiveStaffUnitRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ArchiveStaffUnitIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ArchiveStaffUnitRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_unit/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Staff Unit
     * Update Staff Unit
     *
     * - **id**: UUID - required
     * - **name**: required
     * - **max_rank_id**: UUID - required and should exist in the database
     * - **description**: a long description. This parameter is optional.
     * @returns ArchiveStaffUnitRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ArchiveStaffUnitIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: NewArchiveStaffUnitUpdate;
    }): CancelablePromise<ArchiveStaffUnitRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/archive_staff_unit/{id}/',
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
     * Delete Staff Unit
     * Delete Staff Unit
     *
     * - **id** - UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1ArchiveStaffUnitIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/archive_staff_unit/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Dispose all Staff Units by ids
     * Update Archive Staff Unit
     *
     * - **staff_unit_ids**: List of the UUIDs - required
     * - **staff_list_id**: UUID - required
     * @returns ArchiveStaffUnitRead Successful Response
     * @throws ApiError
     */
    public static sendToDispositionApiV1ArchiveStaffUnitDispositionAllPut({
        requestBody,
    }: {
        requestBody: ArchiveStaffUnitUpdateDispose;
    }): CancelablePromise<Array<ArchiveStaffUnitRead>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/archive_staff_unit/disposition/all/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Staff Unit by id
     * Get Staff Unit by user
     *
     * - **id** - UUID - required
     * @returns ArchiveStaffUnitRead Successful Response
     * @throws ApiError
     */
    public static getByUserIdApiV1ArchiveStaffUnituserUserIdGet({
        userId,
    }: {
        userId: string;
    }): CancelablePromise<ArchiveStaffUnitRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_unituser/{user_id}/',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get ServiceStaffFunctions by StaffUnit id
     * Get ServiceStaffFunctions by StaffUnit id
     *
     * - **id** - UUID - required
     * @returns ArchiveServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getServiceStaffFunctionsApiV1ArchiveStaffUnitGetServiceStaffFunctionsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<ArchiveServiceStaffFunctionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_unit/get-service-staff-functions/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Add ServiceStaffFunction
     * Add ServiceStaffFunction to StaffUnit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addServiceStaffFunctionApiV1ArchiveStaffUnitAddServiceStaffFunctionPost({
        requestBody,
    }: {
        requestBody: ArchiveStaffUnitFunctions;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/archive_staff_unit/add-service-staff-function',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Remove ServiceStaffFunction
     * Remove ServiceStaffFunction from StaffUnit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static removeServiceStaffFunctionApiV1ArchiveStaffUnitRemoveServiceStaffFunctionPost({
        requestBody,
    }: {
        requestBody: ArchiveStaffUnitFunctions;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/archive_staff_unit/remove-service-staff-function',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get DocumentStaffFunctions by StaffUnit id
     * Get DocumentStaffFunctions by StaffUnit id
     *
     * - **id** - UUID - required
     * @returns ArchiveDocumentStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getDocumentStaffFunctionsApiV1ArchiveStaffUnitGetDocumentStaffFunctionsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<ArchiveDocumentStaffFunctionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_unit/get-document-staff-functions/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Add DocumentStaffFunction
     * Add DocumentStaffFunction to StaffUnit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addDocumentStaffFunctionApiV1ArchiveStaffUnitAddDocumentStaffFunctionPost({
        requestBody,
    }: {
        requestBody: ArchiveStaffUnitFunctions;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/archive_staff_unit/add-document-staff-function',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Remove DocumentStaffFunction
     * Remove DocumentStaffFunction from StaffUnit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static removeDocumentStaffFunctionApiV1ArchiveStaffUnitRemoveDocumentStaffFunctionPost({
        requestBody,
    }: {
        requestBody: ArchiveStaffUnitFunctions;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/archive_staff_unit/remove-document-staff-function',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
