/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PermissionTypeRead } from './PermissionTypeRead';

export type PermissionRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    type_id: string;
    user_id: string;
    type: PermissionTypeRead;
};
