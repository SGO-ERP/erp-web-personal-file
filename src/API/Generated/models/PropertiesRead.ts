/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PropertyTypeRead } from './PropertyTypeRead';

export type PropertiesRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    type_id: string;
    purchase_date: string;
    purchase_type: string;
    purchase_typeKZ: string;
    address: string;
    profile_id: string;
    type?: PropertyTypeRead;
};
