/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { schemas__user__UserRead } from '../models/schemas__user__UserRead';
import type { TableUserRead } from '../models/TableUserRead';
import type { UserShortRead } from '../models/UserShortRead';
import type { UserShortReadStatusPagination } from '../models/UserShortReadStatusPagination';
import type { UserUpdate } from '../models/UserUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {
    /**
     * Get all Users
     * Get all Users
     *
     * - **hr_document_template_id**: str - The value which returns filtered
     * results by hr_document_template_id.
     * This parameter is optional and defaults to None
     * - **filter**: str - The value which returns filtered results.
     * This parameter is optional and defaults to None
     * - **skip**: int - The number of users to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of users to return in response.
     * This parameter is optional and defaults to 10.
     * @returns schemas__user__UserRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1UsersGet({
        hrDocumentTemplateId,
        filter = '',
        skip,
        limit = 10,
    }: {
        hrDocumentTemplateId?: string;
        filter?: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<schemas__user__UserRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users',
            query: {
                'hr_document_template_id': hrDocumentTemplateId,
                'filter': filter,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Check if user has access to template
     * Check if user has access to template
     *
     * - **user_id**: str - The value which returns filtered results by user_id.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static isTemplateAccessibleForUserApiV1UsersUserIdTemplatesGet({
        userId,
        hrDocumentTemplateId,
    }: {
        userId: string;
        hrDocumentTemplateId: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/{user_id}/templates/',
            path: {
                'user_id': userId,
            },
            query: {
                'hr_document_template_id': hrDocumentTemplateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Users
     * Get all Users
     * - **filter**: str - The value which returns filtered results.
     * This parameter is optional and defaults to None
     * - **skip**: int - The number of users to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of users to return in response.
     * This parameter is optional and defaults to 10.
     * @returns TableUserRead Successful Response
     * @throws ApiError
     */
    public static getAllArchivedApiV1UsersArchivedGet({
        filter = '',
        skip,
        limit = 10,
    }: {
        filter?: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<TableUserRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/archived',
            query: {
                'filter': filter,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Users
     * Get all Users
     * - **filter**: str - The value which returns filtered results.
     * This parameter is optional and defaults to None
     * - **skip**: int - The number of users to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of users to return in response.
     * This parameter is optional and defaults to 10.
     * @returns TableUserRead Successful Response
     * @throws ApiError
     */
    public static getAllActiveApiV1UsersActiveGet({
        filter = '',
        skip,
        limit = 10,
    }: {
        filter?: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<TableUserRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/active',
            query: {
                'filter': filter,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Users by Jurisdiction
     * Get all Users by juridction
     *
     * - **skip**: int - The number of users to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of users to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns schemas__user__UserRead Successful Response
     * @throws ApiError
     */
    public static getAllByJurisdictionApiV1UsersJurisdictionGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<schemas__user__UserRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/jurisdiction',
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
     * Get all Users by Staff Unit
     * Get all Users by Staff Unit
     *
     * - **id**: UUID - required and should exist in the database.
     * @returns schemas__user__UserRead Successful Response
     * @throws ApiError
     */
    public static getAllByStaffUnitApiV1UsersStaffUnitIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<schemas__user__UserRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/staff-unit/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Users by Staff Unit
     * Get all Users by Position
     *
     * - **id**: UUID - required and should exist in the database.
     * @returns schemas__user__UserRead Successful Response
     * @throws ApiError
     */
    public static getAllByPositionApiV1UsersPositionIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<schemas__user__UserRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/position/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Users by ScheduleYear
     * Get all Users by Plan
     *
     * - **id**: UUID - required and should exist in the database.
     * - **skip**: int - The number of users to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of users to return in response.
     * This parameter is optional and defaults to 10.
     * @returns UserShortReadStatusPagination Successful Response
     * @throws ApiError
     */
    public static getAllByScheduleIdApiV1UsersScheduleIdGet({
        id,
        skip,
        limit,
    }: {
        id: string;
        skip: number;
        limit: number;
    }): CancelablePromise<UserShortReadStatusPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/schedule/{id}',
            path: {
                'id': id,
            },
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
     * Get User by id
     * Get User by id
     *
     * - **id**: UUID - required
     * @returns schemas__user__UserRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1UsersIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<schemas__user__UserRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update User Patch
     * Update User
     *
     * - **id**: UUID - id of the User.
     * - **email**: string required and should be a valid email format.
     * - **first_name**: required.
     * - **last_name**: required.
     * - **father_name**: optional.
     * - **icon**: image with url format. This parameter is optional.
     * - **call_sign**: required.
     * - **id_number**: unique employee number. This parameter is required.
     * - **phone_number**: format (+77xxxxxxxxx). This parameter is optional.
     * - **address**: optional.
     * - **status**: the current status of the employee
     * (e.g. "working", "on vacation", "sick", etc.).
     * This parameter is optional.
     * - **status_till**: the date when the current status
     * of the employee will end. This parameter is optional.
     * @returns schemas__user__UserRead Successful Response
     * @throws ApiError
     */
    public static updateUserPatchApiV1UsersIdPatch({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: UserUpdate;
    }): CancelablePromise<schemas__user__UserRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/users/{id}/',
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
     * Get fields
     * Get fields
     *
     * This endpoint does not accept any parameters and returns all fields.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getFieldsApiV1UsersFieldsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/fields',
        });
    }

    /**
     * Get Profile
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProfileApiV1UsersProfileGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/profile',
        });
    }

    /**
     * Get Templates
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTemplatesApiV1UsersTemplatesUserIdGet({
        userId,
        skip,
        limit = 10,
    }: {
        userId: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/templates/{user_id}/',
            path: {
                'user_id': userId,
            },
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
     * Get Short User
     * @returns UserShortRead Successful Response
     * @throws ApiError
     */
    public static getShortUserApiV1UsersShortIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<UserShortRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/short/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
