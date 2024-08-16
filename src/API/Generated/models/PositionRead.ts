/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RankRead } from './RankRead';

export type PositionRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    nameKZ?: string | null;
    category_code?: string;
    form?: string;
    max_rank_id?: string;
    max_rank?: RankRead;
};
