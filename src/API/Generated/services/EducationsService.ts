/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EducationCreate } from '../models/EducationCreate';
import type { EducationRead } from '../models/EducationRead';
import type { EducationUpdate } from '../models/EducationUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EducationsService {
    /**
     * Get all Educations
     * Get all Educations
     *
     * - **skip**: int - The number of Educations
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Educations
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns EducationRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationEducationsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<EducationRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/educations',
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
     * Create new Education
     *
     * - **name**: required
     * @returns EducationRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationEducationsPost({
        requestBody,
    }: {
        requestBody: EducationCreate;
    }): CancelablePromise<EducationRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/educations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Education by id
     * Get Education by id
     *
     * - **id**: UUID - required.
     * @returns EducationRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationEducationsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<EducationRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/educations/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Education
     * Update Education
     *
     * - **id**: UUID - the ID of Education to update. This is required.
     * - **name**: required.
     * @returns EducationRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationEducationsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: EducationUpdate;
    }): CancelablePromise<EducationRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/educations/{id}/',
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
     * Delete Education
     * Delete Education
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationEducationsIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/educations/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
