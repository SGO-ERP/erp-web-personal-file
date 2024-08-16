/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ServiceStaffFunctionTypeRead } from './ServiceStaffFunctionTypeRead';

export type ServiceStaffFunctionRead = {
    name: string;
    nameKZ?: string | null;
    is_active?: boolean | null;
    hours_per_week?: number | null;
    type_id?: string;
    id?: string;
    created_at?: string;
    updated_at?: string;
    discriminator?: string | null;
    type?: ServiceStaffFunctionTypeRead;
};
