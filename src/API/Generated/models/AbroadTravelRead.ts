/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CountryRead } from './CountryRead';

export type AbroadTravelRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    vehicle_type: string;
    destination_country_id: string;
    date_from: string;
    date_to: string;
    reason: string;
    document_link?: string;
    profile_id?: string;
    destination_country?: CountryRead;
};
