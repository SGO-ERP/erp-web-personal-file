/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CandidateStageAnswerCreate } from '../models/CandidateStageAnswerCreate';
import type { CandidateStageAnswerRead } from '../models/CandidateStageAnswerRead';
import type { CandidateStageAnswerUpdate } from '../models/CandidateStageAnswerUpdate';
import type { CandidateStageListAnswerCreate } from '../models/CandidateStageListAnswerCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CandidateStageAnswerService {
    /**
     * Get all CandidateStageAnswer
     * Get all CandidateStageAnswer.
     *
     * - **skip**: int - The number of CandidateStageAnswer
     * to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of CandidateStageAnswer
     * to return in the response.
     * This parameter is optional and defaults to 100.
     * @returns CandidateStageAnswerRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1CandidateStageAnswerGet({
        skip,
        limit = 100,
    }: {
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<CandidateStageAnswerRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_stage_answer',
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
     * Create a CandidateStageAnswer for single question
     * Create a CandidateStageAnswer for single question
     *
     * - **candidate_stage_question_id**: UUID - required.
     * Уникальный идентификатор для вопроса, на который дается ответ.
     * - **type**: str - optional.
     * Тип данных ответа, который может быть:
     * String, Choice, Text, Document, Essay, Sport score, Dropdown
     * - **answer_str**: str - optional.
     * Фактический ответ, предоставленный кандидатом,
     * если тип ответа - строка.
     * - **answer_bool**: boolean - optional.
     * Логическое значение, представляющее ответ,
     * если тип ответа является логическим.
     * - **answer**: str - optional.
     * Фактический ответ, предоставленный кандидатом,
     * если тип ответа TEXT.
     * - **document_link**: str - optional.
     * Ссылка на документ или ресурс, подтверждающий ответ,
     * предоставленный кандидатом, если тип ответа Document.
     * - **document_number**: str - optional.
     * Уникальный идентификатор документа или ресурса,
     * на который ссылается поле document_link.
     * - **candidate_essay_type_id**: UUID - optional.
     * Уникальный идентификатор для типа вопроса эссе,
     * на который требуется ответить, если type Essay
     * - **candidate_id**: UUID - required.
     * Уникальный идентификатор кандидата,
     * который предоставляет ответ.
     * - **category_id**: UUID - optional.
     * Уникальный идентификатор для категории dropdown вопроса,
     * на который дается ответ.
     * - **sport_score**: int - optional. Числовая оценка.
     * @returns CandidateStageAnswerRead Successful Response
     * @throws ApiError
     */
    public static createApiV1CandidateStageAnswerPost({
        requestBody,
    }: {
        requestBody?: CandidateStageAnswerCreate;
    }): CancelablePromise<CandidateStageAnswerRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/candidate_stage_answer',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get a CandidateStageAnswer by id
     * Get a CandidateStageAnswer by id.
     *
     * - **id**: required and should exist in the database.
     * @returns CandidateStageAnswerRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1CandidateStageAnswerIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<CandidateStageAnswerRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_stage_answer/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update a CandidateStageAnswer
     * Update a CandidateStageAnswer.
     *
     * - **id**: required and should exist in the database.
     * - **candidate_stage_question_id**: UUID - required.
     * Уникальный идентификатор для вопроса,
     * на который дается ответ.
     * - **type**: str - optional.
     * Тип данных ответа, который может быть:
     * String, Choice, Text, Document,
     * Essay, Sport score, Dropdown
     * - **answer_str**: str - optional.
     * Фактический ответ,
     * предоставленный кандидатом,
     * если тип ответа - строка.
     * - **answer_bool**: boolean - optional.
     * Логическое значение, представляющее ответ,
     * если тип ответа является логическим.
     * - **answer**: str - optional.
     * Фактический ответ, предоставленный кандидатом,
     * если тип ответа TEXT.
     * - **document_link**: str - optional.
     * Ссылка на документ или ресурс,
     * подтверждающий ответ, предоставленный кандидатом,
     * если тип ответа Document.
     * - **document_number**: str - optional.
     * Уникальный идентификатор документа или ресурса,
     * на который ссылается поле document_link.
     * - **candidate_essay_type_id**: UUID - optional.
     * Уникальный идентификатор для типа вопроса эссе,
     * на который требуется ответить, если type Essay
     * - **candidate_id**: UUID - required.
     * Уникальный идентификатор кандидата,
     * который предоставляет ответ.
     * - **category_id**: UUID - optional.
     * Уникальный идентификатор для категории
     * dropdown вопроса, на который дается ответ.
     * @returns CandidateStageAnswerRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1CandidateStageAnswerIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody?: CandidateStageAnswerUpdate;
    }): CancelablePromise<CandidateStageAnswerRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/candidate_stage_answer/{id}',
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
     * Delete a CandidateStageAnswer
     * Delete a CandidateStageAnswer.
     *
     * - **id**: required and should exist in the database.
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1CandidateStageAnswerIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/candidate_stage_answer/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all CandidateStageAnswer by candidate_id
     * Get all CandidateStageAnswer by candidate_id.
     *
     * - **candidate_id**: required and should exist in the database.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllByCandidateIdApiV1CandidateStageAnswerAllCandidateCandidateIdGet({
        candidateId,
    }: {
        candidateId: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/candidate_stage_answer/all/candidate/{candidate_id}',
            path: {
                'candidate_id': candidateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create CandidateStageAnswer for multiple questions
     * Create CandidateStageAnswer for multiple questions
     *
     * - **candidate_stage_question_id**: UUID - required.
     * Уникальный идентификатор для вопроса,
     * на который дается ответ.
     * - **type**: str - optional.
     * Тип данных ответа, который может быть:
     * String, Choice, Text, Document, Essay,
     * Sport score, Dropdown
     * - **answer_str**: str - optional.
     * Фактический ответ, предоставленный кандидатом,
     * если тип ответа - строка.
     * - **answer_bool**: boolean - optional.
     * Логическое значение, представляющее ответ,
     * если тип ответа является логическим.
     * - **answer**: str - optional.
     * Фактический ответ,
     * предоставленный кандидатом, если тип ответа TEXT.
     * - **document_link**: str - optional.
     * Ссылка на документ или ресурс,
     * подтверждающий ответ, предоставленный кандидатом,
     * если тип ответа Document.
     * - **document_number**: str - optional.
     * Уникальный идентификатор документа или ресурса,
     * на который ссылается поле document_link.
     * - **candidate_essay_type_id**: UUID - optional.
     * Уникальный идентификатор для типа вопроса эссе,
     * на который требуется ответить, если type Essay
     * - **candidate_id**: UUID - required.
     * Уникальный идентификатор кандидата,
     * который предоставляет ответ.
     * - **category_id**: UUID - optional.
     * Уникальный идентификатор для категории dropdown вопроса,
     * на который дается ответ.
     * - **sport_score**: int - optional. Числовая оценка.
     * @returns CandidateStageAnswerRead Successful Response
     * @throws ApiError
     */
    public static createListApiV1CandidateStageAnswerListPost({
        requestBody,
    }: {
        requestBody?: CandidateStageListAnswerCreate;
    }): CancelablePromise<Array<CandidateStageAnswerRead>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/candidate_stage_answer/list',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
