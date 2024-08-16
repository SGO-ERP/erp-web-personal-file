/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BadgeTypeRead } from './BadgeTypeRead';
import type { schemas__badge__History } from './schemas__badge__History';

export type BadgeRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    user_id: string;
    type_id: string;
    type?: BadgeTypeRead;
    history?: schemas__badge__History;
};
