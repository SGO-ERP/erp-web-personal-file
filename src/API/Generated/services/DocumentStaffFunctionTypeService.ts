/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentStaffFunctionTypeCreate } from '../models/DocumentStaffFunctionTypeCreate';
import type { DocumentStaffFunctionTypeRead } from '../models/DocumentStaffFunctionTypeRead';
import type { DocumentStaffFunctionTypeUpdate } from '../models/DocumentStaffFunctionTypeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DocumentStaffFunctionTypeService {
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
     * @returns DocumentStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1DocumentFunctionTypeGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<DocumentStaffFunctionTypeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/document_function_type',
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
     * @returns DocumentStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1DocumentFunctionTypePost({
        requestBody,
    }: {
        requestBody: DocumentStaffFunctionTypeCreate;
    }): CancelablePromise<DocumentStaffFunctionTypeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/document_function_type',
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
     * @returns DocumentStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1DocumentFunctionTypeIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<DocumentStaffFunctionTypeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/document_function_type/{id}/',
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
     * @returns DocumentStaffFunctionTypeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1DocumentFunctionTypeIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: DocumentStaffFunctionTypeUpdate;
    }): CancelablePromise<DocumentStaffFunctionTypeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/document_function_type/{id}/',
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
    public static deleteApiV1DocumentFunctionTypeIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/document_function_type/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
