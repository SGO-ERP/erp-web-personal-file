/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TypeArmyEquipmentModel } from './TypeArmyEquipmentModel';

export type TypeArmyEquipmentRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name?: string;
    nameKZ?: string;
    type_of_army_equipment_models?: Array<TypeArmyEquipmentModel>;
};
