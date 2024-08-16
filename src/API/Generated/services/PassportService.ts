/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PassportCreate } from '../models/PassportCreate';
import type { PassportRead } from '../models/PassportRead';
import type { PassportUpdate } from '../models/PassportUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PassportService {
    /**
     * Get all Passport
     * Get all Passport
     *
     * - **skip**: int - The number of Passport
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Passport
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns PassportRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonalPassportGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PassportRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/passport',
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
     * Create Passport
     * Create new Passport
     *
     * - **document_number**: str
     * - **date_of_issue**: datetime.date
     * - **date_to**: datetime.date
     * - **document_link**: str
     * - **profile_id**: str
     * @returns PassportRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PersonalPassportPost({
        requestBody,
    }: {
        requestBody: PassportCreate;
    }): CancelablePromise<PassportRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/personal/passport',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Passport by id
     * Get Passport by id
     *
     * - **id**: UUID - required.
     * @returns PassportRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonalPassportIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<PassportRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/passport/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Passport
     * Update Passport
     *
     * - **id**: UUID - the ID of Passport to update. This is required.
     * - **document_link**: str (url)
     * @returns PassportRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PersonalPassportIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: PassportUpdate;
    }): CancelablePromise<PassportRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/personal/passport/{id}/',
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
     * Delete Passport
     * Delete Passport
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PersonalPassportIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/personal/passport/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
