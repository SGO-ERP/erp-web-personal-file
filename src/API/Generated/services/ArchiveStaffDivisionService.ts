/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArchiveStaffDivisionRead } from '../models/ArchiveStaffDivisionRead';
import type { ArchiveStaffDivisionStepRead } from '../models/ArchiveStaffDivisionStepRead';
import type { ArchiveStaffDivisionUpdateParentGroup } from '../models/ArchiveStaffDivisionUpdateParentGroup';
import type { NewArchiveStaffDivisionCreate } from '../models/NewArchiveStaffDivisionCreate';
import type { NewArchiveStaffDivisionUpdate } from '../models/NewArchiveStaffDivisionUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ArchiveStaffDivisionService {
    /**
     * Get all Staff Divisions
     * Get all Staff Divisions
     *
     * - **skip**: int - The number of staff divisions
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of staff divisions
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ArchiveStaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ArchiveStaffDivisionGet({
        staffListId,
        skip,
        limit = 100,
    }: {
        staffListId: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ArchiveStaffDivisionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_division',
            query: {
                'staff_list_id': staffListId,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Staff Division
     * Create Staff Division
     *
     * - **parent_group_id**: the id of the parent group. This parameter is optional.
     * - **name**: required
     * - **description**: a long description. This parameter is optional.
     * @returns ArchiveStaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ArchiveStaffDivisionPost({
        requestBody,
    }: {
        requestBody: NewArchiveStaffDivisionCreate;
    }): CancelablePromise<ArchiveStaffDivisionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/archive_staff_division',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Staff Division one level by id
     * Get all Staff Divisions
     *
     * - **id**: uuid - The id of staff division. This parameter is required.
     * @returns ArchiveStaffDivisionStepRead Successful Response
     * @throws ApiError
     */
    public static getAllOneLevelForIdApiV1ArchiveStaffDivisionOneLevelGet({
        staffDivisionId,
    }: {
        staffDivisionId: string;
    }): CancelablePromise<ArchiveStaffDivisionStepRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_division/one-level/',
            query: {
                'staff_division_id': staffDivisionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Archive Staff Division and all his parents
     * Get all Staff Divisions
     *
     * - **id**: uuid - The id of staff division. This parameter is required.
     * @returns ArchiveStaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static getDivisionParentsByIdApiV1ArchiveStaffDivisionDivisionParentsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ArchiveStaffDivisionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_division/division_parents/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Duplicate Staff Division by id
     * Get Staff Division by id
     *
     * - **id**: UUID - required
     * @returns ArchiveStaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static duplicateApiV1ArchiveStaffDivisionDuplicateIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ArchiveStaffDivisionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_division/duplicate/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Staff Division by id
     * Get Staff Division by id
     *
     * - **id**: UUID - required
     * @returns ArchiveStaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ArchiveStaffDivisionIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ArchiveStaffDivisionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/archive_staff_division/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Staff Division
     * Update Staff Division
     *
     * - **id**: UUID - id of the Staff Division.
     * - **parent_group_id**: the id of the parent group. This parameter is optional.
     * - **name**: required
     * - **description**: a long description. This parameter is optional.
     * @returns ArchiveStaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ArchiveStaffDivisionIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: NewArchiveStaffDivisionUpdate;
    }): CancelablePromise<ArchiveStaffDivisionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/archive_staff_division/{id}/',
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
     * Update parent of Staff Division
     * Update parent of Staff Division
     *
     * - **id**: UUID - staff division id. It is required
     * - **parent_group_id**: the id of the parent group. It is required
     * @returns ArchiveStaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static updateParentApiV1ArchiveStaffDivisionIdPost({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ArchiveStaffDivisionUpdateParentGroup;
    }): CancelablePromise<ArchiveStaffDivisionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/archive_staff_division/{id}/',
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
     * Delete Staff Division
     * Delete Staff Division
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1ArchiveStaffDivisionIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/archive_staff_division/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
