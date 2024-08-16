/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BiographicInfoRead } from './BiographicInfoRead';
import type { DrivingLicenseRead } from './DrivingLicenseRead';
import type { IdentificationCardRead } from './IdentificationCardRead';
import type { PassportRead } from './PassportRead';
import type { ProfileRead } from './ProfileRead';
import type { SportAchievementRead } from './SportAchievementRead';
import type { SportDegreeRead } from './SportDegreeRead';
import type { TaxDeclarationRead } from './TaxDeclarationRead';
import type { UserFinancialInfoRead } from './UserFinancialInfoRead';

export type PersonalProfileRead = {
    profile_id?: string;
    id?: string;
    created_at?: string;
    updated_at?: string;
    profile?: ProfileRead;
    identification_card?: IdentificationCardRead;
    biographic_info?: BiographicInfoRead;
    driving_license?: DrivingLicenseRead;
    passport?: PassportRead;
    sport_achievements?: Array<SportAchievementRead>;
    sport_degrees?: Array<SportDegreeRead>;
    tax_declarations?: Array<TaxDeclarationRead>;
    user_financial_infos?: Array<UserFinancialInfoRead>;
};
