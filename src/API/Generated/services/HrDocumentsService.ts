/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DraftHrDocumentCreate } from '../models/DraftHrDocumentCreate';
import type { HrDocumentInit } from '../models/HrDocumentInit';
import type { HrDocumentInitEcp } from '../models/HrDocumentInitEcp';
import type { HrDocumentRead } from '../models/HrDocumentRead';
import type { HrDocumentSign } from '../models/HrDocumentSign';
import type { HrDocumentSignEcp } from '../models/HrDocumentSignEcp';
import type { HrDocumentSignEcpWithIds } from '../models/HrDocumentSignEcpWithIds';
import type { HrDocumentUpdate } from '../models/HrDocumentUpdate';
import type { schemas__user__UserRead } from '../models/schemas__user__UserRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HrDocumentsService {
    /**
     * Get all not signed HrDocuments
     * Get all not signed HrDocuments
     *
     * - **skip**: int - The number of HrDocuments to skip
     * before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of HrDocuments to return in the response.
     * This parameter is optional and defaults to 10.
     * - **filter**: str - The value which returns filtered results.
     * This parameter is optional and defaults to None
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static getNotSignedApiV1HrDocumentsNotSignedGet({
        parentId,
        filter = '',
        skip,
        limit = 10,
    }: {
        parentId?: string;
        filter?: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<HrDocumentRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents/not-signed',
            query: {
                'parent_id': parentId,
                'filter': filter,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all not signed HrDocuments
     * Get all not signed HrDocuments
     *
     * - **skip**: int - The number of HrDocuments to skip
     * before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of HrDocuments to return in the response.
     * This parameter is optional and defaults to 10.
     * - **filter**: str - The value which returns filtered results.
     * This parameter is optional and defaults to None
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static getSignedApiV1HrDocumentsSignedGet({
        parentId,
        filter = '',
        skip,
        limit = 10,
    }: {
        parentId?: string;
        filter?: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<HrDocumentRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents/signed',
            query: {
                'parent_id': parentId,
                'filter': filter,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all initialized HrDocuments
     * Get all initialized HrDocuments
     *
     * - **skip**: int - The number of HrDocuments to skip
     * before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of HrDocuments to return in the response.
     * This parameter is optional and defaults to 10.
     * - **filter**: str - The value which returns filtered results.
     * This parameter is optional and defaults to None
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static getInitializedApiV1HrDocumentsInitializedGet({
        parentId,
        filter = '',
        skip,
        limit = 10,
    }: {
        parentId?: string;
        filter?: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<HrDocumentRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents/initialized',
            query: {
                'parent_id': parentId,
                'filter': filter,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all al HrDocuments by user
     * Get all all HrDocuments
     *
     * - **skip**: int - The number of HrDocuments to skip
     * before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of HrDocuments to return in the response.
     * This parameter is optional and defaults to 10.
     * - **filter**: str - The value which returns filtered results.
     * This parameter is optional and defaults to None
     * - **user_id**: UUID - optional defaults to authorized user.
     * User ID of the subject of the HrDocument.
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static getAllApiV1HrDocumentsAllGet({
        userId,
        filter = '',
        skip,
        limit = 10,
    }: {
        userId?: string;
        filter?: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<HrDocumentRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents/all/',
            query: {
                'user_id': userId,
                'filter': filter,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Sign HrDocument with ecp
     * Sign HrDocument
     *
     * The user must have a role that allows them to sign this HR document.
     *
     * - **id**: UUID - the ID of HrDocument. This is required.
     * - **comment**: A comment on the signed document.
     * - **is_signed**: bool - indicating whether the document is signed.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static signEcpAllApiV1HrDocumentsEcpSignAllPost({
        requestBody,
    }: {
        requestBody: HrDocumentSignEcpWithIds;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents/ecp_sign_all/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Sign HrDocument with ecp
     * Sign HrDocument
     *
     * The user must have a role that allows them to sign this HR document.
     *
     * - **id**: UUID - the ID of HrDocument. This is required.
     * - **comment**: A comment on the signed document.
     * - **is_signed**: bool - indicating whether the document is signed.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static signEcpApiV1HrDocumentsEcpSignIdPost({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HrDocumentSignEcp;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents/ecp_sign/{id}/',
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
     * Initialize HrDocument
     * Initialize HrDocument
     *
     * The user must have a role that allows them to create HR documents.
     *
     * - **hr_document_template_id**: UUID - required.
     * HrDocument will be initialized based on HrDocumentTemplate.
     * - **due_date**: the end date of this document - format (YYYY-MM-DD).
     * This parameter is required.
     * - **properties**: A dictionary containing properties for the HrDocument.
     * - **user_ids**: UUID - required and should exist in database.
     * A list of user IDs to be assigned to the HrDocument.
     * - **document_step_users_ids**: UUID - required and should exist in database.
     * Dictionary of priority to user IDs to be assigned to the HrDocument.
     * - **certificate_blob**: string - required.
     * The certificate's string representation.
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static initializeWithCertificateApiV1HrDocumentsEcpInitializePost({
        requestBody,
    }: {
        requestBody: HrDocumentInitEcp;
    }): CancelablePromise<HrDocumentRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents/ecp_initialize',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Initialize HrDocument
     * Initialize HrDocument
     *
     * The user must have a role that allows them to create HR documents.
     *
     * - **hr_document_template_id**: UUID - required.
     * HrDocument will be initialized based on HrDocumentTemplate.
     * - **due_date**: the end date of this document - format (YYYY-MM-DD).
     * This parameter is required.
     * - **properties**: A dictionary containing properties for the HrDocument.
     * - **user_ids**: UUID - required and should exist in database.
     * A list of user IDs to be assigned to the HrDocument.
     * - **document_step_users_ids**: UUID - required and should exist in database.
     * Dictionary of priority to user IDs to be assigned to the HrDocument.
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static initializeApiV1HrDocumentsPost({
        requestBody,
    }: {
        requestBody: HrDocumentInit;
    }): CancelablePromise<HrDocumentRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get all Draft HrDocuments
     * Get all Draft HrDocuments
     * - **filter**: str - The value which returns filtered results.
     * This parameter is optional and defaults to None
     * - **skip**: int - The number of HrDocuments to skip before returning the results.
     * This parameter is optional and defaults to 0.
     * - **limit**: int - The maximum number of HrDocuments to return in the response.
     * This parameter is optional and defaults to 10.
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static getDraftDocumentsApiV1HrDocumentsDraftsGet({
        parentId,
        filter = '',
        skip,
        limit = 10,
    }: {
        parentId?: string;
        filter?: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<Array<HrDocumentRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents/drafts',
            query: {
                'parent_id': parentId,
                'filter': filter,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Save HrDocument to Draft
     * Save HrDocument
     *
     * The user must have a role that allows them to create HR documents.
     *
     * - **hr_document_template_id**: UUID - required.
     * HrDocument will be initialized based on HrDocumentTemplate.
     * - **due_date**: the end date of this document - format (YYYY-MM-DD).
     * This parameter is required.
     * - **properties**: A dictionary containing properties for the HrDocument.
     * - **user_ids**: UUID - required and should exist in database.
     * A list of user IDs to be assigned to the HrDocument.
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static saveToDraftApiV1HrDocumentsDraftsPost({
        requestBody,
    }: {
        requestBody: DraftHrDocumentCreate;
    }): CancelablePromise<HrDocumentRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents/drafts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Initialize Draft HrDocument
     * Initialize Draft HrDocument
     *
     * The user must have a role that allows them to create HR documents.
     *
     * - **document_id**: UUID - required.
     * - **due_date**: the end date of this document - format (YYYY-MM-DD).
     * This parameter is required.
     * - **properties**: A dictionary containing properties for the HrDocument.
     * - **user_ids**: UUID - required and should exist in database.
     * A list of user IDs to be assigned to the HrDocument.
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static initializeDraftDocumentApiV1HrDocumentsDraftsIdPost({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: DraftHrDocumentCreate;
    }): CancelablePromise<HrDocumentRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents/drafts/{id}',
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
     * Get HrDocument by id
     * Get HrDocument by id
     *
     * - **id**: UUID - required
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static getByIdApiV1HrDocumentsIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<HrDocumentRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update HrDocument
     * Update HrDocument
     *
     * - **id**: UUID - the id of HrDocument. This is required.
     * - **hr_document_template_id**: UUID - required.
     * HrDocument will be initialized based on HrDocumentTemplate.
     * - **due_date**: the end date of this document - format (YYYY-MM-DD).
     * This parameter is required.
     * - **properties**: A dictionary containing properties for the HrDocument.
     * - **user_ids**: UUID - required and should exist in database.
     * A list of user IDs to be assigned to the HrDocument.
     * - **status**: the status of the HrDocument.
     * This field should accept one of the following statuses:
     *
     * * Иницилизирован
     * * В процессе
     * * Завершен
     * * Отменен
     * * На доработке
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static updateApiV1HrDocumentsIdPut({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HrDocumentUpdate;
    }): CancelablePromise<HrDocumentRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/hr-documents/{id}/',
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
     * Sign HrDocument
     * Sign HrDocument
     *
     * The user must have a role that allows them to sign this HR document.
     *
     * - **id**: UUID - the ID of HrDocument. This is required.
     * - **comment**: A comment on the signed document.
     * - **is_signed**: bool - indicating whether the document is signed.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static signApiV1HrDocumentsIdPost({
        id,
        requestBody,
    }: {
        id: string;
        requestBody: HrDocumentSign;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents/{id}/',
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
     * Delete HrDocument
     * Delete HrDocument
     *
     * - **id**: UUID - required.
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1HrDocumentsIdDelete({ id }: { id: string }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/hr-documents/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Generate HrDocument
     * This endpoint generates a HR document based on the given document ID. (pdf)
     *
     * It takes a document ID as input,
     * retrieves the corresponding HR document from the database,
     * retrieves the HR document template associated with the document,
     * renders the template with the document's properties,
     * and saves the resulting Word document to a temporary file.
     * It then returns a FileResponse
     * containing the generated document as an attachment
     * that can be downloaded by the user.
     *
     * - **id**: UUID - required.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateApiV1HrDocumentsGenerateIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents/generate/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Generate HrDocument
     * This endpoint generates a HR document based on the given document ID. (html)
     *
     * It takes a document ID as input,
     * retrieves the corresponding HR document from the database,
     * retrieves the HR document template associated with the document,
     * renders the template with the document's properties,
     * and saves the resulting Word document to a temporary file.
     * It then returns a FileResponse containing
     * the generated document as an attachment that can be downloaded by the user.
     *
     * - **id**: UUID - required.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateHtmlApiV1HrDocumentsGenerateHtmlIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents/generate-html/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get data by option
     * Get data by option
     *
     * - **option**: required. This field should accept one of the following options:
     *
     * * staff_unit
     * * actual_staff_unit
     * * staff_division
     * * rank
     * * badges
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getDataByOptionApiV1HrDocumentsOptionsGet({
        option,
        dataTaken,
        id,
        type = 'write',
        skip,
        limit = 10,
    }: {
        option: string;
        dataTaken?: string;
        id?: string;
        type?: string;
        skip?: number;
        limit?: number;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents/options',
            query: {
                'option': option,
                'data_taken': dataTaken,
                'id': id,
                'type': type,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Signee
     * Get signee
     *
     * - **id**: UUID - required.
     * @returns schemas__user__UserRead Successful Response
     * @throws ApiError
     */
    public static getSigneeApiV1HrDocumentsSigneeIdGet({
        id,
    }: {
        id: string;
    }): CancelablePromise<schemas__user__UserRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-documents/signee/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Initialize HrDocument from staff list
     * Initialize HrDocument from staff list
     *
     * - **id**: UUID - required.
     * @returns HrDocumentRead Successful Response
     * @throws ApiError
     */
    public static initializeFromStaffListApiV1HrDocumentsInitializeStaffListIdPost({
        id,
    }: {
        id: string;
    }): CancelablePromise<HrDocumentRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-documents/initialize/staff_list/{id}/',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
