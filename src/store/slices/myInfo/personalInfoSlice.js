import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PersonalInfoService from "../../../services/myInfo/PersonalInfoService";
import moment from "moment";
import { PrivateServices } from "API";
import { notification } from "antd";
import UsersService from "../../../services/myInfo/UsersService";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { phoneNumberFormatter } from "utils/phoneNumberFormatter/phoneNumberFormatter";

let initialState = {
    personalInfoData: [],
    myProfile: [],
    nameChangeHistory: [],
    loading: true,
    familyStatuses: [],
    error: "",
};

export const getPersonalInfo = createAsyncThunk(
    "personalInfo/getPersonalInfo",
    async (userId, { rejectWithValue }) => {
        try {
            return await PersonalInfoService.get_personal_info(userId);
        } catch (e) {
            return rejectWithValue(e.response.data);
        }
    },
);

export const getNameChangedHistory = createAsyncThunk(
    "personalInfo/getNameChangedHistory",
    async (userId, { rejectWithValue }) => {
        try {
            return await PersonalInfoService.get_name_change_history(userId);
        } catch (e) {
            return rejectWithValue(e.response.data);
        }
    },
);

export const getMyProfile = createAsyncThunk(
    "personalInfo/getMyProfile",
    async (userId, { thunkAPI }) => {
        try {
            const response = await PersonalInfoService.get_my_profile_info(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const getFamilyStatuses = createAsyncThunk(
    "personalInfo/getFamilyStatuses",
    async (userId, { rejectWithValue }) => {
        try {
            return await PersonalInfoService.get_family_statuses(userId);
        } catch (e) {
            return rejectWithValue(e.response.data);
        }
    },
);

export const updateBiographicInfo = createAsyncThunk(
    "personalInfo/updateBiographicInfo",
    async (userId, { rejectWithValue, dispatch, getState }) => {
        try {
            const biographicInfo = getState().myInfo.allTabs.personal_data.biographic_info;
            const bioId = getState().personalInfo.personalInfoData.biographic_info?.id;
            const profile_id = getState().personalInfo.personalInfoData.id;

            const remoteBiographic = getState().personalInfo.myProfile?.biographic_info;

            const body = {
                gender: biographicInfo.gender.value
                    ? biographicInfo.gender.value === "Мужчина"
                    : remoteBiographic.gender,
                family_status_id:
                    biographicInfo.family_status_id.id || remoteBiographic.family_status_id,
                residence_address:
                    biographicInfo.residence_address.value || remoteBiographic.residence_address,
                address: biographicInfo.address.value || remoteBiographic.address,
                citizenship_id: biographicInfo.citizenship.id || remoteBiographic.citizenship_id,
                nationality_id: biographicInfo.nationality.id || remoteBiographic.nationality_id,
                region_id: biographicInfo.region.id || remoteBiographic.birthplace.region_id,
                city_id: biographicInfo.cityOrVillage.id || remoteBiographic.birthplace.city_id,
                country_id: biographicInfo.country.id || remoteBiographic.birthplace.country_id,
                profile_id,
            };
            const response = !bioId
                ? await PersonalInfoService.create_biographic_info(body)
                : await PersonalInfoService.update_biographic_info(bioId, body);

            dispatch(getPersonalInfo(userId));
            return response;
        } catch (e) {
            console.log(e);
            return rejectWithValue(e.response.data);
        }
    },
);

export const updatePassportInfo = createAsyncThunk(
    "personalInfo/updatePassportInfo",
    async (userId, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState().myInfo.allTabs.personal_data.passport;
            const passportId = getState().personalInfo.personalInfoData.passport?.id;
            const profile_id = getState().personalInfo.personalInfoData.id;
            const passport_document_link =
                getState().myInfo.edited.personal_data.passport_document_link;
            const create_passport_document_link =
                getState().myInfo.allTabs.personal_data.passport_document_link;

            const keys = Object.keys(state);

            const body = keys
                .filter((key) => state[key].value.trim() !== "")
                .reduce((result, key) => {
                    if (key.includes("date")) {
                        const date = state[key].value;
                        result[key] = moment(date, "DD.MM.YYYY").format("YYYY-MM-DD");
                    } else {
                        result[key] = state[key].value;
                    }
                    return result;
                }, {});

            if (Object.keys(body).length === 0) return;

            const document_link =
                Object.keys(passport_document_link).length !== 0
                    ? passport_document_link.delete
                        ? { document_link: null }
                        : { document_link: passport_document_link.document_link }
                    : Object.keys(passport_document_link).length === 0 && { document_link: null };

            const create_document_link =
                Object.keys(create_passport_document_link).length !== 0
                    ? { document_link: create_passport_document_link.document_link }
                    : Object.keys(create_passport_document_link).length === 0 && {
                          document_link: null,
                      };

            const new_Object = {
                ...body,
                ...document_link,
            };

            const response = !passportId
                ? await PersonalInfoService.create_passport_info({
                      ...body,
                      ...create_document_link,
                      profile_id,
                  })
                : await PersonalInfoService.update_passport_info(passportId, new_Object);

            dispatch(getPersonalInfo(userId));

            return response;
        } catch (e) {
            return rejectWithValue(e.response.data);
        }
    },
);

export const updateIdentificationCard = createAsyncThunk(
    "personalInfo/updateIdentificationCard",
    async (userId, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState().myInfo.allTabs.personal_data.identification_card;
            const identification_card_document_link =
                getState().myInfo.edited.personal_data.identification_card_document_link;

            const create_identification_card_document_link =
                getState().myInfo.allTabs.personal_data.identification_card_document_link;
            const keys = Object.keys(state);

            const body = keys
                .filter((key) => state[key].value.trim() !== "")
                .reduce((result, key) => {
                    if (key.includes("date")) {
                        const date = state[key].value;
                        result[key] = moment(date, "DD.MM.YYYY").format("YYYY-MM-DD");
                    } else {
                        result[key] = state[key].value;
                    }
                    return result;
                }, {});

            if (Object.keys(body).length === 0) return;

            const documentNumberId = state?.document_number?.id;
            const profile_id = getState().personalInfo.personalInfoData.id;

            const document_link =
                Object.keys(identification_card_document_link).length !== 0
                    ? identification_card_document_link.delete
                        ? { document_link: null }
                        : { document_link: identification_card_document_link.document_link }
                    : Object.keys(identification_card_document_link).length === 0 && {
                          document_link: null,
                      };

            const create_document_link =
                Object.keys(create_identification_card_document_link).length !== 0
                    ? { document_link: create_identification_card_document_link.document_link }
                    : Object.keys(create_identification_card_document_link).length === 0 && {
                          document_link: null,
                      };

            const new_Object = {
                ...body,
                ...document_link,
            };

            const response =
                documentNumberId.trim() === ""
                    ? await PersonalInfoService.create_identification_card({
                          ...body,
                          ...create_document_link,
                          profile_id,
                      })
                    : await PersonalInfoService.update_identification_card(
                          documentNumberId,
                          new_Object,
                      );

            dispatch(getPersonalInfo(userId));

            return response;
        } catch (e) {
            return rejectWithValue(e.response.data);
        }
    },
);

export const updateSportDegrees = createAsyncThunk(
    "personalInfo/updateSportDegrees",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const sportDegrees = state.myInfo.edited.personal_data.sport_degrees;

            if (sportDegrees.length === 0) {
                return;
            }
            const promises = sportDegrees
                .filter((item) => !item.delete)
                .map((sportDegree) => {
                    const clone = (({ id, ...o }) => o)(sportDegree);
                    const body = {
                        ...clone,
                        profile_id: state.personalInfo.personalInfoData.id,
                        assignment_date: sportDegree.assignment_date.toISOString().substring(0, 10),
                    };
                    return PersonalInfoService.update_sport_degree(body, sportDegree.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getPersonalInfo(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const deleteSportDegrees = createAsyncThunk(
    "personalInfo/deleteSportDegrees",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const sportDegrees = state.myInfo.edited.personal_data.sport_degrees;

            if (sportDegrees.length === 0) {
                return;
            }

            const promises = sportDegrees
                .filter((item) => item.delete)
                .map((sportDegree) => {
                    return PersonalInfoService.delete_sport_degree(sportDegree.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getPersonalInfo(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const updateSportAchievements = createAsyncThunk(
    "personalInfo/updateSportAchievements",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const sportAchievements = state.myInfo.edited.personal_data.sport_achievements;

            if (sportAchievements.length === 0) {
                return;
            }

            const promises = sportAchievements
                .filter((item) => !item.delete)
                .map((sportAchievement) => {
                    const { id, sport_type, ...rest } = sportAchievement;
                    const body = {
                        ...rest,
                        assignment_date: sportAchievement.assignment_date
                            .toISOString()
                            .substring(0, 10),
                    };
                    return PersonalInfoService.update_sport_achievement(body, id);
                });

            const responses = await Promise.all(promises);

            dispatch(getPersonalInfo(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);
export const deleteSportAchievements = createAsyncThunk(
    "personalInfo/deleteSportDegrees",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const sportAchievements = state.myInfo.edited.personal_data.sport_achievements;

            if (sportAchievements.length === 0) {
                return;
            }

            const promises = sportAchievements
                .filter((item) => item.delete)
                .map((item) => {
                    return PersonalInfoService.delete_sport_achievement(item.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getPersonalInfo(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const postFinancialInfo = createAsyncThunk(
    "personalInfo/postFinancialInfo",
    async (userId, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState().myInfo.allTabs.personal_data.financial_info;
            const profile_id = getState().personalInfo.personalInfoData.id;

            if (state.iban.trim() === "" || state.housing_payments_iban.trim() === "") {
                return;
            }
            const clone = (({ id, ...o }) => o)(state);

            const response = await PersonalInfoService.post_financial_info({
                ...clone,
                profile_id,
            });
            dispatch(getPersonalInfo(userId));
            return response;
        } catch (e) {
            console.error("ERROR HEREE!: ", e);
        }
    },
);

export const updateFinancialInfo = createAsyncThunk(
    "personalInfo/updateFinancialInfo",
    async (userId, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState().myInfo.edited.personal_data.financial_info;
            const profile_id = getState().personalInfo.personalInfoData.id;

            if (
                state.iban.trim() === "" ||
                state.housing_payments_iban.trim() === "" ||
                state.id.trim() === ""
            ) {
                return;
            }
            const clone = (({ id, ...o }) => o)(state);

            const response = await PersonalInfoService.update_financial_info(state?.id, {
                ...clone,
                profile_id,
            });
            dispatch(getPersonalInfo(userId));
            return response;
        } catch (e) {
            console.error("ERROR HEREE!: ", e);
        }
    },
);

export const updateDrivingLicenseInfo = createAsyncThunk(
    "personalInfo/updateDrivingLicenseInfo",
    async (userId, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState().myInfo.allTabs.personal_data.driving_license_info;
            const keys = Object.keys(state);
            const created_driving_license = getState().myInfo.allTabs.personal_data.driving_license;
            const driving_license = getState().myInfo.edited.personal_data.driving_license;

            const body = keys
                .filter((key) => {
                    const value = state[key].value;

                    if (Array.isArray(value)) {
                        return value.length > 0;
                    } else {
                        return value && value.trim() !== "";
                    }
                })
                .reduce((result, key) => {
                    if (key === "category") {
                        let resultArray = state.category.value.map((value) => {
                            return "'" + value.replace(/[^\w\s]/gi, "") + "'";
                        });
                        result[key] = "[" + resultArray.join(",") + "]";
                    } else if (key.includes("date")) {
                        const date = state[key].value;
                        result[key] = moment(date, "DD.MM.YYYY").format("YYYY-MM-DD");
                    } else {
                        result[key] = state[key].value;
                    }
                    return result;
                }, {});

            if (Object.keys(body).length === 0) return;

            const documentNumberId = state?.document_number?.id;
            const profile_id = getState().personalInfo.personalInfoData.id;

            const document_link =
                driving_license.length > 0
                    ? driving_license[0].delete
                        ? { document_link: null }
                        : { document_link: driving_license[0].document_link }
                    : driving_license.length === 0 && { document_link: null };

            const create_document_link =
                created_driving_license.length > 0
                    ? { document_link: created_driving_license.document_link }
                    : created_driving_license.length === 0 && { document_link: null };

            const newObj = {
                ...body,
                ...document_link,
            };

            const response =
                documentNumberId.trim() === ""
                    ? await PersonalInfoService.create_driving_license({
                          ...body,
                          ...create_document_link,
                          profile_id: profile_id,
                      })
                    : await PersonalInfoService.update_driving_license(documentNumberId, newObj);

            dispatch(getPersonalInfo(userId));

            return response;
        } catch (e) {
            console.error("ERROR HEREE!: ", e);
        }
    },
);

export const createDrivingLicense = createAsyncThunk(
    "personalInfo/createDrivingLicense",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const drivingLicenses = state.myInfo.allTabs.personal_data.driving_license;
            const drivingLicensesID = state.personalInfo.personalInfoData.driving_license;

            if (drivingLicenses.length === 0) {
                return;
            }
            const promises = drivingLicenses.map((drivingLicense) => {
                const body = {
                    document_link: drivingLicense.document_link,
                    profile_id: state.personalInfo.personalInfoData.id,
                };
                return PersonalInfoService.create_driving_license(body, drivingLicensesID.id);
            });

            const responses = await Promise.all(promises);
            dispatch(getPersonalInfo(userId));

            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createSportDegrees = createAsyncThunk(
    "personalInfo/createSportDegrees",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const sportDegrees = state.myInfo.allTabs.personal_data.sport_degrees;

            if (sportDegrees.length === 0) {
                return;
            }
            const promises = sportDegrees.map((sportDegree) => {
                const clone = (({ sport_type, sport_degree, assignment_date, id, ...o }) => o)(
                    sportDegree,
                );
                const body = {
                    ...clone,
                    assignment_date: sportDegree.assignment_date.toISOString().substring(0, 10),
                    profile_id: state.personalInfo.personalInfoData.id,
                };
                return PersonalInfoService.create_sport_degrees(body);
            });

            const responses = await Promise.all(promises);
            dispatch(getPersonalInfo(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createSportAchievements = createAsyncThunk(
    "personalInfo/createSportAchievements",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const sportAchievements = state.myInfo.allTabs.personal_data.sport_achievements;

            if (sportAchievements.length === 0) {
                return;
            }
            const promises = sportAchievements.map((sportAchievement) => {
                const clone = (({ assignment_date, id, ...o }) => o)(sportAchievement);
                const body = {
                    ...clone,
                    assignment_date: sportAchievement.assignment_date
                        .toISOString()
                        .substring(0, 10),
                    profile_id: state.personalInfo.personalInfoData.id,
                };
                return PersonalInfoService.create_sport_achievements(body);
            });

            const responses = await Promise.all(promises);
            dispatch(getPersonalInfo(userId));
            return responses;
        } catch (e) {
            console.error(e);
        }
    },
);

export const updateInitials = createAsyncThunk(
    "personalInfo/updateInitials",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const initials = JSON.parse(
                JSON.stringify(state.myInfo.allTabs.personal_data.biographic_info.initials),
            );

            const currentUser = state.users.user;

            for (const key in initials) {
                if (initials[key].trim() === "") {
                    delete initials[key];
                }
            }

            const keys = Object.keys(initials);

            if (keys.length === 0) return;

            const postHistoryPromises = keys.map(async (key) => {
                await PersonalInfoService.post_name_change_history({
                    name_before: currentUser[key],
                    name_after: initials[key],
                    user_id: userId,
                    name_type: key,
                });
            });

            await Promise.all(postHistoryPromises);

            const responses = await PrivateServices.patch(`/api/v1/users/${userId}`, {
                body: initials,
            });

            dispatch(getPersonalInfo(userId));
            return responses;
        } catch (e) {
            console.error(e);
        }
    },
);

export const updateUserInfo = createAsyncThunk(
    "personalInfo/updateUserInfo",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState().myInfo.allTabs.user_info;
            const keys = Object.keys(state);

            const body = keys
                .filter((key) => state[key].value.trim() !== "")
                .reduce((result, key) => {
                    if (key === "phone_number") {
                        const phomeNumberResult = phoneNumberFormatter.unformatSync(
                            state.phone_number.value,
                        );
                        result.phone_number = !phomeNumberResult.error
                            ? phomeNumberResult.data
                            : "";
                        return result;
                    }
                    result[key] = state[key].value;
                    return result;
                }, {});

            if (Object.keys(body).length === 0) {
                return;
            }

            const response = await UsersService.update_user_by_id(userId, body).catch(
                (response) => {
                    notification.info({
                        message: <IntlMessage id={"warning.message"} />,
                    });
                },
            );

            dispatch(getPersonalInfo(userId));
            return response;
        } catch (e) {
            console.error(e);
        }
    },
);

export const deleteNameChangeHistory = createAsyncThunk(
    "personalInfo/deleteNameChangeHistory",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const name_change = state.myInfo.edited.personal_data.name_change;

            if (name_change.length === 0) {
                return;
            }

            const promises = name_change
                .filter((item) => item.delete)
                .map((history_name_change) => {
                    return PersonalInfoService.delete_name_change_history(history_name_change.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getPersonalInfo(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const updateHistoryNameChange = createAsyncThunk(
    "personalInfo/updateHistoryNameChange",
    async (userId, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            const name_change = state.myInfo.edited.personal_data.name_change;

            if (name_change.length === 0) {
                return;
            }

            const promises = name_change
                .filter((item) => !item.delete)
                .map((history_name_change) => {
                    const clone = (({ id, ...o }) => o)(history_name_change);

                    return PersonalInfoService.update_name_change_history(
                        clone,
                        history_name_change.id,
                    );
                });

            const responses = await Promise.all(promises);
            dispatch(getPersonalInfo(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const personalInfoSlice = createSlice({
    name: "personalInfo",
    initialState,
    reducers: {
        deleteByPath: (state, action) => {
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
    },
    extraReducers: (builder) => {
        builder.addCase(getPersonalInfo.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getPersonalInfo.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            if (action?.payload?.driving_license) {
                state.personalInfoData = {
                    ...action.payload,
                    driving_license: {
                        ...action.payload?.driving_license,
                        category: action.payload?.driving_license?.category?.map((item) =>
                            item.replace(/['"\s]+/g, ""),
                        ),
                    },
                };
            } else {
                state.personalInfoData = {
                    ...action.payload,
                };
            }
            state.myProfile = action.payload;
        });
        builder.addCase(getPersonalInfo.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING
            state.loading = false;
            state.error = "Персональные данные не найдены";
        });
        builder.addCase(getNameChangedHistory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getNameChangedHistory.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            state.nameChangeHistory = action.payload;
        });
        builder.addCase(getNameChangedHistory.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING
            state.loading = false;
            state.error = "Персональные данные (ФИО) не были изменены";
        });
        builder.addCase(getFamilyStatuses.fulfilled, (state, action) => {
            state.familyStatuses = action.payload;
        });
    },
});

export const { personalInfo, deleteByPath } = personalInfoSlice.actions;

export default personalInfoSlice.reducer;
