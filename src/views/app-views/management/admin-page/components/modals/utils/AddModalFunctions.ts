import ApiService from "auth/FetchInterceptor";
import store from "store";

import { notification } from "antd";
import { getBadgeTypes } from "store/slices/admin-page/adminBadgeSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
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
import { getRanksTypes } from "store/slices/admin-page/adminRanksSlice";
import { getPositionTypes } from "store/slices/admin-page/adminPositionSlice";
import { getNationalities } from "store/slices/admin-page/adminNationalitiesSlice";
import { getBirthPlaces } from "store/slices/admin-page/adminBirthPlaceSlice";
import { getCitizenship } from "store/slices/admin-page/adminCitizenshipSlice";
import { getIllness } from "store/slices/admin-page/adminIllnessSlice";
import { getLiberation } from "store/slices/admin-page/adminLiberationSlice";
import { getViolation } from "store/slices/admin-page/adminViolationSlice";
import { getRegion } from "store/slices/admin-page/adminRegionSlice";
import { getCity } from "store/slices/admin-page/adminCitySlice";
import { getMilitaryInstitution } from "../../../../../../../store/slices/admin-page/adminMilitaryInstitutionSlice";
import { getSportDegreeType } from "../../../../../../../store/slices/admin-page/adminSportDegreeTypeSlice";
import { getWeaponType } from "store/slices/admin-page/adminWeaponSlice";
import { getWeaponModel } from "store/slices/admin-page/adminWeaponModelsSlice";
import { getClothingType } from "store/slices/admin-page/adminClothingTypeSlice";
import { getClothingModel } from "store/slices/admin-page/adminClothingModelsSlice";
import { getOtherModel } from "store/slices/admin-page/adminOtherModelSlice";
import { getOtherType } from "store/slices/admin-page/adminOtherTypeSlice";

interface BodyTypes {
    name: string;
    nameKZ: string;
}

const errorsTypes: { [key: string]: BodyTypes } = {
    badge: {
        name: "Медали не добавилось",
        nameKZ: "Медальдар қосылмаған",
    },
    position: {
        name: "Должность не добавилось",
        nameKZ: "Қызмет атауы қосылмаған",
    },
    rank: {
        name: "Звание не добавилось",
        nameKZ: "Дәреже қосылмаған",
    },
    penalty: {
        name: "Взыскание не добавилось",
        nameKZ: "Төлем қосылмаған",
    },
    property: {
        name: "Вид имущество не добавилось",
        nameKZ: "Меншік түрі қосылмаған",
    },
    sport: {
        name: "Вид спорта не добавилось",
        nameKZ: "Спорт түрі қосылмаған",
    },
    status: {
        name: "Статус не добавилось",
        nameKZ: "Күй қосылмаған",
    },
    specialty: {
        name: "Специальность не добавилось",
        nameKZ: "Мамандығы қосылмаған",
    },
    academicDegree: {
        name: "Академическая степень не добавилось",
        nameKZ: "Академиялық дәреже қосылмаған",
    },
    academicTitle: {
        name: "Ученое звание степени не добавилось",
        nameKZ: "Ғылыми дәреженің ғылыми атағы қосылмаған",
    },
    country: {
        name: "Страна не добавилось",
        nameKZ: "Мемлекет қосылмаған",
    },
    course: {
        name: "Поставщики курсов не добавилось",
        nameKZ: "Курс провайдерлері қосылмаған",
    },
    institutionDegree: {
        name: "Степень не добавилось",
        nameKZ: "Дәреже қосылмаған",
    },
    institution: {
        name: "Учебные заведения не добавилось",
        nameKZ: "Білім беру мекемелері қосылмаған",
    },
    language: {
        name: "Языки не добавилось",
        nameKZ: "Тілдер қосылмаған",
    },
    science: {
        name: "Наука не добавилось",
        nameKZ: "Ғылым қосылмаған",
    },
    nationality: {
        name: "Национальность не добавилось",
        nameKZ: "Ұлты қосылмаған",
    },
    birthPlace: {
        name: "Mесто рождения не добавилось",
        nameKZ: "Tуған жер қосылмаған",
    },
    citizenship: {
        name: "Гражданство не добавилось",
        nameKZ: "Азаматтық қосылмаған",
    },
    illness: {
        name: "Наименование болезни не добавилось",
        nameKZ: "Аурудың атауы қосылмаған",
    },
    liberation: {
        name: "Освобождение не добавилось",
        nameKZ: "Азаттық қосылмаған",
    },
    violation: {
        name: "Правонарушение не добавилось",
        nameKZ: "Құқық бұзушылық қосылмаған",
    },
    city: {
        name: "Город не добавилось",
        nameKZ: "Қала қосылмаған",
    },
    region: {
        name: "Область не добавилось",
        nameKZ: "Аймақ қосылмаған",
    },
    military_institution: {
        name: "Военные учебные заведения не добавилось",
        nameKZ: "Әскери оқу орындары қосылмаған",
    },
    sport_degree_type: {
        name: "Наименование спортивного навыка не добавилось",
        nameKZ: "Спорттық дағдылардың атауы қосылмаған",
    },
    weaponType: {
        name: "Тип вооружения не добавилось",
        nameKZ: "Қару түрі қосылмаған",
    },
    weaponModel: {
        name: "Модели вооружения не добавилось",
        nameKZ: "Қару-жарақ моделі қосылмады",
    },
    clothingType: {
        name: "Тип одежды не добавилось",
        nameKZ: "Киім түрі қосылмаған",
    },
    clothingModel: {
        name: "Модели одежды не добавилось",
        nameKZ: "Киім үлгісі қосылмады",
    },
    otherType: {
        name: "Тип иного не добавилось",
        nameKZ: "Басқа түрі қосылмаған",
    },
    otherModel: {
        name: "Модели иного не добавилось",
        nameKZ: "Модельдер басқаша қосылмады",
    },
};

const createNewItem = (action: any, url: string, type: string) => {
    return async (body: BodyTypes) => {
        try {
            const response: any = await ApiService.post(url, body);

            if (response.error) {
                notification.error({
                    message: LocalText.getName(errorsTypes[type]),
                });
            }

            store.dispatch(action());
        } catch (error) {
            console.error("Error deleting record:", error);

            notification.error({
                message: LocalText.getName(errorsTypes[type]),
            });
        }
    };
};

export const createRank = createNewItem(getRanksTypes, "ranks", "rank");
export const createPosition = createNewItem(getPositionTypes, "positions", "position");
export const createBadge = createNewItem(getBadgeTypes, "badge_types", "badge");
export const createPenalty = createNewItem(getPenaltyTypes, "penalty_types", "penalty");
export const createProperty = createNewItem(
    getPropertyTypes,
    "additional/property_types",
    "property",
);
export const createSport = createNewItem(getSportTypes, "personal/sport_type", "sport");
export const createStatus = createNewItem(getStatusTypes, "status_types", "status");
export const createSpecialty = createNewItem(
    getSpecialtiesTypes,
    "education/specialties",
    "specialty",
);
export const createAcademicDegree = createNewItem(
    getAcademicDegreeTypes,
    "education/academic_degree_degrees",
    "academicDegree",
);
export const createAcademicTitle = createNewItem(
    getAcademicTitleTypes,
    "education/academic_title_degrees",
    "academicTitle",
);
export const createCountry = createNewItem(getCountryTypes, "additional/country", "country");
export const createCourse = createNewItem(getCourseTypes, "education/course_providers", "course");
export const createInstitutionDegree = createNewItem(
    getInstitutionDegreeTypes,
    "education/institution_degree_types",
    "institutionDegree",
);
export const createInstitution = createNewItem(
    getInstitutionTypes,
    "education/institutions",
    "institution",
);
export const createLanguage = createNewItem(getLanguageTypes, "education/languages", "language");
export const createScience = createNewItem(getScienceTypes, "education/sciences", "science");
export const createNationalities = createNewItem(
    getNationalities,
    "personal/nationality",
    "nationality",
);
export const createBirthPlaces = createNewItem(getBirthPlaces, "personal/birthplace", "birthPlace");
export const createCitizenship = createNewItem(
    getCitizenship,
    "personal/citizenship",
    "citizenship",
);
export const createIllness = createNewItem(getIllness, "medical/illness_type", "illness");
export const createLiberation = createNewItem(getLiberation, "medical/liberations", "liberation");
export const createViolation = createNewItem(
    getViolation,
    "additional/violation_type",
    "violation",
);
export const createRegion = createNewItem(getRegion, "personal/region", "region");
export const createCity = createNewItem(getCity, "personal/city", "city");
export const createMilitaryInstitution = createNewItem(
    getMilitaryInstitution,
    "education/military_institution",
    "military_institution",
);
export const createSportDegreeType = createNewItem(
    getSportDegreeType,
    "personal/sport_degree_type",
    "sport_degree_type",
);
export const createWeaponType = createNewItem(getWeaponType, "equipments/type/army", "weaponType");
export const createWeaponModel = createNewItem(
    getWeaponModel,
    "equipments/model/army",
    "weaponModel",
);
export const createClothingType = createNewItem(
    getClothingType,
    "equipments/type/clothing",
    "clothingType",
);
export const createClothingModel = createNewItem(
    getClothingModel,
    "equipments/model/clothing",
    "clothingModel",
);
export const createOtherType = createNewItem(getOtherType, "equipments/type/other", "otherType");
export const createOtherModel = createNewItem(
    getOtherModel,
    "equipments/model/other",
    "otherModel",
);

export const generateRankOption = async () => {
    try {
        const response = await ApiService.get("ranks?skip=0&limit=10000");

        if (!response || !response.data || !response.data.objects) {
            return [];
        }

        return response.data.objects.map((item: any) => ({
            value: item.id,
            label: LocalText.getName(item),
            object: item,
        }));
    } catch (error) {
        notification.error({
            message: "Звание не загрузились",
        });
        console.log(error);
        return [];
    }
};

export const generateFormOption = async () => {
    try {
        const response: any = await ApiService.get("privelege_emergencies/forms");

        if (!response || !response.data) {
            return [];
        }

        const keys = Object.keys(response.data);

        return keys.map((item) => ({ value: item, label: response.data[item] }));
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const generateCategoryOption = async () => {
    try {
        const response: any = await ApiService.get("positions/category_codes");

        if (!response || !response.data) {
            return [];
        }

        return response.data.map((item: string) => ({ value: item, label: item }));
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const generateModelsOption = async (which: string, type: string) => {
    const api = `equipments/${type}/${which}/`;

    try {
        const response: any = await ApiService.get(api);

        if (!response) return [];

        if (response.data.objects) {
            return response.data.objects.map((item: any) => ({
                value: item.id,
                label: LocalText.getName(item),
            }));
        }

        if (response.data) {
            return response.data.map((item: any) => ({
                value: item.id,
                label: LocalText.getName(item),
            }));
        }

        return response.map((item: any) => ({ value: item.id, label: LocalText.getName(item) }));
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const generateAdditionalOptions = async (api: string) => {
    try {
        const response: any = await ApiService.get(api, {
            params: {
                limit: 10_000
            }
        });

        if (!response) return [];

        if (response.data.objects) {
            return response.data.objects.map((item: any) => ({
                value: item.id,
                label: LocalText.getName(item),
            }));
        }

        if (response.data) {
            return response.data.map((item: any) => ({
                value: item.id,
                label: LocalText.getName(item),
            }));
        }

        return response.map((item: any) => ({ value: item.id, label: LocalText.getName(item) }));
    } catch (error) {
        console.log(error);
        return [];
    }
};
