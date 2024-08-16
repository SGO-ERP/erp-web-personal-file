/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PropertiesCreate } from '../models/PropertiesCreate';
import type { PropertiesRead } from '../models/PropertiesRead';
import type { PropertiesUpdate } from '../models/PropertiesUpdate';
import type { PropertyTypeCreate } from '../models/PropertyTypeCreate';
import type { PropertyTypeRead } from '../models/PropertyTypeRead';
import type { PropertyTypeUpdate } from '../models/PropertyTypeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PropertiesService {
    /**
     * Get all Properties
     * Get all Properties
     *
     * - **skip**: int - The number of Propertiers to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Properties to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns PropertiesRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AdditionalPropertiesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PropertiesRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/properties',
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
     * @returns PropertiesRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AdditionalPropertiesPost({
        requestBody,
    }: {
        requestBody: PropertiesCreate;
    }): CancelablePromise<PropertiesRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/additional/properties',
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
     * @returns PropertiesRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AdditionalPropertiesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: PropertiesUpdate;
    }): CancelablePromise<PropertiesRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/additional/properties/{id}/',
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
     * Delete properties by id
     * Delete properties by id
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns PropertiesRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AdditionalPropertiesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<PropertiesRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/additional/properties/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Properties
     * Get all Properties
     *
     * - **skip**: int - The number of Properties to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Properties to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns PropertyTypeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AdditionalPropertyTypesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PropertyTypeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/property_types',
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
     * @returns PropertyTypeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AdditionalPropertyTypesPost({
        requestBody,
    }: {
        requestBody: PropertyTypeCreate;
    }): CancelablePromise<PropertyTypeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/additional/property_types',
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
     * @returns PropertyTypeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AdditionalPropertyTypesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: PropertyTypeUpdate;
    }): CancelablePromise<PropertyTypeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/additional/property_types/{id}/',
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
     * Delete properties by id
     * Delete properties by id
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns PropertyTypeRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AdditionalPropertyTypesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<PropertyTypeRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/additional/property_types/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
