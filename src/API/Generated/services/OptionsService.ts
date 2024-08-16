/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OptionRead } from '../models/OptionRead';
import type { OptionReadPagination } from '../models/OptionReadPagination';
import type { OptionUpdate } from '../models/OptionUpdate';
import type { schemas__survey__option__OptionCreate } from '../models/schemas__survey__option__OptionCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OptionsService {
    /**
     * Get all Options
     * Get all Option
     *
     * - **skip**: int - The number of options to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of options to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns OptionReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllApiV1OptionsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<OptionReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/options',
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
     * @returns OptionRead Successful Response
     * @throws ApiError
     */
    public static createApiV1OptionsPost({
        requestBody,
    }: {
        requestBody: Array<schemas__survey__option__OptionCreate>;
    }): CancelablePromise<Array<OptionRead>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/options',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Options by question id
     * Get all Option by question id
     * @returns OptionRead Successful Response
     * @throws ApiError
     */
    public static getByQuestionApiV1OptionsQuestionIdGet({
        questionId,
    }: {
        questionId: string;
    }): CancelablePromise<Array<OptionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/options/question-id/',
            query: {
                'question_id': questionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Option by id
     * Get question by id
     *
     * - **id**: UUID - required.
     * @returns OptionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1OptionsIdGet({ id }: { id: string }): CancelablePromise<OptionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/options/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Option
     * Update question
     *
     * - **id**: UUID - the ID of question to update. This is required.
     * - **name**: required.
     * - **url**: image url. This parameter is required.
     * @returns OptionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1OptionsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: OptionUpdate;
    }): CancelablePromise<OptionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/options/{id}/',
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
     * Delete Option
     * Delete question
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1OptionsIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/options/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
