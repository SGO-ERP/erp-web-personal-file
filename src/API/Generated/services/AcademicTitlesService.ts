/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcademicTitleCreate } from '../models/AcademicTitleCreate';
import type { AcademicTitleRead } from '../models/AcademicTitleRead';
import type { AcademicTitleUpdate } from '../models/AcademicTitleUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AcademicTitlesService {
    /**
     * Get all AcademicTitles
     * Get all AcademicTitles
     *
     * - **skip**: int - The number of AcademicTitles
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of AcademicTitles
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AcademicTitleRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationAcademicTitlesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<AcademicTitleRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/academic_titles',
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
     * Create new AcademicTitle
     *
     * - **name**: required
     * @returns AcademicTitleRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationAcademicTitlesPost({
        requestBody,
    }: {
        requestBody: AcademicTitleCreate;
    }): CancelablePromise<AcademicTitleRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/academic_titles',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get AcademicTitle by id
     * Get AcademicTitle by id
     *
     * - **id**: UUID - required.
     * @returns AcademicTitleRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationAcademicTitlesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<AcademicTitleRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/academic_titles/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update AcademicTitle
     * Update AcademicTitle
     *
     * - **id**: UUID - the ID of AcademicTitle to update.
     * This is required.
     * - **name**: required.
     * @returns AcademicTitleRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationAcademicTitlesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: AcademicTitleUpdate;
    }): CancelablePromise<AcademicTitleRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/academic_titles/{id}/',
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
     * Delete AcademicTitle
     * Delete AcademicTitle
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationAcademicTitlesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/academic_titles/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
