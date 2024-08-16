/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdentificationCardCreate } from '../models/IdentificationCardCreate';
import type { IdentificationCardRead } from '../models/IdentificationCardRead';
import type { IdentificationCardUpdate } from '../models/IdentificationCardUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class IdentificationCardService {
    /**
     * Get all IdentificationCard
     * Get all IdentificationCard
     *
     * - **skip**: int - The number of IdentificationCard
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of IdentificationCard
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns IdentificationCardRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonalIdentificationCardGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<IdentificationCardRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/identification_card',
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
     * Create IdentificationCard
     * Create new IdentificationCard
     *
     * - **document_number**: str
     * - **date_of_issue**: datetime.date
     * - **date_to: datetime**.date
     * - **issued_by**: str
     * - **document_link**: str
     * - **profile_id**: str
     * @returns IdentificationCardRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PersonalIdentificationCardPost({
        requestBody,
    }: {
        requestBody: IdentificationCardCreate;
    }): CancelablePromise<IdentificationCardRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/personal/identification_card',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get IdentificationCard by id
     * Get IdentificationCard by id
     *
     * - **id**: UUID - required.
     * @returns IdentificationCardRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonalIdentificationCardIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<IdentificationCardRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/identification_card/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update IdentificationCard
     * Update IdentificationCard
     *
     * - **id**: UUID - the ID of IdentificationCard to update. This is required.
     * - **document_link**: str (url)
     * @returns IdentificationCardRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PersonalIdentificationCardIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: IdentificationCardUpdate;
    }): CancelablePromise<IdentificationCardRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/personal/identification_card/{id}/',
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
     * Delete IdentificationCard
     * Delete IdentificationCard
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PersonalIdentificationCardIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/personal/identification_card/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
