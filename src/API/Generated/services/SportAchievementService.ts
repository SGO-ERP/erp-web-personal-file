/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SportAchievementCreate } from '../models/SportAchievementCreate';
import type { SportAchievementRead } from '../models/SportAchievementRead';
import type { SportAchievementUpdate } from '../models/SportAchievementUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SportAchievementService {
    /**
     * Get all SportAchievement
     * Get all SportAchievement
     *
     * - **skip**: int - The number of SportAchievement
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of SportAchievement
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns SportAchievementRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1PersonalSportAchievementGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<SportAchievementRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/sport_achievement',
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
     * Create SportAchievement
     * Create new SportAchievement
     *
     * - **name**: str
     * - **assignment_date**: datetime.date
     * - **document_link**: str
     * - **profile_id**: str
     * @returns SportAchievementRead Successful Response
     * @throws ApiError
     */
    public static createApiV1PersonalSportAchievementPost({
        requestBody,
    }: {
        requestBody: SportAchievementCreate;
    }): CancelablePromise<SportAchievementRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/personal/sport_achievement',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get SportAchievement by id
     * Get SportAchievement by id
     *
     * - **id**: UUID - required.
     * @returns SportAchievementRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1PersonalSportAchievementIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<SportAchievementRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/personal/sport_achievement/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update SportAchievement
     * Update SportAchievement
     *
     * - **id**: UUID - the ID of SportAchievement to update. This is required.
     * - **name**: str
     * - **assignment_date**: datetime.date
     * - **document_link**: str
     * - **profile_id**: str
     * @returns SportAchievementRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1PersonalSportAchievementIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: SportAchievementUpdate;
    }): CancelablePromise<SportAchievementRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/personal/sport_achievement/{id}/',
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
     * Delete SportAchievement
     * Delete SportAchievement
     *
     * - **id**: UUId - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1PersonalSportAchievementIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/personal/sport_achievement/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
