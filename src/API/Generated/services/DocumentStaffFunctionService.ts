/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentStaffFunctionAdd } from '../models/DocumentStaffFunctionAdd';
import type { DocumentStaffFunctionAppendToStaffUnit } from '../models/DocumentStaffFunctionAppendToStaffUnit';
import type { DocumentStaffFunctionConstructorAdd } from '../models/DocumentStaffFunctionConstructorAdd';
import type { DocumentStaffFunctionRead } from '../models/DocumentStaffFunctionRead';
import type { DocumentStaffFunctionUpdate } from '../models/DocumentStaffFunctionUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DocumentStaffFunctionService {
    /**
     * Get all DocumentStaffFunction
     * Get all DocumentStaffFunction
     *
     * - **skip**: int - The number of DocumentStaffFunction
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of DocumentStaffFunction
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns DocumentStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1DocumentStaffFunctionGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<DocumentStaffFunctionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/document_staff_function',
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
     * Create Function
     * @returns DocumentStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static createFunctionApiV1DocumentStaffFunctionPost({
        requestBody,
    }: {
        requestBody: DocumentStaffFunctionAdd;
    }): CancelablePromise<DocumentStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/document_staff_function',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get DocumentStaffFunction by id
     * Get DocumentStaffFunction by id
     *
     * - **id**: UUID - required
     * @returns DocumentStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1DocumentStaffFunctionIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<DocumentStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/document_staff_function/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update DocumentStaffFunction
     * Update DocumentStaffFunction
     * @returns DocumentStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1DocumentStaffFunctionIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: DocumentStaffFunctionUpdate;
    }): CancelablePromise<DocumentStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/document_staff_function/{id}/',
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
     * Delete DocumentStaffFunction
     * Delete DocumentStaffFunction
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1DocumentStaffFunctionIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/document_staff_function/{id}/',
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
     * @returns DocumentStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static duplicateApiV1DocumentStaffFunctionDuplicateIdPost({
        id,
    }: {
        id: string;
    }): CancelablePromise<DocumentStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/document_staff_function/duplicate/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Function For Constructor
     * @returns DocumentStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static createFunctionForConstructorApiV1DocumentStaffFunctionConstructorPost({
        requestBody,
    }: {
        requestBody: DocumentStaffFunctionConstructorAdd;
    }): CancelablePromise<DocumentStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/document_staff_function/constructor/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Staff Units By Id
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getStaffUnitsByIdApiV1DocumentStaffFunctionStaffUnitIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/document_staff_function/staff_unit/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Append To Staff Unit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static appendToStaffUnitApiV1DocumentStaffFunctionAppendToStaffUnitPost({
        requestBody,
    }: {
        requestBody: DocumentStaffFunctionAppendToStaffUnit;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/document_staff_function/append_to_staff_unit/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
