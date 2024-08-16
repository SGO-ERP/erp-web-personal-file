/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HrDocumentStatusRead } from '../models/HrDocumentStatusRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HrDocumentStatusService {
    /**
     * Get all HrDocumentStatus
     * Get all HrDocumentStatus
     *
     * - **skip**: int - The number of HrDocumentStatus
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of HrDocumentStatus
     * to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns HrDocumentStatusRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1HrDocumentStatusGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<HrDocumentStatusRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-document-status',
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
     * Get HrDocumentStatus by id
     * Get HrDocumentStatus by id
     *
     * - **id**: UUID - required
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1HrDocumentStatusIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-document-status/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
