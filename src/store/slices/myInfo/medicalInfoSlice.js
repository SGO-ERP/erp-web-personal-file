import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import MedicalService from '../../../services/myInfo/MedicalService';

let initialState = {
    medicalInfo: [],
    liberations: [],
    loading: true,
    error: '',
};

export const getMedicalInfo = createAsyncThunk(
    'medicine/getMedicine',
    async (userId, { rejectedWithValue }) => {
        try {
            return await MedicalService.getMedicalInfo(userId);
        } catch (e) {
            return rejectedWithValue(e.response.data);
        }
    },
);

export const getLiberations = createAsyncThunk('myInfo/getLiberations', async (_, thunkAPI) => {
    try {
        return await MedicalService.getLiberations();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const updateGeneralUserInformation = createAsyncThunk(
    'medicalInfo/updateGeneralUserInformation',
    async (userId, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            const general = state.myInfo.allTabs.medical_card.general;
            const body = {
                height: general.height.value,
                blood_group: general.blood_group,
                weight: general.weight.value,
                profile_id: state.medicalInfo.medicalInfo.general_user_info[0].profile_id,
                age_group: state.medicalInfo.medicalInfo.general_user_info[0].age_group,
            };
            const idGeneral = state.medicalInfo.medicalInfo.general_user_info[0].id;
            const response = await MedicalService.updateGeneralUserInformation(idGeneral, body);
            dispatch(getMedicalInfo(userId));
            return response;
        } catch (e) {
            rejectWithValue(e.response.data);
            throw new Error(e);
        }
    },
);

export const updateAnthropometricData = createAsyncThunk(
    'medicalInfo/updateAnthropometricData',
    async (userId, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            const anthropometric = state.myInfo.allTabs.medical_card.anthropometric;
            const body = {
                bust_size: anthropometric.bust_size.value,
                head_circumference: anthropometric.head_circumference.value,
                neck_circumference: anthropometric.neck_circumference.value,
                shape_size: anthropometric.shape_size.value,
                shoe_size: anthropometric.shoe_size.value,
                profile_id: state.medicalInfo.medicalInfo.anthropometric_datas[0].profile_id,
            };
            const idGeneral = state.medicalInfo.medicalInfo.anthropometric_datas[0].id;
            const response = await MedicalService.updateAnthropometricData(idGeneral, body);
            dispatch(getMedicalInfo(userId));
            return response;
        } catch (e) {
            rejectWithValue(e.response.data);
            throw new Error(e);
        }
    },
);

export const updateHospitalData = createAsyncThunk(
    'medicalInfo/updateHostitalData',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const hospitalData = state.myInfo.edited.medical_card.sick_list;
            if (hospitalData.length === 0) {
                return;
            }
            const promises = hospitalData.map((sick) => {
                const clone = (({ id, ...o }) => o)(sick);
                const body = {
                    ...clone,
                };
                if(!sick.delete) {
                    return MedicalService.updateHospitalData(sick.id, body);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getMedicalInfo(userId));
            return responses;
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
);

export const createHospitalData = createAsyncThunk(
    'medicalInfo/createHospitalData',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const hospitalData = state.myInfo.allTabs.medical_card.sick_list;

            if (hospitalData.length === 0) {
                return;
            }
            const promises = hospitalData.map((data) => {
                const body = {
                   ...data,
                    profile_id: state.medicalInfo.medicalInfo.id,
                };
                if(!data.delete) {
                    return MedicalService.createHospitalData(body);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getMedicalInfo(userId));
            return responses;
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
);

export const deleteHospitalData = createAsyncThunk(
    'medicalInfo/deleteHospitalData',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const sick_list = state.myInfo.edited.medical_card.sick_list;

            if (sick_list.length === 0) {
                return;
            }
            const promises = sick_list.map((item) => {
                if(item.delete){
                    return MedicalService.deleteHospitalData(item.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getMedicalInfo(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateUserLiberations = createAsyncThunk(
    'medicalInfo/updateUserLiberations',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const userLiberations = state.myInfo.edited.medical_card.release_detail;
            if (userLiberations.length === 0) {
                return;
            }
            const promises = userLiberations.map((liberation) => {
                const clone = (({ id,liberations, ...o }) => o)(liberation);
                const liberationIds = liberation.liberation_ids.map((item) => item.id);
                const flatLiberationIds = liberationIds.flat();

                const body = {
                    ...clone,
                    liberation_ids: flatLiberationIds,
                    profile_id: state.medicalInfo.medicalInfo.id
                };
                if(!liberation.delete) {
                    return MedicalService.updateUserLiberations(liberation.id, body);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getMedicalInfo(userId));
            return responses;
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
);
export const deleteUserLiberations = createAsyncThunk(
    'medicalInfo/deleteUserLiberations',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const user_liberation = state.myInfo.edited.medical_card.release_detail;

            if (user_liberation.length === 0) {
                return;
            }
            const promises = user_liberation.map((item) => {
                if(item.delete){
                    return MedicalService.deleteUserLiberations(item.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getMedicalInfo(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);


export const createUserLiberations = createAsyncThunk(
    'medicalInfo/createUserLiberations',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const userLiberations = state.myInfo.allTabs.medical_card.release_detail;

            if (userLiberations.length === 0) {
                return;
            }
            const promises = userLiberations.map((data) => {
                const clone = (({ liberations, ...o }) => o)(data);
                const liberationIds = data.liberation_ids.map((item) => item.id);
                const flatLiberationIds = liberationIds.flat();

                const body = {
                    ...clone,
                    liberation_ids: flatLiberationIds,
                    profile_id: state.medicalInfo.medicalInfo.id,
                };

                if(!data.delete) {
                    return MedicalService.createUserLiberations(body);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getMedicalInfo(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const updateDispensaryRegistration = createAsyncThunk(
    'medicalInfo/updateDispensaryRegistration',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const dispensaryRegistration = state.myInfo.edited.medical_card.dispensary_reg;
            if (dispensaryRegistration.length === 0) {
                return;
            }
            const promises = dispensaryRegistration.map((registration) => {
                const clone = (({ id, ...o }) => o)(registration);
                const body = {
                    ...clone,
                };
                if(!registration.delete) {
                    return MedicalService.updateDispensaryRegistration(registration.id, body);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getMedicalInfo(userId));
            return responses;
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
);
export const deleteDispensaryRegistration  = createAsyncThunk(
    'medicalInfo/deleteDispensaryRegistration',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const dispensaryRegistration = state.myInfo.edited.medical_card.dispensary_reg;

            if (dispensaryRegistration.length === 0) {
                return;
            }
            const promises = dispensaryRegistration.map((item) => {
                if(item.delete){
                    return MedicalService.deleteDispensaryRegistration(item.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getMedicalInfo(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);


export const createDispensaryRegistration = createAsyncThunk(
    'medicalInfo/createDispensaryRegistration',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const dispensaryRegistration = state.myInfo.allTabs.medical_card.dispensary_reg;

            if (dispensaryRegistration.length === 0) {
                return;
            }
            const promises = dispensaryRegistration.map((data) => {
                const clone = (({ id, ...o }) => o)(data);
                const body = {
                    ...clone,
                    profile_id: state.medicalInfo.medicalInfo.id,
                };
                if(!data.delete) {
                    return MedicalService.createDispensaryRegistration(body);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getMedicalInfo(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const medicalInfoSlice = createSlice({
    name: 'medicalInfo',
    initialState,
    reducers: {
        setLiberaltions: (state, action) => {
            state.liberations = action.payload
        },
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
        builder.addCase(getMedicalInfo.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getMedicalInfo.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.medicalInfo = action.payload;
        });
        builder.addCase(getMedicalInfo.rejected, (state, action) => {
            state.loading = false;
            state.error = 'Медицинские данные не найдены';
        });
        builder.addCase(getLiberations.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLiberations.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.liberations = action.payload;
        });
        builder.addCase(getLiberations.rejected, (state, action) => {
            state.loading = false;
            state.error = 'Данные не найдены';
        });
    },
});

export const { medicalInfo, deleteByPath, setLiberaltions } = medicalInfoSlice.actions;

export default medicalInfoSlice.reducer;
