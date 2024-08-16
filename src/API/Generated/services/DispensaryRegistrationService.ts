/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DispensaryRegistrationCreate } from '../models/DispensaryRegistrationCreate';
import type { DispensaryRegistrationRead } from '../models/DispensaryRegistrationRead';
import type { DispensaryRegistrationUpdate } from '../models/DispensaryRegistrationUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DispensaryRegistrationService {
    /**
     * Get all DispensaryRegistration
     * Get all DispensaryRegistration
     *
     * - **skip**: int - The number of DispensaryRegistration
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of DispensaryRegistration
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns DispensaryRegistrationRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1MedicalDispensaryRegistrationGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<DispensaryRegistrationRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/dispensary_registration',
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
     * Create DispensaryRegistration
     * Create new DispensaryRegistration
     *
     * - **initiator**: str
     * - **start_date**: datetime.datetime
     * - **end_date**: datetime.datetime
     * - **document_link**: str
     * - **profile_id**: str
     * @returns DispensaryRegistrationRead Successful Response
     * @throws ApiError
     */
    public static createApiV1MedicalDispensaryRegistrationPost({
        requestBody,
    }: {
        requestBody: DispensaryRegistrationCreate;
    }): CancelablePromise<DispensaryRegistrationRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/medical/dispensary_registration',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get DispensaryRegistration by id
     * Get DispensaryRegistration by id
     * - **id**: UUID - required.
     * @returns DispensaryRegistrationRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1MedicalDispensaryRegistrationIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<DispensaryRegistrationRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/dispensary_registration/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update DispensaryRegistration
     * Update AcademicDegree
     *
     * - **id**: UUID - the ID of DispensaryRegistration to update. This is required.
     * - **initiator**: str
     * - **start_date**: datetime.datetime
     * - **end_date**: datetime.datetime
     * - **document_link**: str
     * - **profile_id**: str
     * @returns DispensaryRegistrationRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1MedicalDispensaryRegistrationIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: DispensaryRegistrationUpdate;
    }): CancelablePromise<DispensaryRegistrationRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/medical/dispensary_registration/{id}/',
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
     * Delete DispensaryRegistration
     * Delete a DispensaryRegistration
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1MedicalDispensaryRegistrationIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/medical/dispensary_registration/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
