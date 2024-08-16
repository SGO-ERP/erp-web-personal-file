/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PropertyTypeRead } from './PropertyTypeRead';

export type ServiceHousingRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    type_id?: string;
    address?: string;
    document_link?: string;
    issue_date?: string;
    type?: PropertyTypeRead;
};
