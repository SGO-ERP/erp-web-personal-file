/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConvertCandidateTemplate } from '../models/ConvertCandidateTemplate';
import type { HTML } from '../models/HTML';
import type { LanguageEnum } from '../models/LanguageEnum';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RenderJinjaService {
    /**
     * Генерация документа 'Заключение спец. проверки'
     * Генерация документа "Заключение спец. проверки"
     *
     * - **hr_document_template_id**: UUID - required
     * - **candidate_id**: UUID - required
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateApiV1RenderRenderPost({
        requestBody,
    }: {
        requestBody: ConvertCandidateTemplate;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/render/render',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Генерация документа 'Заключение на зачисление'
     * Генерация документа "Заключение на зачисление"
     *
     * - **hr_document_template_id**: UUID - required
     * - **candidate_id**: UUID - required
     * @returns any Successful Response
     * @throws ApiError
     */
    public static renderFinishCandidateApiV1RenderRenderFinishCandidatePost({
        requestBody,
    }: {
        requestBody: ConvertCandidateTemplate;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/render/render/finish-candidate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Convert
     * @returns any Successful Response
     * @throws ApiError
     */
    public static convertApiV1RenderConvertPost({
        requestBody,
    }: {
        requestBody: HTML;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/render/convert',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Convert Docx To Html
     * @returns any Successful Response
     * @throws ApiError
     */
    public static convertDocxToHtmlApiV1RenderConvertDocxToHtmlPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/render/convert_docx_to_html',
        });
    }

    /**
     * Convert Html To Pdf
     * @returns any Successful Response
     * @throws ApiError
     */
    public static convertHtmlToPdfApiV1RenderConvertPdfPost({
        requestBody,
    }: {
        requestBody: HTML;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/render/convert/pdf',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Inflect Word
     * @returns any Successful Response
     * @throws ApiError
     */
    public static inflectWordApiV1RenderInflectGet({
        word,
        septikInt,
        lang,
    }: {
        word: string;
        septikInt: number;
        lang?: LanguageEnum;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/render/inflect',
            query: {
                'word': word,
                'septik_int': septikInt,
                'lang': lang,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
