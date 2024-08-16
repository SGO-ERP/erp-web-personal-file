import React, { Dispatch } from "react";
import { AsyncThunk } from "@reduxjs/toolkit";

import RankTable from "../tables/RankTable";
import BadgeTypesTable from "../tables/BadgeTypesTable";
import PositionTable from "../tables/PositionTable";
import RecoveryTable from "../tables/RecoveryTable";
import PropertyTypesTable from "../tables/PropertyTypesTable";
import StatusTable from "../tables/StatusTable";
import SpecialtiesTables from "../tables/SpecialtiesTables";
import AcademicDegreeDegreesTable from "../tables/AcademicDegreeDegreesTable";
import AcademicTitleDegreesTable from "../tables/AcademicTitleDegreesTable";
import CountryTable from "../tables/CountryTable";
import CourseProvidersTable from "../tables/CourseProvidersTable";
import InstitutionDegreeTypesTable from "../tables/InstitutionDegreeTypesTable";
import InstitutionsTable from "../tables/InstitutionsTable";
import LanguageTable from "../tables/LanguageTable";
import ScienceTable from "../tables/ScienceTable";
import SportTypesTable from "../tables/SportTypesTable";
import NationalityTable from "../tables/NationalityTable";
import LiberationTable from "../tables/LiberationTable";
import IllnessTable from "../tables/IllnessTable";
import CityTable from "../tables/CityTable";
import RegionTable from "../tables/RegionTable";
import ViolationTable from "../tables/ViolationTable";
import BirthPlaceTable from "../tables/BirthPlaceTable";
import CitizenshipTable from "../tables/CitizenshipTable";
import MilitaryInstitutionTable from "../tables/MilitaryInstitutionTable";
import SportDegreeTypeTable from "../tables/SportDegreeTable";
import WeaponTypeTable from "../tables/WeaponTypeTable";
import WeaponModelsTable from "../tables/WeaponModelsTable";
import ClothingTypesTable from "../tables/ClothingTypeTable";
import ClothingModelsTable from "../tables/ClothingModelsTable";
import OtherTypesTable from "../tables/OtherTypeTable";
import OtherModelTable from "../tables/OtherModelTable";

import NoDataChoose from "../NoDataChoose";

import { getBadgeTypes } from "store/slices/admin-page/adminBadgeSlice";
import { getRanksTypes } from "store/slices/admin-page/adminRanksSlice";
import { getPositionTypes } from "store/slices/admin-page/adminPositionSlice";
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
import { getLanguageTypes } from "store/slices/admin-page/adminLanguagesSlice";
import { getInstitutionTypes } from "store/slices/admin-page/adminInstitutionsSlice";
import { getScienceTypes } from "store/slices/admin-page/adminScienceSlice";
import { getNationalities } from "store/slices/admin-page/adminNationalitiesSlice";
import { getBirthPlaces } from "store/slices/admin-page/adminBirthPlaceSlice";
import { getCitizenship } from "store/slices/admin-page/adminCitizenshipSlice";
import { getIllness } from "store/slices/admin-page/adminIllnessSlice";
import { getLiberation } from "store/slices/admin-page/adminLiberationSlice";
import { getViolation } from "store/slices/admin-page/adminViolationSlice";
import { getCity } from "store/slices/admin-page/adminCitySlice";
import { getRegion } from "store/slices/admin-page/adminRegionSlice";
import { getMilitaryInstitution } from "store/slices/admin-page/adminMilitaryInstitutionSlice";
import { getSportDegreeType } from "store/slices/admin-page/adminSportDegreeTypeSlice";
import { getWeaponType } from "store/slices/admin-page/adminWeaponSlice";
import { getWeaponModel } from "store/slices/admin-page/adminWeaponModelsSlice";
import { getClothingType } from "store/slices/admin-page/adminClothingTypeSlice";
import { getClothingModel } from "store/slices/admin-page/adminClothingModelsSlice";
import { getOtherType } from "store/slices/admin-page/adminOtherTypeSlice";
import { getOtherModel } from "store/slices/admin-page/adminOtherModelSlice";

export const info = [
    {
        id: "1",
        name: "Звание",
        nameKZ: "Дәрежесі",
        key: "rank",
    },
    {
        id: "2",
        name: "Медали",
        nameKZ: "Медальдар",
        key: "medals",
    },
    {
        id: "3",
        name: "Должность",
        nameKZ: "Должность",
        key: "position",
    },
    {
        id: "4",
        name: "Взыскание",
        nameKZ: "Өндіріп алу",
        key: "recovery",
    },
    {
        id: "5",
        name: "Вид имущество",
        nameKZ: "Мүлік түрі",
        key: "TypeOfProperty",
    },
    {
        id: "6",
        name: "Вид спорта",
        nameKZ: "Спорт түрі",
        key: "viewOfSport",
    },
    {
        id: "7",
        name: "Статус",
        nameKZ: "Мәртебесі",
        key: "status",
    },
    {
        id: "8",
        name: "Специальность",
        nameKZ: "Мамандығы",
        key: "specialties",
    },
    {
        id: "9",
        name: "Академическая степень",
        nameKZ: "Академиялық дәрежесі",
        key: "academicDegreeDegrees",
    },
    {
        id: "10",
        name: "Ученое звание степени",
        nameKZ: "Ғылыми атағы дәрежесі",
        key: "academicTitleDegrees",
    },
    {
        id: "11",
        name: "Страна",
        nameKZ: "Ел",
        key: "country",
    },
    {
        id: "12",
        name: "Поставщики курсов",
        nameKZ: "Курс жеткізушілері",
        key: "courseProviders",
    },
    {
        id: "13",
        name: "Степень",
        nameKZ: "Дәрежесі",
        key: "institutionDegreeTypes",
    },
    {
        id: "14",
        name: "Учебные заведения",
        nameKZ: "Оқу орындары",
        key: "institutions",
    },
    {
        id: "15",
        name: "Языки",
        nameKZ: "Тілдер",
        key: "languages",
    },
    {
        id: "16",
        name: "Наука",
        nameKZ: "Ғылымдар",
        key: "sciences",
    },
    {
        id: "17",
        name: "Национальность",
        nameKZ: "Ұлты",
        key: "nationalities",
    },
    {
        id: "18",
        name: "Mесто рождения",
        nameKZ: "Tуған жер",
        key: "birthPlace",
    },
    {
        id: "19",
        name: "Гражданство",
        nameKZ: "Азаматтық",
        key: "citizenship",
    },
    {
        id: "20",
        name: "Наименование болезни",
        nameKZ: "Аурудың атауы",
        key: "illness",
    },
    {
        id: "21",
        name: "Освобождение",
        nameKZ: "Азаттық",
        key: "liberation",
    },
    {
        id: "22",
        name: "Правонарушение",
        nameKZ: "Құқық бұзушылық",
        key: "liberation",
    },
    {
        id: "23",
        name: "Город",
        nameKZ: "Қала",
        key: "city",
    },
    {
        id: "24",
        name: "Область",
        nameKZ: "Аймақ",
        key: "region",
    },
    {
        id: "25",
        name: "Военные учебные заведения",
        nameKZ: "Әскери оқу орындары",
        key: "militaryInstitution",
    },
    {
        id: "26",
        name: "Наименование спортивного навыка",
        nameKZ: "Спорттық дағдылардың атауы",
        key: "sportDegree",
    },
    {
        id: "27",
        name: "Тип вооружения",
        nameKZ: "Қару түрі",
        key: "weaponType",
    },
    {
        id: "28",
        name: "Модели вооружения",
        nameKZ: "Қару-жарақ модельдері",
        key: "weaponType",
    },
    {
        id: "29",
        name: "Тип одежды",
        nameKZ: "Киім түрі",
        key: "clothingType",
    },
    {
        id: "30",
        name: "Модели одежды",
        nameKZ: "Киім үлгілері",
        key: "clothingType",
    },
    {
        id: "31",
        name: "Тип иного",
        nameKZ: "Басқа түрі",
        key: "clothingType",
    },
    {
        id: "32",
        name: "Модели иного",
        nameKZ: "Басқа модельдер",
        key: "clothingType",
    },
];

export const renderTableComponent = (
    setRecord: React.Dispatch<React.SetStateAction<any>>,
    record: string,
    choose: string,
) => {
    switch (choose) {
        case "1":
            return <RankTable setRecord={setRecord} record={record} />;
        case "2":
            return <BadgeTypesTable setRecord={setRecord} record={record} />;
        case "3":
            return <PositionTable setRecord={setRecord} record={record} />;
        case "4":
            return <RecoveryTable setRecord={setRecord} record={record} />;
        case "5":
            return <PropertyTypesTable setRecord={setRecord} record={record} />;
        case "6":
            return <SportTypesTable setRecord={setRecord} record={record} />;
        case "7":
            return <StatusTable setRecord={setRecord} record={record} />;
        case "8":
            return <SpecialtiesTables setRecord={setRecord} record={record} />;
        case "9":
            return <AcademicDegreeDegreesTable setRecord={setRecord} record={record} />;
        case "10":
            return <AcademicTitleDegreesTable setRecord={setRecord} record={record} />;
        case "11":
            return <CountryTable setRecord={setRecord} record={record} />;
        case "12":
            return <CourseProvidersTable setRecord={setRecord} record={record} />;
        case "13":
            return <InstitutionDegreeTypesTable setRecord={setRecord} record={record} />;
        case "14":
            return <InstitutionsTable setRecord={setRecord} record={record} />;
        case "15":
            return <LanguageTable setRecord={setRecord} record={record} />;
        case "16":
            return <ScienceTable setRecord={setRecord} record={record} />;
        case "17":
            return <NationalityTable setRecord={setRecord} record={record} />;
        case "18":
            return <BirthPlaceTable setRecord={setRecord} record={record} />;
        case "19":
            return <CitizenshipTable setRecord={setRecord} record={record} />;
        case "20":
            return <IllnessTable setRecord={setRecord} record={record} />;
        case "21":
            return <LiberationTable setRecord={setRecord} record={record} />;
        case "22":
            return <ViolationTable setRecord={setRecord} record={record} />;
        case "23":
            return <CityTable setRecord={setRecord} record={record} />;
        case "24":
            return <RegionTable setRecord={setRecord} record={record} />;
        case "25":
            return <MilitaryInstitutionTable setRecord={setRecord} record={record} />;
        case "26":
            return <SportDegreeTypeTable setRecord={setRecord} record={record} />;
        case "27":
            return <WeaponTypeTable setRecord={setRecord} record={record} />;
        case "28":
            return <WeaponModelsTable setRecord={setRecord} record={record} />;
        case "29":
            return <ClothingTypesTable setRecord={setRecord} record={record} />;
        case "30":
            return <ClothingModelsTable setRecord={setRecord} record={record} />;
        case "31":
            return <OtherTypesTable setRecord={setRecord} record={record} />;
        case "32":
            return <OtherModelTable setRecord={setRecord} record={record} />;
        default:
            return <NoDataChoose />;
    }
};

export const handleSelect = (
    e: string,
    setChoose: React.Dispatch<React.SetStateAction<any>>,
    dispatch: Dispatch<any>,
) => {
    setChoose(e);

    const dispatchFunctions: Record<string, AsyncThunk<any, void, {}>> = {
        "Звание": getRanksTypes,
        "Медали": getBadgeTypes,
        "Должность": getPositionTypes,
        "Взыскание": getPenaltyTypes,
        "Вид имущество": getPropertyTypes,
        "Вид спорта": getSportTypes,
        "Статус": getStatusTypes,
        "Специальность": getSpecialtiesTypes,
        "Академическая степень": getAcademicDegreeTypes,
        "Ученое звание степени": getAcademicTitleTypes,
        "Страна": getCountryTypes,
        "Поставщики курсов": getCourseTypes,
        "Степень": getInstitutionDegreeTypes,
        "Учебные заведения": getInstitutionTypes,
        "Языки": getLanguageTypes,
        "Наука": getScienceTypes,
        "Национальность": getNationalities,
        "Mесто рождения": getBirthPlaces,
        "Гражданство": getCitizenship,
        "Наименование болезни": getIllness,
        "Освобождение": getLiberation,
        "Правонарушение": getViolation,
        "Город": getCity,
        "Область": getRegion,
        "Военные учебные заведения": getMilitaryInstitution,
        "Наименование спортивного навыка": getSportDegreeType,
        "Тип вооружения": getWeaponType,
        "Модели вооружения": getWeaponModel,
        "Тип одежды": getClothingType,
        "Модели одежды": getClothingModel,
        "Тип иного": getOtherType,
        "Модели иного": getOtherModel,
    };

    const name = info.find((item) => item.id === e)?.name ?? "";

    const dispatchFunction = dispatchFunctions[name];

    if (dispatchFunction) {
        dispatch(dispatchFunction());
    }
};
