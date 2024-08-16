/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AbroadTravelRead } from './AbroadTravelRead';
import type { PolygraphCheckRead } from './PolygraphCheckRead';
import type { PropertiesRead } from './PropertiesRead';
import type { PsychologicalCheckRead } from './PsychologicalCheckRead';
import type { ServiceHousingRead } from './ServiceHousingRead';
import type { SpecialCheckRead } from './SpecialCheckRead';
import type { VehicleRead } from './VehicleRead';
import type { ViolationRead } from './ViolationRead';

export type AdditionalProfileRead = {
    id?: string;
    created_at?: string;
    updated_at?: string;
    profile_id: string;
    polygraph_checks?: Array<PolygraphCheckRead>;
    violations?: Array<ViolationRead>;
    abroad_travels?: Array<AbroadTravelRead>;
    psychological_checks?: Array<PsychologicalCheckRead>;
    special_checks?: Array<SpecialCheckRead>;
    service_housing?: Array<ServiceHousingRead>;
    user_vehicles?: Array<VehicleRead>;
    properties?: Array<PropertiesRead>;
};
