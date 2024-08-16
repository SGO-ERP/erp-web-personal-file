/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FamilyCreate } from '../models/FamilyCreate';
import type { FamilyRead } from '../models/FamilyRead';
import type { FamilyUpdate } from '../models/FamilyUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FamilyMembersService {
    /**
     * Get All
     * @returns FamilyRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1FamilyFamiliesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<FamilyRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family/families',
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
     * @returns FamilyRead Successful Response
     * @throws ApiError
     */
    public static createApiV1FamilyFamiliesPost({
        requestBody,
    }: {
        requestBody: FamilyCreate;
    }): CancelablePromise<FamilyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/family/families',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get
     * @returns FamilyRead Successful Response
     * @throws ApiError
     */
    public static getApiV1FamilyFamiliesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<FamilyRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family/families/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update
     * @returns FamilyRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1FamilyFamiliesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: FamilyUpdate;
    }): CancelablePromise<FamilyRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/family/families/{id}/',
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
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1FamilyFamiliesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/family/families/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
