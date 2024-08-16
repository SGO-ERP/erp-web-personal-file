/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaxDeclarationCreate } from '../models/TaxDeclarationCreate';
import type { TaxDeclarationRead } from '../models/TaxDeclarationRead';
import type { TaxDeclarationUpdate } from '../models/TaxDeclarationUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TaxDeclarationService {
    /**
     * Get all TaxDeclaration
     * Get all TaxDeclaration
     *
     * - **skip**: int - The number of TaxDeclaration
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of TaxDeclaration
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns TaxDeclarationRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonalTaxDeclarationGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<TaxDeclarationRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/tax_declaration',
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
     * Create TaxDeclaration
     * Create new TaxDeclaration
     *
     * - **id**: UUID - the ID of TaxDeclaration to update. This is required.
     * - **year**: str
     * - **is_paid**: bool
     * - **profile_id**: str
     * @returns TaxDeclarationRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PersonalTaxDeclarationPost({
        requestBody,
    }: {
        requestBody: TaxDeclarationCreate;
    }): CancelablePromise<TaxDeclarationRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/personal/tax_declaration',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get TaxDeclaration by id
     * Get TaxDeclaration by id
     *
     * - **id**: UUID - required.
     * @returns TaxDeclarationRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonalTaxDeclarationIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<TaxDeclarationRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/tax_declaration/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update TaxDeclaration
     * Update TaxDeclaration
     *
     * - **year**: str
     * - **is_paid**: bool
     * - **profile_id**: str
     * @returns TaxDeclarationRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PersonalTaxDeclarationIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: TaxDeclarationUpdate;
    }): CancelablePromise<TaxDeclarationRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/personal/tax_declaration/{id}/',
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
     * Delete TaxDeclaration
     * Delete TaxDeclaration
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PersonalTaxDeclarationIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/personal/tax_declaration/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
