/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PsychologicalCheckCreate } from '../models/PsychologicalCheckCreate';
import type { PsychologicalCheckRead } from '../models/PsychologicalCheckRead';
import type { PsychologicalCheckUpdate } from '../models/PsychologicalCheckUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PsychologicalCheckService {
    /**
     * Get all Polygraph Check
     * Get all Abroad Travel
     *
     * - **skip**: int - The number of abroad travel to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of abroad travel to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns PsychologicalCheckRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AdditionalPsychologicalCheckGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<PsychologicalCheckRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/additional/psychological-check',
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
     * @returns PsychologicalCheckRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AdditionalPsychologicalCheckPost({
        requestBody,
    }: {
        requestBody: PsychologicalCheckCreate;
    }): CancelablePromise<PsychologicalCheckRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/additional/psychological-check',
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
     * @returns PsychologicalCheckRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AdditionalPsychologicalCheckIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: PsychologicalCheckUpdate;
    }): CancelablePromise<PsychologicalCheckRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/additional/psychological-check/{id}/',
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
     * Delete Abroad Travel by id
     * Delete abroad travel by id
     *
     * - **name**: required
     * - **url**: image url. This parameter is required
     * @returns PsychologicalCheckRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AdditionalPsychologicalCheckIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<PsychologicalCheckRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/additional/psychological-check/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
