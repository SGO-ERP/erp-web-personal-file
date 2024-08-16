/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LanguageRead } from './LanguageRead';

export type LanguageProficiencyRead = {
    level: number;
    profile_id?: string;
    language_id?: string;
    language?: LanguageRead;
};
