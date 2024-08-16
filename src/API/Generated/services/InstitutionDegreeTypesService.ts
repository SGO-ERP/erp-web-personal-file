/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InstitutionDegreeTypeCreate } from '../models/InstitutionDegreeTypeCreate';
import type { InstitutionDegreeTypeRead } from '../models/InstitutionDegreeTypeRead';
import type { InstitutionDegreeTypeUpdate } from '../models/InstitutionDegreeTypeUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class InstitutionDegreeTypesService {
    /**
     * Get all InstitutionDegreeTypes
     * Get all InstitutionDegreeTypes
     *
     * - **skip**: int - The number of InstitutionDegreeTypes
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of InstitutionDegreeTypes
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns InstitutionDegreeTypeRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1EducationInstitutionDegreeTypesGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<InstitutionDegreeTypeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/institution_degree_types',
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
     * Create
     * Create new InstitutionDegreeType
     *
     * - **name**: required
     * @returns InstitutionDegreeTypeRead Successful Response
     * @throws ApiError
     */
    public static createApiV1EducationInstitutionDegreeTypesPost({
        requestBody,
    }: {
        requestBody: InstitutionDegreeTypeCreate;
    }): CancelablePromise<InstitutionDegreeTypeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/education/institution_degree_types',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get InstitutionDegreeType by id
     * Get InstitutionDegreeType by id
     *
     * - **id**: UUID - required.
     * @returns InstitutionDegreeTypeRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1EducationInstitutionDegreeTypesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<InstitutionDegreeTypeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/education/institution_degree_types/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update InstitutionDegreeType
     * Update InstitutionDegreeType
     *
     * - **id**: UUID - the ID of InstitutionDegreeType to update. This is required.
     * - **name**: required.
     * @returns InstitutionDegreeTypeRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1EducationInstitutionDegreeTypesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: InstitutionDegreeTypeUpdate;
    }): CancelablePromise<InstitutionDegreeTypeRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/education/institution_degree_types/{id}/',
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
     * Delete InstitutionDegreeType
     * Delete InstitutionDegreeType
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1EducationInstitutionDegreeTypesIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/education/institution_degree_types/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
