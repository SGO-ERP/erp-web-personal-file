/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdditionalProfileCreate } from '../models/AdditionalProfileCreate';
import type { AdditionalProfileRead } from '../models/AdditionalProfileRead';
import type { AdditionalProfileUpdate } from '../models/AdditionalProfileUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdditionalProfileService {
    /**
     * Get all Additional Profile
     * Get all Abroad Travel
     *
     * - **skip**: int - The number of abroad travel to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of abroad travel to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AdditionalProfileRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AdditionalAdditionalProfileGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<AdditionalProfileRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/additional-profile',
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
     * Create new abroad travel
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns AdditionalProfileCreate Successful Response
     * @throws ApiError
     */
    public static createApiV1AdditionalAdditionalProfilePost(): CancelablePromise<AdditionalProfileCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/additional/additional-profile',
        });
    }

    /**
     * Get Additional Profile by id
     * Get additional profile by id
     *
     * - **name**: required
     * @returns AdditionalProfileRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1AdditionalAdditionalProfileIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<AdditionalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/additional-profile/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Abroad Travel by id
     * Update abroad travel by id
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns AdditionalProfileRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AdditionalAdditionalProfileIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: AdditionalProfileUpdate;
    }): CancelablePromise<AdditionalProfileRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/additional/additional-profile/{id}/',
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
     * Delete Abroad Travel by id
     * Delete abroad travel by id
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns AdditionalProfileRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AdditionalAdditionalProfileIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<AdditionalProfileRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/additional/additional-profile/{id}/',
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
     * @returns AdditionalProfileRead Successful Response
     * @throws ApiError
     */
    public static getProfileApiV1AdditionalAdditionalProfileProfileGet(): CancelablePromise<AdditionalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/additional-profile/profile',
        });
    }

    /**
     * Get Profile By Id
     * @returns AdditionalProfileRead Successful Response
     * @throws ApiError
     */
    public static getProfileByIdApiV1AdditionalAdditionalProfileProfileIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<AdditionalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/additional-profile/profile/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
