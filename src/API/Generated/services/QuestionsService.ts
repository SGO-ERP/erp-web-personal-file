/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionCreateList } from '../models/QuestionCreateList';
import type { QuestionRead } from '../models/QuestionRead';
import type { QuestionReadPagination } from '../models/QuestionReadPagination';
import type { QuestionUpdate } from '../models/QuestionUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionsService {
    /**
     * Get all Questions
     * Get all Question
     *
     * - **skip**: int - The number of questions to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of questions to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns QuestionReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllApiV1QuestionsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<QuestionReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/questions',
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
     * Create new question
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns QuestionRead Successful Response
     * @throws ApiError
     */
    public static createApiV1QuestionsPost({
        requestBody,
    }: {
        requestBody: Array<QuestionCreateList>;
    }): CancelablePromise<Array<QuestionRead>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/questions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Questions by survey id
     * Get all Question by survey
     *
     * - **skip**: int - The number of questions to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of questions to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns QuestionRead Successful Response
     * @throws ApiError
     */
    public static getBySurveyApiV1QuestionsSurveyIdGet({
        surveyId,
    }: {
        surveyId: string;
    }): CancelablePromise<Array<QuestionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/questions/survey-id/',
            query: {
                'survey_id': surveyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Question by id
     * Get question by id
     *
     * - **id**: UUID - required.
     * @returns QuestionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1QuestionsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<QuestionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/questions/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Question
     * Update question
     *
     * - **id**: UUID - the ID of question to update. This is required.
     * - **name**: required.
     * - **url**: image url. This parameter is required.
     * @returns QuestionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1QuestionsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: QuestionUpdate;
    }): CancelablePromise<QuestionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/questions/{id}/',
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
     * Delete Question
     * Delete question
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1QuestionsIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/questions/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
