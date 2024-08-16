/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InstitutionCreate } from '../models/InstitutionCreate';
import type { InstitutionRead } from '../models/InstitutionRead';
import type { InstitutionUpdate } from '../models/InstitutionUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class InstitutionsService {
    /**
     * Get all Institutions
     * Get all Institutions
     *
     * - **skip**: int - The number of Institutions
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Institutions
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns InstitutionRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationInstitutionsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<InstitutionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/institutions',
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
     * Create new Institution
     *
     * - **name**: required
     * @returns InstitutionRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationInstitutionsPost({
        requestBody,
    }: {
        requestBody: InstitutionCreate;
    }): CancelablePromise<InstitutionRead> {

        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/institutions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Institution by id
     * Get Institution by id
     *
     * - **id**: UUID - required.
     * @returns InstitutionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationInstitutionsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<InstitutionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/institutions/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Institution
     * Update Institution
     *
     * - **id**: UUID - the ID of Institution to update. This is required.
     * - **name**: required.
     * @returns InstitutionRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationInstitutionsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: InstitutionUpdate;
    }): CancelablePromise<InstitutionRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/institutions/{id}/',
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
     * Delete Institution
     * Delete Institution
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationInstitutionsIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/institutions/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
