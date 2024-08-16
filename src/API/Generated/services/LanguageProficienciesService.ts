/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LanguageProficiencyCreate } from '../models/LanguageProficiencyCreate';
import type { LanguageProficiencyRead } from '../models/LanguageProficiencyRead';
import type { LanguageProficiencyUpdate } from '../models/LanguageProficiencyUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LanguageProficienciesService {
    /**
     * Get all LanguageProficiencies
     * Get all LanguageProficiencies
     *
     * - **skip**: int - The number of LanguageProficiencies
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of LanguageProficiencies
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns LanguageProficiencyRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationLanguageProficienciesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<LanguageProficiencyRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/language_proficiencies',
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
     * Create new LanguageProficiency
     *
     * - **name**: required
     * @returns LanguageProficiencyRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationLanguageProficienciesPost({
        requestBody,
    }: {
        requestBody: LanguageProficiencyCreate;
    }): CancelablePromise<LanguageProficiencyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/language_proficiencies',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get LanguageProficiency by id
     * Get LanguageProficiency by id
     *
     * - **id**: UUID - required.
     * @returns LanguageProficiencyRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationLanguageProficienciesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<LanguageProficiencyRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/language_proficiencies/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update LanguageProficiency
     * Update LanguageProficiency
     *
     * - **id**: UUID - the ID of LanguageProficiency to update. This is required.
     * - **name**: required.
     * @returns LanguageProficiencyRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationLanguageProficienciesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: LanguageProficiencyUpdate;
    }): CancelablePromise<LanguageProficiencyRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/language_proficiencies/{id}/',
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
     * Delete LanguageProficiency
     * Delete LanguageProficiency
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationLanguageProficienciesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/language_proficiencies/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
