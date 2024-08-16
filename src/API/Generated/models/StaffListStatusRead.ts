/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserShortRead } from './UserShortRead';

export type StaffListStatusRead = {
    name: string;
    nameKZ?: string | null;
    user_id?: string;
    id?: string;
    status?: string | null;
    updated_at?: string;
    changes_size?: number | null;
    user?: UserShortRead | null;
    reg_number?: string | null;
    document_signed_by?: string | null;
    document_signed_at?: string | null;
};
