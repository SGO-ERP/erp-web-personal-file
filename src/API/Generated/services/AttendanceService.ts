/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendanceChangeStatus } from '../models/AttendanceChangeStatus';
import type { AttendanceChangeStatusWithSchedule } from '../models/AttendanceChangeStatusWithSchedule';
import type { AttendanceCreate } from '../models/AttendanceCreate';
import type { AttendancePercentageRead } from '../models/AttendancePercentageRead';
import type { AttendanceRead } from '../models/AttendanceRead';
import type { AttendanceReadPagination } from '../models/AttendanceReadPagination';
import type { AttendanceReadShort } from '../models/AttendanceReadShort';
import type { AttendanceUpdate } from '../models/AttendanceUpdate';
import type { AttendedUserRead } from '../models/AttendedUserRead';
import type { UserShortRead } from '../models/UserShortRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AttendanceService {
    /**
     * Get all Attendance
     * Get all Attendance
     *
     * - **skip**: int - The number of Attendance
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Attendance
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AttendanceRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1AttendanceGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<AttendanceRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/attendance',
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
     * Get all nearest Attendances
     * Get all Attendance
     *
     * - **skip**: int - The number of Attendance
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Attendance
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns AttendanceReadPagination Successful Response
     * @throws ApiError
     */
    public static getAllNearestApiV1AttendanceNearestGet({
        skip,
        limit = 100,
        isMine = false,
    }: {
        skip?: number;
        limit?: number;
        isMine?: boolean;
    }): CancelablePromise<AttendanceReadPagination> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/attendance/nearest',
            query: {
                'skip': skip,
                'limit': limit,
                'is_mine': isMine,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all users in Attendance
     * Get all users by attendance
     * @returns AttendedUserRead Successful Response
     * @throws ApiError
     */
    public static getAttendanceUsersApiV1AttendanceUsersIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<AttendedUserRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/attendance/users/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Attendance by id
     * Get Attendance by id
     *
     * - **id**: UUID - required
     * @returns AttendanceRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1AttendanceIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<AttendanceRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/attendance/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Attendance
     * Update Attendance
     * @returns AttendanceRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1AttendanceIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: AttendanceUpdate;
    }): CancelablePromise<AttendanceRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/attendance/{id}/',
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
     * Delete Attendance
     * Delete Attendance
     * @returns AttendanceRead Successful Response
     * @throws ApiError
     */
    public static deleteApiV1AttendanceIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<AttendanceRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/attendance/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Attendance by id
     * Get Attendance by id
     *
     * - **id**: UUID - required
     * @returns AttendancePercentageRead Successful Response
     * @throws ApiError
     */
    public static getAttendancePercentageApiV1AttendancePercentageGet(): CancelablePromise<
        Array<AttendancePercentageRead>
    > {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/attendance/percentage',
        });
    }

    /**
     * Get all absent days by user for the ScheduleYear
     * Get all absent users for the ScheduleYear
     *
     * - **id**: String - required. ScheduleYear id
     * - **user_id**: String - required. User id
     * @returns AttendanceReadShort Successful Response
     * @throws ApiError
     */
    public static getAbsentDaysByUserApiV1AttendanceUserAbsentIdGet({
        id,
        userId,
    }: {
        id: string;
        userId: string;
    }): CancelablePromise<Array<AttendanceReadShort>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/attendance/user/absent/{id}/',
            path: {
                'id': id,
            },
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all absent users for the ScheduleYear
     * Get all absent users for the ScheduleYear
     *
     * - **id**: UUID - required. ScheduleYear id
     * @returns UserShortRead Successful Response
     * @throws ApiError
     */
    public static getAbsentUsersApiV1AttendanceAbsentIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<UserShortRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/attendance/absent/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Attendance
     * Create Attendance
     * @returns AttendanceRead Successful Response
     * @throws ApiError
     */
    public static createApiV1AttendancePost({
        requestBody,
    }: {
        requestBody: AttendanceCreate;
    }): CancelablePromise<AttendanceRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/attendance/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Change Attendance status
     * Change Attendance status
     * @returns any Successful Response
     * @throws ApiError
     */
    public static changeAttendanceStatusApiV1AttendanceStatusChangePost({
        requestBody,
    }: {
        requestBody: AttendanceChangeStatus;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/attendance/status_change',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Change Attendance status by schedule and date
     * Change Attendance status
     * @returns any Successful Response
     * @throws ApiError
     */
    public static changeAttendanceStatusByScheduleApiV1AttendanceStatusChangeSchedulePost({
        requestBody,
    }: {
        requestBody: AttendanceChangeStatusWithSchedule;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/attendance/status_change/schedule',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
