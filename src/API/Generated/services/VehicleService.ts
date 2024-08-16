/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VehicleCreate } from '../models/VehicleCreate';
import type { VehicleRead } from '../models/VehicleRead';
import type { VehicleUpdate } from '../models/VehicleUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class VehicleService {
    /**
     * Get all Vehicles
     * Get all Abroad Travel
     *
     * - **skip**: int - The number of abroad travel to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of abroad travel to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns VehicleRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AdditionalVehicleGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<VehicleRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/vehicle',
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
     * Create Vehicle
     * Create new abroad travel
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns VehicleRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AdditionalVehiclePost({
        requestBody,
    }: {
        requestBody: VehicleCreate;
    }): CancelablePromise<VehicleRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/additional/vehicle',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Vehicle by id
     * Get abroad travel by id
     *
     * - **skip**: int - The number of abroad travel to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of abroad travel to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns VehicleRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1AdditionalVehicleIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<VehicleRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/vehicle/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Vehicle by id
     * Update abroad travel by id
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns VehicleRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AdditionalVehicleIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: VehicleUpdate;
    }): CancelablePromise<VehicleRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/additional/vehicle/{id}/',
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
     * Delete Vehicle by id
     * Delete abroad travel by id
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns VehicleRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AdditionalVehicleIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<VehicleRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/additional/vehicle/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
