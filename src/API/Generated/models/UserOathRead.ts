/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MilitaryUnitRead } from './MilitaryUnitRead';

export type UserOathRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    date?: string;
    user_id: string;
    military_unit_id: string;
    military_unit?: MilitaryUnitRead;
};
