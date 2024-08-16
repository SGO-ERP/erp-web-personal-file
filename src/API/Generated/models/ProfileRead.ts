/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { schemas__user__UserRead } from './schemas__user__UserRead';

export type ProfileRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    user_id?: string;
    user?: schemas__user__UserRead;
};
