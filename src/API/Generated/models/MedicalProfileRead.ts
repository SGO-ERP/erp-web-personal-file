/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnthropometricDataRead } from './AnthropometricDataRead';
import type { DispensaryRegistrationRead } from './DispensaryRegistrationRead';
import type { GeneralUserInformationRead } from './GeneralUserInformationRead';
import type { HospitalDataRead } from './HospitalDataRead';
import type { UserLiberationRead } from './UserLiberationRead';

export type MedicalProfileRead = {
    profile_id: string;
    id?: string;
    general_user_info?: Array<GeneralUserInformationRead>;
    dispensary_registrations?: Array<DispensaryRegistrationRead>;
    anthropometric_datas?: Array<AnthropometricDataRead>;
    hospital_datas?: Array<HospitalDataRead>;
    user_liberations?: Array<UserLiberationRead>;
};
