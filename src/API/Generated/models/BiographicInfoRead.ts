/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FamilyStatusRead } from './FamilyStatusRead';

export type BiographicInfoRead = {
    place_birth?: string;
    gender?: boolean;
    citizenship?: string;
    nationality?: string;
    family_status_id?: string;
    address?: string;
    residence_address?: string;
    profile_id?: string;
    id?: string;
    created_at?: string;
    updated_at?: string;
    family_status?: FamilyStatusRead;
};
