/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HrVacancyCandidateRead } from '../models/HrVacancyCandidateRead';
import type { HrVacancyCreate } from '../models/HrVacancyCreate';
import type { HrVacancyUpdate } from '../models/HrVacancyUpdate';
import type { schemas__hr_vacancy__HrVacancyRead } from '../models/schemas__hr_vacancy__HrVacancyRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HrVacanciesService {
    /**
     * Get all HrVacancies
     * Get all HrVacancies
     * @returns schemas__hr_vacancy__HrVacancyRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1HrVacanciesGet(): CancelablePromise<
        Array<schemas__hr_vacancy__HrVacancyRead>
    > {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr_vacancies',
        });
    }

    /**
     * Create HrVacancy
     * Create HrVacancy
     *
     * - **staff_unit_id**: uuid - required
     * - **hr_vacancy_requirements_ids**: List of uuid - optional
     * @returns schemas__hr_vacancy__HrVacancyRead Successful Response
     * @throws ApiError
     */
    public static createApiV1HrVacanciesPost({
        requestBody,
    }: {
        requestBody: HrVacancyCreate;
    }): CancelablePromise<schemas__hr_vacancy__HrVacancyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr_vacancies',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all HrVacancies by department
     * Get all HrVacancies by department
     *
     * - **staff_division_id**: uuid - required.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllByDepartmentApiV1HrVacanciesDepartmentStaffDivisionIdGet({
        staffDivisionId,
    }: {
        staffDivisionId: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr_vacancies/department/{staff_division_id}',
            path: {
                'staff_division_id': staffDivisionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all not active HrVacancies
     * Get all HrVacancies
     *
     * - **skip**: int - The number of HrVacancies
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of HrVacancies
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns schemas__hr_vacancy__HrVacancyRead Successful Response
     * @throws ApiError
     */
    public static getNotActiveApiV1HrVacanciesNotActiveGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<schemas__hr_vacancy__HrVacancyRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr_vacancies/not_active',
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
     * Get all candidates of Vacancy
     * Get all Candidates of HrVacancy
     *
     * - **id**: uuid - the id of HrVacancy.
     * @returns HrVacancyCandidateRead Successful Response
     * @throws ApiError
     */
    public static getAllCandidatesApiV1HrVacanciesIdCandidatesGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<HrVacancyCandidateRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr_vacancies/{id}/candidates',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Respond to Candidate (Отклик)
     * Respond to the Hrvacancy
     *
     * - **id**: uuid - the id of HrVacancy.
     * @returns schemas__hr_vacancy__HrVacancyRead Successful Response
     * @throws ApiError
     */
    public static respondApiV1HrVacanciesIdRespondPost({
        id,
    }: {
        id: string;
    }): CancelablePromise<schemas__hr_vacancy__HrVacancyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr_vacancies/{id}/respond',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create HrVacancy by archieve staff unit
     * Create HrVacancy by archieve staff unit
     *
     * - **staff_unit_id**: uuid - required. The id of ArchieveStaffUnit
     * - **hr_vacancy_requirements_ids**: List of uuid - optional
     * @returns schemas__hr_vacancy__HrVacancyRead Successful Response
     * @throws ApiError
     */
    public static createByArchieveStaffUnitApiV1HrVacanciesArchieveStaffUnitPost({
        requestBody,
    }: {
        requestBody: HrVacancyCreate;
    }): CancelablePromise<schemas__hr_vacancy__HrVacancyRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr_vacancies/archieve-staff-unit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get HrVacancy by id
     * Get HrVacancy by id
     *
     * - **id**: UUID - required
     * @returns schemas__hr_vacancy__HrVacancyRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1HrVacanciesIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<schemas__hr_vacancy__HrVacancyRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr_vacancies/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update HrVacancy
     * Update HrVacancy
     *
     * - **id**: uuid - required
     * - **archive_staff_unit_id**: uuid - optional. The id of ArchiveStaffUnit
     * - **staff_unit_id**: uuid - optional. The id of StaffUnit
     * - **is_active**: bool - optional
     * - **hr_vacancy_requirements_ids**: List of uuid - optional
     * @returns schemas__hr_vacancy__HrVacancyRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1HrVacanciesIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HrVacancyUpdate;
    }): CancelablePromise<schemas__hr_vacancy__HrVacancyRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/hr_vacancies/{id}/',
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
     * Update HrVacancy
     * Update HrVacancy
     *
     * - **id**: uuid - required
     * - **archive_staff_unit_id**: uuid - optional. The id of ArchiveStaffUnit
     * - **staff_unit_id**: uuid - optional. The id of StaffUnit
     * - **is_active**: bool - optional
     * - **hr_vacancy_requirements_ids**: List of uuid - optional
     * @returns schemas__hr_vacancy__HrVacancyRead Successful Response
     * @throws ApiError
     */
    public static updateByArchieveStaffUnitApiV1HrVacanciesIdArchieveStaffUnitPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HrVacancyUpdate;
    }): CancelablePromise<schemas__hr_vacancy__HrVacancyRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/hr_vacancies/{id}/archieve-staff-unit',
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
     * Get HrVacancy by archieve staff unit
     * Get HrVacancy by archieve staff unit
     *
     * - **archieve_staff_unit_id**: UUID - required
     * @returns schemas__hr_vacancy__HrVacancyRead Successful Response
     * @throws ApiError
     */
    public static getByArchieveStaffUnitIdApiV1HrVacanciesArchieveStaffUnitArchieveStaffUnitIdGet({
        archieveStaffUnitId,
    }: {
        archieveStaffUnitId: string;
    }): CancelablePromise<schemas__hr_vacancy__HrVacancyRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr_vacancies/archieve-staff-unit/{archieve_staff_unit_id}/',
            path: {
                'archieve_staff_unit_id': archieveStaffUnitId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
