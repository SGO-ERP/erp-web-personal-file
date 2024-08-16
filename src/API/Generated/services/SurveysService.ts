/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SurveyCreateWithJurisdiction } from '../models/SurveyCreateWithJurisdiction';
import type { SurveyRead } from '../models/SurveyRead';
import type { SurveyReadPagination } from '../models/SurveyReadPagination';
import type { SurveyUpdate } from '../models/SurveyUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SurveysService {
    /**
     * Get all Surveys
     * Get all Surveys
     *
     * - **skip**: int - The number of surveys to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of surveys to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns SurveyReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllActiveApiV1SurveysGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<SurveyReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/surveys',
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
     * Create new survey
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns SurveyRead Successful Response
     * @throws ApiError
     */
    public static createApiV1SurveysPost({
        requestBody,
    }: {
        requestBody: SurveyCreateWithJurisdiction;
    }): CancelablePromise<SurveyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/surveys',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all competence forms
     * Get all competence forms
     *
     * - **skip**: int - The number of surveys to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of surveys to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns SurveyReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllCompetenceFormsApiV1SurveysCompetenceFormsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<SurveyReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/surveys/competence_forms',
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
     * Get all archive Surveys
     * Get all archive Surveys
     *
     * - **skip**: int - The number of surveys to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of surveys to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns SurveyReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllArchivesApiV1SurveysArchivesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<SurveyReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/surveys/archives',
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
     * Get all draft Surveys
     * Get all draft Surveys
     *
     * - **skip**: int - The number of surveys to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of surveys to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns SurveyReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllDraftApiV1SurveysDraftsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<SurveyReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/surveys/drafts',
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
     * Get Surveys & Quizzes by jurisdiction
     * Get all Surveys by jurisdiction
     *
     * - **skip**: int - The number of surveys to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of surveys to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns SurveyReadPagination Successful Response
     * @throws ApiError
     */
    public static getSurveysAndQuizzesByJurisdictionApiV1SurveysMyGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<SurveyReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/surveys/my',
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
     * Get Surveys & Quizzes by jurisdiction
     * Get all Surveys by jurisdiction
     *
     * - **skip**: int - The number of surveys to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of surveys to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns SurveyReadPagination Successful Response
     * @throws ApiError
     */
    public static getCompetenceFormsByJurisdictionApiV1SurveysMyCompetenceFormsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<SurveyReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/surveys/my/competence-forms',
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
     * Duplicate
     * Duplicate the survey
     *
     * - **id**: required
     * @returns SurveyRead Successful Response
     * @throws ApiError
     */
    public static duplicateApiV1SurveysIdDuplicatePost({
        id,
    }: {
        id: string;
    }): CancelablePromise<SurveyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/surveys/{id}/duplicate',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Repeat
     * Repeat the survey
     *
     * - **id**: required
     * @returns SurveyRead Successful Response
     * @throws ApiError
     */
    public static repeatApiV1SurveysIdRepeatPost({
        id,
    }: {
        id: string;
    }): CancelablePromise<SurveyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/surveys/{id}/repeat',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Save as draft
     * Create new survey
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns SurveyRead Successful Response
     * @throws ApiError
     */
    public static saveAsDraftApiV1SurveysDraftPost({
        requestBody,
    }: {
        requestBody: SurveyCreateWithJurisdiction;
    }): CancelablePromise<SurveyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/surveys/draft',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Survey by id
     * Get survey by id
     *
     * - **id**: UUID - required.
     * @returns SurveyRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1SurveysIdGet({ id }: { id: string }): CancelablePromise<SurveyRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/surveys/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Survey
     * Update survey
     *
     * - **id**: UUID - the ID of survey to update. This is required.
     * - **name**: required.
     * - **url**: image url. This parameter is required.
     * @returns SurveyRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1SurveysIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: SurveyUpdate;
    }): CancelablePromise<SurveyRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/surveys/{id}/',
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
     * Delete Survey
     * Delete survey
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1SurveysIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/surveys/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
