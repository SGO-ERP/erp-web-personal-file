/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Enum } from './Enum';

export type ServiceIdInfoRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    number?: string;
    date_to?: string;
    token_status?: Enum;
    id_status?: Enum;
};
