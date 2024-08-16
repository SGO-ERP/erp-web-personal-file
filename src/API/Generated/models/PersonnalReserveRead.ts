/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Enum } from './Enum';

export type PersonnalReserveRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    reserve?: Enum;
    date_from?: string;
    date_to?: string;
    user_id?: string;
    document_link?: string;
    document_number?: string;
};
