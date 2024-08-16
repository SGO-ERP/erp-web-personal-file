/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArchiveStaffDivisionStepChildRead } from './ArchiveStaffDivisionStepChildRead';
import type { ArchiveStaffUnitRead } from './ArchiveStaffUnitRead';
import type { NamedModel } from './NamedModel';
import type { StaffDivisionTypeRead } from './StaffDivisionTypeRead';

export type ArchiveStaffDivisionStepRead = {
    name: string;
    nameKZ?: string | null;
    parent_group_id?: string | null;
    description?: NamedModel;
    staff_list_id: string;
    is_combat_unit?: boolean | null;
    leader_id?: string | null;
    type_id?: string | null;
    staff_division_number?: number | null;
    id?: string;
    children?: Array<ArchiveStaffDivisionStepChildRead>;
    staff_units?: Array<ArchiveStaffUnitRead>;
    type?: StaffDivisionTypeRead;
};
