/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcademicTitleDegreeCreate } from '../models/AcademicTitleDegreeCreate';
import type { AcademicTitleDegreeRead } from '../models/AcademicTitleDegreeRead';
import type { AcademicTitleDegreeUpdate } from '../models/AcademicTitleDegreeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AcademicTitleDegreesService {
    /**
     * Get all AcademicTitleDegrees
     * Get all AcademicTitleDegrees
     *
     * - **skip**: int - The number of AcademicTitleDegrees
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of AcademicTitleDegrees
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AcademicTitleDegreeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationAcademicTitleDegreesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<AcademicTitleDegreeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/academic_title_degrees',
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
     * Create new AcademicTitleDegree
     *
     * - **name**: required
     * @returns AcademicTitleDegreeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationAcademicTitleDegreesPost({
        requestBody,
    }: {
        requestBody: AcademicTitleDegreeCreate;
    }): CancelablePromise<AcademicTitleDegreeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/academic_title_degrees',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get AcademicTitleDegree by id
     * Get AcademicTitleDegree by id
     *
     * - **id**: UUID - required.
     * @returns AcademicTitleDegreeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationAcademicTitleDegreesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<AcademicTitleDegreeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/academic_title_degrees/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update AcademicTitleDegree
     * Update AcademicTitleDegree
     *
     * - **id**: UUID - the ID of AcademicTitleDegree to update. This is required.
     * - **name**: required.
     * @returns AcademicTitleDegreeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationAcademicTitleDegreesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: AcademicTitleDegreeUpdate;
    }): CancelablePromise<AcademicTitleDegreeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/academic_title_degrees/{id}/',
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
     * Delete AcademicTitleDegree
     * Delete AcademicTitleDegree
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationAcademicTitleDegreesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/academic_title_degrees/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
