/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserLiberationCreate } from '../models/UserLiberationCreate';
import type { UserLiberationRead } from '../models/UserLiberationRead';
import type { UserLiberationUpdate } from '../models/UserLiberationUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserLiberationService {
    /**
     * Get all UserLiberation
     * Get all UserLiberation
     *
     * - **skip**: int - The number of UserLiberation
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of UserLiberation
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns UserLiberationRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1MedicalUserLiberationsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<UserLiberationRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/user_liberations',
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
     * Create UserLiberation
     * Create new UserLiberation
     *
     * - **reason**: str
     * - **liberation_name**: str
     * - **initiator**: str
     * - **start_date**: datetime.datetime
     * - **end_date**: datetime.datetime
     * - **profile_id**: str
     * @returns UserLiberationRead Successful Response
     * @throws ApiError
     */
    public static createApiV1MedicalUserLiberationsPost({
        requestBody,
    }: {
        requestBody: UserLiberationCreate;
    }): CancelablePromise<UserLiberationRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/medical/user_liberations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get UserLiberation by id
     * Get UserLiberation by id
     *
     * - **id**: UUID - required.
     * @returns UserLiberationRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1MedicalUserLiberationsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<UserLiberationRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/user_liberations/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update UserLiberation
     * Update UserLiberation
     *
     * - **id**: UUID - the ID of UserLiberation to update. This is required.
     * - **reason**: str
     * - **liberation_name**: str
     * - **initiator**: str
     * - **start_date**: datetime.datetime
     * - **end_date**: datetime.datetime
     * - **profile_id**: str
     * @returns UserLiberationRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1MedicalUserLiberationsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: UserLiberationUpdate;
    }): CancelablePromise<UserLiberationRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/medical/user_liberations/{id}/',
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
     * Delete UserLiberation
     * Delete a UserLiberation
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1MedicalUserLiberationsIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/medical/user_liberations/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
