/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SportTypeCreate } from '../models/SportTypeCreate';
import type { SportTypeRead } from '../models/SportTypeRead';
import type { SportTypeUpdate } from '../models/SportTypeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SportTypeService {
    /**
     * Get all SportType
     * Get all SportType
     *
     * - **skip**: int - The number of SportType
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of SportType
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns SportTypeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonalSportTypeGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<SportTypeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/sport_type',
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
     * Create SportType
     * Create new SportType
     *
     * - **name**: str
     * @returns SportTypeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PersonalSportTypePost({
        requestBody,
    }: {
        requestBody: SportTypeCreate;
    }): CancelablePromise<SportTypeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/personal/sport_type',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get SportType by id
     * Get SportType by id
     * @returns SportTypeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonalSportTypeIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<SportTypeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/sport_type/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update SportType by id
     * Update SportType by id
     *
     * - **name**: str
     * @returns SportTypeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PersonalSportTypeIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: SportTypeUpdate;
    }): CancelablePromise<SportTypeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/personal/sport_type/{id}/',
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
     * Delete SportType by id
     * Delete SportType by id
     * @returns SportTypeRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1PersonalSportTypeIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<SportTypeRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/personal/sport_type/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
