/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EmergencyContactRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    date_from?: string;
    date_to?: string;
    length_of_service?: Record<string, any>;
    coefficient?: number;
    percentage?: number;
    staff_division?: Record<string, any>;
    position?: Record<string, any>;
    position_id?: string;
    emergency_rank_id?: string;
    document_link?: string;
    document_number?: string;
    staff_division_id?: string;
    document_style?: string;
    contractor_signer_name?: Record<string, any>;
};
