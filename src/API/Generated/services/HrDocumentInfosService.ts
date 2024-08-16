/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HrDocumentHistoryRead } from '../models/HrDocumentHistoryRead';
import type { HrDocumentInfoCreate } from '../models/HrDocumentInfoCreate';
import type { HrDocumentInfoRead } from '../models/HrDocumentInfoRead';
import type { HrDocumentInfoUpdate } from '../models/HrDocumentInfoUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HrDocumentInfosService {
    /**
     * Get all HrDocumentInfo
     * Get all HrDocumentInfo
     *
     * - **skip**: int - The number of HrDocumentInfo
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of HrDocumentInfo
     * to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns HrDocumentInfoRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1HrDocumentsInfoGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<HrDocumentInfoRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents-info',
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
     * Create HrDocumentInfo
     * Create HrDocumentInfo
     *
     * - **hr_document_step_id**: UUID - the id of HrDocumentStep associated
     * with this document info. This is required.
     * - **signed_by**: UUID - the id of the user who signed this document info.
     * This field is optional.
     * - **comment**: a comment regarding this document info.
     * - **is_signed**: bool - whether or not this document info has been signed.
     * - **hr_document_id**: UUID - the id of the HrDocument associated
     * with this document info.
     * - **signed_at**: the datetime at which this document info was signed.
     * This field is optional. Format (YYYY-MM-DD)
     * @returns HrDocumentInfoRead Successful Response
     * @throws ApiError
     */
    public static createApiV1HrDocumentsInfoPost({
        requestBody,
    }: {
        requestBody: HrDocumentInfoCreate;
    }): CancelablePromise<HrDocumentInfoRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents-info',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get HrDocumentInfo by id
     * Get HrDocumentInfo by id
     *
     * - **id**: UUID - required
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1HrDocumentsInfoIdGet({ id }: { id: string }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents-info/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update HrDocumentInfo
     * Update HrDocumentInfo
     *
     * - **id**: UUID - the id of the HrDocumentInfo. This is required.
     * - **hr_document_step_id**: UUID - the id of HrDocumentStep associated
     * with this document info. This is required.
     * - **signed_by**: UUID - the id of the user who signed this document info.
     * This field is optional.
     * - **comment**: a comment regarding this document info.
     * - **is_signed**: bool - whether or not this document info has been signed.
     * - **hr_document_id**: UUID - the id of the HrDocument
     * associated with this document info.
     * - **signed_at**: the datetime at which this document info was signed.
     * This field is optional. Format (YYYY-MM-DD)
     * @returns HrDocumentInfoRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1HrDocumentsInfoIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HrDocumentInfoUpdate;
    }): CancelablePromise<HrDocumentInfoRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/hr-documents-info/{id}/',
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
     * Delete HrDocumentInfo
     * Delete HrDocumentInfo
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1HrDocumentsInfoIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/hr-documents-info/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get History by document id
     * Get History by document id
     *
     * The function returns a list of HrDocumentHistoryRead objects,
     * which represent the history of the HR document.
     *
     * - **id**: UUID - required.
     * @returns HrDocumentHistoryRead Successful Response
     * @throws ApiError
     */
    public static getHistoryByDocumentIdApiV1HrDocumentsInfoHistoryIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<HrDocumentHistoryRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents-info/history/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
