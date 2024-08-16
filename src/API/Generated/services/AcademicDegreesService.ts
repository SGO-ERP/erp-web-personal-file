/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcademicDegreeCreate } from '../models/AcademicDegreeCreate';
import type { AcademicDegreeRead } from '../models/AcademicDegreeRead';
import type { AcademicDegreeUpdate } from '../models/AcademicDegreeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AcademicDegreesService {
    /**
     * Get all AcademicDegrees
     * Get all AcademicDegrees
     *
     * - **skip**: int - The number of AcademicDegrees
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of AcademicDegrees
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AcademicDegreeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationAcademicDegreesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<AcademicDegreeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/academic_degrees',
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
     * Create new AcademicDegree
     *
     * - **name**: required
     * @returns AcademicDegreeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationAcademicDegreesPost({
        requestBody,
    }: {
        requestBody: AcademicDegreeCreate;
    }): CancelablePromise<AcademicDegreeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/academic_degrees',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get AcademicDegree by id
     * Get AcademicDegree by id
     *
     * - **id**: UUID - required.
     * @returns AcademicDegreeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationAcademicDegreesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<AcademicDegreeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/academic_degrees/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update AcademicDegree
     * Update AcademicDegree
     *
     * - **id**: UUID - the ID of AcademicDegree to update.
     * This is required.
     * - **name**: required.
     * @returns AcademicDegreeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationAcademicDegreesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: AcademicDegreeUpdate;
    }): CancelablePromise<AcademicDegreeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/academic_degrees/{id}/',
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
     * Delete AcademicDegree
     * Delete AcademicDegree
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationAcademicDegreesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/academic_degrees/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
