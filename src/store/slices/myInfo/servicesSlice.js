import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import GroupsService from "services/GroupsService";
import ServicesService from "services/myInfo/ServicesService";
import moment from "moment";
import BadgesService from "services/BadgesService";

let initialState = {
    blackBeretHistory: [],
    coolnessHistory: [],
    serviceData: {},
    characteristic: [],
    awards: [],
    clothingEquipments: [],
    armyEquipments: [],
    otherEquipments: [],
    allAvailable: [],
    militaryUnits: [],
    ranks: [],
    staffDivisions: [],
    badge_types: [],
    recommendation: {},
    researcher: {},
    loading: true,
    error: "",
};

export const getService = createAsyncThunk(
    "services/getService",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await ServicesService.get_services(userId);
            return response;
        } catch (e) {
            console.error(e);
            return rejectWithValue(e.response.data);
        }
    },
);

export const getBadgeTypes = createAsyncThunk("services/get_badge_types", async (_, thunkAPI) => {
    try {
        return await BadgesService.get_badge_types();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const getCoolnessHistory = createAsyncThunk(
    "services/getCoolnessHistory",
    async (userId, { rejectWithValue }) => {
        try {
            return await ServicesService.getCoolnessHistory(userId);
        } catch (e) {
            console.error(e);
            return rejectWithValue(e.response.data);
        }
    },
);

export const getBlackBeretHistory = createAsyncThunk(
    "services/getBlackBeretHistory",
    async (userId, { rejectWithValue }) => {
        try {
            return await ServicesService.getBlackBeretHistory(userId);
        } catch (e) {
            console.error(e);
            return rejectWithValue(e.response.data);
        }
    },
);

export const getClothingEquipments = createAsyncThunk(
    "services/getClothingEquipments",
    async (_, { rejectWithValue }) => {
        try {
            return await ServicesService.get_clothing_equipments();
        } catch (e) {
            console.error(e);
            return rejectWithValue(e.response.data);
        }
    },
);

export const getArmyEquipments = createAsyncThunk(
    "services/getArmyEquipments",
    async (_, { rejectWithValue }) => {
        try {
            return await ServicesService.get_army_equipments();
        } catch (e) {
            console.error(e);
            return rejectWithValue(e.response.data);
        }
    },
);

export const getOtherEquipments = createAsyncThunk(
    "services/getOtherEquipments",
    async (_, { rejectWithValue }) => {
        try {
            return await ServicesService.get_other_equipments();
        } catch (e) {
            console.error(e);
            return rejectWithValue(e.response.data);
        }
    },
);

export const getAllAvailable = createAsyncThunk(
    "services/getAllAvailable",
    async (userId, { rejectWithValue }) => {
        try {
            return await ServicesService.get_all_available(userId);
        } catch (e) {
            console.error(e);
            return rejectWithValue(e.response.data);
        }
    },
);

export const getAwards = createAsyncThunk("services/get_awards", async (_, thunkAPI) => {
    try {
        return await ServicesService.get_awards();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const getUsers = createAsyncThunk("services/get_users", async (_, thunkAPI) => {
    try {
        return await ServicesService.get_users();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const getRanks = createAsyncThunk("services/get_ranks", async (_, thunkAPI) => {
    try {
        return await ServicesService.get_ranks();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const getStaffDivisions = createAsyncThunk(
    "services/get_staff_divisions",
    async (_, thunkAPI) => {
        try {
            return await GroupsService.get_staff_divisions();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const createCharacteristic = createAsyncThunk(
    "services/createCharacteristic",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const characterictics = state.myInfo.allTabs.services.characteristics;

            if (characterictics.length === 0) {
                return;
            }

            const promises = characterictics
                .filter((item) => !item.delete)
                .map((data) => {
                    const body = {
                        type: "service_characteristic_history",
                        user_id: userId,
                        date_from: data.date_from,
                        document_link: data.document_link,
                        document_number: data.document_number,
                        characteristic_initiator_id: data.characteristic_initiator_id,
                        profile_id: state.services.serviceData.characteristics.id,
                    };
                    return ServicesService.createHistory(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateCharacteristic = createAsyncThunk(
    "services/updateCharacteristic",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const characteristics = state.myInfo.edited.services.characteristics;

            if (characteristics.length === 0) {
                return;
            }
            const promises = characteristics
                .filter((data) => !data.delete)
                .map((data) => {
                    const clone = (({ id, ...o }) => o)(data);
                    const body = {
                        ...clone,
                        user_id: userId,
                    };

                    return ServicesService.updateHistories(body, data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteCharacteristic = createAsyncThunk(
    "services/deleteCharacteristic",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const characteristics = state.myInfo.edited.services.characteristics;

            if (characteristics.length === 0) {
                return;
            }

            const promises = characteristics
                .filter((item) => item.delete)
                .map((data) => {
                    if (data.delete) return ServicesService.deleteHistories(data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const getMilitaryUnits = createAsyncThunk(
    "services/getMilitaryUnits",
    async (userId, { rejectWithValue }) => {
        try {
            return await ServicesService.get_military_units(userId);
        } catch (e) {
            console.error(e);
            return rejectWithValue(e.response.data);
        }
    },
);

export const createWeaponEquipment = createAsyncThunk(
    "services/createWeaponEquipment",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const weapons = state.myInfo.allTabs.services.weapons;

            if (weapons.length === 0) {
                return;
            }
            const promises = weapons
                .filter((item) => !item.delete)
                .map((weapon) => {
                    const clone = (({ id, type_of_army_equipment_model, ...o }) => o)(weapon);
                    const body = {
                        ...clone,
                        user_id: userId,
                    };
                    return ServicesService.create_equipment(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateWeaponEquipment = createAsyncThunk(
    "services/updateWeaponEquipment",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const weapons = state.myInfo.edited.services.weapons;

            if (weapons.length === 0) {
                return;
            }
            const promises = weapons
                .filter((item) => !item.delete)
                .map((weapon) => {
                    const clone = (({ id, type_of_army_equipment_model, ...o }) => o)(weapon);
                    const body = {
                        ...clone,
                        user_id: userId,
                    };
                    return ServicesService.update_equipment(body, weapon.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteWeaponEquipment = createAsyncThunk(
    "services/deleteWeaponEquipment",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const weapons = state.myInfo.edited.services.weapons;

            if (weapons.length === 0) {
                return;
            }
            const promises = weapons
                .filter((item) => item.delete)
                .map((weapon) => {
                    return ServicesService.delete_equipment(weapon.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createClothingEquipment = createAsyncThunk(
    "services/createClothingEquipment",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const clothes = state.myInfo.allTabs.services.clothes;

            if (clothes.length === 0) {
                return;
            }
            const promises = clothes
                .filter((item) => !item.delete)
                .map((weapon) => {
                    const clone = (({
                        id,
                        type_of_clothing_equipment_model,
                        cloth_eq_types_models,
                        ...o
                    }) => o)(weapon);
                    const body = {
                        ...clone,
                        user_id: userId,
                    };
                    return ServicesService.create_equipment(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateClothingEquipment = createAsyncThunk(
    "services/updateClothingEquipment",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const clothes = state.myInfo.edited.services.clothes;

            if (clothes.length === 0) {
                return;
            }
            const promises = clothes
                .filter((item) => !item.delete)
                .map((clothe) => {
                    const clone = (({ id, type_of_clothing_equipment_model, ...o }) => o)(clothe);
                    const body = {
                        ...clone,
                        user_id: userId,
                    };
                    return ServicesService.update_equipment(body, clothe.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteClothingEquipment = createAsyncThunk(
    "services/deleteClothingEquipment",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const clothes = state.myInfo.edited.services.clothes;

            if (clothes.length === 0) {
                return;
            }
            const promises = clothes
                .filter((item) => item.delete)
                .map((clothe) => {
                    return ServicesService.delete_equipment(clothe.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createOthersEquipment = createAsyncThunk(
    "services/createOthersEquipment",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const others = state.myInfo.allTabs.services.others;

            if (others.length === 0) {
                return;
            }
            const promises = others
                .filter((item) => !item.delete)
                .map((weapon) => {
                    const clone = (({ id, type_of_other_equipment_model, ...o }) => o)(weapon);
                    const body = {
                        ...clone,
                        user_id: userId,
                    };
                    return ServicesService.create_equipment(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateOthersEquipment = createAsyncThunk(
    "services/updateOthersEquipment",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const others = state.myInfo.edited.services.others;

            if (others.length === 0) {
                return;
            }
            const promises = others
                .filter((item) => !item.delete)
                .map((other) => {
                    const clone = (({ id, type_of_other_equipment_model, ...o }) => o)(other);
                    const body = {
                        ...clone,
                        user_id: userId,
                    };
                    return ServicesService.update_equipment(body, other.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteOthersEquipment = createAsyncThunk(
    "services/deleteOthersEquipment",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const others = state.myInfo.edited.services.others;

            if (others.length === 0) {
                return;
            }
            const promises = others
                .filter((item) => item.delete)
                .map((other) => {
                    return ServicesService.delete_equipment(other.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateOath = createAsyncThunk(
    "services/updateOthersEquipment",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const oath = state.myInfo.edited.services.oath;
            if (Object.keys(oath).length === 0) return;

            const body = {
                user_id: userId,
                date: oath.date,
                military_unit: oath.military_unit,
            };

            const response =
                oath.id !== null
                    ? await ServicesService.update_oath(body, oath.id)
                    : await ServicesService.create_oath(body);

            dispatch(getService(userId));
            return response;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateSecret = createAsyncThunk(
    "services/updateSecret",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const secret = state.myInfo.edited.services.privilege_emergency_secrets;
            if (Object.keys(secret).length === 0) return;

            const body = {
                form: secret.form,
                date_from: moment(secret.date_from).format("YYYY-MM-DD"),
                date_to: moment(secret.date_to).format("YYYY-MM-DD"),
                user_id: userId,
            };

            const response = secret.id
                ? await ServicesService.update_secret(body, secret.id)
                : await ServicesService.create_secret(body);

            dispatch(getService(userId));
            return response;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateReserve = createAsyncThunk(
    "services/updateReserve",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const reserve = state.myInfo.edited.services.personnel_reserve;
            if (reserve.delete) {
                ServicesService.delete_reserve(reserve.id);
                dispatch(getService(userId));
                return;
            }

            if (Object.keys(reserve).length === 0) return;

            const body = {
                reserve: reserve.reserve,
                document_number: reserve.document_number,
                document_link: reserve.document_link,
                reserve_date: moment(reserve.reserve_date).format("YYYY-MM-DD"),
                user_id: userId,
            };

            const response = reserve.id
                ? await ServicesService.update_reserve(body, reserve.id)
                : await ServicesService.create_reserve(body);

            dispatch(getService(userId));
            return response;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createJobExperience = createAsyncThunk(
    "services/createJobExperience",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const experiences = state.myInfo.allTabs.services.workExperience;

            if (experiences.length === 0) {
                return;
            }

            const promises = experiences
                .filter((item) => !item.delete)
                .map((data) => {
                    const body = {
                        user_id: userId,
                        type: "work_experience_history",
                        ...data,
                    };
                    return ServicesService.createHistory(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateJobExperience = createAsyncThunk(
    "services/updateJobExperience",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const experiences = state.myInfo.edited.services.workExperience;

            if (experiences.length === 0) {
                return;
            }

            const promises = experiences
                .filter((data) => !data.delete)
                .map((data) => {
                    const body = {
                        user_id: userId,
                        type: "work_experience_history",
                        ...data,
                    };
                    return ServicesService.updateHistories(body, data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteJobExperience = createAsyncThunk(
    "services/deleteJobExperience",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const experiences = state.myInfo.edited.services.workExperience;

            if (experiences.length === 0) {
                return;
            }

            const promises = experiences
                .filter((item) => item.delete)
                .map((data) => {
                    return ServicesService.deleteHistories(data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createEmergencyContract = createAsyncThunk(
    "services/createEmergencyContract",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const contracts = state.myInfo.allTabs.services.emergency_contracts;

            if (contracts.length === 0) {
                return;
            }

            const promises = contracts
                .filter((item) => !item.delete)
                .map((data) => {
                    const clone = (({
                        id,
                        staff_division,
                        contractor_signer_name,
                        position,
                        ...o
                    }) => o)(data);

                    const body = {
                        user_id: userId,
                        type: "emergency_history",
                        contractor_signer_name: data.contractor_signer_name.name,
                        contractor_signer_nameKZ: data.contractor_signer_name.nameKZ,
                        position_name: data.position.name,
                        position_nameKZ: data.position.nameKZ,
                        staff_division_name: data.staffDivision.name,
                        staff_division_nameKZ: data.staffDivision.nameKZ,
                        is_employee: data.is_employee,
                        ...clone,
                    };
                    return ServicesService.createHistory(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateEmergencyContract = createAsyncThunk(
    "services/updateEmergencyContract",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const contracts = state.myInfo.edited.services.emergency_contracts;

            if (contracts.length === 0) {
                return;
            }

            const promises = contracts
                .filter((data) => !data.delete)
                .map((data) => {
                    const clone = (({
                        id,
                        staff_division,
                        contractor_signer_name,
                        position,
                        ...o
                    }) => o)(data);
                    const body = {
                        user_id: userId,
                        type: "emergency_history",
                        contractor_signer_name: data.contractor_signer_name.name,
                        contractor_signer_nameKZ: data.contractor_signer_name.nameKZ,
                        position_name: data.position.name,
                        position_nameKZ: data.position.nameKZ,
                        staff_division_name: data.staffDivision.name,
                        staff_division_nameKZ: data.staffDivision.nameKZ,
                        is_employee: data.is_employee,
                        ...clone,
                    };
                    return ServicesService.updateHistories(body, data.id);
                });

            const responses = await Promise.all(promises);

            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteEmergencyContract = createAsyncThunk(
    "services/deleteEmergencyContract",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const contracts = state.myInfo.edited.services.emergency_contracts;

            if (contracts.length === 0) {
                return;
            }

            const promises = contracts
                .filter((item) => item.delete)
                .map((data) => {
                    if (data.delete) return ServicesService.deleteHistories(data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createRank = createAsyncThunk(
    "services/createRank",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const ranks = state.myInfo.allTabs.services.ranks;

            if (ranks.length === 0) {
                return;
            }

            const promises = ranks
                .filter((item) => !item.delete)
                .map((data) => {
                    const clone = (({ document_style, id, names, ...o }) => o)(data);

                    const body = {
                        user_id: userId,
                        type: "rank_history",
                        ...clone,
                    };
                    return ServicesService.createHistory(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateRank = createAsyncThunk(
    "services/updateRank",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const ranks = state.myInfo.edited.services.ranks;

            if (ranks.length === 0) {
                return;
            }

            const promises = ranks
                .filter((item) => !item.delete)
                .map((data) => {
                    const clone = (({ id, name, ...o }) => o)(data);

                    const body = {
                        user_id: userId,
                        type: "rank_history",
                        ...clone,
                    };
                    return ServicesService.updateHistories(body, data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteRank = createAsyncThunk(
    "services/deleteRank",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const ranks = state.myInfo.edited.services.ranks;

            if (ranks.length === 0) {
                return;
            }

            const promises = ranks.map((data) => {
                if (data.delete) return ServicesService.deleteHistories(data.id);
            });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createResearcherAndRecommendation = createAsyncThunk(
    "services/createResearcherAndRecommendation",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const researcher = state.myInfo.allTabs.services.recommendation_and_researcher;

            if (!researcher.researcher) {
                return;
            }

            const clone = (({ source, id, ...o }) => o)(researcher);

            const body = {
                user_id: userId,
                ...clone,
            };

            const result = await ServicesService.create_recommendation_and_researcher(body);

            dispatch(getService(userId));
            return result;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateResearcherAndRecommendation = createAsyncThunk(
    "services/updateResearcherAndRecommendation",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const researcher = state.myInfo.edited.services.recommendation_and_researcher;

            if (!researcher.researcher) {
                return;
            }

            const clone = (({ source, id, ...o }) => o)(researcher);

            const body = {
                user_id: userId,
                ...clone,
            };
            const result = await ServicesService.update_recommendation_and_researcher(
                body,
                researcher.id,
            );

            dispatch(getService(userId));
            return result;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createServiceId = createAsyncThunk(
    "services/createServiceId",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const serviceId = state.myInfo.allTabs.services.service_id_info;

            if (Object.keys(serviceId).length === 0) {
                return;
            }
            const clone = (({ id, ...o }) => o)(serviceId);

            const body = {
                user_id: userId,
                ...clone,
            };
            const result = await ServicesService.create_serviceId(body);

            dispatch(getService(userId));
            return result;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateServiceId = createAsyncThunk(
    "services/updateServiceId",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const serviceId = state.myInfo.edited.services.service_id_info;

            if (Object.keys(serviceId).length === 0) {
                return;
            }

            if (serviceId.delete) return;

            const clone = (({ id, ...o }) => o)(serviceId);

            const body = {
                user_id: userId,
                ...clone,
            };

            const result = await ServicesService.update_serviceId(body, serviceId.id);

            dispatch(getService(userId));
            return result;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteServiceId = createAsyncThunk(
    "services/deleteServiceId",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const serviceId = state.myInfo.edited.services.service_id_info;

            if (Object.keys(serviceId).length === 0) {
                return;
            }

            if (!serviceId.delete) return;

            const result = await ServicesService.delete_serviceId(serviceId.id);

            dispatch(getService(userId));
            return result;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createContracts = createAsyncThunk(
    "services/createContracts",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const contracts = state.myInfo.allTabs.services.contracts;

            if (contracts.length === 0) {
                return;
            }

            const promises = contracts
                .filter((item) => !item.delete)
                .map((data) => {
                    const body = {
                        user_id: userId,
                        type: "contract_history",
                        ...data,
                    };

                    return ServicesService.createHistoryContracts(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateContracts = createAsyncThunk(
    "services/updateRank",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const contracts = state.myInfo.edited.services.contracts;

            if (contracts.length === 0) {
                return;
            }

            const promises = contracts
                .filter((item) => !item.delete)
                .map(async (data) => {
                    const clone = (({ contract_type_id, ...o }) => o)(data);

                    const historyBody = {
                        user_id: userId,
                        type: "contract_history",
                        ...clone,
                    };

                    const contractBody = {
                        user_id: userId,
                        type_id: data.contract_type_id,
                    };

                    const updateHistoryPromise = ServicesService.updateContracts(
                        contractBody,
                        data.contract_id,
                    );

                    const updateContractPromise = ServicesService.updateHistories(
                        historyBody,
                        data.id,
                    );

                    const [historyResponse, contractResponse] = await Promise.all([
                        updateHistoryPromise,
                        updateContractPromise,
                    ]);

                    return { historyResponse, contractResponse };
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteContracts = createAsyncThunk(
    "services/deleteContracts",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const contracts = state.myInfo.edited.services.contracts;

            if (contracts.length === 0) {
                return;
            }

            const promises = contracts.map((data) => {
                if (data.delete) return ServicesService.deleteHistories(data.id);
            });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createSecondments = createAsyncThunk(
    "services/createSecondments",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const secondments = state.myInfo.allTabs.services.secondments;

            if (secondments.length === 0) {
                return;
            }

            const promises = secondments
                .filter((item) => !item.delete)
                .map((data) => {
                    const clone = (({ staff_division, staff_division_id, id, ...o }) => o)(data);

                    const body = {
                        user_id: userId,
                        type: "secondment_history",
                        staff_division_id: data.staff_division,
                        ...clone,
                    };
                    return ServicesService.createHistorySecondment(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateSecondments = createAsyncThunk(
    "services/updateSecondments",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const secondments = state.myInfo.edited.services.secondments;

            if (secondments.length === 0) {
                return;
            }

            const promises = secondments
                .filter((item) => !item.delete)
                .map((data) => {
                    const clone = (({ staff_division, id, ...o }) => o)(data);

                    const body = {
                        user_id: userId,
                        type: "secondment_history",
                        ...clone,
                    };
                    return ServicesService.updateSecondment(body, data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteSecondments = createAsyncThunk(
    "services/deleteSecondments",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const secondments = state.myInfo.edited.services.secondments;

            if (secondments.length === 0) {
                return;
            }

            const promises = secondments.map((data) => {
                if (data.delete) return ServicesService.deleteHistories(data.id);
            });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createBadges = createAsyncThunk(
    "services/createBadges",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const awards = state.myInfo.allTabs.services.awards;

            if (awards.length === 0) {
                return;
            }

            const promises = awards
                .filter((item) => !item.delete)
                .map((data) => {
                    if (data.delete) return;
                    const clone = (({ id, name, ...o }) => o)(data);

                    const body = {
                        user_id: userId,
                        type: "badge_history",
                        ...clone,
                    };
                    return ServicesService.createHistoryBadge(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateBadges = createAsyncThunk(
    "services/updateBadges",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const awards = state.myInfo.edited.services.awards;

            if (awards.length === 0) {
                return;
            }
            const promises = awards
                .filter((item) => !item.delete)
                .map(async (data) => {
                    if (data.delete) return;

                    const clone = (({ id, name, nameKZ, ...o }) => o)(data);

                    const body = {
                        user_id: userId,
                        type: "badge_history",
                        ...clone,
                    };

                    return ServicesService.updateBadges(body, data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteBadges = createAsyncThunk(
    "services/deleteBadges",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const awards = state.myInfo.edited.services.awards;

            if (awards.length === 0) {
                return;
            }

            const promises = awards.map((data) => {
                if (data.delete) return ServicesService.deleteHistories(data.id);
            });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createPenalty = createAsyncThunk(
    "services/createPenalty",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const penalties = state.myInfo.allTabs.services.penalties;

            if (penalties.length === 0) {
                return;
            }

            const promises = penalties.map((data) => {
                if (data.delete) return;
                const clone = (({ id, date_to, ...o }) => o)(data);

                const body = {
                    user_id: userId,
                    type: "penalty_history",
                    penalty_type_id: data.status,
                    ...clone,
                };

                return ServicesService.createHistoryPenalty(body);
            });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updatePenalty = createAsyncThunk(
    "services/updatePenalty",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const penalties = state.myInfo.edited.services.penalties;

            if (penalties.length === 0) {
                return;
            }

            const promises = penalties
                .filter((item) => !item.delete)
                .map(async (data) => {
                    if (data.delete) return;

                    const clone = (({ id, date_to, status, ...o }) => o)(data);

                    const body = {
                        user_id: userId,
                        type: "penalty_history",
                        ...clone,
                    };

                    const penaltiesType = {
                        type_id: data.status,
                    };

                    const updateNamePenalty = ServicesService.updatePenalties(
                        penaltiesType,
                        data.penalty_id,
                    );

                    const updatePenalty = ServicesService.updateHistories(body, data.id);

                    const [typeResponse, nameResponse] = await Promise.all([
                        updateNamePenalty,
                        updatePenalty,
                    ]);

                    return { typeResponse, nameResponse };
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deletePenalty = createAsyncThunk(
    "services/deletePenalty",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const penalties = state.myInfo.edited.services.penalties;

            if (penalties.length === 0) {
                return;
            }

            const promises = penalties.map((data) => {
                if (data.delete) return ServicesService.deleteHistories(data.id);
            });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createHoliday = createAsyncThunk(
    "services/createHoliday",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const holidays = state.myInfo.allTabs.services.holidays;

            if (holidays.length === 0) {
                return;
            }

            const promises = holidays.map((data) => {
                if (data.delete) return;
                const clone = (({ id, ...o }) => o)(data);

                const body = {
                    user_id: userId,
                    type: "status_history",
                    status_type_id: data.status,
                    ...clone,
                };

                return ServicesService.createHistoryHoliday(body);
            });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteHoliday = createAsyncThunk(
    "services/deleteHoliday",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const holidays = state.myInfo.edited.services.holidays;

            if (holidays.length === 0) {
                return;
            }

            const promises = holidays
                .filter((item) => item.delete)
                .map((data) => {
                    if (data.delete) return ServicesService.deleteHistories(data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateHoliday = createAsyncThunk(
    "services/updateHoliday",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const holidays = state.myInfo.edited.services.holidays;

            if (holidays.length === 0) {
                return;
            }

            const promises = holidays
                .filter((item) => !item.delete)
                .map(async (data) => {
                    if (data.delete) return;

                    const clone = (({ id, ...o }) => o)(data);

                    const body = {
                        user_id: userId,
                        type: "status_history",
                        status_type_id: data.status,
                        ...clone,
                    };

                    const holidaysType = {
                        user_id: userId,
                        status_name: data.status,
                    };

                    const updateNameHoliday = ServicesService.updateStatus(holidaysType, data.id);

                    const updateHoliday = ServicesService.updateHistories(body, data.id);

                    const [typeResponse, nameResponse] = await Promise.all([
                        updateNameHoliday,
                        updateHoliday,
                    ]);

                    return { typeResponse, nameResponse };
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createAttestation = createAsyncThunk(
    "services/createAttestation",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const attestation = state.myInfo.allTabs.services.attestations;

            if (attestation.length === 0) {
                return;
            }

            const promises = attestation.map((data) => {
                if (data.delete) return;
                const clone = (({ id, ...o }) => o)(data);

                const body = {
                    user_id: userId,
                    type: "attestation",
                    ...clone,
                };

                return ServicesService.create_attestation(body);
            });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateAttestation = createAsyncThunk(
    "services/updateAttestation",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const attestation = state.myInfo.edited.services.attestations;

            if (attestation.length === 0) {
                return;
            }

            const promises = attestation.map((data) => {
                if (data.delete) return;
                const clone = (({ id, ...o }) => o)(data);

                const body = {
                    user_id: userId,
                    type: "attestation",
                    ...clone,
                };

                return ServicesService.updateHistories(body, data.id);
            });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteAttestation = createAsyncThunk(
    "services/deleteAttestation",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const attestations = state.myInfo.edited.services.attestations;

            if (attestations.length === 0) {
                return;
            }

            const promises = attestations
                .filter((item) => item.delete)
                .map((data) => {
                    if (data.delete) return ServicesService.deleteHistories(data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createCoolness = createAsyncThunk(
    "services/createCoolness",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const coolness = state.myInfo.allTabs.services.coolness;

            if (coolness.length === 0) {
                return;
            }

            const promises = coolness
                .filter((item) => !item.delete)
                .map((data) => {
                    const body = {
                        user_id: userId,
                        type: "coolness_history",
                        coolness_status: data.coolness_status_id,
                        coolness_type_id: data.type_id,
                    };

                    return ServicesService.create_coolness(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateCoolness = createAsyncThunk(
    "services/updateCoolness",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const coolness = state.myInfo.edited.services.coolness;

            if (coolness.length === 0) {
                return;
            }

            const promises = coolness
                .filter((item) => !item.delete)
                .map((data) => {
                    const body = {
                        user_id: userId,
                        type: "coolness_history",
                        coolness_status: data.coolness_status_id,
                        type_id: data.type_id,
                    };

                    return ServicesService.update_coolness(body, data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteCoolness = createAsyncThunk(
    "services/deleteCoolness",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const coolness = state.myInfo.edited.services.coolness;

            if (coolness.length === 0) {
                return;
            }

            const promises = coolness
                .filter((item) => item.delete)
                .map((data) => {
                    return ServicesService.delete_coolness(data.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createBeret = createAsyncThunk(
    "services/createBeret",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const beret = state.myInfo.allTabs.services.beret;

            if (!beret.is_badge_black) {
                return;
            }

            const body = {
                date_from: beret.date_from,
                document_number: beret.document_number,
                user_id: userId,
                type: "badge_history",
            };

            const responses = await ServicesService.create_badge(body);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateBeret = createAsyncThunk(
    "services/updateBeret",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const beret = state.myInfo.edited.services.beret;

            if ((!beret.is_badge_black && beret.delete) || Object.keys(beret).length === 0) {
                return;
            }

            const clone = (({ is_badge_black, form, source, id, ...o }) => o)(beret);
            const body = {
                ...clone,
                user_id: userId,
                type: "badge_history",
            };

            const responses = await ServicesService.updateHistories(body, beret.id);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteBeret = createAsyncThunk(
    "services/deleteBeret",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const beret = state.myInfo.edited.services.beret;

            if (!beret.delete) {
                return;
            }

            const responses = await ServicesService.delete_black_beret(beret.id);
            dispatch(getService(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const serviceSlice = createSlice({
    name: "services",
    initialState,
    reducers: {
        deleteByPath: (state, action) => {
            const { path, id } = action.payload;
            const pathParts = path.split(".");
            if (pathParts[pathParts.length - 1] === "service_id_info") {
                state.serviceData.service_id_info = null;
            } else if (pathParts[pathParts.length - 1] === "black_beret") {
                state.serviceData.general_information.black_beret = {};
            } else {
                const target = pathParts.reduce((acc, cur) => acc[cur], state);

                for (let i = 0; i < target.length; i++) {
                    if (target[i].id === id) {
                        target.splice(i, 1);
                        break;
                    }
                }
            }
        },
        setServiceFieldValue: (state, action) => {
            const { fieldPath, value } = action.payload;
            const pathParts = fieldPath.split(".");
            let currentObject = state;

            for (let i = 0; i < pathParts.length - 1; i++) {
                currentObject = currentObject[pathParts[i]];
            }

            currentObject[pathParts[pathParts.length - 1]] = value;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getService.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getService.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            state.serviceData = action.payload;
        });
        builder.addCase(getService.rejected, (state, action) => {
            state.loading = false;
            state.error = "Персональные данные не найдены";
        });
        builder.addCase(getBadgeTypes.fulfilled, (state, action) => {
            state.badge_types = action.payload;
        });
        builder.addCase(getClothingEquipments.fulfilled, (state, action) => {
            state.clothingEquipments = action.payload;
        });
        builder.addCase(getCoolnessHistory.fulfilled, (state, action) => {
            state.coolnessHistory = action.payload;
        });
        builder.addCase(getBlackBeretHistory.fulfilled, (state, action) => {
            state.blackBeretHistory = action.payload;
        });
        builder.addCase(getArmyEquipments.fulfilled, (state, action) => {
            state.armyEquipments = action.payload;
        });
        builder.addCase(getOtherEquipments.fulfilled, (state, action) => {
            state.otherEquipments = action.payload;
        });
        builder.addCase(getAllAvailable.fulfilled, (state, action) => {
            state.allAvailable = action.payload;
        });
        builder.addCase(getMilitaryUnits.fulfilled, (state, action) => {
            state.militaryUnits = action.payload;
        });
        builder.addCase(getAwards.fulfilled, (state, action) => {
            state.awards = action.payload;
        });
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.characteristic = action.payload;
        });
        builder.addCase(getRanks.fulfilled, (state, action) => {
            state.ranks = action.payload;
        });
        builder.addCase(getStaffDivisions.fulfilled, (state, action) => {
            state.staffDivisions = action.payload;
        });
    },
});

export const { services, deleteByPath, setServiceFieldValue } = serviceSlice.actions;

export default serviceSlice.reducer;
