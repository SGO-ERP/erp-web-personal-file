/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DrivingLicenseCreate = {
    document_number: string;
    category: Array<string>;
    date_of_issue: string;
    date_to: string;
    document_link?: string;
    profile_id: string;
};
