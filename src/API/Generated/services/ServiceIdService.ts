/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceIDCreate } from '../models/ServiceIDCreate';
import type { ServiceIDRead } from '../models/ServiceIDRead';
import type { ServiceIDStatus } from '../models/ServiceIDStatus';
import type { ServiceIDUpdate } from '../models/ServiceIDUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServiceIdService {
    /**
     * Get all ServiceID
     * Get all Profiles
     * @returns ServiceIDRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ServiceIdGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ServiceIDRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service_id',
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
     * Create new ServiceID
     *
     * no parameters required.
     * @returns ServiceIDRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ServiceIdPost({
        requestBody,
    }: {
        requestBody: ServiceIDCreate;
    }): CancelablePromise<ServiceIDRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service_id',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get ServiceID by id
     * Get ServiceID by id
     *
     * - **id**: UUID - required.
     * @returns ServiceIDRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ServiceIdIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ServiceIDRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service_id/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update ServiceID
     * Update ServiceID
     * @returns ServiceIDRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ServiceIdIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ServiceIDUpdate;
    }): CancelablePromise<ServiceIDRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/service_id/{id}/',
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
     * Delete ServiceID
     * Delete Profile
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1ServiceIdIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/service_id/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all ServiceID statuses
     * Get all ServiceID statuses
     * @returns ServiceIDStatus Successful Response
     * @throws ApiError
     */
    public static getAllStatusesApiV1ServiceIdstatusesGet(): CancelablePromise<
        Array<ServiceIDStatus>
    > {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service_idstatuses/',
        });
    }
}
