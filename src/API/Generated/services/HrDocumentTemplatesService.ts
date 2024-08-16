/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HrDocumentTemplateCreate } from '../models/HrDocumentTemplateCreate';
import type { HrDocumentTemplateRead } from '../models/HrDocumentTemplateRead';
import type { HrDocumentTemplateUpdate } from '../models/HrDocumentTemplateUpdate';
import type { SuggestCorrections } from '../models/SuggestCorrections';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HrDocumentTemplatesService {
    /**
     * Get all HrDocumentTemplate
     * Get all HrDocumentTemplate
     *
     * - **skip**: int - The number of HrDocumentTemplate
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of HrDocumentTemplate
     * to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns HrDocumentTemplateRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1HrDocumentsTemplateGet({
        skip,
        name,
        limit = 10,
    }: {
        skip?: number;
        name?: string;
        limit?: number;
    }): CancelablePromise<Array<HrDocumentTemplateRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents-template',
            query: {
                'skip': skip,
                'name': name,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create HrDocumentTemplate
     * Create HrDocumentTemplate
     *
     * - **name**: required
     * - **path**: string - the current location of this document.
     * This is required.
     * - **subject_type**: int - the subject type of the HrDocumentTemplate.
     * This field should necessarily accept one of the following types.
     * - **properties**: Dict[str, dict] - details which
     * will be replaced while creating HrDocument.
     * This is required.
     *
     * - CANDIDATE = 1
     * - EMPLOYEE = 2
     * - PERSONNEL = 3
     * - STAFF = 4
     * @returns HrDocumentTemplateRead Successful Response
     * @throws ApiError
     */
    public static createApiV1HrDocumentsTemplatePost({
        requestBody,
    }: {
        requestBody: HrDocumentTemplateCreate;
    }): CancelablePromise<HrDocumentTemplateRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents-template',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get All Archived
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllArchivedApiV1HrDocumentsTemplateArchiveGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents-template/archive',
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
     * Get HrDocumentTemplate drafts
     * @returns HrDocumentTemplateRead Successful Response
     * @throws ApiError
     */
    public static getAllDraftApiV1HrDocumentsTemplateDraftGet({
        skip,
        name,
        limit = 10,
    }: {
        skip?: number;
        name?: string;
        limit?: number;
    }): CancelablePromise<Array<HrDocumentTemplateRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents-template/draft',
            query: {
                'skip': skip,
                'name': name,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create HrDocumentTemplate draft
     * Create HrDocumentTemplate draft
     *
     * - **name**: required
     * - **path**: string - the current location of this document.
     * This is required.
     * - **subject_type**: int - the subject type of the HrDocumentTemplate.
     * This field should necessarily accept one of the following types.
     * - **properties**: Dict[str, dict] - details which
     * will be replaced while creating HrDocument.
     *
     * - CANDIDATE = 1
     * - EMPLOYEE = 2
     * - PERSONNEL = 3
     * - STAFF = 4
     * @returns HrDocumentTemplateRead Successful Response
     * @throws ApiError
     */
    public static createDraftApiV1HrDocumentsTemplateDraftPost({
        requestBody,
    }: {
        requestBody: HrDocumentTemplateCreate;
    }): CancelablePromise<HrDocumentTemplateRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents-template/draft',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get HrDocumentTemplate by id
     * Get HrDocumentTemplate by id
     *
     * - **id**: UUID - required.
     * @returns HrDocumentTemplateRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1HrDocumentsTemplateIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<HrDocumentTemplateRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents-template/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update HrDocumentTemplate
     * Update HrDocumentTeplate
     *
     * - **id**: UUID - required.
     * - **name**: required
     * - **path**: string - the current location of this document.
     * This is required.
     * - **subject_type**: int - the subject type of the HrDocumentTemplate.
     * This field should necessarily accept one of the following types.
     * - **properties**: Dict[str, dict] - details which will be replaced
     * while creating HrDocument. This is required.
     *
     * * CANDIDATE = 1
     * * EMPLOYEE = 2
     * * PERSONNEL = 3
     * * STAFF = 4
     * @returns HrDocumentTemplateRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1HrDocumentsTemplateIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HrDocumentTemplateUpdate;
    }): CancelablePromise<HrDocumentTemplateRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/hr-documents-template/{id}/',
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
     * Delete HrDocumentTemplate
     * Delete HrDocumentTemplate
     *
     * - **id**: UUID - required.
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1HrDocumentsTemplateIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/hr-documents-template/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get HrDocumentTemplate by step id
     * Get HrDocumentTemplate by step id
     *
     * - **id**: UUID - required.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getStepsByDocumentTemplateIdApiV1HrDocumentsTemplateStepsIdGet({
        id,
        userId,
    }: {
        id: string;
        userId: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents-template/steps/{id}',
            path: {
                'id': id,
            },
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Duplicate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static duplicateApiV1HrDocumentsTemplateDuplicateIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents-template/duplicate/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Suggest Corrections
     * @returns any Successful Response
     * @throws ApiError
     */
    public static suggestCorrectionsApiV1HrDocumentsTemplateCorrectionsPost({
        requestBody,
    }: {
        requestBody: SuggestCorrections;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents-template/corrections/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
