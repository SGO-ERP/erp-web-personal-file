/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Enum } from './Enum';

export type PersonnalReserveCreate = {
    reserve?: Enum;
    date_from?: string;
    date_to?: string;
    user_id?: string;
    document_link?: string;
    document_number?: string;
};
