/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AbroadTravelRead } from './AbroadTravelRead';
import type { FamilyRelationRead } from './FamilyRelationRead';
import type { ViolationRead } from './ViolationRead';

export type FamilyRead = {
    relation_id?: string;
    first_name?: string;
    last_name?: string;
    father_name?: string;
    IIN?: string;
    birthday?: string;
    death_day?: string;
    birthplace?: string;
    address?: string;
    workplace?: string;
    profile_id?: string;
    id?: string;
    relation?: FamilyRelationRead;
    violation?: Array<ViolationRead>;
    abroad_travel?: Array<AbroadTravelRead>;
};
