/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TypeOtherEquipmentModel } from './TypeOtherEquipmentModel';

export type TypeOtherEquipmentRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name?: string;
    nameKZ?: string;
    type_of_other_equipment_models?: Array<TypeOtherEquipmentModel>;
};
