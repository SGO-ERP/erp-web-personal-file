/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StaffDivisionMatreshkaStepChildRead } from './StaffDivisionMatreshkaStepChildRead';
import type { StaffDivisionTypeRead } from './StaffDivisionTypeRead';

export type StaffDivisionMatreshkaStepRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    nameKZ?: string | null;
    children?: Array<StaffDivisionMatreshkaStepChildRead>;
    is_combat_unit?: boolean | null;
    leader_id?: string | null;
    staff_division_number?: number | null;
    type?: StaffDivisionTypeRead;
};
