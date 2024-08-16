/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HrDocumentStepCreate } from '../models/HrDocumentStepCreate';
import type { HrDocumentStepRead } from '../models/HrDocumentStepRead';
import type { HrDocumentStepUpdate } from '../models/HrDocumentStepUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HrDocumentStepsService {
    /**
     * Get all HrDocumentStep
     * Get all HrDocumentStep
     *
     * - **id**: UUID - the id of HrDocumentTemplate. This parameter is required.
     * @returns HrDocumentStepRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1HrDocumentsStepGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<Array<HrDocumentStepRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents-step',
            query: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create HrDocumentStep
     * Crete HrDocumentStep
     *
     * - **hr_document_template_id**: UUID - the id of HrDocumentTemplate.
     * This step will depend to this template. This field is required.
     * - **previous_step_id**: UUID - the id of previous HrDocumentStep.
     * This parameter is optional.
     * - **staff_unit_id**: UUID - the id of StaffUnit. This is required.
     * - **staff_function_id**: UUID - the id of StaffFunction. This is required.
     * @returns HrDocumentStepRead Successful Response
     * @throws ApiError
     */
    public static createApiV1HrDocumentsStepPost({
        requestBody,
    }: {
        requestBody: HrDocumentStepCreate;
    }): CancelablePromise<HrDocumentStepRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents-step',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get HrDocumentStep by id
     * Get HrDocumentStep by id
     *
     * - **id**: UUID - required
     * @returns HrDocumentStepRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1HrDocumentsStepIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<HrDocumentStepRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents-step/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update HrDocumentStep
     * Update HrDocumentStep
     *
     * - **id**: UUID - required
     * - **hr_document_template_id**: UUID - the id of HrDocumentTemplate.
     * This step will depend on this template. This field is required.
     * - **previous_step_id**: UUID - the id of previous HrDocumentStep.
     * This parameter is optional.
     * - **staff_unit_id**: UUID - the id of StaffUnit. This is required.
     * - **staff_function_id**: UUID - the id of StaffFunction.
     * This is required.
     *
     * > Note that child steps **can not change** template type,
     * > and **template will be changed for every child steps**
     * if you want to change template for parent step
     * @returns HrDocumentStepRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1HrDocumentsStepIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HrDocumentStepUpdate;
    }): CancelablePromise<HrDocumentStepRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/hr-documents-step/{id}/',
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
     * Delete HrDocumentStep
     * Delete HrDocumentStep
     *
     * - **id**: UUID - required
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1HrDocumentsStepIdDelete({
        id,
    }: {
        id: string;
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/hr-documents-step/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
