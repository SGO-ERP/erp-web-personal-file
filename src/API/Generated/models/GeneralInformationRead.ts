/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CoolnessRead } from './CoolnessRead';
import type { OathRead } from './OathRead';
import type { PersonnalReserveRead } from './PersonnalReserveRead';
import type { PrivelegeEmergencyRead } from './PrivelegeEmergencyRead';

export type GeneralInformationRead = {
    oath?: OathRead;
    privilege_emergency_secrets?: PrivelegeEmergencyRead;
    personnel_reserve?: PersonnalReserveRead;
    coolness?: CoolnessRead;
    is_badge_black?: boolean;
    researcher?: Record<string, any>;
    recommender?: Record<string, any>;
};
