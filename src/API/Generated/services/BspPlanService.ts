/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BspPlanCreate } from '../models/BspPlanCreate';
import type { BspPlanRead } from '../models/BspPlanRead';
import type { BspPlanReadPagination } from '../models/BspPlanReadPagination';
import type { BspPlanUpdate } from '../models/BspPlanUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BspPlanService {
    /**
     * Get all BspPlan
     * Get all BspPlans
     *
     * - **skip**: int - The number of BspPlan
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of BspPlan
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns BspPlanReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PlanGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<BspPlanReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/plan',
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
     * Get all BspPlan
     * Get all draft BspPlans
     *
     * - **skip**: int - The number of BspPlan
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of BspPlan
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns BspPlanReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllDraftApiV1PlanDraftGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<BspPlanReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/plan/draft/',
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
     * Get all BspPlan
     * Get all draft BspPlans
     *
     * - **skip**: int - The number of BspPlan
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of BspPlan
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns BspPlanReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllSignedApiV1PlanSignedGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<BspPlanReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/plan/signed/',
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
     * Get all BspPlan
     * Sign BspPlan
     * @returns BspPlanRead Successful Response
     * @throws ApiError
     */
    public static signApiV1PlanSignIdPost({ id }: { id: string }): CancelablePromise<BspPlanRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/plan/sign/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Send BspPlan to draft
     * Send BspPlan to draft
     * @returns BspPlanRead Successful Response
     * @throws ApiError
     */
    public static sendToDraftApiV1PlanDraftIdPost({
        id,
    }: {
        id: string;
    }): CancelablePromise<BspPlanRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/plan/draft/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get BspPlan by id
     * Get BspPlan by id
     *
     * - **id**: UUID - required
     * @returns BspPlanRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PlanIdGet({ id }: { id: string }): CancelablePromise<BspPlanRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/plan/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update BspPlan
     * Update BspPlan
     * @returns BspPlanRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PlanIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: BspPlanUpdate;
    }): CancelablePromise<BspPlanRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/plan/{id}/',
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
     * Delete BspPlan
     * Delete BspPlan
     * @returns BspPlanRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1PlanIdDelete({ id }: { id: string }): CancelablePromise<BspPlanRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/plan/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Duplicate BspPlan by id
     * Duplicate BspPlan by id
     *
     * - **id**: UUID - required
     * @returns BspPlanRead Successful Response
     * @throws ApiError
     */
    public static duplicateApiV1PlanDuplicateIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<BspPlanRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/plan/duplicate/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create BspPlan
     * Create BspPlan
     * @returns BspPlanRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PlanPost({
        requestBody,
    }: {
        requestBody: BspPlanCreate;
    }): CancelablePromise<BspPlanRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/plan/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
