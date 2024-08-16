/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonnalReserveCreate } from '../models/PersonnalReserveCreate';
import type { PersonnalReserveRead } from '../models/PersonnalReserveRead';
import type { PersonnalReserveUpdate } from '../models/PersonnalReserveUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PersonnalReserveService {
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
     * @returns PersonnalReserveRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonnalReserveGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PersonnalReserveRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personnal_reserve',
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
     * @returns PersonnalReserveRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PersonnalReservePost({
        requestBody,
    }: {
        requestBody: PersonnalReserveCreate;
    }): CancelablePromise<PersonnalReserveRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/personnal_reserve',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Reserve Enum
     * Get all Privelege Emergency Forms
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllFormsApiV1PersonnalReserveFormsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personnal_reserve/forms/',
        });
    }

    /**
     * Get Privelege Emergency Unit by id
     * Get Privelege Emergency by id
     *
     * - **id** - UUID - required
     * @returns PersonnalReserveRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonnalReserveIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<PersonnalReserveRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personnal_reserve/{id}/',
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
     * @returns PersonnalReserveRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PersonnalReserveIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: PersonnalReserveUpdate;
    }): CancelablePromise<PersonnalReserveRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/personnal_reserve/{id}/',
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
    public static deleteApiV1PersonnalReserveIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/personnal_reserve/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
