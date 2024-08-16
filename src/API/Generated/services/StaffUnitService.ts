/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentStaffFunctionRead } from '../models/DocumentStaffFunctionRead';
import type { schemas__staff_unit__StaffUnitRead } from '../models/schemas__staff_unit__StaffUnitRead';
import type { ServiceStaffFunctionRead } from '../models/ServiceStaffFunctionRead';
import type { StaffUnitCreate } from '../models/StaffUnitCreate';
import type { StaffUnitCreateWithPosition } from '../models/StaffUnitCreateWithPosition';
import type { StaffUnitFunctions } from '../models/StaffUnitFunctions';
import type { StaffUnitFunctionsByPosition } from '../models/StaffUnitFunctionsByPosition';
import type { StaffUnitMatreshkaOptionRead } from '../models/StaffUnitMatreshkaOptionRead';
import type { StaffUnitUpdate } from '../models/StaffUnitUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StaffUnitService {
    /**
     * Get all Staff Units
     * Get all Staff Units
     *
     * - **skip**: int - The number of staff units
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of staff units
     * to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns schemas__staff_unit__StaffUnitRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1StaffUnitGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<schemas__staff_unit__StaffUnitRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_unit',
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
     * Create Staff Unit
     * Create Staff Unit
     *
     * - **name**: required
     * - **max_rank_id**: UUID - required and should exist in the database
     * - **description**: a long description. This parameter is optional.
     * @returns schemas__staff_unit__StaffUnitRead Successful Response
     * @throws ApiError
     */
    public static createApiV1StaffUnitPost({
        requestBody,
    }: {
        requestBody: StaffUnitCreate;
    }): CancelablePromise<schemas__staff_unit__StaffUnitRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_unit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Staff Unit
     * Create Staff Unit with new position
     *
     * - **max_rank_id**: UUID - required and should exist in the database
     * @returns schemas__staff_unit__StaffUnitRead Successful Response
     * @throws ApiError
     */
    public static createWithPositionApiV1StaffUnitPositionPost({
        requestBody,
    }: {
        requestBody: StaffUnitCreateWithPosition;
    }): CancelablePromise<schemas__staff_unit__StaffUnitRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_unit/position/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Staff Unit by id
     * Get Staff Unit by id
     *
     * - **id** - UUID - required
     * @returns schemas__staff_unit__StaffUnitRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1StaffUnitIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<schemas__staff_unit__StaffUnitRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_unit/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Staff Unit
     * Update Staff Unit
     *
     * - **id**: UUID - required
     * - **name**: required
     * - **position_id**: id of position.
     * This parameter is optional.
     * - **staff_division_id**: id of staff_division.
     * This parameter is optional.
     * @returns schemas__staff_unit__StaffUnitRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1StaffUnitIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: StaffUnitUpdate;
    }): CancelablePromise<schemas__staff_unit__StaffUnitRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/staff_unit/{id}/',
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
     * Delete Staff Unit
     * Delete Staff Unit
     *
     * - **id** - UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1StaffUnitIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/staff_unit/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get ServiceStaffFunctions by StaffUnit id
     * Get ServiceStaffFunctions by StaffUnit id
     *
     * - **id** - UUID - required
     * @returns ServiceStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getServiceStaffFunctionsApiV1StaffUnitGetServiceStaffFunctionsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<ServiceStaffFunctionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_unit/get-service-staff-functions/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Add ServiceStaffFunction
     * Add ServiceStaffFunction to StaffUnit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addServiceStaffFunctionApiV1StaffUnitAddServiceStaffFunctionPost({
        requestBody,
    }: {
        requestBody: StaffUnitFunctions;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_unit/add-service-staff-function',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Remove ServiceStaffFunction
     * Remove ServiceStaffFunction from StaffUnit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static removeServiceStaffFunctionApiV1StaffUnitRemoveServiceStaffFunctionPost({
        requestBody,
    }: {
        requestBody: StaffUnitFunctions;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_unit/remove-service-staff-function',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get DocumentStaffFunctions by StaffUnit id
     * Get DocumentStaffFunctions by StaffUnit id
     *
     * - **id** - UUID - required
     * @returns DocumentStaffFunctionRead Successful Response
     * @throws ApiError
     */
    public static getDocumentStaffFunctionsApiV1StaffUnitGetDocumentStaffFunctionsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<DocumentStaffFunctionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_unit/get-document-staff-functions/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Add DocumentStaffFunction
     * Add DocumentStaffFunction to StaffUnit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addDocumentStaffFunctionApiV1StaffUnitAddDocumentStaffFunctionPost({
        requestBody,
    }: {
        requestBody: StaffUnitFunctions;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_unit/add-document-staff-function',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Add DocumentStaffFunction
     * Add DocumentStaffFunction to StaffUnit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addDocumentStaffFunctionByPositionApiV1StaffUnitAddDocumentStaffFunctionPositionPost({
        requestBody,
    }: {
        requestBody: StaffUnitFunctionsByPosition;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_unit/add-document-staff-function/position',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Remove DocumentStaffFunction
     * Remove DocumentStaffFunction from StaffUnit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static removeDocumentStaffFunctionApiV1StaffUnitRemoveDocumentStaffFunctionPost({
        requestBody,
    }: {
        requestBody: StaffUnitFunctions;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/staff_unit/remove-document-staff-function',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Staff Units by staff_division_id
     * Get Staff Units by staff_division_id
     *
     * - **staff_division_id** - UUID - required
     * @returns StaffUnitMatreshkaOptionRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1StaffUnitStaffDivisionIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<StaffUnitMatreshkaOptionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/staff_unit/staff_division/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
