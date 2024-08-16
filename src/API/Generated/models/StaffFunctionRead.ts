/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StaffFunctionRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    nameKZ?: string | null;
    is_active?: boolean | null;
    hours_per_week?: number | null;
    discriminator?: string | null;
};
