/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RankRead } from './RankRead';
import type { StatusRead } from './StatusRead';

export type UserShortReadStatus = {
    id?: string;
    first_name?: string;
    last_name?: string;
    father_name?: string;
    icon?: string;
    rank?: RankRead;
    statuses?: Array<StatusRead>;
};
