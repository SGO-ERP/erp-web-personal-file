/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HrVacancyRequirementsCreate } from '../models/HrVacancyRequirementsCreate';
import type { HrVacancyRequirementsRead } from '../models/HrVacancyRequirementsRead';
import type { HrVacancyRequirementsUpdate } from '../models/HrVacancyRequirementsUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HrVacancyRequirementsService {
    /**
     * Get all HrVacancyRequirements
     * Get all HrVacancyRequirements
     *
     * - **skip**: int - The number of HrVacancyRequirements
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of HrVacancyRequirements
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns HrVacancyRequirementsRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1HrVacancyRequirementsGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<HrVacancyRequirementsRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr_vacancy_requirements',
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
     * Create HrVacancyRequirements
     * @returns HrVacancyRequirementsRead Successful Response
     * @throws ApiError
     */
    public static createApiV1HrVacancyRequirementsPost({
        requestBody,
    }: {
        requestBody: HrVacancyRequirementsCreate;
    }): CancelablePromise<HrVacancyRequirementsRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr_vacancy_requirements',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get HrVacancyRequirements by id
     * Get HrVacancyRequirements by id
     *
     * - **id**: UUID - required
     * @returns HrVacancyRequirementsRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1HrVacancyRequirementsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<HrVacancyRequirementsRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr_vacancy_requirements/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update HrVacancyRequirements
     * @returns HrVacancyRequirementsRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1HrVacancyRequirementsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HrVacancyRequirementsUpdate;
    }): CancelablePromise<HrVacancyRequirementsRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/hr_vacancy_requirements/{id}/',
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
     * Delete HrVacancyRequirements
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1HrVacancyRequirementsIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/hr_vacancy_requirements/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
