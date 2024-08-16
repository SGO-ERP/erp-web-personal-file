/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DrivingLicenseCreate } from '../models/DrivingLicenseCreate';
import type { DrivingLicenseLinkUpdate } from '../models/DrivingLicenseLinkUpdate';
import type { DrivingLicenseRead } from '../models/DrivingLicenseRead';
import type { DrivingLicenseUpdate } from '../models/DrivingLicenseUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DrivingLicenseService {
    /**
     * Get all DrivingLicense
     * Get all DrivingLicense
     *
     * - **skip**: int - The number of DrivingLicense
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of DrivingLicense
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns DrivingLicenseRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonalDrivingLicenseGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<DrivingLicenseRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/driving_license',
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
     * Create DrivingLicense
     * Create new DrivingLicense
     *
     * - **document_number**: str
     * - **category**: List[str]
     * - **date_of_issue**: datetime.date
     * - **date_to**: datetime.date
     * - **document_link**: str
     * - **profile_id**: str
     * @returns DrivingLicenseRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PersonalDrivingLicensePost({
        requestBody,
    }: {
        requestBody: DrivingLicenseCreate;
    }): CancelablePromise<DrivingLicenseRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/personal/driving_license',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get DrivingLicense by id
     * Get DrivingLicense by id
     *
     * - **id**: UUID - required.
     * @returns DrivingLicenseRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonalDrivingLicenseIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<DrivingLicenseRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/driving_license/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update DrivingLicense
     * Update DrivingLicense
     *
     * - **id**: UUID - the ID of DrivingLicense to update. This is required.
     * - **document_link**: str (url)
     * @returns DrivingLicenseRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PersonalDrivingLicenseIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: DrivingLicenseUpdate;
    }): CancelablePromise<DrivingLicenseRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/personal/driving_license/{id}/',
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
     * Delete DrivingLicense
     * Delete DrivingLicense
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PersonalDrivingLicenseIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/personal/driving_license/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update DrivingLicense document_link
     * Update DrivingLicense document_link
     *
     * - **id**: UUID - the ID of DrivingLicense to update. This is required.
     * - **document_link**: str (url)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateDocumentLinkApiV1PersonalDrivingLicenseIdDocumentLinkPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: DrivingLicenseLinkUpdate;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/personal/driving_license/{id}/document_link/',
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
}
