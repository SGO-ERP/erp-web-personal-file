/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PrivelegeEmergencyCreate } from '../models/PrivelegeEmergencyCreate';
import type { PrivelegeEmergencyRead } from '../models/PrivelegeEmergencyRead';
import type { PrivelegeEmergencyUpdate } from '../models/PrivelegeEmergencyUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PrivelegeEmergencyService {
    /**
     * Get all Privelege Emergencies
     * Get all Military Units
     *
     * - **skip**: int - The number of Military Units
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Military Units
     * to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns PrivelegeEmergencyRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PrivelegeEmergenciesGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PrivelegeEmergencyRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/privelege_emergencies',
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
     * Create Military Unit
     * Create Military Unit
     *
     * **name** - required - str
     * @returns PrivelegeEmergencyRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PrivelegeEmergenciesPost({
        requestBody,
    }: {
        requestBody: PrivelegeEmergencyCreate;
    }): CancelablePromise<PrivelegeEmergencyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/privelege_emergencies',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Privelege Emergency Forms
     * Get all Privelege Emergency Forms
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllFormsApiV1PrivelegeEmergenciesFormsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/privelege_emergencies/forms/',
        });
    }

    /**
     * Get Privelege Emergency Unit by id
     * Get Privelege Emergency by id
     *
     * - **id** - UUID - required
     * @returns PrivelegeEmergencyRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PrivelegeEmergenciesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<PrivelegeEmergencyRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/privelege_emergencies/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Privelege Emergency
     * Update Privelege Emergency
     *
     * **name** - required - str
     * @returns PrivelegeEmergencyRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PrivelegeEmergenciesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: PrivelegeEmergencyUpdate;
    }): CancelablePromise<PrivelegeEmergencyRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/privelege_emergencies/{id}/',
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
     * Delete Privelege Emergency
     * Delete Military Unit
     *
     * - **id** - UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PrivelegeEmergenciesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/privelege_emergencies/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Privelege Emergency Unit by user id
     * Get Privelege Emergency by user id
     *
     * - **user_id** - UUID - required
     * @returns PrivelegeEmergencyRead Successful Response
     * @throws ApiError
     */
    public static getByUserIdApiV1PrivelegeEmergenciesUserIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<PrivelegeEmergencyRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/privelege_emergencies/user/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
