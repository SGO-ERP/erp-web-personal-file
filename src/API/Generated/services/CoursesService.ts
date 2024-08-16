/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseCreate } from '../models/CourseCreate';
import type { CourseRead } from '../models/CourseRead';
import type { CourseUpdate } from '../models/CourseUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CoursesService {
    /**
     * Get all Courses
     * Get all Courses
     *
     * - **skip**: int - The number of Courses
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Courses
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns CourseRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationCoursesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<CourseRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/courses',
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
     * Create new Course
     *
     * - **name**: required
     * @returns CourseRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationCoursesPost({
        requestBody,
    }: {
        requestBody: CourseCreate;
    }): CancelablePromise<CourseRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/courses',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Course by id
     * Get Course by id
     *
     * - **id**: UUID - required.
     * @returns CourseRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationCoursesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<CourseRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/courses/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Course
     * Update Course
     *
     * - **id**: UUID - the ID of Course to update. This is required.
     * - **name**: required.
     * @returns CourseRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationCoursesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: CourseUpdate;
    }): CancelablePromise<CourseRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/courses/{id}/',
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
     * Delete Course
     * Delete Course
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationCoursesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/courses/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
