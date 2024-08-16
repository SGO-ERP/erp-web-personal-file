/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceHousingCreate } from '../models/ServiceHousingCreate';
import type { ServiceHousingRead } from '../models/ServiceHousingRead';
import type { ServiceHousingUpdate } from '../models/ServiceHousingUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServiceHousingsService {
    /**
     * Get all Service Housings
     * Get all Service Housings
     *
     * - **skip**: int - The number of Service Housings to skip before returning
     * the results
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Service Housings to return in the response
     * This parameter is optional and defaults to 100.
     * @returns ServiceHousingRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AdditionalServiceHousingsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ServiceHousingRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/service-housings',
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
     * @returns ServiceHousingRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AdditionalServiceHousingsPost({
        requestBody,
    }: {
        requestBody: ServiceHousingCreate;
    }): CancelablePromise<ServiceHousingRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/additional/service-housings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update
     * Update Service Housing
     *
     * - **id**: required
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns ServiceHousingRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AdditionalServiceHousingsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ServiceHousingUpdate;
    }): CancelablePromise<ServiceHousingRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/additional/service-housings/{id}/',
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
     * Delete Service Housing
     *
     * - **id**: required
     * @returns ServiceHousingRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AdditionalServiceHousingsIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<ServiceHousingRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/additional/service-housings/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
