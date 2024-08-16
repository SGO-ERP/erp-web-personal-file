/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerCreate } from '../models/AnswerCreate';
import type { AnswerRead } from '../models/AnswerRead';
import type { AnswerReadPagination } from '../models/AnswerReadPagination';
import type { AnswerUpdate } from '../models/AnswerUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AnswersService {
    /**
     * Get all Answers
     * Get all Answer
     *
     * - **skip**: int - The number of answers to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of answers to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AnswerReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AnswersGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<AnswerReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/answers',
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
     * @returns AnswerRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AnswersPost({
        requestBody,
    }: {
        requestBody: Array<AnswerCreate>;
    }): CancelablePromise<Array<AnswerRead>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/answers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all by survey
     * Get all Answer by survey
     *
     * - **skip**: int - The number of answers to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of answers to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AnswerRead Successful Response
     * @throws ApiError
     */
    public static getBySurveyIdApiV1AnswersSurveySurveyIdGet({
        surveyId,
        userId,
    }: {
        surveyId: string;
        userId?: string;
    }): CancelablePromise<Array<AnswerRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/answers/survey/{survey_id}',
            path: {
                'survey_id': surveyId,
            },
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get responded users
     * Get responded users
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getRespondedUsersApiV1AnswersSurveySurveyIdUsersGet({
        surveyId,
    }: {
        surveyId: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/answers/survey/{survey_id}/users',
            path: {
                'survey_id': surveyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all by survey
     * Get all Answer by survey
     *
     * - **skip**: int - The number of answers to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of answers to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeByStaffDivisionApiV1AnswersSurveySurveyIdStatisticsGet({
        surveyId,
    }: {
        surveyId: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/answers/survey/{survey_id}/statistics',
            path: {
                'survey_id': surveyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all by question
     * Get all Answer by question
     *
     * - **skip**: int - The number of answers to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of answers to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeByQuestionsApiV1AnswersSurveySurveyIdQuestionsGet({
        surveyId,
    }: {
        surveyId: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/answers/survey/{survey_id}/questions',
            path: {
                'survey_id': surveyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Analyze question with text type
     * Get all Answer by question
     *
     * - **skip**: int - The number of answers to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of answers to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeByQuestionsApiV1AnswersQuestionTextQuestionIdGet({
        questionId,
    }: {
        questionId: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/answers/question-text/{question_id}/',
            path: {
                'question_id': questionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Answer by id
     * Get question by id
     *
     * - **id**: UUID - required.
     * @returns AnswerRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1AnswersIdGet({ id }: { id: string }): CancelablePromise<AnswerRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/answers/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Answer
     * Update question
     *
     * - **id**: UUID - the ID of question to update. This is required.
     * - **name**: required.
     * - **url**: image url. This parameter is required.
     * @returns AnswerRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AnswersIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: AnswerUpdate;
    }): CancelablePromise<AnswerRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/answers/{id}/',
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
     * Delete Answer
     * Delete question
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1AnswersIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/answers/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
