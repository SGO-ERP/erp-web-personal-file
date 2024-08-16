import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createDrivingLicense,
    createSportAchievements,
    createSportDegrees,
    updateBiographicInfo,
    updateDrivingLicenseInfo,
    updateFinancialInfo,
    updateInitials,
    updateIdentificationCard,
    updateSportAchievements,
    updateSportDegrees,
    updateUserInfo,
    updatePassportInfo,
    deleteSportDegrees,
    deleteSportAchievements,
    deleteNameChangeHistory,
    updateHistoryNameChange,
    postFinancialInfo,
} from "./personalInfoSlice";
import {
    createAbroadTravel,
    createPolygraphCheck,
    createProperty,
    createPsychologicalCheck,
    createServiceHousing,
    createSpecialChecks,
    createVehicle,
    createViolation,
    deleteAbroadTravel,
    deletePolygraphCheck,
    deleteProperty,
    deletePsychologicalCheck,
    deleteServiceHousing,
    deleteSpecialCheck,
    deleteVehicle,
    deleteViolation,
    updateAbroadTravel,
    updatePolygraphCheck,
    updateProperty,
    updatePsychologicalCheck,
    updateServiceHousing,
    updateSpecialCheck,
    updateVehicle,
    updateViolation,
} from "./additionalSlice";
import {
    createAttestation,
    createBadges,
    createBeret,
    createCharacteristic,
    createClothingEquipment,
    createContracts,
    createCoolness,
    createEmergencyContract,
    createHoliday,
    createJobExperience,
    createOthersEquipment,
    createPenalty,
    createRank,
    createResearcherAndRecommendation,
    createSecondments,
    createServiceId,
    createWeaponEquipment,
    deleteAttestation,
    deleteBadges,
    deleteBeret,
    deleteCharacteristic,
    deleteClothingEquipment,
    deleteContracts,
    deleteCoolness,
    deleteEmergencyContract,
    deleteHoliday,
    deleteJobExperience,
    deleteOthersEquipment,
    deletePenalty,
    deleteRank,
    deleteSecondments,
    deleteServiceId,
    deleteWeaponEquipment,
    updateAttestation,
    updateBadges,
    updateBeret,
    updateCharacteristic,
    updateClothingEquipment,
    updateContracts,
    updateCoolness,
    updateEmergencyContract,
    updateHoliday,
    updateJobExperience,
    updateOath,
    updateOthersEquipment,
    updatePenalty,
    updateRank,
    updateRecommendation,
    updateResearcher,
    updateResearcherAndRecomendation,
    updateResearcherAndRecommendation,
    updateReserve,
    updateSecondments,
    updateSecret,
    updateServiceId,
    updateWeaponEquipment,
} from "./servicesSlice";
import {
    createAcademicDegree,
    createAcademicTitle,
    deleteAcademicDegree,
    createCourse,
    createEducation,
    createLanguage,
    deleteAcademicTitle,
    deleteCourse,
    deleteEducation,
    updateAcademicDegree,
    updateAcademicTitle,
    updateCourse,
    updateEducation,
    updateLanguage,
    deleteLanguage,
} from "./educationSlice";
import {
    createFamilyAbroadTravel,
    createFamilyMember,
    createFamilyViolation,
    deleteFamilyAbroadTravel,
    deleteFamilyMember,
    deleteFamilyViolation,
    updateFamilyAbroadTravel,
    updateFamilyMember,
    updateFamilyViolation,
} from "./familyProfileSlice";
import {
    createDispensaryRegistration,
    createHospitalData,
    createUserLiberations,
    deleteDispensaryRegistration,
    deleteHospitalData,
    deleteUserLiberations,
    updateAnthropometricData,
    updateDispensaryRegistration,
    updateGeneralUserInformation,
    updateHospitalData,
    updateUserLiberations,
} from "./medicalInfoSlice";

const initialTabs = {
    personal_data: {
        biographic_info: {
            address: {
                value: "",
                id: "",
            },
            citizenship: {
                value: "",
                id: "",
            },
            country: {
                value: "",
                id: "",
            },
            region: {
                value: "",
                id: "",
            },
            isVillage: false,
            cityOrVillage: {
                value: "",
                id: "",
                is_village: false,
            },
            gender: {
                value: "",
                id: "",
            },
            nationality: {
                value: "",
                id: "",
            },
            family_status_id: {
                value: "",
                id: "",
            },
            residence_address: {
                value: "",
                id: "",
            },
            initials: {
                first_name: "",
                last_name: "",
                father_name: "",
            },
        },
        sport_degrees: [],
        sport_achievements: [],
        driving_license: [],
        identification_card_document_link: {},
        passport_document_link: {},
        driving_license_info: {
            document_number: {
                value: "",
                id: "",
            },
            date_of_issue: {
                value: "",
                id: "",
            },
            date_to: {
                value: "",
                id: "",
            },
            category: {
                value: "",
                id: "",
            },
        },
        identification_card: {
            document_number: {
                value: "",
                id: "",
            },
            date_of_issue: {
                value: "",
                id: "",
            },
            date_to: {
                value: "",
                id: "",
            },
            issued_by: {
                value: "",
                id: "",
            },
        },
        financial_info: {
            iban: "",
            housing_payments_iban: "",
            id: "",
        },
        passport: {
            document_number: { value: "", id: "" },
            date_of_issue: { value: "", id: "" },
            date_to: { value: "", id: "" },
            document_link: { value: "", id: "" },
            issued_by: { value: "", id: "" },
        },
        name_change: [],
    },
    medical_card: {
        sick_list: [],
        release_detail: [],
        dispensary_reg: [],
        general: {
            height: {
                value: "",
                id: "",
            },
            weight: {
                value: "",
                id: "",
            },
            blood_group: {
                value: "",
                id: "",
            },
        },
        anthropometric: {
            head_circumference: {
                value: "",
                id: "",
            },
            shape_size: {
                value: "",
                id: "",
            },
            shoe_size: {
                value: "",
                id: "",
            },
            bust_size: {
                value: "",
                id: "",
            },
            neck_circumference: {
                value: "",
                id: "",
            },
        },
    },
    family: {
        members: [],
        deletedMembers: [],
        family_abroad_travels: {
            local: [],
            remote: [],
        },
        family_violations: {
            local: [],
            remote: [],
        },
    },
    additional: {
        transport: [],
        psych_charact: [],
        result_polygraph: [],
        polygraph_checks: [],
        violations: [],
        abroad_travels: [],
        special_checks: [],
        properties: [],
        service_housing: [],
        psychological_checks: [],
    },
    user_info: {
        personal_id: {
            value: "",
        },
        call_sign: {
            value: "",
        },
        service_phone_number: {
            value: "",
        },
        phone_number: {
            value: "",
        },
        cabinet: {
            value: "",
        },
        id_number: {
            value: "",
        },
        iin: {
            value: "",
        },
    },
    education: {
        add_education: [],
        add_course: [],
        add_language: [],
        add_academic_degree: [],
        add_academic_title: [],
    },
    services: {
        awards: [],
        characteristics: [],
        weapons: [],
        clothes: [],
        others: [],
        oath: {},
        workExperience: [],
        emergency_contracts: [],
        ranks: [],
        service_id_info: {},
        contracts: [],
        secondments: [],
        penalties: [],
        attestations: [],
        holidays: [],
        coolness: [],
        recommendation_and_researcher: {},
        beret: {},
        personnel_reserve: {},
    },
};

let initialState = {
    allTabs: initialTabs,
    initialTabs: initialTabs,
    edited: initialTabs,
    modeRedactor: false,
    loading: true,
    error: "",
};

export const myInfoSlice = createSlice({
    name: "myInfo",
    initialState,
    reducers: {
        setMode: (state, action) => {
            state.modeRedactor = action.payload;
        },
        setFieldValue: (state, action) => {
            const { fieldPath, value } = action.payload;
            const pathParts = fieldPath.split(".");
            let currentObject = state;

            for (let i = 0; i < pathParts.length - 1; i++) {
                currentObject = currentObject[pathParts[i]];
            }

            currentObject[pathParts[pathParts.length - 1]] = value;
        },
        setAllTabsPersonalInfoPhoneNumber: (state, action) => {
            state.allTabs.user_info.phone_number.value = action.payload;
        },
        setInitialTabsPersonalInfoPhoneNumber: (state, action) => {
            state.initialTabs.user_info.phone_number.value = action.payload;
        },
        setAllTabsPersonalDataBiographicInfoCountry: (state, action) => {
            state.allTabs.personal_data.biographic_info.country.id = action.payload.value;
            state.allTabs.personal_data.biographic_info.country.value = action.payload.label;
        },
        setInitialTabsPersonalDataBiographicInfoCountry: (state, action) => {
            state.initialTabs.personal_data.biographic_info.country.id = action.payload.value;
            state.initialTabs.personal_data.biographic_info.country.value = action.payload.label;
        },
        setAllTabsPersonalDataBiographicInfoRegion: (state, action) => {
            state.allTabs.personal_data.biographic_info.region.id = action.payload.value;
            state.allTabs.personal_data.biographic_info.region.value = action.payload.label;
        },
        setInitialTabsPersonalDataBiographicInfoRegion: (state, action) => {
            state.initialTabs.personal_data.biographic_info.region.id = action.payload.value;
            state.initialTabs.personal_data.biographic_info.region.value = action.payload.label;
        },
        setIsVillage: (state, action) => {
            state.allTabs.personal_data.biographic_info.isVillage = action.payload;
        },
        setAllTabsPersonalDataBiographicInfoCityOrVillage: (state, action) => {
            state.allTabs.personal_data.biographic_info.cityOrVillage.id = action.payload.value;
            state.allTabs.personal_data.biographic_info.cityOrVillage.value = action.payload.label;
            state.allTabs.personal_data.biographic_info.cityOrVillage.is_village =
                action.payload.is_village;
        },
        setInitialTabsPersonalDataBiographicInfoCityOrVillage: (state, action) => {
            state.initialTabs.personal_data.biographic_info.cityOrVillage.id = action.payload.value;
            state.initialTabs.personal_data.biographic_info.cityOrVillage.value =
                action.payload.label;
            state.initialTabs.personal_data.biographic_info.cityOrVillage.is_village =
                action.payload.is_village;
        },
        setAllTabsPersonalDataBiographicInfoNationality: (state, action) => {
            state.allTabs.personal_data.biographic_info.nationality.id = action.payload.value;
            state.allTabs.personal_data.biographic_info.nationality.value = action.payload.label;
        },
        setInitialTabsPersonalDataBiographicInfoNationality: (state, action) => {
            state.initialTabs.personal_data.biographic_info.nationality.id = action.payload.value;
            state.initialTabs.personal_data.biographic_info.nationality.value =
                action.payload.label;
        },
        setAllTabsPersonalDataBiographicInfoCitizenship: (state, action) => {
            state.allTabs.personal_data.biographic_info.citizenship.id = action.payload.value;
            state.allTabs.personal_data.biographic_info.citizenship.value = action.payload.label;
        },
        setInitialTabsPersonalDataBiographicInfoCitizenship: (state, action) => {
            state.initialTabs.personal_data.biographic_info.citizenship.id = action.payload.value;
            state.initialTabs.personal_data.biographic_info.citizenship.value =
                action.payload.label;
        },
        setAllTabsPersonalDataBiographicInfoFamilyStatus: (state, action) => {
            state.allTabs.personal_data.biographic_info.family_status_id.id = action.payload.value;
            state.allTabs.personal_data.biographic_info.family_status_id.value =
                action.payload.label;
        },
        setInitialTabsPersonalDataBiographicInfoFamilyStatus: (state, action) => {
            state.initialTabs.personal_data.biographic_info.family_status_id.id =
                action.payload.value;
            state.initialTabs.personal_data.biographic_info.family_status_id.value =
                action.payload.label;
        },
        setAllTabsFamilyViolationsRemote: (state, action) => {
            state.allTabs.family.family_violations.remote = action.payload;
        },
        addAllTabsFamilyViolationsRemote: (state, action) => {
            state.allTabs.family.family_violations.remote.push(action.payload);
        },
        setAllTabsFamilyViolationsLocal: (state, action) => {
            state.allTabs.family.family_violations.local = action.payload;
        },
        addAllTabsFamilyViolationsLocal: (state, action) => {
            state.allTabs.family.family_violations.local.push(action.payload);
        },
        setInitialsValue: (state, action) => {
            state.initialTabs.personal_data.biographic_info.initials = action.payload;
        },
        resetValues: (state) => {
            state.allTabs = state.initialTabs;
        },
        resetSlice: () => {
            return initialState;
        },
        replaceByPath: (state, action) => {
            const { path, id, newObj } = action.payload;
            const pathArr = path.split(".");
            const arrName = pathArr.pop();
            let currentObj = state;
            for (let i = 0; i < pathArr.length; i++) {
                currentObj = currentObj[pathArr[i]];
            }

            currentObj[arrName] = currentObj[arrName].map((item) =>
                item.id === id ? newObj : item,
            );
        },
        deleteByPathMyInfo: (state, action) => {
            const { path, id } = action.payload;
            const pathParts = path.split(".");
            const target = pathParts.reduce((acc, cur) => acc[cur], state);

            for (let i = 0; i < target.length; i++) {
                if (target[i].id === id) {
                    target.splice(i, 1);
                    break;
                }
            }
        },
        addFieldValue: (state, action) => {
            const { fieldPath, value } = action.payload;
            const pathParts = fieldPath.split(".");
            let currentObject = state;

            for (let i = 0; i < pathParts.length - 1; i++) {
                currentObject = currentObject[pathParts[i]];
            }

            if (Array.isArray(currentObject[pathParts[pathParts.length - 1]])) {
                currentObject[pathParts[pathParts.length - 1]].push(value);
            } else {
                state[pathParts[pathParts.length - 1]] = value;
            }
        },
    },
});

export const save = createAsyncThunk("myInfo/save", async (userId, { dispatch }) => {
    try {
        const promises = [
            // personal info
            dispatch(updateUserInfo(userId)),
            dispatch(updateDrivingLicenseInfo(userId)),
            dispatch(updateBiographicInfo(userId)),
            dispatch(updatePassportInfo(userId)),
            dispatch(updateIdentificationCard(userId)),
            dispatch(createAbroadTravel(userId)),
            dispatch(updateAbroadTravel(userId)),
            dispatch(createSportDegrees(userId)),
            dispatch(updateSportDegrees(userId)),
            dispatch(deleteSportDegrees(userId)),
            dispatch(createSportAchievements(userId)),
            dispatch(updateSportAchievements(userId)),
            dispatch(deleteSportAchievements(userId)),
            dispatch(createDrivingLicense(userId)),
            dispatch(updateFinancialInfo(userId)),
            dispatch(updateInitials(userId)),
            dispatch(deleteNameChangeHistory(userId)),
            dispatch(updateHistoryNameChange(userId)),
            dispatch(postFinancialInfo(userId)),
            // medical info
            dispatch(updateAnthropometricData(userId)),
            dispatch(createHospitalData(userId)),
            dispatch(updateHospitalData(userId)),
            dispatch(updateUserLiberations(userId)),
            dispatch(createUserLiberations(userId)),
            dispatch(updateDispensaryRegistration(userId)),
            dispatch(createDispensaryRegistration(userId)),
            dispatch(createPsychologicalCheck(userId)),
            dispatch(deletePsychologicalCheck(userId)),
            dispatch(updatePsychologicalCheck(userId)),

            dispatch(updateGeneralUserInformation(userId)),
            dispatch(deleteHospitalData(userId)),
            dispatch(deleteUserLiberations(userId)),
            dispatch(deleteDispensaryRegistration(userId)),

            dispatch(createPolygraphCheck(userId)),
            dispatch(deletePolygraphCheck(userId)),
            dispatch(updatePolygraphCheck(userId)),
            //family
            dispatch(updateFamilyMember(userId)),
            dispatch(createFamilyMember(userId)),
            dispatch(deleteFamilyMember(userId)),
            dispatch(createFamilyViolation(userId)),
            dispatch(createFamilyAbroadTravel(userId)),
            dispatch(updateFamilyAbroadTravel(userId)),
            dispatch(deleteFamilyAbroadTravel(userId)),
            dispatch(updateFamilyViolation(userId)),
            dispatch(deleteFamilyViolation(userId)),
            // education
            dispatch(createAcademicDegree(userId)),
            dispatch(updateAcademicDegree(userId)),
            dispatch(deleteAcademicDegree(userId)),
            dispatch(createAcademicTitle(userId)),
            dispatch(updateAcademicTitle(userId)),
            dispatch(deleteAcademicTitle(userId)),
            dispatch(createEducation(userId)),
            dispatch(updateEducation(userId)),
            // Пример удаления из списка (dispatch)
            dispatch(deleteEducation(userId)),
            dispatch(createCourse(userId)),
            dispatch(updateCourse(userId)),
            dispatch(deleteCourse(userId)),
            dispatch(createLanguage(userId)),
            dispatch(updateLanguage(userId)),
            dispatch(deleteLanguage(userId)),
            //services
            dispatch(createCharacteristic(userId)),
            dispatch(updateCharacteristic(userId)),
            dispatch(deleteCharacteristic(userId)),
            dispatch(createWeaponEquipment(userId)),
            dispatch(updateWeaponEquipment(userId)),
            dispatch(deleteWeaponEquipment(userId)),
            dispatch(createClothingEquipment(userId)),
            dispatch(updateClothingEquipment(userId)),
            dispatch(deleteClothingEquipment(userId)),
            dispatch(createOthersEquipment(userId)),
            dispatch(updateOthersEquipment(userId)),
            dispatch(deleteOthersEquipment(userId)),
            dispatch(updateOath(userId)),
            dispatch(updateSecret(userId)),
            dispatch(updateReserve(userId)),
            dispatch(createJobExperience(userId)),
            dispatch(updateJobExperience(userId)),
            dispatch(deleteJobExperience(userId)),
            dispatch(createEmergencyContract(userId)),
            dispatch(updateEmergencyContract(userId)),
            dispatch(deleteEmergencyContract(userId)),
            dispatch(createRank(userId)),
            dispatch(updateRank(userId)),
            dispatch(deleteRank(userId)),
            dispatch(createResearcherAndRecommendation(userId)),
            dispatch(updateResearcherAndRecommendation(userId)),
            dispatch(createServiceId(userId)),
            dispatch(updateServiceId(userId)),
            dispatch(deleteServiceId(userId)),
            dispatch(createContracts(userId)),
            dispatch(updateContracts(userId)),
            dispatch(deleteContracts(userId)),
            dispatch(createSecondments(userId)),
            dispatch(updateSecondments(userId)),
            dispatch(deleteSecondments(userId)),
            dispatch(createBadges(userId)),
            dispatch(updateBadges(userId)),
            dispatch(deleteBadges(userId)),
            dispatch(createPenalty(userId)),
            dispatch(updatePenalty(userId)),
            dispatch(deletePenalty(userId)),
            dispatch(createHoliday(userId)),
            dispatch(updateHoliday(userId)),
            dispatch(deleteHoliday(userId)),
            dispatch(createAttestation(userId)),
            dispatch(updateAttestation(userId)),
            dispatch(deleteAttestation(userId)),
            dispatch(createCoolness(userId)),
            dispatch(updateCoolness(userId)),
            dispatch(deleteCoolness(userId)),
            dispatch(createBeret(userId)),
            dispatch(updateBeret(userId)),
            dispatch(deleteBeret(userId)),
            // dispatch(createRacommendatnt(userId)),
            //additional
            dispatch(createServiceHousing(userId)),
            dispatch(updateServiceHousing(userId)),
            dispatch(deleteServiceHousing(userId)),

            dispatch(updateViolation(userId)),
            dispatch(deleteViolation(userId)),
            dispatch(createViolation(userId)),

            dispatch(createVehicle(userId)),
            dispatch(updateVehicle(userId)),
            dispatch(deleteVehicle(userId)),

            dispatch(createSpecialChecks(userId)),
            dispatch(updateSpecialCheck(userId)),
            dispatch(deleteSpecialCheck(userId)),

            dispatch(createProperty(userId)),
            dispatch(updateProperty(userId)),
            dispatch(deleteProperty(userId)),

            dispatch(deleteAbroadTravel(userId)),
        ];
        await Promise.all(promises);
        await dispatch(resetSlice());
        return true;
    } catch (e) {
        console.error(e);
        throw new Error(e.response.data);
    }
});

export const getFieldValue = (state, path) => {
    const pathParts = path.split(".");
    let currentObject = state.myInfo;
    for (let i = 0; i < pathParts.length; i++) {
        currentObject = currentObject[pathParts[i]];
        if (typeof currentObject === "undefined") {
            return undefined;
        }
    }

    return currentObject;
};

export const {
    myInfo,
    setMode,
    setFieldValue,
    setInitialsValue,
    resetValues,
    replaceByPath,
    resetSlice,
    deleteByPathMyInfo,
    addFieldValue,
    replaceOath,
    setAllTabsPersonalInfoPhoneNumber,
    setInitialTabsPersonalInfoPhoneNumber,
    setAllTabsPersonalDataBiographicInfoCountry,
    setInitialTabsPersonalDataBiographicInfoCountry,
    setAllTabsPersonalDataBiographicInfoRegion,
    setInitialTabsPersonalDataBiographicInfoRegion,
    setIsVillage,
    setAllTabsPersonalDataBiographicInfoCityOrVillage,
    setInitialTabsPersonalDataBiographicInfoCityOrVillage,
    setAllTabsPersonalDataBiographicInfoNationality,
    setInitialTabsPersonalDataBiographicInfoNationality,
    setAllTabsPersonalDataBiographicInfoCitizenship,
    setInitialTabsPersonalDataBiographicInfoCitizenship,
    setAllTabsPersonalDataBiographicInfoFamilyStatus,
    setInitialTabsPersonalDataBiographicInfoFamilyStatus,
    setAllTabsFamilyViolationsRemote,
    addAllTabsFamilyViolationsRemote,
    setAllTabsFamilyViolationsLocal,
    addAllTabsFamilyViolationsLocal,
} = myInfoSlice.actions;

export default myInfoSlice.reducer;
