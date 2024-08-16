/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EducationalProfileCreate } from '../models/EducationalProfileCreate';
import type { EducationalProfileRead } from '../models/EducationalProfileRead';
import type { EducationalProfileUpdate } from '../models/EducationalProfileUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EducationalProfilesService {
    /**
     * Get all EducationalProfiles
     * Get all EducationalProfiles
     *
     * - **skip**: int - The number of EducationalProfiles
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of EducationalProfiles
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationEducationalProfilesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/educational_profiles',
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
     * Create new EducationalProfile
     *
     * - **name**: required
     * @returns EducationalProfileRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationEducationalProfilesPost({
        requestBody,
    }: {
        requestBody: EducationalProfileCreate;
    }): CancelablePromise<EducationalProfileRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/educational_profiles',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get EducationalProfile by id
     * Get EducationalProfile by id
     *
     * - **id**: UUID - required.
     * @returns EducationalProfileRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationEducationalProfilesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<EducationalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/educational_profiles/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update EducationalProfile
     * Update EducationalProfile
     *
     * - **id**: UUID - the ID of EducationalProfile to update. This is required.
     * - **name**: required.
     * @returns EducationalProfileRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationEducationalProfilesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: EducationalProfileUpdate;
    }): CancelablePromise<EducationalProfileRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/educational_profiles/{id}/',
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
     * Delete EducationalProfile
     * Delete EducationalProfile
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationEducationalProfilesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/educational_profiles/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Profile
     * @returns EducationalProfileRead Successful Response
     * @throws ApiError
     */
    public static getProfileApiV1EducationEducationalProfilesProfileGet(): CancelablePromise<EducationalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/educational_profiles/profile',
        });
    }

    /**
     * Get Profile By Id
     * @returns EducationalProfileRead Successful Response
     * @throws ApiError
     */
    public static getProfileByIdApiV1EducationEducationalProfilesProfileIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<EducationalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/educational_profiles/profile/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
