/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TypeClothingEquipmentModel } from './TypeClothingEquipmentModel';

export type TypeClothingEquipmentRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name?: string;
    nameKZ?: string;
    type_cloth_eq_models?: Array<TypeClothingEquipmentModel>;
};
