/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CandidateStageQuestionCreate } from '../models/CandidateStageQuestionCreate';
import type { CandidateStageQuestionUpdate } from '../models/CandidateStageQuestionUpdate';
import type { schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead } from '../models/schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CandidateStageQuestionService {
    /**
     * Get all CandidateStageQuestion
     * Get all CandidateStageQuestion.
     *
     * - **skip**: int - The number of CandidateStageQuestion
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of CandidateStageQuestion
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1CandidateStageQuestionGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<
        Array<schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead>
    > {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_stage_question',
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
     * Create a CandidateStageQuestion
     * Create a Candidate.
     *
     * - **question**: str - required
     * - **question_type**: str - required
     * @returns schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead Successful Response
     * @throws ApiError
     */
    public static createApiV1CandidateStageQuestionPost({
        requestBody,
    }: {
        requestBody?: CandidateStageQuestionCreate;
    }): CancelablePromise<schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/candidate_stage_question',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get a CandidateStageQuestion by id
     * Get a CandidateStageQuestion by id.
     *
     * - **id**: UUID - required and should exist in the database.
     * @returns schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1CandidateStageQuestionIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_stage_question/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update a CandidateStageQuestion
     * Update a CandidateStageQuestion.
     *
     * - **id**: UUID - required and should exist in the database.
     * - **question**: str - required
     * - **question_type**: str - required
     * - **candidate_stage_type_id**: UUID - required and should exist in the database.
     * @returns schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1CandidateStageQuestionIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody?: CandidateStageQuestionUpdate;
    }): CancelablePromise<schemas__user_candidates__candidate_stage_question__CandidateStageQuestionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/candidate_stage_question/{id}',
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
     * Delete a CandidateStageQuestion
     * Delete a CandidateStageQuestion.
     *
     * - **id**: UUID - required and should exist in the database.
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1CandidateStageQuestionIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/candidate_stage_question/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
