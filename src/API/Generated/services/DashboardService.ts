/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DashboardService {
    /**
     * Get all data for Dashboard
     * Количество всей штатки
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllStateApiV1DashboardStatesAllGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/states/all',
        });
    }

    /**
     * Get all data by list for Dashboard
     * Количество сотрудников по списку
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getStateByListApiV1DashboardStatesByListGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/states/by_list/',
        });
    }

    /**
     * Get all data of vacancies for Dashboard
     * Количество вакансии
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getHrVacancyCountByDivisionApiV1DashboardStatesVacanciesGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/states/vacancies/',
        });
    }

    /**
     * Get all data of users in line for Dashboard
     * Количество сотрудников которые в строю
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getInLineCountByStatusApiV1DashboardStatesInlineGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/states/inline/',
        });
    }

    /**
     * Get data of all out line users for Dashboard
     * Общее количество сотрудников которые отсутствуют
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCountByStatusAllUsersApiV1DashboardStatesOutlineAllGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/states/outline/all/',
        });
    }

    /**
     * Get data by every status of out line users for Dashboard
     * Количество сотрудников которые отсутствуют по статусам
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCountByEveryStatusUsersApiV1DashboardStatesOutlineBystatusGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/states/outline/bystatus/',
        });
    }

    /**
     * Get all data of active candidates for Dashboard
     * Количество изучающихся кандидатов
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllActiveCandidatesApiV1DashboardCandidatesActiveGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/candidates/active/',
        });
    }

    /**
     * Get passed candidate stage infos
     * Get passed candidate stage infos
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getStatisticPassedCandidateStageInfosApiV1DashboardCandidatesStagesGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/candidates/stages',
        });
    }

    /**
     * Get duration candidates
     * Get duration candidates
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getStatisticDurationCandidateLearningApiV1DashboardCandidatesDurationGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/candidates/duration',
        });
    }

    /**
     * Get completed candidates
     * Get completed candidates
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getStatisticCompletedCandidatesApiV1DashboardCandidatesCompletedGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/candidates/completed',
        });
    }

    /**
     * Get all data of candidates curators for Dashboard
     * Количество изучающих кандидатов кураторы
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCuratorsByCandidatesApiV1DashboardCandidatesCuratorsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/candidates/curators/',
        });
    }

    /**
     * Get all data of candidates curators for Dashboard
     * Количество изучающих кандидатов кураторы
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCuratorsByCandidatesDurationApiV1DashboardCandidatesCuratorsDurationGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/candidates/curators/duration',
        });
    }

    /**
     * Get all data of candidates curators for Dashboard
     * Количество изучающих кандидатов кураторы
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllUsersOfErpApiV1DashboardUsersAllInErpGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/users/all/inErp',
        });
    }

    /**
     * Get all data of candidates curators for Dashboard
     * Количество изучающих кандидатов кураторы
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllNewUsersAtWeekApiV1DashboardUsersAddedGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/users/added',
        });
    }

    /**
     * Get all data of candidates curators for Dashboard
     * Количество изучающих кандидатов кураторы
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllActiveApiV1DashboardUsersActiveGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/users/active',
        });
    }

    /**
     * Get all data of candidates curators for Dashboard
     * Количество изучающих кандидатов кураторы
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getUsersAtThreeDayByActiveApiV1DashboardUsersActiveStatisticsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/dashboard/users/active/statistics',
        });
    }
}
