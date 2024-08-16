/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActivityChildRead } from './ActivityChildRead';

export type ActivityRead = {
    name: string;
    nameKZ?: string | null;
    parent_group_id?: string;
    instructions?: string;
    is_time_required?: boolean;
    normative_img?: string;
    id?: string;
    children?: Array<ActivityChildRead>;
};
