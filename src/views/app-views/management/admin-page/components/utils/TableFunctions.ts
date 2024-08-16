import store from "store";
import ApiService from "auth/FetchInterceptor";
import { Modal } from "antd";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";

import { getRanksTypes } from "store/slices/admin-page/adminRanksSlice";
import { getBadgeTypes } from "store/slices/admin-page/adminBadgeSlice";
import { getPenaltyTypes } from "store/slices/admin-page/adminPenaltySlice";
import { getPropertyTypes } from "store/slices/admin-page/adminPropertySlice";
import { getSportTypes } from "store/slices/admin-page/adminSportTypesSlice";
import { getStatusTypes } from "store/slices/admin-page/adminStatusesSlice";
import { getSpecialtiesTypes } from "store/slices/admin-page/adminSpecialtiesSlice";
import { getAcademicDegreeTypes } from "store/slices/admin-page/adminAcademicDegreeSlice";
import { getAcademicTitleTypes } from "store/slices/admin-page/adminAcademicTitleSlice";
import { getCountryTypes } from "store/slices/admin-page/adminCountriesSlice";
import { getCourseTypes } from "store/slices/admin-page/adminCoursesSlice";
import { getInstitutionDegreeTypes } from "store/slices/admin-page/adminInstitutionDegreeSlice";
import { getInstitutionTypes } from "store/slices/admin-page/adminInstitutionsSlice";
import { getLanguageTypes } from "store/slices/admin-page/adminLanguagesSlice";
import { getScienceTypes } from "store/slices/admin-page/adminScienceSlice";
import { getRegion } from "store/slices/admin-page/adminRegionSlice";
import { getCity } from "store/slices/admin-page/adminCitySlice";
import { getMilitaryInstitution } from "store/slices/admin-page/adminMilitaryInstitutionSlice";
import { getSportDegreeType } from "store/slices/admin-page/adminSportDegreeTypeSlice";
import { getNationalities } from "store/slices/admin-page/adminNationalitiesSlice";
import { getBirthPlaces } from "store/slices/admin-page/adminBirthPlaceSlice";
import { getCitizenship } from "store/slices/admin-page/adminCitizenshipSlice";
import { getViolation } from "store/slices/admin-page/adminViolationSlice";
import { getIllness } from "store/slices/admin-page/adminIllnessSlice";
import { getLiberation } from "store/slices/admin-page/adminLiberationSlice";
import { getWeaponModel } from "store/slices/admin-page/adminWeaponModelsSlice";
import { getClothingModel } from "store/slices/admin-page/adminClothingModelsSlice";
import { getOtherModel } from "store/slices/admin-page/adminOtherModelSlice";

const title = {
    name: "Вы уверены, что хотите выполнить удаление?",
    nameKZ: "Сіз жоюды қалайтыныңызға сенімдісіз бе?",
};

const content = {
    name: "Эта запись будет полностью удалена из списка и базы данных",
    nameKZ: "Бұл жазба тізімнен және дерекқордан толығымен жойылады",
};

const okText = {
    name: "Да",
    nameKZ: "Ия",
};

const cancelText = {
    name: "Нет",
    nameKZ: "Жоқ",
};

export const createTableDelete = (action: any, url: string) => {
    return async (id: string) => {
        Modal.confirm({
            title: LocalText.getName(title),
            content: LocalText.getName(content),
            okText: LocalText.getName(okText),
            cancelText: LocalText.getName(cancelText),
            onOk: async () => {
                try {
                    await ApiService.delete(url + `/${id}`);

                    store.dispatch(action());
                } catch (error) {
                    console.error("Error deleting record:", error);
                }
            },
        });
    };
};

export const tableRankDelete = createTableDelete(getRanksTypes, "ranks");
export const tableBadgeDelete = createTableDelete(getBadgeTypes, "badge_types");
export const tablePositionDelete = createTableDelete(getBadgeTypes, "positions");
export const tablePenaltyDelete = createTableDelete(getPenaltyTypes, "penalty_types");
export const tableSportDelete = createTableDelete(getSportTypes, "personal/sport_type");
export const tablePropertyDelete = createTableDelete(getPropertyTypes, "additional/property_types");
export const tableStatusDelete = createTableDelete(getStatusTypes, "status_types");
export const tableSpecialtiesDelete = createTableDelete(
    getSpecialtiesTypes,
    "education/specialties",
);
export const tableAcademicDegreeDelete = createTableDelete(
    getAcademicDegreeTypes,
    "education/academic_degree_degrees",
);
export const tableAcademicTitleDelete = createTableDelete(
    getAcademicTitleTypes,
    "education/academic_title_degrees",
);
export const tableCountryDelete = createTableDelete(getCountryTypes, "additional/country");
export const tableCourseDelete = createTableDelete(getCourseTypes, "education/course_providers");
export const tableInstitutionDegreeDelete = createTableDelete(
    getInstitutionDegreeTypes,
    "education/institution_degree_types",
);
export const tableInstitutionDelete = createTableDelete(
    getInstitutionTypes,
    "education/institutions",
);
export const tableLanguageDelete = createTableDelete(getLanguageTypes, "education/languages");
export const tableScienceDelete = createTableDelete(getScienceTypes, "education/sciences");
export const tableNationDelete = createTableDelete(getNationalities, "personal/nationality");
export const tableBirthPlaceDelete = createTableDelete(getBirthPlaces, "personal/birthplace");
export const tableCitizenshipDelete = createTableDelete(getCitizenship, "personal/citizenship");
export const tableIllnessDelete = createTableDelete(getIllness, "medical/illness_type");
export const tableLiberationDelete = createTableDelete(getLiberation, "medical/liberations");
export const tableViolationDelete = createTableDelete(getViolation, "additional/violation_type");
export const tableRegionDelete = createTableDelete(getRegion, "personal/region");
export const tableCityDelete = createTableDelete(getCity, "personal/city");
export const tableMilitaryInstitutionDelete = createTableDelete(
    getMilitaryInstitution,
    "education/military_institution",
);
export const tableSportDegreeTypeDelete = createTableDelete(
    getSportDegreeType,
    "personal/sport_degree_type",
);
export const tableWeaponModelDelete = createTableDelete(getWeaponModel, "equipments/models/army");
export const tableClothingModelDelete = createTableDelete(
    getClothingModel,
    "equipments/models/clothing",
);
export const tableOtherModelDelete = createTableDelete(getOtherModel, "equipments/models/other");

export const nameSorter = (a: any, b: any, type: string) => {
    const sanitizeAndNormalize = (text: string) => text.replace(/['"«»]/g, "");

    const nameA = sanitizeAndNormalize(a[type] ?? "").trim();
    const nameB = sanitizeAndNormalize(b[type] ?? "").trim();

    return nameA.localeCompare(nameB);
};
