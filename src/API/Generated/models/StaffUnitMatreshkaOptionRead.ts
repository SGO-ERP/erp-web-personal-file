/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MatreshkaUserRead } from './MatreshkaUserRead';
import type { NamedModel } from './NamedModel';

export type StaffUnitMatreshkaOptionRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    staff_division_id?: string;
    position_id?: string;
    position?: NamedModel;
    users?: Array<MatreshkaUserRead>;
};
