/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LiberationCreate } from '../models/LiberationCreate';
import type { LiberationRead } from '../models/LiberationRead';
import type { LiberationUpdate } from '../models/LiberationUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LiberationService {
    /**
     * Get all Liberation
     * Get all Liberation
     *
     * - **skip**: int - The number of Liberation
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Liberation
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns LiberationRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1MedicalLiberationsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<LiberationRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/liberations',
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
     * Create Liberation
     * Create new Liberation
     *
     * - **name**: str -required
     * @returns LiberationRead Successful Response
     * @throws ApiError
     */
    public static createApiV1MedicalLiberationsPost({
        requestBody,
    }: {
        requestBody: LiberationCreate;
    }): CancelablePromise<LiberationRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/medical/liberations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Liberation by id
     * Get Hospital Data by id
     *
     * - **id**: UUID - required.
     * @returns LiberationRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1MedicalLiberationsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<LiberationRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/liberations/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Liberation
     * Update Liberation
     *
     * - **id**: UUID - required.
     * - **name**: str -required
     * @returns LiberationRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1MedicalLiberationsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: LiberationUpdate;
    }): CancelablePromise<LiberationRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/medical/liberations/{id}/',
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
     * Delete Liberation
     * Delete a Liberation
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1MedicalLiberationsIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/medical/liberations/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
