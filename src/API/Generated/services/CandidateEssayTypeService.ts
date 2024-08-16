/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CandidateEssayTypeCreate } from '../models/CandidateEssayTypeCreate';
import type { CandidateEssayTypeRead } from '../models/CandidateEssayTypeRead';
import type { CandidateEssayTypeSetToCandidate } from '../models/CandidateEssayTypeSetToCandidate';
import type { CandidateEssayTypeUpdate } from '../models/CandidateEssayTypeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CandidateEssayTypeService {
    /**
     * Get all CandidateEssayType
     * Get all CandidateEssayType.
     *
     * - **skip**: int - The number of CandidateEssayType
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of CandidateEssayType
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns CandidateEssayTypeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1CandidateEssayTypeGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<CandidateEssayTypeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_essay_type',
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
     * Create a CandidateEssayType
     * Create a CandidateEssayType.
     *
     * - **name**: str - required
     * @returns CandidateEssayTypeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1CandidateEssayTypePost({
        requestBody,
    }: {
        requestBody?: CandidateEssayTypeCreate;
    }): CancelablePromise<CandidateEssayTypeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/candidate_essay_type',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get a CandidateEssayType by id
     * Get a CandidateEssayType by id.
     *
     * - **id**: required and should exist in the database.
     * @returns CandidateEssayTypeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1CandidateEssayTypeIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<CandidateEssayTypeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_essay_type/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update a CandidateEssayType
     * Update a CandidateEssayType.
     *
     * - **id**: required and should exist in the database.
     * - **name**: str - required
     * @returns CandidateEssayTypeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1CandidateEssayTypeIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody?: CandidateEssayTypeUpdate;
    }): CancelablePromise<CandidateEssayTypeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/candidate_essay_type/{id}',
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
     * Delete a CandidateEssayType
     * Delete a CandidateEssayType.
     *
     * - **id**: required and should exist in the database.
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1CandidateEssayTypeIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/candidate_essay_type/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create a CandidateEssayType and set to Candidate
     * Create a CandidateEssayType and set to Candidate.
     *
     * - **id**: UUID - optional and should exist in the database.
     * - **name**: str - optional
     *
     * 1. If candidate chooses from existing essay types then you can set id of essay
     * 2. If candidate creates a new essay you can send name of the new essay to create
     * @returns CandidateEssayTypeRead Successful Response
     * @throws ApiError
     */
    public static createAndSetToCandidateApiV1CandidateEssayTypeCandidateCandidateIdPost({
        candidateId,
        requestBody,
    }: {
        candidateId: string;
        requestBody?: CandidateEssayTypeSetToCandidate;
    }): CancelablePromise<CandidateEssayTypeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/candidate_essay_type/candidate/{candidate_id}',
            path: {
                'candidate_id': candidateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
