/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { schemas__status__History } from './schemas__status__History';
import type { StatusTypeRead } from './StatusTypeRead';

export type StatusRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    type_id?: string;
    user_id: string;
    type?: StatusTypeRead;
    history?: schemas__status__History;
};
