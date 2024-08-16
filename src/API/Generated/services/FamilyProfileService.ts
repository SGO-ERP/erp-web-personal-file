/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FamilyProfileCreate } from '../models/FamilyProfileCreate';
import type { FamilyProfileRead } from '../models/FamilyProfileRead';
import type { FamilyProfileUpdate } from '../models/FamilyProfileUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FamilyProfileService {
    /**
     * Get All
     * @returns FamilyProfileRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1FamilyFamilyProfilesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<FamilyProfileRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family/family_profiles',
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
     * @returns FamilyProfileRead Successful Response
     * @throws ApiError
     */
    public static createApiV1FamilyFamilyProfilesPost({
        requestBody,
    }: {
        requestBody: FamilyProfileCreate;
    }): CancelablePromise<FamilyProfileRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/family/family_profiles',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get
     * @returns FamilyProfileRead Successful Response
     * @throws ApiError
     */
    public static getApiV1FamilyFamilyProfilesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<FamilyProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family/family_profiles/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update
     * @returns FamilyProfileRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1FamilyFamilyProfilesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: FamilyProfileUpdate;
    }): CancelablePromise<FamilyProfileRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/family/family_profiles/{id}/',
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
     * Delete
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1FamilyFamilyProfilesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/family/family_profiles/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get By Profile
     * @returns FamilyProfileRead Successful Response
     * @throws ApiError
     */
    public static getByProfileApiV1FamilyFamilyProfilesProfileGet(): CancelablePromise<FamilyProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family/family_profiles/profile',
        });
    }

    /**
     * Get By Profile Id
     * @returns FamilyProfileRead Successful Response
     * @throws ApiError
     */
    public static getByProfileIdApiV1FamilyFamilyProfilesProfileIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<FamilyProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family/family_profiles/profile/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
