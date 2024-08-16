/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArchiveDocumentStaffFunctionRead } from '../models/ArchiveDocumentStaffFunctionRead';
import type { ArchiveDocumentStaffFunctionUpdate } from '../models/ArchiveDocumentStaffFunctionUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ArchiveDocumentStaffFunctionService {
    /**
     * Get all ArchiveDocumentStaffFunction
     * Get all DocumentStaffFunction
     *
     * - **skip**: int - The number of DocumentStaffFunction
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of DocumentStaffFunction
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ArchiveDocumentStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ArchiveDocumentStaffFunctionGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ArchiveDocumentStaffFunctionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_document_staff_function',
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
     * Get ArchiveDocumentStaffFunction by id
     * Get DocumentStaffFunction by id
     *
     * - **id**: UUID - required
     * @returns ArchiveDocumentStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ArchiveDocumentStaffFunctionIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ArchiveDocumentStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_document_staff_function/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update ArchiveDocumentStaffFunction
     * Update DocumentStaffFunction
     * @returns ArchiveDocumentStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ArchiveDocumentStaffFunctionIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ArchiveDocumentStaffFunctionUpdate;
    }): CancelablePromise<ArchiveDocumentStaffFunctionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/archive_document_staff_function/{id}/',
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
}
