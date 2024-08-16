/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CandidateStageQuestionTypeEnumService {
    /**
     * Get all CandidateStageQuestionTypeEnum
     * Get all CandidateStageQuestionTypeEnumEnum
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllApiV1CandidateStageQuestionTypeGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_stage_question_type',
        });
    }
}
