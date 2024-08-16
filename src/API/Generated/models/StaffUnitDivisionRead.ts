/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NamedModel } from './NamedModel';

export type StaffUnitDivisionRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    nameKZ?: string | null;
    parent_group_id?: string | null;
    description?: NamedModel;
    is_combat_unit?: boolean | null;
    leader_id?: string | null;
    is_active?: boolean;
    type_id?: string | null;
    staff_division_number?: number | null;
};
