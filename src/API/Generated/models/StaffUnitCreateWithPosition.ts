/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StaffUnitCreateWithPosition = {
    name: string;
    nameKZ?: string | null;
    category_code: string;
    form: string;
    max_rank_id?: string;
    staff_division_id: string;
    is_active?: boolean;
    requirements?: Array<Record<string, any>> | null;
};
