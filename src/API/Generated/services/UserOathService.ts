/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserOathCreate } from '../models/UserOathCreate';
import type { UserOathRead } from '../models/UserOathRead';
import type { UserOathUpdate } from '../models/UserOathUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserOathService {
    /**
     * Get all User Oaths
     * Get all User Oaths
     *
     * - **skip**: int - The number of User Oaths
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of User Oaths
     * to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns UserOathRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1UserOathsGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<UserOathRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user_oaths',
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
     * Create User Oath
     * Create User Oath
     *
     * **date** - required - datetime
     * **user_id** - required - uuid
     * **military_unit_id** - required - uuid
     * @returns UserOathRead Successful Response
     * @throws ApiError
     */
    public static createApiV1UserOathsPost({
        requestBody,
    }: {
        requestBody: UserOathCreate;
    }): CancelablePromise<UserOathRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/user_oaths',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get User Oath by id
     * Get User Oath by id
     *
     * - **id** - UUID - required
     * @returns UserOathRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1UserOathsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<UserOathRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user_oaths/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update User Oath
     * Update User Oath
     *
     * **date** - required - datetime
     * **user_id** - required - uuid
     * **military_unit_id** - required - uuid
     * @returns UserOathRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1UserOathsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: UserOathUpdate;
    }): CancelablePromise<UserOathRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/user_oaths/{id}/',
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
     * Delete User Oath
     * Delete User Oath
     *
     * - **id** - UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1UserOathsIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/user_oaths/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
