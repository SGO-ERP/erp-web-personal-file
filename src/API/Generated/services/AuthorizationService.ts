/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CandidateRegistrationForm } from '../models/CandidateRegistrationForm';
import type { EcpLoginForm } from '../models/EcpLoginForm';
import type { LoginForm } from '../models/LoginForm';
import type { RegistrationForm } from '../models/RegistrationForm';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthorizationService {
    /**
     * Login
     * Login to the system.
     *
     * - **email**: required and should be a valid email format.
     * - **password**: required.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static loginApiV1AuthLoginPost({
        requestBody,
    }: {
        requestBody: LoginForm;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Login by ecp
     * Login to the system.
     *
     * - **certificate_blob**: required. auth_certificate.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static loginEcpApiV1AuthLoginEcpPost({
        requestBody,
    }: {
        requestBody: EcpLoginForm;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/login/ecp',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Register
     * Register new user to the system.
     *
     * - **email**: string required and should be a valid email format.
     * - **first_name**: required.
     * - **last_name**: required.
     * - **father_name**: optional.
     * - **group_id**: UUID - required and should exist in the database
     * - **position_id**: UUID - required and should exist in the database.
     * - **icon**: image with url format. This parameter is optional.
     * - **call_sign**: required.
     * - **id_number**: unique employee number. This parameter is required.
     * - **phone_number**: format (+77xxxxxxxxx). This parameter is optional.
     * - **address**: optional.
     * - **birthday**: format (YYYY-MM-DD). This parameter is optional.
     * - **status**: the current status of the employee
     * (e.g. "working", "on vacation", "sick", etc.). This parameter is optional.
     * - **status_till**: the date when the current status of the employee will end.
     * This parameter is optional.
     * - **role_name**: required.
     * - **password**: required.
     * - **re_password**: required and should match the password field.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static registerApiV1AuthRegisterPost({
        requestBody,
    }: {
        requestBody: RegistrationForm;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Register Candidate
     * Register new candidate to the system.
     *
     * - **iin**: str
     * @returns any Successful Response
     * @throws ApiError
     */
    public static registerCandidateApiV1AuthRegisterCandidatePost({
        requestBody,
    }: {
        requestBody: CandidateRegistrationForm;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/register/candidate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Refresh Token
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshTokenApiV1AuthRefreshGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/refresh',
        });
    }
}
