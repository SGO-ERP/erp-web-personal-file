import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AdditionalService from '../../../services/myInfo/AdditionalService';
const initialState = {
    additional: {
        data: {},
        loading: true,
        error: '',
    },
    psychological: {
        data: [],
        loading: true,
        error: '',
    },
    polygraph: {
        data: [],
        loading: true,
        error: '',
    },
};

export const getAdditional = createAsyncThunk(
    'personalInfo/getAdditional',
    async (userId, { rejectedWithValue }) => {
        try {
            return await AdditionalService.get_additional(userId);
        } catch (e) {
            return rejectedWithValue(e.response.data);
        }
    },
);

export const getPsychologicalCheck = createAsyncThunk(
    'personalInfo/getPsychologicalCheck',
    async (_, thunkAPI) => {
        try {
            return await AdditionalService.get_psychological();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const getPolygraph = createAsyncThunk('personalInfo/getPolygraph', async (_, thunkAPI) => {
    try {
        return await AdditionalService.get_polygraph();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const createVehicle = createAsyncThunk(
    'additional/createVehicle',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const vehicles = state.myInfo.allTabs.additional.transport;

            if (vehicles.length === 0) {
                return;
            }
            const promises = vehicles.map((data) => {
                const body = {
                    name: data.name,
                    nameKZ: data.nameKZ,
                    number: data.number,
                    date_from: data.date_from,
                    document_link: data.document_link ?? null,
                    profile_id: state.additional.additional.data.id,
                    vin_code: data.vin_code,
                };
                return AdditionalService.createVehicle(body);
            });

            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.error('createVehicle error', e);
            throw new Error(e);
        }
    },
);

export const createViolation = createAsyncThunk(
    'additional/createViolation',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const checks = state.myInfo.allTabs.additional.violations;

            if (checks.length === 0) {
                return;
            }
            const promises = checks.map((data) => {
                const clone = (({ id, ...o }) => o)(data);
                const body = {
                    ...clone,
                    profile_id: state.additional.additional.data.id,
                };
                return AdditionalService.createViolation(body, data.id);
            });
            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const createAbroadTravel = createAsyncThunk(
    'additional/createAbroadTravel',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const checks = state.myInfo.allTabs.additional.abroad_travels;

            if (checks.length === 0) {
                return;
            }
            const promises = checks.map((data) => {
                const clone = (({ id, destination_country, ...o }) => o)(data);
                const body = {
                    ...clone,
                    profile_id: state.additional.additional.data.id,
                };
                return AdditionalService.createAbroadTravel(body, data.id);
            });
            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const createSpecialChecks = createAsyncThunk(
    'additional/createSpecialChecks',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const checks = state.myInfo.allTabs.additional.special_checks;

            if (checks.length === 0) {
                return;
            }
            const promises = checks.map((data) => {
                const clone = (({ id, destination_country, ...o }) => o)(data);
                const body = {
                    ...clone,
                    profile_id: state.additional.additional.data.id,
                };
                return AdditionalService.createSpecialChecks(body, data.id);
            });
            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const createProperty = createAsyncThunk(
    'additional/createProperty',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const checks = state.myInfo.allTabs.additional.properties;

            if (checks.length === 0) {
                return;
            }
            const promises = checks.map((data) => {
                const clone = (({ id, type, ...o }) => o)(data);
                const body = {
                    ...clone,
                    profile_id: state.additional.additional.data.id,
                };
                return AdditionalService.createProperty(body, data.id);
            });
            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const updateProperty = createAsyncThunk(
    'additional/updateVehicle',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const properties = state.myInfo.edited.additional.properties;

            if (properties.length === 0) {
                return;
            }
            const promises = properties.map((data) => {
                const clone = (({ id, ...o }) => o)(data);
                const body = {
                    ...clone,
                    profile_id: state.additional.additional.data.id,
                };
                if (!data.delete) {
                    return AdditionalService.updateProperties(body, data.id);
                }
            });
            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateVehicle = createAsyncThunk(
    'additional/updateVehicle',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const vehicles = state.myInfo.edited.additional.transport;

            if (vehicles.length === 0) {
                return;
            }
            const promises = vehicles.map((data) => {
                const clone = (({ id, document_link, ...o }) => o)(data);
                const body = {
                    ...clone,
                    date_from: data.date_from,
                    document_link: data.document_link ?? null,
                };

                if (!data.delete) {
                    return AdditionalService.updateVehicle(body, data.id);
                }
            });
            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateSpecialCheck = createAsyncThunk(
    'additional/updateSpecialCheck',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const special_checks = state.myInfo.edited.additional.special_checks;

            if (special_checks.length === 0) {
                return;
            }
            const promises = special_checks.map((data) => {
                const body = {
                    ...data,
                    profile_id: state.additional.additional.data.id,
                };
                if (!data.delete) {
                    return AdditionalService.updateSpecialCheck(body, data.id);
                }
            });
            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const updatePolygraphCheck = createAsyncThunk(
    'additional/updatePolygraphCheck',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const checks = state.myInfo.edited.additional.polygraph_checks;

            if (checks.length === 0) {
                return;
            }
            const promises = checks.map((data) => {
                const clone = (({ id, ...o }) => o)(data);
                const body = {
                    ...clone,
                    date_of_issue: data.date_of_issue,
                };
                if (!data.delete) {
                    return AdditionalService.updatePolygraphCheck(body, data.id);
                }
            });
            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const updatePsychologicalCheck = createAsyncThunk(
    'familyProfile/updatePsychologicalCheck',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const checks = state.myInfo.edited.additional.psychological_checks;

            if (checks.length === 0) {
                return;
            }
            const promises = checks.map((data) => {
                const clone = (({ id, ...o }) => o)(data);
                const body = {
                    ...clone,
                };

                if (!data.delete) {
                    return AdditionalService.updatePsychologicalCheck(body, data.id);
                }
            });

            const responses = await Promise.all(promises);
            await dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const createPolygraphCheck = createAsyncThunk(
    'familyProfile/createPolygraphCheck',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const checks = state.myInfo.allTabs.additional.polygraph_checks;

            if (checks.length === 0) {
                return;
            }
            const promises = checks.map((data) => {
                const body = {
                    number: data.number,
                    issued_by: data.issued_by,
                    date_of_issue: data.date_of_issue,
                    document_link: data.document_link,
                    profile_id: state.additional.additional.data.id,
                };
                return AdditionalService.createPolygraphCheck(body);
            });

            const responses = await Promise.all(promises);
            await dispatch(getAdditional(userId));
            await dispatch(getPolygraph());
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const createPsychologicalCheck = createAsyncThunk(
    'familyProfile/createPsychologicalCheck',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const checks = state.myInfo.allTabs.additional.psychological_checks;

            if (checks.length === 0) {
                return;
            }
            const promises = checks.map((data) => {
                const body = {
                    ...data,
                    profile_id: state.additional.additional.data.id,
                };
                return AdditionalService.createPsychologicalCheck(body);
            });

            const responses = await Promise.all(promises);

            await dispatch(getPsychologicalCheck());
            await dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const createServiceHousing = createAsyncThunk(
    'serviceHousing/createServiceHousing',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const checks = state.myInfo.allTabs.additional.service_housing;

            if (checks.length === 0) {
                return;
            }
            const promises = checks.map((data) => {
                const clone = (({ id, type, ...o }) => o)(data);

                const body = {
                    ...clone,
                    profile_id: state.additional.additional.data.id,
                };
                return AdditionalService.createServiceHousing(body);
            });

            const responses = await Promise.all(promises);

            await dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const updateServiceHousing = createAsyncThunk(
    'serviceHousing/updateServiceHousing',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const checks = state.myInfo.edited.additional.service_housing;

            if (checks.length === 0) {
                return;
            }
            const promises = checks.map((data) => {
                const clone = (({ id, type, ...o }) => o)(data);

                const body = {
                    ...clone,
                    profile_id: state.additional.additional.data.id,
                };

                if (!data.delete) {
                    return AdditionalService.updateServiceHousing(body, data.id);
                }
            });

            const responses = await Promise.all(promises);

            await dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const updateAbroadTravel = createAsyncThunk(
    'additional/updateAbroadTravel',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const abroad_travels = state.myInfo.edited.additional.abroad_travels;

            if (abroad_travels.length === 0) {
                return;
            }
            const promises = abroad_travels.map((data) => {
                const clone = (({ id, ...o }) => o)(data);
                const body = {
                    ...clone,
                };
                if (!data.delete) {
                    return AdditionalService.updateAbroadTravel(body, data.id);
                }
            });
            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const updateViolation = createAsyncThunk(
    'additional/updateViolation',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const violations = state.myInfo.edited.additional.violations;

            if (violations.length === 0) {
                return;
            }
            const promises = violations.map((data) => {
                const clone = (({ id, ...o }) => o)(data);
                const body = {
                    ...clone,
                };
                if (!data.delete) {
                    return AdditionalService.updateViolation(body, data.id);
                }
            });
            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const deleteServiceHousing = createAsyncThunk(
    'education/deleteServiceHousing',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const service_housings = state.myInfo.edited.additional.service_housing;

            if (service_housings.length === 0) {
                return;
            }

            const promises = service_housings.map((service_housing) => {
                if (service_housing.delete) {
                    return AdditionalService.deleteServiceHousing(service_housing.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteAbroadTravel = createAsyncThunk(
    'education/deleteAbroadTravel',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const abroad_travels = state.myInfo.edited.additional.abroad_travels;

            if (abroad_travels.length === 0) {
                return;
            }

            const promises = abroad_travels.map((service_housing) => {
                if (service_housing.delete) {
                    return AdditionalService.deleteAbroadTravel(service_housing.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteViolation = createAsyncThunk(
    'education/deleteViolation',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const violations = state.myInfo.edited.additional.violations;

            if (violations.length === 0) {
                return;
            }

            const promises = violations.map((violation) => {
                if (violation.delete) {
                    return AdditionalService.deleteViolation(violation.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);
export const deleteProperty = createAsyncThunk(
    'education/deleteProperty',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const properties = state.myInfo.edited.additional.properties;

            if (properties.length === 0) {
                return;
            }

            const promises = properties.map((property) => {
                if (property.delete) {
                    return AdditionalService.deleteProperty(property.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deletePsychologicalCheck = createAsyncThunk(
    'education/deletePsychologicalCheck',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const psych_characts = state.myInfo.edited.additional.psychological_checks;

            if (psych_characts.length === 0) {
                return;
            }

            const promises = psych_characts.map((psych_charact) => {
                if (psych_charact.delete) {
                    return AdditionalService.deletePsychologicalCheck(psych_charact.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteSpecialCheck = createAsyncThunk(
    'education/deleteSpecialCheck',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const special_checks = state.myInfo.edited.additional.special_checks;

            if (special_checks.length === 0) {
                return;
            }

            const promises = special_checks.map((special_check) => {
                if (special_check.delete) {
                    return AdditionalService.deleteSpecialCheck(special_check.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deletePolygraphCheck = createAsyncThunk(
    'education/deletePolygraphCheck',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const pol_checks = state.myInfo.edited.additional.polygraph_checks;

            if (pol_checks.length === 0) {
                return;
            }

            const promises = pol_checks.map((pol_check) => {
                if (pol_check.delete) {
                    return AdditionalService.deletePolygraphCheck(pol_check.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteVehicle = createAsyncThunk(
    'education/deleteVehicle',
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const vehicles = state.myInfo.edited.additional.transport;
            if (vehicles.length === 0) {
                return;
            }
            const promises = vehicles.map((vehicle) => {
                if (vehicle.delete) {
                    return AdditionalService.deleteVehicle(vehicle.id);
                }
            });

            const responses = await Promise.all(promises);
            dispatch(getAdditional(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const additionalSlice = createSlice({
    name: 'additional',
    initialState,
    reducers: {
        deleteByPath: (state, action) => {
            const { path, id } = action.payload;
            const pathParts = path.split('.');

            const target = pathParts.reduce((acc, cur) => {
                if (acc === undefined) {
                    console.log(`Ошибка: acc is undefined на шаге с ключом '${cur}'`);
                    return undefined;
                }
                if (acc[cur] === undefined) {
                    console.log(`Ошибка: ключ '${cur}' не существует в объекте`, acc);
                }
                return acc[cur];
            }, state);

            for (let i = 0; i < target.length; i++) {
                if (target[i].id === id) {
                    target.splice(i, 1);
                    break;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAdditional.pending, (state) => {
            state.additional.loading = true;
        });
        builder.addCase(getAdditional.fulfilled, (state, action) => {
            state.additional.loading = false;
            state.additional.error = '';
            state.additional.data = action.payload;
        });
        builder.addCase(getAdditional.rejected, (state, action) => {
            state.additional.loading = false;
            state.additional.error = 'Дополнительная информация не найдена';
        });
        builder.addCase(getPsychologicalCheck.pending, (state) => {
            state.psychological.loading = true;
        });
        builder.addCase(getPsychologicalCheck.fulfilled, (state, action) => {
            state.psychological.loading = false;
            state.psychological.error = '';
            state.psychological.data = action.payload;
        });
        builder.addCase(getPsychologicalCheck.rejected, (state, action) => {
            state.psychological.loading = false;
            state.psychological.error = 'Дополнительная информация не найдена';
        });
        builder.addCase(getPolygraph.pending, (state) => {
            state.polygraph.loading = true;
        });
        builder.addCase(getPolygraph.fulfilled, (state, action) => {
            state.polygraph.loading = false;
            state.polygraph.error = '';
            state.polygraph.data = action.payload;
        });
        builder.addCase(getPolygraph.rejected, (state, action) => {
            state.polygraph.loading = false;
            state.polygraph.error = 'Дополнительная информация не найдена';
        });
    },
});

export const { additional, deleteByPath } = additionalSlice.actions;

export default additionalSlice.reducer;
