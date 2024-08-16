/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SpecialtyCreate } from '../models/SpecialtyCreate';
import type { SpecialtyRead } from '../models/SpecialtyRead';
import type { SpecialtyUpdate } from '../models/SpecialtyUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SpecialtiesService {
    /**
     * Get all Specialties
     * Get all Specialties
     *
     * - **skip**: int - The number of Specialties
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Specialties
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns SpecialtyRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationSpecialtiesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<SpecialtyRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/specialties',
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
     * Create new Specialty
     *
     * - **name**: required
     * @returns SpecialtyRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationSpecialtiesPost({
        requestBody,
    }: {
        requestBody: SpecialtyCreate;
    }): CancelablePromise<SpecialtyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/specialties',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Specialty by id
     * Get Specialty by id
     *
     * - **id**: UUID - required.
     * @returns SpecialtyRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationSpecialtiesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<SpecialtyRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/specialties/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Specialty
     * Update Specialty
     *
     * - **id**: UUID - the ID of Specialty to update. This is required.
     * - **name**: required.
     * @returns SpecialtyRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationSpecialtiesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: SpecialtyUpdate;
    }): CancelablePromise<SpecialtyRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/specialties/{id}/',
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
     * Delete Specialty
     * Delete Specialty
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationSpecialtiesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/specialties/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
