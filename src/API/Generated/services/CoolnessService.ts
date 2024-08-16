/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CoolnessCreate } from '../models/CoolnessCreate';
import type { CoolnessRead } from '../models/CoolnessRead';
import type { SpecialtyEnum } from '../models/SpecialtyEnum';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CoolnessService {
    /**
     * Get all Coolness
     * Get all Coolness
     *
     * - **skip**: int - The number of Coolness to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Coolness to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns CoolnessRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1CoolnessGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<CoolnessRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/coolness',
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
     * Create Coolness
     * Create Coolness
     *
     * **name** - required - str
     * @returns CoolnessRead Successful Response
     * @throws ApiError
     */
    public static createApiV1CoolnessPost({
        requestBody,
    }: {
        requestBody: CoolnessCreate;
    }): CancelablePromise<CoolnessRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/coolness',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Specialty Enum
     * Get all Specialty Enum
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllFormsApiV1CoolnessFormsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/coolness/forms/',
        });
    }

    /**
     * Get Coolness by id
     * Get Coolness by id
     *
     * - **id** - UUID - required
     * @returns CoolnessRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1CoolnessIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<CoolnessRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/coolness/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Coolness
     * Update Coolness
     *
     * **name** - required - str
     * @returns CoolnessRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1CoolnessIdPut({
        id,
        body,
    }: {
        id: string;
        body: SpecialtyEnum;
    }): CancelablePromise<CoolnessRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/coolness/{id}/',
            path: {
                'id': id,
            },
            query: {
                'body': body,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Coolness
     * Delete Coolness
     *
     * - **id** - UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1CoolnessIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/coolness/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
