/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationRead } from '../models/NotificationRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NotificationsService {
    /**
     * Get all Notifications
     * Get all Notifications
     *
     * - **skip**: int - The number of Notifications
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of Notifications
     * to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns NotificationRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1NotificationsGet({
        skip,
        limit = 10,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<NotificationRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/notifications',
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
