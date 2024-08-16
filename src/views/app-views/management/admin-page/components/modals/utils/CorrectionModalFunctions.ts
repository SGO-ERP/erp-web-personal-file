import { getBadgeTypes } from "store/slices/admin-page/adminBadgeSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { notification } from "antd";
import store from "store";
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

import ApiService from "auth/FetchInterceptor";
import { getCity } from "store/slices/admin-page/adminCitySlice";
import { getRegion } from "store/slices/admin-page/adminRegionSlice";
import { getMilitaryInstitution } from "../../../../../../../store/slices/admin-page/adminMilitaryInstitutionSlice";
import { getSportDegreeType } from "../../../../../../../store/slices/admin-page/adminSportDegreeTypeSlice";
import { getWeaponType } from "store/slices/admin-page/adminWeaponSlice";
import { getWeaponModel } from "store/slices/admin-page/adminWeaponModelsSlice";
import { getClothingType } from "store/slices/admin-page/adminClothingTypeSlice";
import { getClothingModel } from "store/slices/admin-page/adminClothingModelsSlice";
import { getOtherType } from "store/slices/admin-page/adminOtherTypeSlice";
import { getOtherModel } from "store/slices/admin-page/adminOtherModelSlice";

interface BodyTypes {
    name: string;
    nameKZ: string;
}

const errorsTypes: { [key: string]: BodyTypes } = {
    badge: {
        name: "Медаль не скорректирована",
        nameKZ: "Медаль түзетілмеген",
    },
    position: {
        name: "Должность не скорректирована",
        nameKZ: "Лауазым түзетілмеген",
    },
    rank: {
        name: "Звание не скорректировано",
        nameKZ: "Атақ түзетілмеген",
    },
    penalty: {
        name: "Взыскание не скорректировано",
        nameKZ: "Өндіріп алу түзетілмеген",
    },
    property: {
        name: "Вид имущества не скорректировано",
        nameKZ: "Мүліктің түрі түзетілмеген",
    },
    sport: {
        name: "Вид спорта не скорректировано",
        nameKZ: "Спорт түзетілмеген",
    },
    status: {
        name: "Статус не скорректировано",
        nameKZ: "Мәртебе реттелмеген",
    },
    specialty: {
        name: "Специальность не скорректирована",
        nameKZ: "Мамандық түзетілмеген",
    },
    academicDegree: {
        name: "Академическая степень не скорректирована",
        nameKZ: "Академиялық дәреже түзетілмеген",
    },
    academicTitle: {
        name: "Ученое звание степени не скорректирована",
        nameKZ: "Ғылыми атағы дәрежесі түзетілмеген",
    },
    country: {
        name: "Страна не скорректирована",
        nameKZ: "Мемлекет түзетілмеген",
    },
    course: {
        name: "Поставщики курсов не скорректированы",
        nameKZ: "Курс провайдерлері түзетілмеген",
    },
    institutionDegree: {
        name: "Степень не скорректирована",
        nameKZ: "Дәреже түзетілмеген",
    },
    institution: {
        name: "Учебные заведения не скорректированы",
        nameKZ: "Білім беру мекемелері түзетілмеген",
    },
    language: {
        name: "Языки не скорректированы",
        nameKZ: "Тілдер түзетілмеген",
    },
    science: {
        name: "Наука не скорректирована",
        nameKZ: "Ғылым түзетілмеген",
    },
    nationality: {
        name: "Национальность не скорректирована",
        nameKZ: "Ұлты түзетілмеген",
    },
    birthPlace: {
        name: "Mесто рождения не скорректировано",
        nameKZ: "Tуған жер түзетілмеген",
    },
    citizenship: {
        name: "Гражданство не скорректировано",
        nameKZ: "Азаматтық түзетілмеген",
    },
    illness: {
        name: "Наименование болезни не скорректировано",
        nameKZ: "Аурудың атауы түзетілмеген",
    },
    liberation: {
        name: "Освобождение не скорректировано",
        nameKZ: "Азаттық түзетілмеген",
    },
    violation: {
        name: "Правонарушение не скорректировано",
        nameKZ: "Құқық бұзушылық түзетілмеді",
    },
    city: {
        name: "Город не скорректирован",
        nameKZ: "Қала түзетілмеген",
    },
    region: {
        name: "Область не скорректирована",
        nameKZ: "Аймақ түзетілмеген",
    },
    weaponType: {
        name: "Тип вооружения не скорректировано",
        nameKZ: "Қару түрі түзетілмеген",
    },
    weaponModel: {
        name: "Модели вооружения не скорректировано",
        nameKZ: "Қару-жарақ модельдері түзетілмеген",
    },
    clothingType: {
        name: "Тип одежды не скорректировано",
        nameKZ: "Киім түрі реттелмеген",
    },
    clothingModel: {
        name: "Модели одежды не скорректировано",
        nameKZ: "Киім үлгілері түзетілмеген",
    },
    otherType: {
        name: "Тип иного не скорректировано",
        nameKZ: "Басқа түрі түзетілмеген",
    },
    otherModel: {
        name: "Модели иного не скорректировано",
        nameKZ: "Модельдер басқаша түзетілмеген",
    },
};

const correctionNewItem = (action: any, url: string, type: string) => {
    return async (body: BodyTypes, id: string) => {
        try {
            const response: any = await ApiService.put(url + `/${id}`, body);

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

export const correctionRank = correctionNewItem(getRanksTypes, "ranks", "rank");
export const correctionPosition = correctionNewItem(getPositionTypes, "positions", "position");
export const correctionBadge = correctionNewItem(getBadgeTypes, "badge_types", "badge");
export const correctionPenalty = correctionNewItem(getPenaltyTypes, "penalty_types", "penalty");
export const correctionProperty = correctionNewItem(
    getPropertyTypes,
    "additional/property_types",
    "property",
);
export const correctionSport = correctionNewItem(getSportTypes, "personal/sport_type", "sport");
export const correctionStatus = correctionNewItem(getStatusTypes, "status_types", "status");
export const correctionSpecialty = correctionNewItem(
    getSpecialtiesTypes,
    "education/specialties",
    "specialty",
);
export const correctionAcademicDegree = correctionNewItem(
    getAcademicDegreeTypes,
    "education/academic_degree_degrees",
    "academicDegree",
);
export const correctionAcademicTitle = correctionNewItem(
    getAcademicTitleTypes,
    "education/academic_title_degrees",
    "academicTitle",
);
export const correctionCountry = correctionNewItem(
    getCountryTypes,
    "additional/country",
    "country",
);
export const correctionCourse = correctionNewItem(
    getCourseTypes,
    "education/course_providers",
    "course",
);
export const correctionInstitutionDegree = correctionNewItem(
    getInstitutionDegreeTypes,
    "education/institution_degree_types",
    "institutionDegree",
);
export const correctionInstitution = correctionNewItem(
    getInstitutionTypes,
    "education/institutions",
    "institution",
);
export const correctionLanguage = correctionNewItem(
    getLanguageTypes,
    "education/languages",
    "language",
);
export const correctionScience = correctionNewItem(
    getScienceTypes,
    "education/sciences",
    "science",
);
export const correctionNationalities = correctionNewItem(
    getNationalities,
    "personal/nationality",
    "nationality",
);
export const correctionBirthPlaces = correctionNewItem(
    getBirthPlaces,
    "personal/birthplace",
    "birthPlace",
);
export const correctionCitizenship = correctionNewItem(
    getCitizenship,
    "personal/citizenship",
    "citizenship",
);
export const correctionIllness = correctionNewItem(getIllness, "medical/illness_type", "illness");
export const correctionLiberation = correctionNewItem(
    getLiberation,
    "medical/liberations",
    "liberation",
);
export const correctionViolation = correctionNewItem(
    getViolation,
    "additional/violation_type",
    "violation",
);
export const correctionCity = correctionNewItem(getCity, "personal/city", "city");
export const correctionRegion = correctionNewItem(getRegion, "personal/region", "region");
export const correctionMilitaryInstitution = correctionNewItem(
    getMilitaryInstitution,
    "education/military_institution",
    "military_institution",
);
export const correctionSportDegreeType = correctionNewItem(
    getSportDegreeType,
    "personal/sport_degree_type",
    "sport_degree_type",
);
export const correctionWeaponType = correctionNewItem(
    getWeaponType,
    "equipments/type/army",
    "weaponType",
);
export const correctionWeaponModel = correctionNewItem(
    getWeaponModel,
    "equipments/models/army",
    "weaponModel",
);
export const correctionClothingType = correctionNewItem(
    getClothingType,
    "equipments/type/clothing",
    "clothingType",
);
export const correctionClothingModel = correctionNewItem(
    getClothingModel,
    "equipments/models/clothing",
    "clothingModel",
);
export const correctionOtherType = correctionNewItem(
    getOtherType,
    "equipments/type/other",
    "otherType",
);
export const correctionOtherModel = correctionNewItem(
    getOtherModel,
    "equipments/models/other",
    "otherModel",
);

export const generateRankOption = async () => {
    try {
        const response = await ApiService.get("ranks", {
            params: { query: { skip: 0, limit: 10000 } },
        });

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
