/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CourseProviderRead } from './CourseProviderRead';

export type CourseRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    nameKZ?: string | null;
    profile_id?: string;
    course_provider_id?: string;
    start_date?: string;
    end_date?: string;
    document_link?: string;
    course_provider?: CourseProviderRead;
};
