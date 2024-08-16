/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ServiceIDStatus } from './ServiceIDStatus';

export type ServiceIDRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    number?: string;
    date_to?: string;
    token_status?: ServiceIDStatus;
    id_status?: ServiceIDStatus;
    user_id: string;
};
