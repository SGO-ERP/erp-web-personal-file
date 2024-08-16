/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SportTypeRead } from './SportTypeRead';

export type SportAchievementRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    nameKZ?: string | null;
    assignment_date?: string;
    sport_type_id?: string;
    document_link?: string;
    profile_id?: string;
    sport_type?: SportTypeRead;
};
