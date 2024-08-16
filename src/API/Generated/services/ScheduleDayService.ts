/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ScheduleDayCreate } from '../models/ScheduleDayCreate';
import type { ScheduleDayRead } from '../models/ScheduleDayRead';
import type { ScheduleDayUpdate } from '../models/ScheduleDayUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ScheduleDayService {
    /**
     * Get all ScheduleDay
     * Get all ScheduleDay
     *
     * - **skip**: int - The number of ScheduleDay
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ScheduleDay
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ScheduleDayRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ScheduleDayGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ScheduleDayRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_day',
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
     * Get ScheduleDay by id
     * Get ScheduleDay by id
     *
     * - **id**: UUID - required
     * @returns ScheduleDayRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ScheduleDayIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ScheduleDayRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_day/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update ScheduleDay
     * Update ScheduleDay
     * @returns ScheduleDayRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ScheduleDayIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ScheduleDayUpdate;
    }): CancelablePromise<ScheduleDayRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/schedule_day/{id}/',
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
     * Delete ScheduleDay
     * Delete ScheduleDay
     * @returns ScheduleDayRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1ScheduleDayIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<ScheduleDayRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/schedule_day/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create ScheduleDay
     * Create ScheduleDay
     * @returns ScheduleDayRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ScheduleDayPost({
        requestBody,
    }: {
        requestBody: ScheduleDayCreate;
    }): CancelablePromise<ScheduleDayRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/schedule_day/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
