/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MedicalProfileCreate } from '../models/MedicalProfileCreate';
import type { MedicalProfileRead } from '../models/MedicalProfileRead';
import type { MedicalProfileUpdate } from '../models/MedicalProfileUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MedicalProfileService {
    /**
     * Get all MedicalProfile
     * Get all Medical Profile
     *
     * - **skip**: int - The number of MedicalProfile
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of MedicalProfile
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns MedicalProfileRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1MedicalMedicalProfileGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<MedicalProfileRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/medical_profile',
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
     * Create MedicalProfile
     * Create new MedicalProfile
     *
     * - **profile_id**: str
     * @returns MedicalProfileRead Successful Response
     * @throws ApiError
     */
    public static createApiV1MedicalMedicalProfilePost({
        requestBody,
    }: {
        requestBody: MedicalProfileCreate;
    }): CancelablePromise<MedicalProfileRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/medical/medical_profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get MedicalProfile by id
     * Get MedicalProfile by id
     *
     * - **id**: UUID - required.
     * @returns MedicalProfileRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1MedicalMedicalProfileIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<MedicalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/medical_profile/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update MedicalProfile
     * Update Medical Profile
     *
     * - **id**: UUID - the ID of MedicalProfile to update. This is required.
     * - **profile_id**: str
     * @returns MedicalProfileRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1MedicalMedicalProfileIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: MedicalProfileUpdate;
    }): CancelablePromise<MedicalProfileRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/medical/medical_profile/{id}/',
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
     * Delete MedicalProfile
     * Delete a MedicalProfile
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1MedicalMedicalProfileIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/medical/medical_profile/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Profile
     * @returns MedicalProfileRead Successful Response
     * @throws ApiError
     */
    public static getProfileApiV1MedicalMedicalProfileProfileGet(): CancelablePromise<MedicalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/medical_profile/profile',
        });
    }

    /**
     * Get Profile By Id
     * @returns MedicalProfileRead Successful Response
     * @throws ApiError
     */
    public static getProfileByIdApiV1MedicalMedicalProfileProfileIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<MedicalProfileRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/medical_profile/profile/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
