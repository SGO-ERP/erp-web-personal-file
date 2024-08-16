/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonalProfileCreate } from '../models/PersonalProfileCreate';
import type { PersonalProfileRead } from '../models/PersonalProfileRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PersonalProfileService {
    /**
     * Get all PersonalProfiles
     * Get all PersonalProfiles
     *
     * - **skip**: int - The number of PersonalProfiles
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of PersonalProfiles
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns PersonalProfileRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonalPersonalProfileGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PersonalProfileRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/personal_profile',
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
     * Create PersonalProfiles
     * Create new PersonalProfiles
     *
     * no parameters required
     * @returns PersonalProfileRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PersonalPersonalProfilePost({
        requestBody,
    }: {
        requestBody: PersonalProfileCreate;
    }): CancelablePromise<PersonalProfileRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/personal/personal_profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get random personal document
     * Get all PersonalProfiles
     *
     * - **skip**: int - The number of PersonalProfiles
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of PersonalProfiles
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getRandApiV1PersonalPersonalProfileRandIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/personal_profile/rand/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get PersonalProfiles by id
     * Get PersonalProfiles by id
     *
     * - **id**: UUID - required.
     * @returns PersonalProfileRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonalPersonalProfileIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<PersonalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/personal_profile/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete PersonalProfiles
     * Delete PersonalProfiles
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PersonalPersonalProfileIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/personal/personal_profile/{id}/',
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
     * @returns PersonalProfileRead Successful Response
     * @throws ApiError
     */
    public static getProfileApiV1PersonalPersonalProfileProfileGet(): CancelablePromise<PersonalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/personal_profile/profile',
        });
    }

    /**
     * Get Profile By Id
     * @returns PersonalProfileRead Successful Response
     * @throws ApiError
     */
    public static getProfileByIdApiV1PersonalPersonalProfileProfileIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<PersonalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/personal_profile/profile/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
