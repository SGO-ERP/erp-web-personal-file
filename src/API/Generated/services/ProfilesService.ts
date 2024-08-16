/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileRead } from '../models/ProfileRead';
import type { ProfileUpdate } from '../models/ProfileUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProfilesService {
    /**
     * Get all Profiles
     * Get all Profiles
     * @returns ProfileRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ProfileGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ProfileRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/profile',
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
     * Create
     * Create new profile
     *
     * no parameters required.
     * @returns ProfileRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ProfilePost(): CancelablePromise<ProfileRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/profile',
        });
    }

    /**
     * Get Profile by id
     * Get profile by id
     *
     * - **id**: UUID - required.
     * @returns ProfileRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ProfileIdGet({ id }: { id: string }): CancelablePromise<ProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/profile/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Profile
     * Update Profile
     * @returns ProfileRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ProfileIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ProfileUpdate;
    }): CancelablePromise<ProfileRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/profile/{id}/',
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
     * Delete Profile
     * Delete Profile
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1ProfileIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/profile/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
