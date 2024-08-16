/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NamedModel } from './NamedModel';
import type { StaffDivisionTypeRead } from './StaffDivisionTypeRead';

export type StaffDivisionStepChildRead = {
    name: string;
    nameKZ?: string | null;
    parent_group_id?: string | null;
    description?: NamedModel;
    is_combat_unit?: boolean | null;
    leader_id?: string | null;
    is_active?: boolean;
    type_id?: string | null;
    staff_division_number?: number | null;
    id?: string;
    type?: StaffDivisionTypeRead;
};
