/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NamedModel } from './NamedModel';

export type NewArchiveStaffDivisionCreate = {
    name: string;
    nameKZ?: string | null;
    parent_group_id?: string | null;
    description?: NamedModel;
    staff_list_id: string;
    is_combat_unit?: boolean | null;
    leader_id?: string | null;
    type_id?: string | null;
    staff_division_number?: number | null;
};
