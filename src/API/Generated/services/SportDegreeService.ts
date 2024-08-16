/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SportDegreeCreate } from '../models/SportDegreeCreate';
import type { SportDegreeRead } from '../models/SportDegreeRead';
import type { SportDegreeUpdate } from '../models/SportDegreeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SportDegreeService {
    /**
     * Get all SportDegree
     * Get all SportDegree
     *
     * - **skip**: int - The number of SportDegree
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of SportDegree
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns SportDegreeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonalSportDegreeGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<SportDegreeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/sport_degree',
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
     * Create SportDegree
     * Create new SportDegree
     *
     * - **name**: str
     * - **assignment_date**: datetime.date
     * - **document_link**: str
     * - **profile_id**: str
     * @returns SportDegreeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PersonalSportDegreePost({
        requestBody,
    }: {
        requestBody: SportDegreeCreate;
    }): CancelablePromise<SportDegreeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/personal/sport_degree',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get SportDegree by id
     * Get SportDegree by id
     *
     * - **id**: UUID - required.
     * @returns SportDegreeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonalSportDegreeIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<SportDegreeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/sport_degree/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update SportDegree
     * Update SportDegree
     *
     * - **id**: UUID - the ID of SportDegree to update. This is required.
     * - **name**: str
     * - **assignment_date**: datetime.date
     * - **document_link**: str
     * - **profile_id**: str
     * @returns SportDegreeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PersonalSportDegreeIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: SportDegreeUpdate;
    }): CancelablePromise<SportDegreeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/personal/sport_degree/{id}/',
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
     * Delete SportDegree
     * Delete SportDegree
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PersonalSportDegreeIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/personal/sport_degree/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
