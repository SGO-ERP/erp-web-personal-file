/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ScienceCreate } from '../models/ScienceCreate';
import type { ScienceRead } from '../models/ScienceRead';
import type { ScienceUpdate } from '../models/ScienceUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SciencesService {
    /**
     * Get all Sciences
     * Get all Sciences
     *
     * - **skip**: int - The number of Sciences
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Sciences
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ScienceRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationSciencesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ScienceRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/sciences',
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
     * Create new Science
     *
     * - **name**: required
     * @returns ScienceRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationSciencesPost({
        requestBody,
    }: {
        requestBody: ScienceCreate;
    }): CancelablePromise<ScienceRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/sciences',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Science by id
     * Get Science by id
     *
     * - **id**: UUID - required.
     * @returns ScienceRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationSciencesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ScienceRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/sciences/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Science
     * Update Science
     *
     * - **id**: UUID - the ID of Science to update.
     * This is required.
     * - **name**: required.
     * @returns ScienceRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationSciencesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ScienceUpdate;
    }): CancelablePromise<ScienceRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/sciences/{id}/',
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
     * Delete Science
     * Delete Science
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationSciencesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/sciences/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
