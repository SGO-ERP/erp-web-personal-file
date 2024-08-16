/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CandidateUserRead } from './CandidateUserRead';

export type StaffUnitCandidateRead = {
    id: string;
    users?: Array<CandidateUserRead>;
};
