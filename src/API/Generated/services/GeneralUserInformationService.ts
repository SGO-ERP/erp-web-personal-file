/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GeneralUserInformationCreate } from '../models/GeneralUserInformationCreate';
import type { GeneralUserInformationRead } from '../models/GeneralUserInformationRead';
import type { GeneralUserInformationUpdate } from '../models/GeneralUserInformationUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GeneralUserInformationService {
    /**
     * Get all GeneralUserInformation
     * Get all GeneralUserInformation
     *
     * - **skip**: int - The number of GeneralUserInformation
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of GeneralUserInformation
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns GeneralUserInformationRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1MedicalGeneralUserInformationGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<GeneralUserInformationRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/general_user_information',
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
     * Create GeneralUserInformation
     * Create new GeneralUserInformation
     *
     * - **height**: int
     * - **blood_group**: str
     * - **age_group**: int
     * - **profile_id**: str
     * @returns GeneralUserInformationRead Successful Response
     * @throws ApiError
     */
    public static createApiV1MedicalGeneralUserInformationPost({
        requestBody,
    }: {
        requestBody: GeneralUserInformationCreate;
    }): CancelablePromise<GeneralUserInformationRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/medical/general_user_information',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get GeneralUserInformation by id
     * Get GeneralUserInformation by id
     *
     * - **id**: UUID - required.
     * @returns GeneralUserInformationRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1MedicalGeneralUserInformationIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<GeneralUserInformationRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/general_user_information/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update GeneralUserInformation
     * Update GeneralUserInformation
     *
     * - **id**: UUID - the ID of GeneralUserInformation to update. This is required.
     * - **height**: int
     * - **blood_group**: str
     * - **age_group**: int
     * - **profile_id**: str
     * @returns GeneralUserInformationRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1MedicalGeneralUserInformationIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: GeneralUserInformationUpdate;
    }): CancelablePromise<GeneralUserInformationRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/medical/general_user_information/{id}/',
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
     * Delete GeneralUserInformation
     * Delete a GeneralUserInformation
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1MedicalGeneralUserInformationIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/medical/general_user_information/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
