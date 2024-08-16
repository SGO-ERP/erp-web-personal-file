/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JurisdictionRead } from '../models/JurisdictionRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class JurisdictionsService {
    /**
     * Get all Jurisdictions
     * Get all Jurisdictions
     *
     * - **skip**: int - The number of Jurisdictions
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Jurisdictions
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns JurisdictionRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1JurisdictionsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<JurisdictionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/jurisdictions',
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
     * Get Jurisdiction by id
     * Get Jurisdiction by id
     *
     * - **id**: UUID - required
     * @returns JurisdictionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1JurisdictionsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<JurisdictionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/jurisdictions/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
