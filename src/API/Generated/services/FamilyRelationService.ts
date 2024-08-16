/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FamilyRelationRead } from '../models/FamilyRelationRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FamilyRelationService {
    /**
     * Get All
     * @returns FamilyRelationRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1FamilyFamilyRelationsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<FamilyRelationRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family/family_relations',
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
     * Get By Id
     * @returns FamilyRelationRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1FamilyFamilyRelationsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<FamilyRelationRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/family/family_relations/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
