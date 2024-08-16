/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttestationRead } from './AttestationRead';
import type { BadgeServiceDetailRead } from './BadgeServiceDetailRead';
import type { CharacteristicRead } from './CharacteristicRead';
import type { EmergencyContactRead } from './EmergencyContactRead';
import type { ExperienceRead } from './ExperienceRead';
import type { GeneralInformationRead } from './GeneralInformationRead';
import type { HolidayRead } from './HolidayRead';
import type { RankServiceDetailRead } from './RankServiceDetailRead';
import type { schemas__history__history__ContractRead } from './schemas__history__history__ContractRead';
import type { schemas__history__history__PenaltyRead } from './schemas__history__history__PenaltyRead';
import type { schemas__history__history__SecondmentRead } from './schemas__history__history__SecondmentRead';
import type { ServiceIdInfoRead } from './ServiceIdInfoRead';
import type { TrainingAttendanceRead } from './TrainingAttendanceRead';

export type HistoryServiceDetailRead = {
    general_information?: GeneralInformationRead;
    attendance?: TrainingAttendanceRead;
    service_id_info?: ServiceIdInfoRead;
    badges?: Array<BadgeServiceDetailRead>;
    ranks?: Array<RankServiceDetailRead>;
    penalties?: Array<schemas__history__history__PenaltyRead>;
    contracts?: Array<schemas__history__history__ContractRead>;
    attestations?: Array<AttestationRead>;
    characteristics?: Array<CharacteristicRead>;
    holidays?: Array<HolidayRead>;
    emergency_contracts?: Array<EmergencyContactRead>;
    experience?: Array<ExperienceRead>;
    secondments?: Array<schemas__history__history__SecondmentRead>;
    equipments?: Array<Record<string, any>>;
};
