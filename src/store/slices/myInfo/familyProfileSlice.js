import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import FamilyProfileService from '../../../services/myInfo/FamilyProfileService';
import ApiService from 'auth/FetchInterceptor';

let initialState = {
    familyProfile: null,
    relations: [],
    loading: true,
    familyRelationLoading: true,
    error: '',
    familyCities: {
        data: [],
        error: '',
        loading: true,
    },
};

export const getFamilyProfile = createAsyncThunk(
    'familyProfile/getFamilyProfile',
    async (userId, { rejectWithValue }) => {
        try {
            return await FamilyProfileService.get_family_profile(userId);
        } catch (e) {
            return rejectWithValue(e.response.data);
        }
    },
);

export const getRelations = createAsyncThunk('familyProfile/getRelations', async (_, thunkAPI) => {
    try {
        return await FamilyProfileService.getRelations();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const getFamilyCities = createAsyncThunk(
    'familyProfile/getFamilyCities',
    async (_, thunkAPI) => {
        try {
            const response = await ApiService.get('personal/city?skip=0&limit=10000');

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const updateFamilyMember = createAsyncThunk(
    'familyProfile/updateFamilyMember',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const members = state.myInfo.edited.family.members;

            if (members.length === 0) {
                return;
            }
            const promises = members.map((data) => {
                const body = {
                    relation_id: data.relation_id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    father_name: data.father_name,
                    IIN: data.IIN,
                    birthday: data.birthday,
                    death_day: data.death_day,
                    address: data.address,
                    workplace: data.workplace,
                    city_id: data.city_id,
                    region_id: data.region_id,
                    country_id: data.country_id,
                    profile_id: state.familyProfile.familyProfile.id
                };
                return FamilyProfileService.updateFamilyMember(data.id, body);
            });

            const responses = await Promise.all(promises);
            dispatch(getFamilyProfile(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const createFamilyMember = createAsyncThunk(
    'familyProfile/createFamilyMember',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();

            const members = state.myInfo.allTabs.family.members;

            if (members.length === 0) {
                return;
            }
            const promises = members.map(async (data) => {
                const clone = (({ id, relation, is_village, ...o }) => o)(data);
                const body = {
                    ...clone,
                    profile_id: state.familyProfile.familyProfile.profile_id,
                };
                const response = await FamilyProfileService.createFamilyMember(body);

                const violations = state.myInfo.allTabs.family.family_violations.local;
                const family_abroad_travels =
                    state.myInfo.allTabs.family.family_abroad_travels.local;
                try {
                    const addViolation = violations.map((data) => {
                        if (
                            Object.hasOwnProperty.call(data, 'local_id') &&
                            data.local_id === members.id
                        ) {
                            const clone = (({ id, local_id, ...o }) => o)(data);
                            const newObj = {
                                ...clone,
                            };

                            return FamilyProfileService.createFamilyMemberViolation(
                                response.data.id,
                                newObj,
                            );
                        }
                    });
                    const addFamilyAbroad = family_abroad_travels.map((data) => {
                        if (
                            Object.hasOwnProperty.call(data, 'local_id') &&
                            data.local_id === members.id
                        ) {
                            const clone = (({ id, local_id, ...o }) => o)(data);
                            const newObj = {
                                ...clone,
                            };

                            return FamilyProfileService.createFamilyMemberAbroadTravel(
                                response.data.id,
                                newObj,
                            );
                        }
                    });

                    return response;
                } catch (e) {
                    return response;
                }
            });
            const responses = await Promise.all(promises);
            dispatch(getFamilyProfile(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const deleteFamilyMember = createAsyncThunk(
    'familyProfile/deleteFamilyMember',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const deletedMembers = state.myInfo.allTabs.family.deletedMembers;

            if (deletedMembers.length === 0) {
                return;
            }
            const promises = deletedMembers.map((id) => {
                return FamilyProfileService.deleteFamilyMember(id);
            });
            const responses = await Promise.all(promises);
            dispatch(getFamilyProfile(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const createFamilyViolation = createAsyncThunk(
    'familyProfile/createFamilyViolation',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();

            const family_violations = state.myInfo.allTabs.family.family_violations.remote;

            if (family_violations.length === 0) {
                return;
            }
            const promises = family_violations.map((data) => {
                const body = {
                    date: data.date,
                    issued_by: data.issued_by,
                    issued_byKZ: data.issued_byKZ,
                    article_number: data.article_number,
                    article_numberKZ: data.article_numberKZ,
                    consequence: data.consequence,
                    consequenceKZ: data.consequenceKZ,
                    document_link: data.document_link,
                    profile_id: data.profile_id,
                    violation_type_id: data.violation_type_id,
                }
                return FamilyProfileService.createFamilyMemberViolation(data.family_id, body);
            });

            const responses = await Promise.all(promises);
            dispatch(getFamilyProfile(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const createFamilyAbroadTravel = createAsyncThunk(
    'familyProfile/createFamilyAbroadTravel',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();

            const family_abroad_travels = state.myInfo.allTabs.family.family_abroad_travels.remote;

            if (family_abroad_travels.length === 0) {
                return;
            }
            const promises = family_abroad_travels.map((data) => {
                const clone = (({ id, family_id, ...o }) => o)(data);

                return FamilyProfileService.createFamilyMemberAbroadTravel(data.family_id, clone);
            });

            const responses = await Promise.all(promises);
            dispatch(getFamilyProfile(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const updateFamilyAbroadTravel = createAsyncThunk(
    'familyProfile/updateFamilyAbroadTravel',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();

            const family_abroad_travels_edit =
                state.myInfo.edited.family.family_abroad_travels.remote;

            if (family_abroad_travels_edit.length === 0) {
                return;
            }
            const promises = family_abroad_travels_edit.map((data) => {
                if (!data.delete) {
                    return FamilyProfileService.updateFamilyMemberAbroadTravel(data.id, data);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getFamilyProfile(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const deleteFamilyAbroadTravel = createAsyncThunk(
    'familyProfile/deleteFamilyAbroadTravel',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();

            const family_abroad_travels_del =
                state.myInfo.edited.family.family_abroad_travels.remote;

            if (family_abroad_travels_del.length === 0) {
                return;
            }
            const promises = family_abroad_travels_del.map((data) => {
                if (data.delete) {
                    return FamilyProfileService.deleteFamilyMemberAbroadTravel(data.id, data);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getFamilyProfile(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const updateFamilyViolation = createAsyncThunk(
    'familyProfile/updateFamilyViolation',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();

            const family_violations_edit = state.myInfo.edited.family.family_violations.remote;

            if (family_violations_edit.length === 0) {
                return;
            }
            const promises = family_violations_edit.map((data) => {
                if (!data.delete) {
                    return FamilyProfileService.updateFamilyMemberViolation(data.id, data);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getFamilyProfile(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const deleteFamilyViolation = createAsyncThunk(
    'familyProfile/deleteFamilyViolation',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();

            const family_violations_edit = state.myInfo.edited.family.family_violations.remote;

            if (family_violations_edit.length === 0) {
                return;
            }
            const promises = family_violations_edit.map((data) => {
                if (data.delete) {
                    return FamilyProfileService.deleteFamilyMemberViolation(data.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getFamilyProfile(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const familyProfileSlice = createSlice({
    name: 'familyProfile',
    initialState,
    reducers: {
        deleteByPath: (state, action) => {
            const { path, id } = action.payload;
            const pathParts = path.split('.');
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
        builder.addCase(getFamilyProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getFamilyProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.familyProfile = action.payload;
        });
        builder.addCase(getFamilyProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = 'Семейный данные не найдены';
        });
        builder.addCase(getRelations.pending, (state) => {
            state.familyRelationLoading = true;
        });
        builder.addCase(getRelations.fulfilled, (state, action) => {
            state.familyRelationLoading = false;
            state.error = '';
            state.relations = action.payload;
        });
        builder.addCase(getRelations.rejected, (state) => {
            state.familyRelationLoading = false;
            state.error = 'Семейный данные не найдены';
        });
        builder.addCase(getFamilyCities.pending, (state) => {
            state.familyCities.loading = true;
        });
        builder.addCase(getFamilyCities.fulfilled, (state, action) => {
            state.familyCities.loading = false;
            state.familyCities.error = '';
            state.familyCities.data = action.payload;
        });
        builder.addCase(getFamilyCities.rejected, (state) => {
            state.familyCities.loading = false;
            state.familyCities.error = 'Города не найдены';
        });
    },
});

export const { familyProfile, deleteByPath } = familyProfileSlice.actions;

export default familyProfileSlice.reducer;
