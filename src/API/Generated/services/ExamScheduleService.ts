/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExamChangeResults } from '../models/ExamChangeResults';
import type { ExamResultRead } from '../models/ExamResultRead';
import type { ExamResultReadPagination } from '../models/ExamResultReadPagination';
import type { ExamScheduleCreateWithInstructors } from '../models/ExamScheduleCreateWithInstructors';
import type { ExamScheduleRead } from '../models/ExamScheduleRead';
import type { ExamScheduleReadPagination } from '../models/ExamScheduleReadPagination';
import type { ExamScheduleUpdate } from '../models/ExamScheduleUpdate';
import type { ExamTabletRead } from '../models/ExamTabletRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ExamScheduleService {
    /**
     * Get all ExamSchedule
     * Get all ExamSchedule
     *
     * - **skip**: int - The number of ExamSchedule
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ExamSchedule
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ExamScheduleReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllApiV1ExamGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<ExamScheduleReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/exam',
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
     * Get all ExamSchedule
     * Get all ExamSchedule
     *
     * - **skip**: int - The number of ExamSchedule
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ExamSchedule
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ExamTabletRead Successful Response
     * @throws ApiError
     */
    public static getForTabletApiV1ExamTabletGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<ExamTabletRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/exam/tablet/',
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
     * Get ExamSchedule users by id
     * Get ExamSchedule users by id
     * @returns ExamResultRead Successful Response
     * @throws ApiError
     */
    public static getExamUsersApiV1ExamUsersIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<ExamResultRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/exam/users/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get ExamSchedule by id
     * Get ExamResults by authorized user
     *
     * - **skip**: int - The number of ExamSchedule
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of ExamSchedule
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns ExamResultReadPagination Successful Response
     * @throws ApiError
     */
    public static getExamResultsApiV1ExamResultsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<ExamResultReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/exam/results/',
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
     * Get ScheduleMonths by month
     * Get ScheduleMonths by month
     *
     * - **month**: int - The number of month when you want to get ScheduleMonth
     * @returns ExamScheduleRead Successful Response
     * @throws ApiError
     */
    public static getByMonthApiV1ExamMonthGet({
        monthNum = 1,
    }: {
        monthNum?: number;
    }): CancelablePromise<Array<ExamScheduleRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/exam/month',
            query: {
                'month_num': monthNum,
            },
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
     * @returns ExamScheduleRead Successful Response
     * @throws ApiError
     */
    public static getNearestApiV1ExamNearestGet({
        limit = 100,
    }: {
        limit?: number;
    }): CancelablePromise<Array<ExamScheduleRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/exam/nearest',
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
     * @returns ExamScheduleRead Successful Response
     * @throws ApiError
     */
    public static getByDateApiV1ExamDateGet({
        date,
        limit = 100,
    }: {
        date: string;
        limit?: number;
    }): CancelablePromise<Array<ExamScheduleRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/exam/date',
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
     * Get ExamSchedule by id
     * Get ExamSchedule by id
     *
     * - **id**: UUID - required
     * @returns ExamScheduleRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1ExamIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<ExamScheduleRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/exam/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update ExamSchedule
     * Update ExamSchedule
     * @returns ExamScheduleRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1ExamIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: ExamScheduleUpdate;
    }): CancelablePromise<ExamScheduleRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/exam/{id}/',
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
     * Delete ExamSchedule
     * Delete ExamSchedule
     * @returns ExamScheduleRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1ExamIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<ExamScheduleRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/exam/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create ExamSchedule
     * Create ExamSchedule
     * @returns ExamScheduleRead Successful Response
     * @throws ApiError
     */
    public static createApiV1ExamPost({
        requestBody,
    }: {
        requestBody: ExamScheduleCreateWithInstructors;
    }): CancelablePromise<ExamScheduleRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/exam/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Change Exam Results
     * Change Exam Results
     * @returns any Successful Response
     * @throws ApiError
     */
    public static changeResultsApiV1ExamResultsUpdatePut({
        requestBody,
    }: {
        requestBody: ExamChangeResults;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/exam/results_update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
