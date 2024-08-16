/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StaffDivisionCreate } from '../models/StaffDivisionCreate';
import type { StaffDivisionMatreshkaStepRead } from '../models/StaffDivisionMatreshkaStepRead';
import type { StaffDivisionRead } from '../models/StaffDivisionRead';
import type { StaffDivisionStepRead } from '../models/StaffDivisionStepRead';
import type { StaffDivisionTypeRead } from '../models/StaffDivisionTypeRead';
import type { StaffDivisionUpdate } from '../models/StaffDivisionUpdate';
import type { StaffDivisionUpdateParentGroup } from '../models/StaffDivisionUpdateParentGroup';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StaffDivisionService {
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
     * @returns StaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1StaffDivisionGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<StaffDivisionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_division',
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
     * Create Staff Division
     * Create Staff Division
     *
     * - **parent_group_id**: the id of the parent group. This parameter is optional.
     * - **name**: required
     * - **description**: a long description. This parameter is optional.
     * @returns StaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static createApiV1StaffDivisionPost({
        requestBody,
    }: {
        requestBody: StaffDivisionCreate;
    }): CancelablePromise<StaffDivisionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_division',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

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
     * @returns StaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static getDepartmentsApiV1StaffDivisionDepartmentsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<StaffDivisionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_division/departments/',
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
     * Get Staff Division and all his parents
     * Get all Staff Divisions
     *
     * - **id**: uuid - The id of staff division. This parameter is required.
     * @returns StaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static getDivisionParentsByIdApiV1StaffDivisionDivisionParentsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<StaffDivisionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_division/division_parents/{id}/',
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
     * @returns StaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1StaffDivisionIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<StaffDivisionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_division/{id}/',
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
     * @returns StaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1StaffDivisionIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: StaffDivisionUpdate;
    }): CancelablePromise<StaffDivisionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/staff_division/{id}/',
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
     * @returns StaffDivisionRead Successful Response
     * @throws ApiError
     */
    public static updateParentApiV1StaffDivisionIdPost({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: StaffDivisionUpdateParentGroup;
    }): CancelablePromise<StaffDivisionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_division/{id}/',
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
    public static deleteApiV1StaffDivisionIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/staff_division/{id}/',
            path: {
                'id': id,
            },
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
     * @returns StaffDivisionStepRead Successful Response
     * @throws ApiError
     */
    public static getAllOneLevelForIdApiV1StaffDivisionOneLevelIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<StaffDivisionStepRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_division/one-level/{id}/',
            path: {
                'id': id,
            },
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
     * @returns StaffDivisionMatreshkaStepRead Successful Response
     * @throws ApiError
     */
    public static getAllOneLevelForIdApiV1StaffDivisionOneLevelMatreshkaGet({
        id,
    }: {
        id?: string;
    }): CancelablePromise<StaffDivisionMatreshkaStepRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_division/one-level-matreshka',
            query: {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getFullNameByIdApiV1StaffDivisionNameIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_division/name/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Staff Division types
     * Get all Staff Division Types
     * @returns StaffDivisionTypeRead Successful Response
     * @throws ApiError
     */
    public static getDivisionTypesApiV1StaffDivisionTypesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<StaffDivisionTypeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_division/types',
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
     * Get ids of all parents of Staff Division
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getParentIdsApiV1StaffDivisionIdsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_division/ids/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
