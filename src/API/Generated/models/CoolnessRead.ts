/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CoolnessTypeRead } from './CoolnessTypeRead';

export type CoolnessRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    type_id?: string;
    user_id?: string;
    type?: CoolnessTypeRead;
};
