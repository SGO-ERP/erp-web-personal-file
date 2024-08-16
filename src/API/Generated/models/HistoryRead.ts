/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BadgeRead } from './BadgeRead';
import type { CoolnessRead } from './CoolnessRead';
import type { PositionRead } from './PositionRead';
import type { RankRead } from './RankRead';
import type { schemas__contract__ContractRead } from './schemas__contract__ContractRead';
import type { schemas__penalty__PenaltyRead } from './schemas__penalty__PenaltyRead';
import type { schemas__secondment__SecondmentRead } from './schemas__secondment__SecondmentRead';
import type { StaffDivisionReadWithoutStaffUnit } from './StaffDivisionReadWithoutStaffUnit';
import type { StatusRead } from './StatusRead';

export type HistoryRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name?: string;
    nameKZ?: string;
    document_link?: string;
    cancel_document_link?: string;
    confirm_document_link?: string;
    document_number?: string;
    date_from?: string;
    date_to?: string;
    position_id?: string;
    rank_id?: string;
    penalty_id?: string;
    emergency_service_id?: string;
    secondment_id?: string;
    name_change_id?: string;
    attestation_id?: string;
    characteristic_initiator_id?: string;
    rank_assigned_by?: string;
    status_id?: string;
    status_name?: string;
    coolness_id?: string;
    contract_id?: string;
    badge_id?: string;
    user_id: string;
    is_credited?: boolean;
    document_style?: string;
    date_credited?: string;
    name_of_organization?: string;
    type: string;
    position_work_experience?: string;
    staff_division_id?: string;
    coefficient?: number;
    percentage?: number;
    staff_division_name?: string;
    staff_division_nameKZ?: string;
    rank?: RankRead;
    position?: PositionRead;
    penalty?: schemas__penalty__PenaltyRead;
    secondment?: schemas__secondment__SecondmentRead;
    status?: StatusRead;
    coolness?: CoolnessRead;
    contract?: schemas__contract__ContractRead;
    badge?: BadgeRead;
    staff_division?: StaffDivisionReadWithoutStaffUnit;
};
