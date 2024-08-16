/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LanguageCreate } from '../models/LanguageCreate';
import type { LanguageRead } from '../models/LanguageRead';
import type { LanguageUpdate } from '../models/LanguageUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LanguagesService {
    /**
     * Get all Languages
     * Get all Languages
     *
     * - **skip**: int - The number of Languages
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Languages
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns LanguageRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationLanguagesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<LanguageRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/languages',
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
     * Create new Language
     *
     * - **name**: required
     * @returns LanguageRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationLanguagesPost({
        requestBody,
    }: {
        requestBody: LanguageCreate;
    }): CancelablePromise<LanguageRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/languages',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Language by id
     * Get Language by id
     *
     * - **id**: UUID - required.
     * @returns LanguageRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationLanguagesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<LanguageRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/languages/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Language
     * Update Language
     *
     * - **id**: UUID - the ID of Language to update. This is required.
     * - **name**: required.
     * @returns LanguageRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationLanguagesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: LanguageUpdate;
    }): CancelablePromise<LanguageRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/languages/{id}/',
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
     * Delete Language
     * Delete Language
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationLanguagesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/languages/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
