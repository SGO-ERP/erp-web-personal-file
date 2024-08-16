/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ScheduleYearCreateString } from '../models/ScheduleYearCreateString';
import type { ScheduleYearRead } from '../models/ScheduleYearRead';
import type { ScheduleYearReadPagination } from '../models/ScheduleYearReadPagination';
import type { ScheduleYearUpdate } from '../models/ScheduleYearUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ScheduleYearService {
    /**
     * Get all ScheduleYear
     * Get all ScheduleYear
     *
     * - **skip**: int - The number of ScheduleYear
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ScheduleYear
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ScheduleYearReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ScheduleYearGet({
        filter,
        filterYear = '2023',
        filterMonth = '9',
        skip,
        limit = 100,
    }: {
        filter?: any;
        filterYear?: string;
        filterMonth?: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<ScheduleYearReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_year',
            query: {
                'filter': filter,
                'filter_year': filterYear,
                'filter_month': filterMonth,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all ScheduleYear by plan id
     * Get all ScheduleYears by plan id
     *
     * - **skip**: int - The number of ScheduleYear
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ScheduleYear
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ScheduleYearReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllByPlanApiV1ScheduleYearPlanIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ScheduleYearReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_year/plan/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all ScheduleYear by staff_division id
     * Get all ScheduleYears by plan id
     * @returns ScheduleYearReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllByStaffDivisionApiV1ScheduleYearStaffDivisionIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ScheduleYearReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_year/staff_division/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all ScheduleYear by staff_division_id and plan_id
     * Get all ScheduleYears by staff_division_id and plan_id
     * @returns ScheduleYearReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllByStaffDivisionAndPlanApiV1ScheduleYearDivisionPlanIdGet({
        id,
        planId,
    }: {
        id: string;
        planId: string;
    }): CancelablePromise<ScheduleYearReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_year/division_plan/{id}/',
            path: {
                'id': id,
            },
            query: {
                'plan_id': planId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Schedule Year by plan year
     * Get all Schedule Year by plan year
     *
     * - **year**: int - year on which to get the schedule
     * - **skip**: int - The number of ScheduleYear
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ScheduleYear
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ScheduleYearReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllByYearApiV1ScheduleYearYearGet({
        year = 2000,
        skip,
        limit = 100,
    }: {
        year?: number;
        skip?: number;
        limit?: number;
    }): CancelablePromise<ScheduleYearReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_year/year/',
            query: {
                'year': year,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get ScheduleYear by id
     * Get ScheduleYear by id
     *
     * - **id**: UUID - required
     * @returns ScheduleYearRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ScheduleYearIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ScheduleYearRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule_year/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update ScheduleYear
     * Update ScheduleYear
     * @returns ScheduleYearRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ScheduleYearIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ScheduleYearUpdate;
    }): CancelablePromise<ScheduleYearRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/schedule_year/{id}/',
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
     * Delete ScheduleYear
     * Delete ScheduleYear
     * @returns ScheduleYearRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1ScheduleYearIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<ScheduleYearRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/schedule_year/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create ScheduleYear
     * Create ScheduleYear
     * @returns ScheduleYearRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ScheduleYearPost({
        requestBody,
    }: {
        requestBody: ScheduleYearCreateString;
    }): CancelablePromise<ScheduleYearRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/schedule_year/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete ScheduleYear
     * Delete ScheduleYear
     * @returns ScheduleYearRead Successful Response
     * @throws ApiError
     */
    public static deleteDivisionApiV1ScheduleYearDivisionScheduleIdDivisionIdDelete({
        scheduleId,
        divisionId,
    }: {
        scheduleId: string;
        divisionId: string;
    }): CancelablePromise<ScheduleYearRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/schedule_year/division/{schedule_id}/{division_id}/',
            path: {
                'schedule_id': scheduleId,
                'division_id': divisionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
