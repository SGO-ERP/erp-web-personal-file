/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CountryCreate } from '../models/CountryCreate';
import type { CountryRead } from '../models/CountryRead';
import type { CountryUpdate } from '../models/CountryUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CountryService {
    /**
     * Get all Country
     * Get all Country
     *
     * - **skip**: int - The number of country to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of country to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns CountryRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AdditionalCountryGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<CountryRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/country',
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
     * Create new country
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns CountryRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AdditionalCountryPost({
        requestBody,
    }: {
        requestBody: CountryCreate;
    }): CancelablePromise<CountryRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/additional/country',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update
     * Update country
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns CountryRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AdditionalCountryIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: CountryUpdate;
    }): CancelablePromise<CountryRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/additional/country/{id}/',
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
     * Delete
     * Delete country
     * @returns CountryRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AdditionalCountryIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<CountryRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/additional/country/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
