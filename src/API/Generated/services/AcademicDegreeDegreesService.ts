/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcademicDegreeDegreeCreate } from '../models/AcademicDegreeDegreeCreate';
import type { AcademicDegreeDegreeRead } from '../models/AcademicDegreeDegreeRead';
import type { AcademicDegreeDegreeUpdate } from '../models/AcademicDegreeDegreeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AcademicDegreeDegreesService {
    /**
     * Get all AcademicDegreeDegrees
     * Get all AcademicDegreeDegrees
     *
     * - **skip**: int - The number of AcademicDegreeDegrees
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of AcademicDegreeDegrees
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AcademicDegreeDegreeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationAcademicDegreeDegreesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<AcademicDegreeDegreeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/academic_degree_degrees',
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
     * Create new AcademicDegreeDegree
     *
     * - **name**: required
     * @returns AcademicDegreeDegreeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationAcademicDegreeDegreesPost({
        requestBody,
    }: {
        requestBody: AcademicDegreeDegreeCreate;
    }): CancelablePromise<AcademicDegreeDegreeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/academic_degree_degrees',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get AcademicDegreeDegree by id
     * Get AcademicDegreeDegree by id
     *
     * - **id**: UUID - required.
     * @returns AcademicDegreeDegreeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationAcademicDegreeDegreesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<AcademicDegreeDegreeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/academic_degree_degrees/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update AcademicDegreeDegree
     * Update AcademicDegreeDegree
     *
     * - **id**: UUID - the ID of AcademicDegreeDegree to update.
     * This is required.
     * - **name**: required.
     * @returns AcademicDegreeDegreeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationAcademicDegreeDegreesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: AcademicDegreeDegreeUpdate;
    }): CancelablePromise<AcademicDegreeDegreeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/academic_degree_degrees/{id}/',
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
     * Delete AcademicDegreeDegree
     * Delete AcademicDegreeDegree
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationAcademicDegreeDegreesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/academic_degree_degrees/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
