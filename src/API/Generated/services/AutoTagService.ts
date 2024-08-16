/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AutoTagService {
    /**
     * Get By User Id
     * Get User data through AutoTag
     *
     * Args:
     * user_id (str): id of user from whom data is to be fetched
     * auto_tag (str): auto_tag to be used to fetch data
     * db (Session, optional): Instance of Session for database connection.
     * Defaults to Depends(get_db).
     * Authorize (AuthJWT, optional): JWTToken holder class. Defaults to Depends().
     *
     * Returns:
     * Any: Result from AutoTag
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getByUserIdApiV1AutoTagsUserIdGet({
        userId,
        autoTag,
    }: {
        userId: string;
        autoTag: string;
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auto-tags/{user_id}/',
            path: {
                'user_id': userId,
            },
            query: {
                'auto_tag': autoTag,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
