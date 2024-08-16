/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PermissionCreate } from '../models/PermissionCreate';
import type { PermissionRead } from '../models/PermissionRead';
import type { PermissionTypeRead } from '../models/PermissionTypeRead';
import type { PermissionUpdate } from '../models/PermissionUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PermissionsService {
    /**
     * Get all Permissions
     * Get all Permissions
     *
     * - **skip**: int - The number of permissions
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of permissions
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns PermissionRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PermissionsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PermissionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/permissions',
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
     * Create Permission
     * Create Permission
     *
     * - **name**: required
     * @returns PermissionRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PermissionsPost({
        requestBody,
    }: {
        requestBody: PermissionCreate;
    }): CancelablePromise<PermissionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/permissions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * If user has permission
     * Check if authorized user has permission for permission_type
     *
     * - **permission_type**: str - permission_type name
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static hasPermissionApiV1PermissionsHasPermissionGet({
        permissionType,
    }: {
        permissionType: string;
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/permissions/has_permission',
            query: {
                'permission_type': permissionType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Permissions of user
     * Get all permissions of user
     *
     * - **permission_type**: str - permission_type name
     * @returns PermissionRead Successful Response
     * @throws ApiError
     */
    public static hasPermissionApiV1PermissionsUserPermissionsGet({
        userId,
    }: {
        userId?: string;
    }): CancelablePromise<Array<PermissionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/permissions/user_permissions',
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Permissions Types
     * Get all Permissions Types
     *
     * - **skip**: int - The number of permission types
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of permission types
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns PermissionTypeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PermissionsTypesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PermissionTypeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/permissions/types',
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
     * Get Permission by id
     * Get Permission by id
     *
     * - **id**: UUID - required
     * @returns PermissionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PermissionsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<PermissionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/permissions/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Permission
     * Update Permission
     *
     * - **id**: UUID - the ID of permission to update. This is required.
     * - **name**: required.
     * @returns PermissionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PermissionsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: PermissionUpdate;
    }): CancelablePromise<PermissionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/permissions/{id}/',
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
     * Delete Permission
     * Delete Permission
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PermissionsIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/permissions/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
