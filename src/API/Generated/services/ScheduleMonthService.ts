/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ScheduleMonthCreateWithDay } from '../models/ScheduleMonthCreateWithDay';
import type { ScheduleMonthRead } from '../models/ScheduleMonthRead';
import type { ScheduleMonthUpdate } from '../models/ScheduleMonthUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ScheduleMonthService {
    /**
     * Get all ScheduleMonth
     * Get all ScheduleMonth
     *
     * - **skip**: int - The number of ScheduleMonth
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ScheduleMonth
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ScheduleMonthRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ScheduleMonthGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<ScheduleMonthRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_month',
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
     * Create ScheduleMonth
     * Create ScheduleMonth
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createApiV1ScheduleMonthPost({
        requestBody,
    }: {
        requestBody: ScheduleMonthCreateWithDay;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/schedule_month',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get nearest ScheduleMonths
     * Get nearest ScheduleMonths
     *
     * - **limit**: int - The maximum number of ScheduleMonth
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ScheduleMonthRead Successful Response
     * @throws ApiError
     */
    public static getNearestApiV1ScheduleMonthNearestGet({
        limit = 100,
    }: {
        limit?: number;
    }): CancelablePromise<Array<ScheduleMonthRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_month/nearest',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get ScheduleMonths by date
     * Get ScheduleMonths by date
     *
     * - **limit**: int - The maximum number of ScheduleMonth
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * - **date**: date (yyyy-mm-dd) - The date when you want to get ScheduleMonth
     * @returns ScheduleMonthRead Successful Response
     * @throws ApiError
     */
    public static getByDateApiV1ScheduleMonthDateGet({
        date,
        limit = 100,
    }: {
        date: string;
        limit?: number;
    }): CancelablePromise<Array<ScheduleMonthRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_month/date',
            query: {
                'limit': limit,
                'date': date,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get ScheduleMonths by month
     * Get ScheduleMonths by month
     *
     * - **month**: int - The number of month when you want to get ScheduleMonth
     * @returns ScheduleMonthRead Successful Response
     * @throws ApiError
     */
    public static getByMonthApiV1ScheduleMonthMonthGet({
        monthNum = 1,
    }: {
        monthNum?: number;
    }): CancelablePromise<Array<ScheduleMonthRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_month/month',
            query: {
                'month_num': monthNum,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get ScheduleMonth by id
     * Get ScheduleMonth by id
     *
     * - **id**: UUID - required
     * @returns ScheduleMonthRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ScheduleMonthIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ScheduleMonthRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_month/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update ScheduleMonth
     * Update ScheduleMonth
     * @returns ScheduleMonthRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ScheduleMonthIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ScheduleMonthUpdate;
    }): CancelablePromise<ScheduleMonthRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/schedule_month/{id}/',
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
     * Delete ScheduleMonth
     * Delete ScheduleMonth
     * @returns ScheduleMonthRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1ScheduleMonthIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<ScheduleMonthRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/schedule_month/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
