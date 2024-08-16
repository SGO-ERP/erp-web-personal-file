/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CandidateStageInfoCreate } from '../models/CandidateStageInfoCreate';
import type { CandidateStageInfoRead } from '../models/CandidateStageInfoRead';
import type { CandidateStageInfoSendToApproval } from '../models/CandidateStageInfoSendToApproval';
import type { CandidateStageInfoSignEcp } from '../models/CandidateStageInfoSignEcp';
import type { CandidateStageInfoUpdate } from '../models/CandidateStageInfoUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CandidateStageInfoService {
    /**
     * Get all Incoming CandidateStageInfo
     * Get all Incoming CandidateStageInfo.
     *
     * - **skip**: int - The number of CandidateStageInfo
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of CandidateStageInfo
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns CandidateStageInfoRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1CandidateStageInfoGet({
        skip,
        limit = 100,
        filter = '',
    }: {
        skip?: number;
        limit?: number;
        filter?: string;
    }): CancelablePromise<Array<CandidateStageInfoRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_stage_info',
            query: {
                'skip': skip,
                'limit': limit,
                'filter': filter,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create a CandidateStageInfo
     * Create a CandidateStageInfo.
     *
     * - **candidate_id**: UUID - required and should exist in the database.
     * - **candidate_stage_type_id**: UUID - required and should exist in the database.
     * - **staff_unit_coordinate_id**: UUID - required and should exist in the database.
     * - **is_waits**: bool - optional.
     * @returns CandidateStageInfoRead Successful Response
     * @throws ApiError
     */
    public static createApiV1CandidateStageInfoPost({
        requestBody,
    }: {
        requestBody?: CandidateStageInfoCreate;
    }): CancelablePromise<CandidateStageInfoRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/candidate_stage_info',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get a CandidateStageInfo by id
     * Get a CandidateStageInfo by id.
     *
     * - **id**: UUID - required and should exist in the database.
     * @returns CandidateStageInfoRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1CandidateStageInfoIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<CandidateStageInfoRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_stage_info/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all CandidateStageInfo by candidate_id
     * Get all CandidateStageInfo by candidate_id.
     *
     * - **candidate_id**: UUID - required and should exist in the database.
     * @returns CandidateStageInfoRead Successful Response
     * @throws ApiError
     */
    public static getAllByCandidateIdApiV1CandidateStageInfoAllCandidateCandidateIdGet({
        candidateId,
        skip,
        limit = 100,
    }: {
        candidateId: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<CandidateStageInfoRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_stage_info/all/candidate/{candidate_id}',
            path: {
                'candidate_id': candidateId,
            },
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
     * Send CandidateStageInfo send to Approval
     * Send CandidateStageInfo send to Approval
     *
     * - **id**: UUID - required.
     * - **staff_unit_coordinate_id**: uuid - optional and should exists in database
     * @returns CandidateStageInfoRead Successful Response
     * @throws ApiError
     */
    public static sendToApprovalApiV1CandidateStageInfoIdSendPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody?: CandidateStageInfoSendToApproval;
    }): CancelablePromise<CandidateStageInfoRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/candidate_stage_info/{id}/send',
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
     * Sign a CandidateStageInfo
     * Sign a CandidateStageInfo
     *
     * - **id**: UUID - required.
     * @returns CandidateStageInfoRead Successful Response
     * @throws ApiError
     */
    public static signCandidateApiV1CandidateStageInfoIdSignPut({
        id,
    }: {
        id: string;
    }): CancelablePromise<CandidateStageInfoRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/candidate_stage_info/{id}/sign',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Sign a CandidateStageInfo
     * Sign a CandidateStageInfo
     *
     * - **id**: UUID - required.
     * @returns CandidateStageInfoRead Successful Response
     * @throws ApiError
     */
    public static signEcpApiV1CandidateStageInfoSignEcpIdPost({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: CandidateStageInfoSignEcp;
    }): CancelablePromise<CandidateStageInfoRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/candidate_stage_info/sign_ecp/{id}/',
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
     * Reject a CandidateStageInfo
     * Reject a CandidateStageInfo
     *
     * - **id**: UUID - required and should exist in the database.
     * @returns CandidateStageInfoRead Successful Response
     * @throws ApiError
     */
    public static rejectCandidateApiV1CandidateStageInfoIdRejectPut({
        id,
    }: {
        id: string;
    }): CancelablePromise<CandidateStageInfoRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/candidate_stage_info/{id}/reject',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update a CandidateStageInfo
     * Update a CandidateStageInfo.
     *
     * - **id**: UUID - required and should exist in the database.
     * - **candidate_id**: UUID - optional and should exist in the database.
     * - **candidate_stage_type_id**: UUID - optional and should exist in the database.
     * - **status**: str - optional.
     * @returns CandidateStageInfoRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1CandidateStageInfoIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody?: CandidateStageInfoUpdate;
    }): CancelablePromise<CandidateStageInfoRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/candidate_stage_info/{id}/',
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
}
