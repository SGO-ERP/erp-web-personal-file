/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StaffListApplyRead } from '../models/StaffListApplyRead';
import type { StaffListRead } from '../models/StaffListRead';
import type { StaffListStatusRead } from '../models/StaffListStatusRead';
import type { StaffListUpdate } from '../models/StaffListUpdate';
import type { StaffListUserCreate } from '../models/StaffListUserCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StaffListService {
    /**
     * Get all Staff Lists
     * Get all Staff Lists
     *
     * - **skip**: int - The number of staff divisions
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of staff divisions
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns StaffListRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1StaffListGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<StaffListRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_list',
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
     * Create Staff List
     * Create Staff List
     * - **parent_group_id**: the id of the parent group. This parameter is optional.
     * - **name**: required
     * - **description**: a long description. This parameter is optional.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createApiV1StaffListPost({
        requestBody,
    }: {
        requestBody: StaffListUserCreate;
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_list',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Staff List history
     * Get Staff Lists drafts
     *
     * - **skip**: int - The number of staff divisions
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of staff divisions
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns StaffListStatusRead Successful Response
     * @throws ApiError
     */
    public static getDraftsApiV1StaffListDraftsGet({
        skip,
        limit = 100,
        filter = '',
    }: {
        skip?: number;
        limit?: number;
        filter?: string;
    }): CancelablePromise<Array<StaffListStatusRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_list/drafts/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter': filter,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Staff List history
     * Get Staff Lists signed
     *
     * - **skip**: int - The number of staff divisions
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of staff divisions
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns StaffListStatusRead Successful Response
     * @throws ApiError
     */
    public static getSignedApiV1StaffListSignedGet({
        skip,
        limit = 100,
        filter = '',
    }: {
        skip?: number;
        limit?: number;
        filter?: string;
    }): CancelablePromise<Array<StaffListStatusRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_list/signed/',
            query: {
                'skip': skip,
                'limit': limit,
                'filter': filter,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Staff List task status
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getResultApiV1StaffListTaskStatusTaskIdGet({
        taskId,
    }: {
        taskId: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_list/task-status/{task_id}',
            path: {
                'task_id': taskId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Staff List by id
     * Get Staff List by id
     *
     * - **id**: UUID - required
     * @returns StaffListRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1StaffListIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<StaffListRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_list/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Staff List
     * Update Staff List
     *
     * - **id**: UUID - id of the Staff Division.
     * - **parent_group_id**: the id of the parent group.
     * This parameter is optional.
     * - **name**: required
     * - **description**: a long description.
     * This parameter is optional.
     * @returns StaffListRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1StaffListIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: StaffListUpdate;
    }): CancelablePromise<StaffListRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/staff_list/{id}/',
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
     * Delete Staff List
     * Delete Staff List
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1StaffListIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/staff_list/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Apply Staff List
     * Update Staff List
     *
     * - **id**: UUID - id of the Staff List.
     * - **signed_by**: required
     * - **document_creation_date**: required
     * - **date_from**: date - format (YYYY-MM-DD).
     * This parameter is required.
     * @returns StaffListApplyRead Successful Response
     * @throws ApiError
     */
    public static applyStaffListApiV1StaffListApplyIdPost({
        id,
        signedBy,
        documentCreationDate,
        rank,
        documentNumber,
        documentLink,
    }: {
        id: string;
        signedBy: string;
        documentCreationDate: string;
        rank: string;
        documentNumber: string;
        documentLink?: string;
    }): CancelablePromise<StaffListApplyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_list/apply/{id}/',
            path: {
                'id': id,
            },
            query: {
                'signed_by': signedBy,
                'document_creation_date': documentCreationDate,
                'rank': rank,
                'document_number': documentNumber,
                'document_link': documentLink,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Duplicate Staff List
     * Duplicate Staff List
     *
     * - **id**: UUID - id of the Staff List.
     * @returns StaffListRead Successful Response
     * @throws ApiError
     */
    public static duplicateApiV1StaffListDuplicateIdPost({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: StaffListUserCreate;
    }): CancelablePromise<StaffListRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_list/duplicate/{id}/',
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
