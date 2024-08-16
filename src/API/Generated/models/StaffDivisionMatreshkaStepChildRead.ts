/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StaffDivisionTypeRead } from './StaffDivisionTypeRead';

export type StaffDivisionMatreshkaStepChildRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    nameKZ?: string | null;
    is_combat_unit?: boolean | null;
    leader_id?: string | null;
    staff_division_number?: number | null;
    type?: StaffDivisionTypeRead;
};
