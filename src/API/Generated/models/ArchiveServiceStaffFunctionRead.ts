/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ServiceStaffFunctionTypeRead } from './ServiceStaffFunctionTypeRead';

export type ArchiveServiceStaffFunctionRead = {
    name?: string;
    nameKZ?: string | null;
    hours_per_week?: number;
    type_id?: string;
    id?: string;
    discriminator?: string;
    type?: ServiceStaffFunctionTypeRead;
};
