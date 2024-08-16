/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EquipmentCreate } from '../models/EquipmentCreate';
import type { EquipmentRead } from '../models/EquipmentRead';
import type { EquipmentUpdate } from '../models/EquipmentUpdate';
import type { TypeArmyEquipmentRead } from '../models/TypeArmyEquipmentRead';
import type { TypeClothingEquipmentRead } from '../models/TypeClothingEquipmentRead';
import type { TypeOtherEquipmentRead } from '../models/TypeOtherEquipmentRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EquipmentsService {
    /**
     * Get all Equipments
     * Get all Equipments
     *
     * - **skip**: int - The number of equipments to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of equipments to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns EquipmentRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EquipmentsGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<EquipmentRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/equipments',
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
     * Create Equipment
     * Create Equipment
     *
     * - **name**: required
     * - **quantity**: required
     * @returns EquipmentCreate Successful Response
     * @throws ApiError
     */
    public static createApiV1EquipmentsPost({
        requestBody,
    }: {
        requestBody: EquipmentCreate;
    }): CancelablePromise<EquipmentCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/equipments',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Equipment by id
     * Get Equipment by id
     *
     * - **id**: UUID - required
     * @returns EquipmentRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EquipmentsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<EquipmentRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/equipments/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Equipment
     * Update Equipment
     *
     * - **id**: UUID - the id of equipment to update. This parameter is required
     * - **name**: required
     * - **quantity**: required
     * @returns EquipmentRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EquipmentsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: EquipmentUpdate;
    }): CancelablePromise<EquipmentRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/equipments/{id}/',
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
     * Delete Equipment
     * Delete Equipment
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EquipmentsIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/equipments/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Clothing Equipments
     * Get all Clothing Equipments
     *
     * - **skip**: int - The number of equipments to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of equipments to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns TypeClothingEquipmentRead Successful Response
     * @throws ApiError
     */
    public static getAllClothingApiV1EquipmentsTypeClothingGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<TypeClothingEquipmentRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/equipments/type/clothing/',
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
     * Get all Army Equipments
     * Get all Army Equipments
     *
     * - **skip**: int - The number of equipments to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of equipments to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns TypeArmyEquipmentRead Successful Response
     * @throws ApiError
     */
    public static getAllArmyApiV1EquipmentsTypeArmyGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<TypeArmyEquipmentRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/equipments/type/army/',
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
     * Get all Other Equipments
     * Get all Other Equipments
     *
     * - **skip**: int - The number of equipments to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of equipments to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns TypeOtherEquipmentRead Successful Response
     * @throws ApiError
     */
    public static getAllOtherApiV1EquipmentsTypeOtherGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<TypeOtherEquipmentRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/equipments/type/other/',
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
     * Get all Types of Equipments
     * Get all Types of Equipments
     *
     * - **skip**: int - The number of equipments to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of equipments to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getAllTypesApiV1EquipmentsTypeAllGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/equipments/type/all',
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
     * Get all available Equipments for user
     * Get all available Equipments for user
     *
     * - **skip**: int - The number of equipments to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of equipments to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllAvailableApiV1EquipmentsavailableUserIdGet({
        userId,
        skip,
        limit = 10,
    }: {
        userId: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/equipmentsavailable/{user_id}/',
            path: {
                'user_id': userId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
