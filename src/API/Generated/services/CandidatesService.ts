/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CandidateCreate } from '../models/CandidateCreate';
import type { CandidateEssayUpdate } from '../models/CandidateEssayUpdate';
import type { CandidateRead } from '../models/CandidateRead';
import type { CandidateUpdate } from '../models/CandidateUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CandidatesService {
    /**
     * Get all Candidate
     * Get all Candidates.
     *
     * - **skip**: int - The number of Candidate
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Candidate
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns CandidateRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1CandidatesGet({
        skip,
        limit = 100,
        filter = '',
    }: {
        skip?: number;
        limit?: number;
        filter?: string;
    }): CancelablePromise<Array<CandidateRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidates',
            query: {
                'skip': skip,
                'limit': limit,
                'filter': filter,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create a Candidate
     * Create a Candidate.
     *
     * - **staff_unit_curator_id**: UUID - required and should exist in the database.
     * This is a staff unit who is the supervisor of a certain candidate
     * - **staff_unit_id**: UUID - required and should exist in the database.
     * @returns CandidateRead Successful Response
     * @throws ApiError
     */
    public static createApiV1CandidatesPost({
        requestBody,
    }: {
        requestBody: CandidateCreate;
    }): CancelablePromise<CandidateRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/candidates',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Draft Candidate
     * Get all Draft Candidates.
     *
     * - **skip**: int - The number of Candidate to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Candidate to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns CandidateRead Successful Response
     * @throws ApiError
     */
    public static getAllDraftCandidatesApiV1CandidatesDraftsGet({
        skip,
        limit = 100,
        filter = '',
    }: {
        skip?: number;
        limit?: number;
        filter?: string;
    }): CancelablePromise<Array<CandidateRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidates/drafts',
            query: {
                'skip': skip,
                'limit': limit,
                'filter': filter,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get a Candidate by id
     * Get a Candidate by id.
     *
     * - **id**: UUID - required and should exist in the database.
     * @returns CandidateRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1CandidatesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<CandidateRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidates/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update a Candidate
     * Update a Candidate.
     *
     * - **staff_unit_curator_id**: UUID - optional and should exist in the database.
     * This is a staff unit who is the supervisor of a certain candidate
     * - **staff_unit_id**: UUID - optional and should exist in the database.
     * - **status**: str - optional. Available statuses are provided below:
     *
     * 1. Активный
     * 2. Черновик
     * @returns CandidateRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1CandidatesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody?: CandidateUpdate;
    }): CancelablePromise<CandidateRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/candidates/{id}',
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
     * Delete a Candidate
     * Delete a Candidate.
     *
     * - **id**: required and should exist in the database.
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1CandidatesIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/candidates/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Essay for Candidate
     * Update a Candidate.
     *
     * - **id**: UUID - required and should exist in the database.
     * - **essay_id**: UUID - required and should exist in the database.
     * @returns CandidateRead Successful Response
     * @throws ApiError
     */
    public static updateEssayApiV1CandidatesIdPatch({
        id,
        requestBody,
    }: {
        id: string;
        requestBody?: CandidateEssayUpdate;
    }): CancelablePromise<CandidateRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/candidates/{id}',
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
     * Finish studying the candidate
     * Finish studying the candidate.
     *
     * - **id**: UUID - required and should exist in the database.
     * - **essay_id**: UUID - required and should exist in the database.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static finishCandidateApiV1CandidatesIdFinishPost({
        id,
    }: {
        id: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/candidates/{id}/finish/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
