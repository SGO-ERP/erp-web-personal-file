/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CandidateStageTypeCreate } from '../models/CandidateStageTypeCreate';
import type { CandidateStageTypeRead } from '../models/CandidateStageTypeRead';
import type { CandidateStageTypeUpdate } from '../models/CandidateStageTypeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CandidateStageTypeService {
    /**
     * Get all CandidateStageType
     * Get all Candidates.
     *
     * - **skip**: int - The number of badges
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of badges
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns CandidateStageTypeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1CandidateStageTypeGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<CandidateStageTypeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_stage_type',
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
     * Create a CandidateStageType
     * Create a CandidateStageType.
     *
     * - **name**: str - required
     * @returns CandidateStageTypeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1CandidateStageTypePost({
        requestBody,
    }: {
        requestBody?: CandidateStageTypeCreate;
    }): CancelablePromise<CandidateStageTypeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/candidate_stage_type',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get a CandidateStageType by id
     * Get a CandidateStageType by id.
     *
     * - **id**: UUID - required and should exist in the database.
     * @returns CandidateStageTypeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1CandidateStageTypeIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<CandidateStageTypeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_stage_type/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update a CandidateStageType
     * Update a CandidateStageType.
     *
     * - **id**: UUID - required and should exist in the database.
     * - **name**: str - required
     * @returns CandidateStageTypeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1CandidateStageTypeIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody?: CandidateStageTypeUpdate;
    }): CancelablePromise<CandidateStageTypeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/candidate_stage_type/{id}',
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
     * Delete a CandidateStageType
     * Delete a CandidateStageType.
     *
     * - **id**: UUID - required and should exist in the database.
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1CandidateStageTypeIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/candidate_stage_type/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
