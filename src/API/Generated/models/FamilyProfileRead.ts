/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FamilyRead } from './FamilyRead';

export type FamilyProfileRead = {
    profile_id?: string;
    id?: string;
    family?: Array<FamilyRead>;
};
