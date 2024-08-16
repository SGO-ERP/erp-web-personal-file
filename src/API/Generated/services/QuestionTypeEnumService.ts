/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionTypeEnumService {
    /**
     * Get all QuestionTypeEnum
     * Get all QuestionTypeEnumEnum
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllApiV1QuestionTypeGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/question_type',
        });
    }
}
