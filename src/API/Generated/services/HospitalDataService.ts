/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HospitalDataCreate } from '../models/HospitalDataCreate';
import type { HospitalDataRead } from '../models/HospitalDataRead';
import type { HospitalDataUpdate } from '../models/HospitalDataUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HospitalDataService {
    /**
     * Get all HospitalData
     * Get all HospitalData
     *
     * - **skip**: int - The number of HospitalData
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of HospitalData
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns HospitalDataRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1MedicalHospitalDataGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<HospitalDataRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/hospital_data',
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
     * Create HospitalData
     * Create new HospitalData
     *
     * - **code**: str
     * - **reason**: str
     * - **place**: str
     * - **start_date**: datetime.datetime
     * - **end_date**: datetime.datetime
     * - **document_link**: str
     * - **profile_id**: str
     * @returns HospitalDataRead Successful Response
     * @throws ApiError
     */
    public static createApiV1MedicalHospitalDataPost({
        requestBody,
    }: {
        requestBody: HospitalDataCreate;
    }): CancelablePromise<HospitalDataRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/medical/hospital_data',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get HospitalData by id
     * Get Hospital Data by id
     *
     * - **id**: UUID - required.
     * @returns HospitalDataRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1MedicalHospitalDataIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<HospitalDataRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/medical/hospital_data/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update HospitalData
     * Update HospitalData
     *
     * - **id**: UUID - the ID of Hospital Data to update. This is required.
     * - **code**: str
     * - **reason**: str
     * - **place**: str
     * - **start_date**: datetime.datetime
     * - **end_date**: datetime.datetime
     * - **document_link**: str
     * - **profile_id**: str
     * @returns HospitalDataRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1MedicalHospitalDataIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HospitalDataUpdate;
    }): CancelablePromise<HospitalDataRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/medical/hospital_data/{id}/',
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
     * Delete HospitalData
     * Delete a HospitalData
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1MedicalHospitalDataIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/medical/hospital_data/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
