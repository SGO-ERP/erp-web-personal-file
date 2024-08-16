/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseProviderCreate } from '../models/CourseProviderCreate';
import type { CourseProviderRead } from '../models/CourseProviderRead';
import type { CourseProviderUpdate } from '../models/CourseProviderUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CourseProvidersService {
    /**
     * Get all CourseProviders
     * Get all CourseProviders
     *
     * - **skip**: int - The number of CourseProviders
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of CourseProviders
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns CourseProviderRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationCourseProvidersGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<CourseProviderRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/course_providers',
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
     * Create new CourseProvider
     *
     * - **name**: required
     * @returns CourseProviderRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationCourseProvidersPost({
        requestBody,
    }: {
        requestBody: CourseProviderCreate;
    }): CancelablePromise<CourseProviderRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/course_providers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get CourseProvider by id
     * Get CourseProvider by id
     *
     * - **id**: UUID - required.
     * @returns CourseProviderRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationCourseProvidersIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<CourseProviderRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/course_providers/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update CourseProvider
     * Update CourseProvider
     *
     * - **id**: UUID - the ID of CourseProvider to update. This is required.
     * - **name**: required.
     * @returns CourseProviderRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationCourseProvidersIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: CourseProviderUpdate;
    }): CancelablePromise<CourseProviderRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/course_providers/{id}/',
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
     * Delete CourseProvider
     * Delete CourseProvider
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationCourseProvidersIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/course_providers/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
