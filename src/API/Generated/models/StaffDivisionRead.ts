/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NamedModel } from './NamedModel';
import type { schemas__staff_division__StaffUnitRead } from './schemas__staff_division__StaffUnitRead';
import type { StaffDivisionChildRead } from './StaffDivisionChildRead';
import type { StaffDivisionTypeRead } from './StaffDivisionTypeRead';

export type StaffDivisionRead = {
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
    children?: Array<StaffDivisionChildRead>;
    staff_units?: Array<schemas__staff_division__StaffUnitRead>;
    type?: StaffDivisionTypeRead;
    count_vacancies?: number;
};
