import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import DocumentStaffFunctionTypeService from "services/DocumentStaffFunctionTypeService";
import HrDocumentTemplatesService from "services/HrDocumentTemplatesService";
import HrDocumentsStepsService from "services/HrDocumentsStepsService";
import JurisdictionsService from "services/JurisdictionsService";
import FileUploaderService from "services/myInfo/FileUploaderService";

export const initialState = {
    page: 0,
    orderTemplate: {
        name: "",
        nameKZ: "",
        person: null,
        description: "",
        descriptionRU: "",
        needRuLanguage: false,
        needComment: false,
        needDueDate: false,
        textKZ: "",
        textRU: "",
    },
    tagsInfoArray: [],
    changeID: null,
    tagModal: false,
    docModal: false,
    pickTagModal: false,
    actionsCard: [{ id: 0, actions: {}, properties: {}, actionsValue: {} }],
    usersArray: [],
    addUserModal: false,
    editUser: {},
    errorResponse: true,
    isHidden: false,
    deleted: false,
    canDraft: false,
    stepsArr: [],
};

export const postHrDocumentTemplate = createAsyncThunk(
    "hrDocument/postHrDocumentTemplate",
    async ({ template, steps, staffUnitsIds, autoUser }, { dispatch }) => {
        try {
            const response = await HrDocumentTemplatesService.post_hr_template(template);
            await dispatch(
                postHrDocumentSteps({
                    steps: steps,
                    orderTemplate: response,
                    unitIds: staffUnitsIds,
                    autoUser: autoUser,
                }),
            );

            return response;
        } catch (error) {
            initialState.errorResponse = true;
            console.error(error);
            throw error;
        }
    },
);

export const postHrDocumentSteps = createAsyncThunk(
    "hrDocument/postHrDocumentSteps",
    async ({ steps, orderTemplate, unitIds, autoUser }, { dispatch }) => {
        try {
            const response = await JurisdictionsService.get_jurisdictions();
            const jurisdictionId = response.find((item) => item.name === "Вся служба").id;
            for (let i = 0; i < steps.length; i++) {
                const obj = {
                    name: steps[i].role + " " + orderTemplate.name,
                    hours_per_week: 3,
                    priority: steps[i].key,
                    role_id: steps[i].roleId,
                    jurisdiction_id: jurisdictionId,
                    hr_doc_id: orderTemplate.id,
                };
                if (autoUser[i] !== null) {
                    const updatedObj = {
                        ...obj,
                        is_direct_supervisor: typeof autoUser[i] === "boolean" ? autoUser[i] : null,
                        category: typeof autoUser[i] === "boolean" ? autoUser[i] : null,
                    };
                    const response =
                        await DocumentStaffFunctionTypeService.post_document_staff_function(
                            updatedObj,
                        );
                    await DocumentStaffFunctionTypeService.add_document_staff_function(
                        steps[i].position,
                        [response.id],
                    );
                } else {
                    const updatedObj = {
                        ...obj,
                        staff_unit_id: unitIds[i],
                    };
                    await DocumentStaffFunctionTypeService.post_document_staff_constructor(
                        updatedObj,
                    );
                }
            }
            return response;
        } catch (error) {
            console.error(error);
            initialState.errorResponse = true;
            throw error;
        } finally {
            initialState.errorResponse = false;
        }
    },
);

export const getHrDocumentsTemplateById = createAsyncThunk(
    "hrDocuments/getHrDocumentsTemplateById",
    async (id, { dispatch, getState }) => {
        try {
            const response = await HrDocumentTemplatesService.get_hr_documents_template_by_id(id); // Assuming you're calling an API

            let file, fileRU;

            try {
                file = await FileUploaderService.getFileByLink(response.pathKZ);
            } catch (error) {
                console.error("Error fetching file:", error);
                file = "Error in file api";
            }

            try {
                fileRU = await FileUploaderService.getFileByLink(response.path);
            } catch (error) {
                console.error("Error fetching fileRU:", error);
                // Handle error if needed
            }

            const [text, textRU] = await Promise.all([
                file === "Error in file api" ? file : file.text(),
                fileRU ? fileRU.text() : "",
            ]);

            response.orderTemplate = {
                name: response?.name,
                nameKZ: response?.nameKZ,
                person: response.subject_type,
                description: response?.description?.nameKZ || "",
                descriptionRU: response?.description?.name || "",
                needRuLanguage: response.path ? true : false,
                needComment: response?.is_initial_comment_required,
                needDueDate: response?.is_due_date_required,
                textKZ: text || "",
                textRU: textRU || "",
            };

            return response; // this will be the `action.payload` in the fulfilled reducer case
        } catch (e) {
            console.log(e);
        }
    },
);

export const deleteHrDocumentsTemplateById = createAsyncThunk(
    "hrDocument/deleteDocumentsById",
    async (id, { dispatch, thunkAPI }) => {
        return await HrDocumentTemplatesService.delete_hr_documents_template_by_id(id);
    },
);

export const getStepsDocumentById = createAsyncThunk(
    "hrDocument/getStepsDocument",
    async (id, { dispatch, thunkAPI }) => {
        return await HrDocumentsStepsService.get_document_step(id);
    },
);

export const constructorNewSlice = createSlice({
    name: "constructorNew",
    initialState,
    reducers: {
        changePage: (state, action) => {
            state.page = action.payload;
        },
        setOrderName: (state, action) => {
            state.orderTemplate.name = action.payload;
        },
        setOrderNameKZ: (state, action) => {
            state.orderTemplate.nameKZ = action.payload;
        },
        setOrderPerson: (state, action) => {
            state.orderTemplate.person = action.payload;
        },
        setOrderDescription: (state, action) => {
            state.orderTemplate.description = action.payload;
        },
        setOrderDescriptionRU: (state, action) => {
            state.orderTemplate.descriptionRU = action.payload;
        },
        saveTextKZ: (state, action) => {
            state.orderTemplate.textKZ = action.payload;
        },
        saveTextRU: (state, action) => {
            state.orderTemplate.textRU = action.payload;
        },
        // addTagToText: (state, action) => {

        // },
        setLanguage: (state, action) => {
            state.orderTemplate.needRuLanguage = action.payload;
        },
        setComment: (state, action) => {
            state.orderTemplate.needComment = action.payload;
        },
        setDate: (state, action) => {
            state.orderTemplate.needDueDate = action.payload;
        },
        showTagModal: (state, action) => {
            state.tagModal = action.payload;
        },
        showAddDoc: (state, action) => {
            state.docModal = action.payload;
        },
        showPickTagModal: (state, action) => {
            state.pickTagModal = action.payload;
        },
        setTags: (state, action) => {
            state.tagsInfoArray.push(action.payload);
        },
        deleteTagsInfo: (state, action) => {
            state.tagsInfoArray = state.tagsInfoArray.filter((tag) => tag.id !== action.payload);
        },
        addRusTags: (state, action) => {
            state.tagsInfoArray.forEach((tag) => {
                if (tag.tagname === action.payload.tagname) {
                    tag.alias_name = action.payload.alias_name;
                    tag.prevWordRU = action.payload.prev;
                }
            });
        },
        addActionsToTag: (state, action) => {
            state.tagsInfoArray.forEach((tag) => {
                if (
                    tag.tagname !== action.payload.tagname &&
                    tag.actionId === action.payload.id &&
                    tag.actions.alias_name === action.payload.actions.alias_name
                ) {
                    delete tag.actions;
                    delete tag.actionId;
                    delete tag.actionNames;
                }

                if (tag.tagname === action.payload.tagname) {
                    tag.actions = action.payload.actions;
                    tag.actionId = action.payload.id;
                    tag.propertyId = action.payload.propertyId;
                    tag.actionNames = action.payload.actionNames;
                }
            });
        },
        addAutoFields: (state, action) => {
            state.tagsInfoArray.forEach((tag) => {
                if (tag.tagname === action.payload.tagname) {
                    tag.auto_fields = action.payload;
                }
            });
        },
        deleteActionsInTag: (state, action) => {
            state.tagsInfoArray.forEach((tag) => {
                if (tag.actionId === action.payload.id) {
                    delete tag.actions;
                    delete tag.actionId;
                }
            });
        },
        addActionCard: (state, action) => {
            state.actionsCard.forEach((card) => {
                if (card.id === action.payload.id) {
                    card.actions = action.payload.data.actions;
                    card.properties = action.payload.data.properties;
                    card.actionsValue = {
                        name: action.payload.data.action_name,
                        nameKZ: action.payload.data.action_nameKZ,
                    };
                }
            });
        },
        addEmptyCard: (state, action) => {
            state.actionsCard.push({
                id: state.actionsCard[state.actionsCard.length - 1].id + 1,
                actions: {},
                properties: {},
            });
        },
        deleteActionCard: (state, action) => {
            state.actionsCard = state.actionsCard.filter((card) => card.id !== action.payload);
        },
        clearActionCard: (state, action) => {
            state.actionsCard = state.actionsCard.map((card) => {
                if (card.id === action.payload.id) {
                    return {
                        id: action.payload.id,
                        actions: {},
                        properties: {},
                    };
                }
                return card;
            });
            // After clearing, delete the next action card
            state.actionsCard = state.actionsCard.filter(
                (card) => card.id !== action.payload.id + 1,
            );
        },
        addUserInfo: (state, action) => {
            const idx = state.usersArray.findIndex((e) => e.id === action.payload.id);

            if (idx !== -1) {
                state.usersArray.splice(idx, 1);
            }

            const itemExists = state.usersArray.some(
                (user) => user.key !== -1 && user.key === action.payload.key,
            );

            if (!itemExists) {
                if (action.payload.key === 1) {
                    state.usersArray = [action.payload, ...state.usersArray];
                } else if (action.payload.key === 100) {
                    state.usersArray = [...state.usersArray, action.payload];
                } else {
                    const insertIndex = state.usersArray.findIndex(
                        (user) => user.key > action.payload.key,
                    );
                    if (insertIndex !== -1) {
                        state.usersArray.splice(insertIndex, 0, action.payload);
                    } else {
                        state.usersArray.push(action.payload);
                    }
                }
            }
        },
        changeUserKey: (state, action) => {
            const { from, to } = action.payload;
            const userToUpdate = state.usersArray.find((user) => user.key === from);

            if (userToUpdate) {
                const updatedUser = { ...userToUpdate, key: to };
                const otherUsers = state.usersArray.filter((user) => user.key !== from);

                let num = to;

                state.usersArray = [
                    ...otherUsers.map((user) => {
                        if (user.key !== 100 && user.key !== -1 && user.key !== 1) {
                            if (user.key === num) {
                                num++;
                                return { ...user, key: num };
                            }
                        }
                        return user;
                    }),
                    updatedUser,
                ].sort((a, b) => a.key - b.key);
            }
        },
        deleteUserInfo: (state, action) => {
            state.usersArray = state.usersArray.filter(
                (arr) => JSON.stringify(arr) !== JSON.stringify(action.payload),
            );
        },
        showAddUser: (state, actions) => {
            state.addUserModal = actions.payload;
        },
        spentEditUser: (state, action) => {
            state.editUser = action.payload;
        },
        clearEditUser: (state, action) => {
            state.editUser = {};
        },
        changeIsHiddenTag: (state, action) => {
            state.isHidden = action.payload;
        },
        resetSlice: () => {
            return { ...initialState, page: 0 };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHrDocumentsTemplateById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getHrDocumentsTemplateById.fulfilled, (state, action) => {
                if (action.payload.is_draft) {
                    state.canDraft = true;
                }
                state.orderTemplate = action.payload.orderTemplate;
                const keys = Object.keys(action.payload.properties);
                const haveAction = keys.some((key) => {
                    return action.payload.properties[key]?.to_tags?.actions !== undefined;
                });

                if (haveAction) {
                    state.actionsCard = [];
                }

                keys.map((key, index) => {
                    state.tagsInfoArray.push({
                        tagname: key,
                        alias_name: action.payload.properties[key].alias_name,
                        alias_nameKZ: action.payload.properties[key].alias_nameKZ,
                        isHidden: action.payload.properties[key]?.to_tags?.isHidden,
                        id: index,
                        data_taken: action.payload.properties[key].data_taken,
                        directory: action.payload.properties[key]?.to_tags?.directory || null,
                        input_format: action.payload.properties[key]?.data_type || null,
                        cases:
                            action.payload.properties[key]?.to_tags?.cases !== undefined
                                ? action.payload.properties[key]?.to_tags?.cases
                                : null,
                        field_name: action.payload.properties[key]?.field_name || null,
                        prevWordKZ: action.payload.properties[key]?.to_tags?.prevWordKZ,
                        prevWordRU: action.payload.properties[key]?.to_tags?.prevWordRU,
                    });

                    if (action.payload.properties[key]?.to_tags?.actions !== undefined) {
                        const actionToAdd = action.payload.properties[key]?.to_tags?.actions[0];
                        if (actionToAdd) {
                            if (!state.actionsCard.some((card) => card.id === actionToAdd.id)) {
                                state.actionsCard.push(actionToAdd);
                            }

                            Object.keys(actionToAdd.properties).map((key) => {
                                const aliasName = actionToAdd.properties[key].alias_name;

                                if (aliasName === state.tagsInfoArray[index].alias_name) {
                                    state.tagsInfoArray[index].actions =
                                        actionToAdd.properties[key];

                                    state.tagsInfoArray[index].actionId = actionToAdd.id;
                                    state.tagsInfoArray[index].actionNames = {
                                        name: actionToAdd.actionsValue.name,
                                        nameKZ: actionToAdd.actionsValue.nameKZ,
                                    };
                                    const mainKey = Object.keys(actionToAdd.actions.args[0]);

                                    Object.keys(actionToAdd.actions.args[0][mainKey]).map(
                                        (keyIn, indexIn) => {
                                            if (
                                                action.payload.actions.args[0][mainKey][keyIn]
                                                    .tagname === state.tagsInfoArray[index].tagname
                                            ) {
                                                state.tagsInfoArray[index].propertyId = indexIn;
                                            }
                                        },
                                    );
                                }
                            });
                        }
                    }
                });
                state.isLoading = false;
            })
            .addCase(getHrDocumentsTemplateById.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteHrDocumentsTemplateById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteHrDocumentsTemplateById.fulfilled, (state) => {
                state.isLoading = false;
                state.deleted = true;
                state.error = "";
            })
            .addCase(deleteHrDocumentsTemplateById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getStepsDocumentById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStepsDocumentById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stepsArr = action.payload;
                state.error = "";
            })
            .addCase(getStepsDocumentById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    changePage,
    setOrderName,
    setOrderNameKZ,
    setOrderPerson,
    setOrderDescription,
    setOrderDescriptionRU,
    saveTextKZ,
    saveTextRU,
    setLanguage,
    setComment,
    setDate,
    showTagModal,
    showAddDoc,
    showPickTagModal,
    setTags,
    deleteTagsInfo,
    addRusTags,
    addActionsToTag,
    addAutoFields,
    deleteActionsInTag,
    addActionCard,
    addEmptyCard,
    deleteActionCard,
    clearActionCard,
    addUserInfo,
    changeUserKey,
    deleteUserInfo,
    showAddUser,
    spentEditUser,
    clearEditUser,
    changeIsHiddenTag,
    resetSlice,
} = constructorNewSlice.actions;

export default constructorNewSlice.reducer;
