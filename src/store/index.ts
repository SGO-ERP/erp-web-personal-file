import { configureStore } from "@reduxjs/toolkit";
import staff from "./slices/doNotTouch/staff";
import { default as profile, default as profileSlice } from "./slices/ProfileSlice";
import auth from "./slices/authSlice";
import candidateStageAnswers from "./slices/candidates/answersSlice/answersSlice";
import candidateAfterSignSlice from "./slices/candidates/candidateAfterSignSlice";
import сandidateArchive from "./slices/candidates/candidateArchiveSlice";
import candidateCategories from "./slices/candidates/candidateCategoriesSlice";
import candidateDocumentTableController from "./slices/candidates/candidateDocumentTableControllerSlice";
import candidateHrDoc from "./slices/candidates/candidateHrDocOptionMatreshkaSlice";
import candidateInitialization from "./slices/candidates/candidateInitializationSlice";
import candidateStageInfoStaffId from "./slices/candidates/candidateStageInfoSlice";
import candidateTableArchieveController from "./slices/candidates/candidateTableArchieveControllerSlice";
import candidates from "./slices/candidates/candidatesSlice";
import candidatesTableController from "./slices/candidates/candidatesTableControllerSlice";
import essayType from "./slices/candidates/essayTypeSlice";
import ordersConstructor from "./slices/candidates/ordersConstructorSlice";
import selectedCandidate from "./slices/candidates/selectedCandidateSlice";
import selectedCandidateStages from "./slices/candidates/selectedCandidateStagesSlice";
import documentStaff from "./slices/classification/documentStaffSlice";
import documentStaffType from "./slices/classification/documentStaffTypeSlice";
import hrDocumentTemplates from "./slices/classification/hrDocumentTemplatesSlice";
import jurisdictions from "./slices/classification/jurisdictionsSlice";
import serviceStaff from "./slices/classification/serviceStaffSlice";
import serviceStaffType from "./slices/classification/serviceStaffTypeSlice";
import tableConstructorSlice from "./slices/constructor/tableConstructorController";
import getRankById from "./slices/getRankByIdSlice";
import steps from "./slices/hrDocumentStepSlice";
import initialization from "./slices/initializationSlice";
import ip from "./slices/ipSlice";
import lettersOrders from "./slices/lettersOrdersSlice/lettersOrdersSlice";
import letters from "./slices/lettersSlice";
import additional from "./slices/myInfo/additionalSlice";
import education from "./slices/myInfo/educationSlice";
import familyProfile from "./slices/myInfo/familyProfileSlice";
import medicalInfo from "./slices/myInfo/medicalInfoSlice";
import myInfo from "./slices/myInfo/myInfoSlice";
import { default as myProfile, default as personalInfo } from "./slices/myInfo/personalInfoSlice";
import services from "./slices/myInfo/servicesSlice";
import sportTypes from "./slices/myInfo/sportTypeSlice";
import archiveStaffDivision from "./slices/schedule/archiveStaffDivision";
import createStaffList from "./slices/schedule/createStaffListSlice";
import archiveFunction from "./slices/schedule/functionArchieveScheduleSlice";
import functionScheduleSlice from "./slices/schedule/functionScheduleSlice";
import staffScheduleSlice from "./slices/schedule/staffDivisionSlice";
import staffList from "./slices/schedule/staffListSlice";
import draftLetters from "./slices/signedLettersSlice/draftLettersSlice";
import signedLetters from "./slices/signedLettersSlice/signedLettersSlice";
import spin from "./slices/spinSlice";
import tableController from "./slices/tableControllerSlice/tableControllerSlice";
import theme from "./slices/themeSlice";
import userMyData from "./slices/userDataSlice/userDataSlice";
import staffDivision from "./slices/userStaffDivisionSlice";
import users from "./slices/users/usersSlice";
import usersStaff from "./slices/users/usersStaffSlice";
import userArchieveTableControllerSlice from "./slices/usersTableControllerClice/userArchieveTableControllerSlice";
import usersTableController from "./slices/usersTableControllerClice/usersTableControllerSlice";
import staffDivisionDepartments from "./slices/vacancy/staffDivisionDepartmentsSlice";
import vacancyCandidates from "./slices/vacancy/vacancyCandidatesSlice";
import vacancy from "./slices/vacancy/vacancySlice";
import watermarker from "./slices/watermarkerSlice";
import disposal from "./slices/schedule/Edit/disposal";
import editArchiveStaffDivision from "./slices/schedule/Edit/staffDivision";
import editArchiveStaffUnit from "./slices/schedule/Edit/staffUnit";
import editStaffFunction from "./slices/schedule/Edit/staffFunctions";
import editArchiveVacancy from "./slices/schedule/Edit/vacancy";
import initializationNew from "./slices/newInitializationsSlices/initializationNewSlice";
import constructorNew from "./slices/newConstructorSlices/constructorNewSlice";
import tableBSP from "./slices/bsp/year-plan/tableSlice";
import staffDivScheduleYear from "./slices/bsp/create/tableByStaffDivisionSlice";
import tableMonthPlan from "./slices/bsp/month-plan/tableMonthPlanSlice";
import scheduleYear from "./slices/bsp/create/scheduleYear";
import dashboard from "./slices/analytics/dashboard/personnelRecordsSlice";
import dashboardCandidate from "./slices/analytics/dashboard/candidateSlice";
import listPresentUsers from "./slices/bsp/month-plan/listPresentUsers";
import listUserData from "./slices/bsp/month-plan/ListUsersData";
import surveys from "./slices/surveys/surveysSlice";
import { SCHEDULE_YEAR } from "../constants/AuthConstant";
import tableAbsentAttendance from "./slices/bsp/month-plan/tableAbsentAttendanceSlice";
import adminPage from "./slices/admin-page/adminPageSlice";
import adminBadge from "./slices/admin-page/adminBadgeSlice";
import adminRanks from "./slices/admin-page/adminRanksSlice";
import adminPositions from "./slices/admin-page/adminPositionSlice";
import adminPenalties from "./slices/admin-page/adminPenaltySlice";
import adminProperties from "./slices/admin-page/adminPropertySlice";
import adminSportTypes from "./slices/admin-page/adminSportTypesSlice";
import adminStatuses from "./slices/admin-page/adminStatusesSlice";
import adminSpecialties from "./slices/admin-page/adminSpecialtiesSlice";
import adminAcademicDegrees from "./slices/admin-page/adminAcademicDegreeSlice";
import adminAcademicTitles from "./slices/admin-page/adminAcademicTitleSlice";
import adminCountries from "./slices/admin-page/adminCountriesSlice";
import adminCourses from "./slices/admin-page/adminCoursesSlice";
import adminInstitutionDegrees from "./slices/admin-page/adminInstitutionDegreeSlice";
import adminInstitutions from "./slices/admin-page/adminInstitutionsSlice";
import adminLanguages from "./slices/admin-page/adminLanguagesSlice";
import adminSciences from "./slices/admin-page/adminScienceSlice";
import adminNationalities from "./slices/admin-page/adminNationalitiesSlice";
import adminBirthPlaces from "./slices/admin-page/adminBirthPlaceSlice";
import adminCitizenship from "./slices/admin-page/adminCitizenshipSlice";
import adminIllness from "./slices/admin-page/adminIllnessSlice";
import adminLiberation from "./slices/admin-page/adminLiberationSlice";
import adminViolation from "./slices/admin-page/adminViolationSlice";
import adminCity from "./slices/admin-page/adminCitySlice";
import adminRegion from "./slices/admin-page/adminRegionSlice";
import adminMilitaryInstitution from "./slices/admin-page/adminMilitaryInstitutionSlice";
import adminSportDegreeType from "./slices/admin-page/adminSportDegreeTypeSlice";
import equip from "./slices/myInfo/deleteEquipSlice";
import notification from "./slices/notifications/notificationSlice";
import coolnessModalEdit from "./slices/coolnessModalEditSlice";
import servicesAwards from "./slices/servicesAwardsSlice";
import secondments from "./slices/myInfo/services/secondmentsSlice";
import activeTable from "./slices/newConstructorSlices/activeTable";
import adminWeaponType from "./slices/admin-page/adminWeaponSlice";
import adminWeaponModels from "./slices/admin-page/adminWeaponModelsSlice";
import adminClothingType from "./slices/admin-page/adminClothingTypeSlice";
import adminClothingModels from "./slices/admin-page/adminClothingModelsSlice";
import adminOtherType from "./slices/admin-page/adminOtherTypeSlice";
import adminOtherModel from "./slices/admin-page/adminOtherModelSlice";

import initializationDocuments from "./slices/initialization/initializationDocumentsSlice";
import initializationDocInfo from "./slices/initialization/initializationDocInfoSlice";
import initializationUsers from "./slices/initialization/initializationUsersSlice";

const store = configureStore({
    reducer: {
        getRankById,
        initializationNew,
        theme,
        auth,
        spin,
        serviceStaff,
        serviceStaffType,
        documentStaff,
        documentStaffType,
        jurisdictions,
        hrDocumentTemplates,
        personalInfo,
        familyProfile,
        medicalInfo,
        additional,
        users,
        education,
        initialization,
        lettersOrders,
        letters,
        myInfo,
        steps,
        staffDivision,
        tableController,
        usersTableController,
        signedLetters,
        watermarker,
        candidates,
        candidateCategories,
        candidatesTableController,
        selectedCandidate,
        selectedCandidateStages,
        candidateStageAnswers,
        sportTypes,
        draftLetters,
        essayType,
        candidateHrDoc,
        сandidateArchive,
        candidateInitialization,
        candidateTableArchieveController,
        candidateDocumentTableController,
        candidateStageInfoStaffId,
        candidateAfterSignSlice,
        profile,
        services,
        ordersConstructor,
        userMyData,
        tableConstructorSlice,
        userArchieveTableControllerSlice,
        usersStaff,
        myProfile,
        createStaffList,
        ip,
        profileSlice,
        functionScheduleSlice,
        staffScheduleSlice,
        staffList,
        archiveStaffDivision,
        archiveFunction,
        vacancy,
        vacancyCandidates,
        staffDivisionDepartments,
        disposal,
        editArchiveStaffDivision,
        editArchiveStaffUnit,
        editStaffFunction,
        editArchiveVacancy,
        staff,
        constructorNew,
        tableBSP,
        tableMonthPlan,
        scheduleYear,
        staffDivScheduleYear,
        listPresentUsers,
        dashboard,
        dashboardCandidate,
        listUserData,
        surveys,
        tableAbsentAttendance,
        equip,
        adminPage,
        notification,
        coolnessModalEdit,
        servicesAwards,
        adminBadge,
        adminRanks,
        adminPositions,
        adminPenalties,
        adminProperties,
        adminSportTypes,
        adminStatuses,
        adminSpecialties,
        adminAcademicDegrees,
        adminAcademicTitles,
        adminCountries,
        adminCourses,
        adminInstitutionDegrees,
        adminInstitutions,
        adminLanguages,
        adminSciences,
        secondments,
        adminNationalities,
        adminBirthPlaces,
        adminCitizenship,
        adminIllness,
        adminLiberation,
        adminViolation,
        adminRegion,
        adminCity,
        adminMilitaryInstitution,
        adminSportDegreeType,
        activeTable,
        adminWeaponType,
        adminWeaponModels,
        adminClothingType,
        adminClothingModels,
        adminOtherType,
        adminOtherModel,
        initializationDocuments,
        initializationDocInfo,
        initializationUsers,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
    devTools: process.env.NODE_ENV === "development",
});

store.subscribe(() => {
    localStorage.setItem(SCHEDULE_YEAR, JSON.stringify(store.getState().scheduleYear));
    // console.log('State changed:', store.getState().myInfo.edited.family.family_violations.remote);
});

// function injectReducers(newReducers: Reducer) {
// store.replaceReducer(combineReducers({ ...rootReducer, ...newReducers }));
// }

export default store;
// export { injectReducers };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
