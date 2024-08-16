/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AbroadTravelCreate } from '../models/AbroadTravelCreate';
import type { AbroadTravelRead } from '../models/AbroadTravelRead';
import type { AbroadTravelUpdate } from '../models/AbroadTravelUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AbroadTravelService {
    /**
     * Get all Abroad Travel
     * Get all Abroad Travel
     *
     * - **skip**: int - The number of abroad travel to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of abroad travel to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AbroadTravelRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AdditionalAbroadTravelGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<AbroadTravelRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/abroad-travel',
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
     * Create new abroad travel
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns AbroadTravelRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AdditionalAbroadTravelPost({
        requestBody,
    }: {
        requestBody: AbroadTravelCreate;
    }): CancelablePromise<AbroadTravelRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/additional/abroad-travel',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Abroad Travel by id
     * Update abroad travel by id
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns AbroadTravelRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AdditionalAbroadTravelIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: AbroadTravelUpdate;
    }): CancelablePromise<AbroadTravelRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/additional/abroad-travel/{id}/',
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
     * Delete Abroad Travel by id
     * Delete abroad travel by id
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns AbroadTravelRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AdditionalAbroadTravelIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<AbroadTravelRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/additional/abroad-travel/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
