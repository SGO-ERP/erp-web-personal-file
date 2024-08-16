import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ActionsService from 'services/ActionsService';
import DocumentStaffFunctionTypeService from 'services/DocumentStaffFunctionTypeService';
import HrDocumentTemplatesService from 'services/HrDocumentTemplatesService';
import JurisdictionsService from 'services/JurisdictionsService';

export const initialState = {
    actionsArr: [],
    isEdited: false,
    tagModal: false,
    tagModalPick: false,
    hiddenTagModal: false,
    error: '',
    editUser: {},
    isLoading: true,
    orderTemplates: [],
    orderTemplate: {
        name: '',
        nameKZ: '',
        description: '',
        descriptionKZ: '',
        text: '',
        subject_type: '',
        addTextStep: '',
        cases: '',
        templateIsCreating: false,
        addTextStepAnotherLanguage: '',
        properties: {},
        editProperties: [
            {
                id: Date.now().toString(),
                name: null,
                tags: [],
                selectedChildren: [],
                properties: [],
            },
        ],
        editedProperties: [
            {
                id: Date.now().toString(),
                name: null,
                tags: [],
                selectedChildren: [],
                properties: [],
            },
        ],
        newEditedProperties: [
            {
                id: Date.now().toString(),
                action_name: null,
                action_type: null,
                tags: [],
            },
        ],

        needAnotherLanguageVariant: false,
    },
    step: 0,
    canMoveToNextStep: false,
    options: [],
    addDocModal: false,
    addUserModal: false,
    showTextEditor: false,
    usersArray: [],
    staffUnitsIds: [],
    deleted: false,
    isHiddenTag: false,
};

export const getHrDocumentsTemplates = createAsyncThunk(
    'hrDocument/fetchDocuments',
    async (_, { dispatch, thunkAPI }) => {
        const response = await HrDocumentTemplatesService.get_hr_documents_template();
        return response;
    },
);

export const actionsTemplate = createAsyncThunk(
    'hrDocument/fetchDocumentsActions',
    async (_, { dispatch, thunkAPI }) => {
        const response = await ActionsService.get_actions();
        return response;
    },
);

export const getHrDocumentsTemplateById = createAsyncThunk(
    'hrDocument/fetchDocumentsById',
    async (id, { dispatch, thunkAPI }) => {
        const response = await HrDocumentTemplatesService.get_hr_documents_template_by_id(id);
        return response;
    },
);

export const deleteHrDocumentsTemplateById = createAsyncThunk(
    'hrDocument/deleteDocumentsById',
    async (id, { dispatch, thunkAPI }) => {
        return await HrDocumentTemplatesService.delete_hr_documents_template_by_id(id);
    },
);

export const postHrDocumentTemplate = createAsyncThunk(
    'hrDocument/postHrDocumentTemplate',
    async ({ template, steps, staffUnitsIds, autoUser }, { dispatch }) => {
        try {
            const response = await HrDocumentTemplatesService.post_hr_template(template);
            dispatch(
                postHrDocumentSteps({
                    steps: steps,
                    orderTemplate: response,
                    unitIds: staffUnitsIds,
                    autoUser: autoUser,
                }),
            );

            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
);

export const postHrDocumentSteps = createAsyncThunk(
    'hrDocument/postHrDocumentSteps',
    async ({ steps, orderTemplate, unitIds, autoUser }, { dispatch }) => {
        try {
            const response = await JurisdictionsService.get_jurisdictions();
            const jurisdictionId = response.find((item) => item.name === 'Вся служба').id;
            for (let i = 0; i < steps.length; i++) {
                if (autoUser[i] !== null) {
                    if (typeof autoUser[i] === 'boolean') {
                        await DocumentStaffFunctionTypeService.post_document_staff_function({
                            name: steps[i].role + ' ' + orderTemplate.name,
                            hours_per_week: 3,
                            priority: steps[i].key,
                            role_id: steps[i].roleId,
                            jurisdiction_id: jurisdictionId,
                            hr_doc_id: orderTemplate.id,
                            is_direct_supervisor: autoUser[i],
                            category: null,
                        });
                    } else {
                        await DocumentStaffFunctionTypeService.post_document_staff_function({
                            name: steps[i].role + ' ' + orderTemplate.name,
                            hours_per_week: 3,
                            priority: steps[i].key,
                            role_id: steps[i].roleId,
                            jurisdiction_id: jurisdictionId,
                            hr_doc_id: orderTemplate.id,
                            is_direct_supervisor: null,
                            category: autoUser[i],
                        });
                    }
                } else {
                    await DocumentStaffFunctionTypeService.post_document_staff_constructor({
                        name: steps[i].role + ' ' + orderTemplate.name,
                        hours_per_week: 3,
                        priority: steps[i].key,
                        role_id: steps[i].roleId,
                        jurisdiction_id: jurisdictionId,
                        hr_doc_id: orderTemplate.id,
                        staff_unit_id: unitIds[i],
                    });
                }
            }
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
);

export const postHrDocumentTemplateAutoUser = createAsyncThunk(
    'hrDocument/postHrDocumentTemplateAutoUser',
    async ({ template, steps, staffUnitsIds, is_direct_supervisor }, { dispatch }) => {
        try {
            const response = await HrDocumentTemplatesService.post_hr_template(template);
            dispatch(
                postHrDocumentStepsAutoUser({
                    steps: steps,
                    orderTemplate: response,
                    staffUnitsIds: staffUnitsIds,
                    is_direct_supervisor: is_direct_supervisor,
                }),
            );
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
);

export const postHrDocumentStepsAutoUser = createAsyncThunk(
    'hrDocument/postHrDocumentStepsAutoUser',
    async ({ steps, orderTemplate, unitIds, autoUser }, { dispatch }) => {
        try {
            const response = await JurisdictionsService.get_jurisdictions();
            //find me item with name 'Вся служба' and get id
            const jurisdictionId = response.find((item) => item.name === 'Вся служба').id;

            for (let i = 0; i < steps.length; i++) {
                await DocumentStaffFunctionTypeService.post_document_staff_function({
                    name: steps[i].role + ' ' + orderTemplate.name,
                    hours_per_week: 3,
                    priority: steps[i].key,
                    role_id: steps[i].roleId,
                    jurisdiction_id: jurisdictionId,
                    hr_doc_id: orderTemplate.id,
                    staff_unit_id: unitIds[i],
                    is_direct_supervisor: autoUser,
                });
            }

            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
);

const someFunc = (arr, id) => {
    for (let item of arr) {
        if (item.unitId !== undefined) {
            if (item.value === id) {
                return item.unitId;
            }
        }

        if (item.children !== undefined) {
            const result = someFunc(item.children, id);
            if (result) {
                return result;
            }
        }
    }
};

export const ordersConstructorSlice = createSlice({
    name: 'ordersConstructor',
    initialState,
    reducers: {
        changeIsEdited: (state, action) => {
            state.isEdited = action.payload;
        },
        spentEditUser: (state, action) => {
            state.editUser = action.payload;
        },
        changeIsHiddenTag: (state, action) => {
            state.isHiddenTag = action.payload;
        },
        showTagModal: (state, action) => {
            state.tagModal = action.payload;
        },
        showTagModalPick: (state, action) => {
            state.tagModalPick = action.payload;
        },
        showHiddenTagModal: (state, action) => {
            state.hiddenTagModal = action.payload;
        },
        setSubjectType: (state, action) => {
            state.orderTemplate.subject_type = action.payload;
        },
        showAddDoc: (state, actions) => {
            state.addDocModal = actions.payload;
        },
        showAddUser: (state, actions) => {
            state.addUserModal = actions.payload;
        },
        saveTextStep: (state, actions) => {
            state.orderTemplate.addTextStep = actions.payload;
        },
        saveTextStepAnotherLanguage: (state, actions) => {
            state.orderTemplate.addTextStepAnotherLanguage = actions.payload;
        },
        showTextStep: (state, actions) => {
            state.showTextEditor = actions.payload;
        },
        setOrderTemplateName: (state, action) => {
            state.orderTemplate.name = action.payload;
        },
        setOrderTemplateNameKz: (state, action) => {
            state.orderTemplate.nameKZ = action.payload;
        },
        setOrderTemplateDescriptionKz: (state, action) => {
            state.orderTemplate.descriptionKZ = action.payload;
        },
        setOrderTemplateDescription: (state, action) => {
            state.orderTemplate.description = action.payload;
        },
        addUserInfo: (state, action) => {
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
        changeUserInfo: (state, action) => {
            state.usersArray = state.usersArray.filter(
                (arr) => JSON.stringify(arr) !== JSON.stringify(action.payload),
            );
        },
        setCanMoveToNextStep: (state, action) => {
            state.canMoveToNextStep = action.payload;
        },
        saveStaffUnitsId: (state, action) => {
            // state.staffUnitsIds = action.payload;
        },
        clearUserInfo: (state, action) => {
            state.usersArray = [];
        },
        addOrderTemplateProperty: (state, action) => {
            const newProperties = JSON.parse(JSON.stringify(state.orderTemplate.properties));
            newProperties[action.payload.tagname] = {
                alias_name: action.payload.alias_name,
                data_taken: action.payload.data_taken,
                id: action.payload.id,
                selectedWord: action.payload.selectedWord,
                properties: action.payload.properties,
                idToChange: action.payload.id,
                tagname: action.payload.tagname,
                title: action.payload.title,
                titleKZ: action.payload.titleKZ,
                isHidden: action.payload.isHidden,
                input_format: action.payload.input_format,
                directory: action.payload.directory,
                field_name: action.payload.field_name,
                foundInText: action.payload.foundInText,
                cases: action.payload.cases,
            };
            state.orderTemplate.properties = newProperties;
        },
        changeOrderTemplateProperty: (state, action) => {
            const idToChange = action.payload.id;
            const updatedProperties = {};
            for (const key in state.orderTemplate.properties) {
                if (Object.prototype.hasOwnProperty.call(state.orderTemplate.properties, key)) {
                    if (state.orderTemplate.properties[key].id === idToChange) {
                        const newKey = action.payload.tagname;
                        updatedProperties[newKey] = {
                            tagname: action.payload.tagname,
                            cases: action.payload.cases,
                            alias_name: action.payload.alias_name,
                            title: action.payload.title,
                            titleKZ: action.payload.titleKZ,
                            id: action.payload.id,
                            idToChange: action.payload.id,
                            data_taken: action.payload.data_taken,
                            input_format: action.payload.input_format,
                            field_name: action.payload.field_name,
                            isHidden: action.payload.isHidden,
                            directory: action.payload.directory,
                            foundInText: false,
                        };
                    } else {
                        updatedProperties[key] = state.orderTemplate.properties[key];
                    }
                    if (action.payload.tagname !== state.orderTemplate.properties[key].tagname) {
                        delete state.orderTemplate.properties[key];
                    }
                }
            }

            state.orderTemplate.properties = updatedProperties;
        },
        changeTitleAnotherLanguage: (state, action) => {
            state.orderTemplate.properties[action.payload.tagname].title_another_language =
                action.payload.title_another_language;
        },
        changeTitle: (state, action) => {
            state.orderTemplate.properties[action.payload.tagname].title = action.payload.title;
            state.orderTemplate.properties[action.payload.tagname].titleKZ = action.payload.titleKZ;
        },
        changeFoundInText: (state, action) => {
            state.orderTemplate.properties[action.payload.tagname].foundInText =
                action.payload.foundInText;
        },
        changeIsHidden: (state, action) => {
            state.orderTemplate.properties[action.payload.tagname].isHidden =
                action.payload.isHidden;
        },
        addDateAnotherLanguage: (state, action) => {
            const newProperties = JSON.parse(JSON.stringify(state.orderTemplate.properties));
            newProperties[action.payload.tagname] = {
                ...state.orderTemplate.properties[action.payload.tagname],
                alias_name_another_language: action.payload.wordToReplace,
                title_another_language: action.payload.title_another_language,
                foundInText: action.payload.foundInText,
            };
            state.orderTemplate.properties = newProperties;
        },
        removeOrderTemplateProperty: (state, action) => {
            const idToRemove = action.payload.id;
            const updatedProperties = {};
            const updatedEditProperties = [];
            for (const key in state.orderTemplate.properties) {
                if (Object.prototype.hasOwnProperty.call(state.orderTemplate.properties, key)) {
                    if (state.orderTemplate.properties[key].idToChange !== idToRemove) {
                        updatedProperties[key] = state.orderTemplate.properties[key];
                    }
                }
            }

            for (const key2 in state.orderTemplate.properties) {
                if (key2 !== action.payload.tagname) {
                    updatedEditProperties.push(state.orderTemplate.properties[key2]);
                }
            }

            state.orderTemplate.properties = updatedProperties;
            state.orderTemplate.editProperties = updatedEditProperties;
        },

        setNeedAnotherLanguageVariant: (state, action) => {
            state.orderTemplate.needAnotherLanguageVariant = action.payload;
        },
        setStep(state, action) {
            state.step = action.payload;
        },
        removeActions(state, action) {
            console.log(action);
        },
        saveActions(state, action) {
            let count = 1;

            if (action.payload.arg.name !== null) {
                state.orderTemplate.editedProperties = action.payload.arg;
            } else {
                state.orderTemplate.editedProperties = [action.payload.arg];
            }

            for (let iitem in state.orderTemplate.properties) {
                let new2 = Object.assign({}, state.orderTemplate.properties[iitem]);
                let newP = Object.assign({}, state.orderTemplate.properties[iitem].properties);
            }

            if (Array.isArray(action.payload.arg)) {

                for (let actionArg of action.payload.arg) {
                    for (let argKey in actionArg.properties) {
                        for (let stateKey in state.orderTemplate.properties) {
                            if (
                                actionArg.properties[argKey].field_name ===
                                state.orderTemplate.properties[stateKey].field_name
                            ) {
                                for (let editProp of state.orderTemplate.editedProperties) {
                                    for (let key2 in editProp.properties) {
                                        if (
                                            editProp.properties[key2] !== undefined &&
                                            editProp.properties[key2].alias_name ===
                                                actionArg.properties[argKey].alias_name
                                        ) {
                                            if (
                                                !state.orderTemplate.properties[stateKey][
                                                    'properties'
                                                ]
                                            ) {
                                                state.orderTemplate.properties[stateKey][
                                                    'properties'
                                                ] = {};
                                            }

                                            state.orderTemplate.properties[stateKey]['properties'][
                                                'to_tags'
                                            ] = {
                                                tagname:
                                                    state.orderTemplate.properties[stateKey]
                                                        .tagname,
                                                isHidden:
                                                    state.orderTemplate.properties[stateKey]
                                                        .isHidden,
                                                title: state.orderTemplate.properties[stateKey]
                                                    .title,
                                                titleKZ:
                                                    state.orderTemplate.properties[stateKey]
                                                        .titleKZ,
                                                idToChange: (Date.now() + Number(count)).toString(),
                                                id: (Date.now() + Number(count)).toString(),
                                                foundInText:
                                                    state.orderTemplate.properties[stateKey]
                                                        .foundInText,
                                                action_type:
                                                    state.orderTemplate.editedProperties.map(
                                                        (el) => {
                                                            for (let key3 in el.properties) {
                                                                if (
                                                                    el.properties[key3]
                                                                        .alias_name ===
                                                                    state.orderTemplate.properties[
                                                                        stateKey
                                                                    ].properties.alias_name
                                                                ) {
                                                                    return el.action_type;
                                                                }
                                                            }
                                                        },
                                                    ),
                                                cases: state.orderTemplate.properties[stateKey]
                                                    .cases,
                                            };

                                            count = count + 1;

                                            for (let itm of actionArg.tags) {
                                                if (
                                                    itm[stateKey] !== undefined &&
                                                    state.orderTemplate.properties[stateKey]
                                                        .tagname == stateKey
                                                ) {
                                                    state.orderTemplate.properties[stateKey][
                                                        'properties'
                                                    ]['alias_name'] =
                                                        itm[stateKey].alias_name !== undefined
                                                            ? itm[stateKey].alias_name
                                                            : editProp.properties[key2].alias_name;
                                                    state.orderTemplate.properties[stateKey][
                                                        'properties'
                                                    ]['alias_nameKZ'] =
                                                        itm[stateKey].alias_nameKZ !== undefined
                                                            ? itm[stateKey].alias_nameKZ
                                                            : editProp.properties[key2]
                                                                  .alias_nameKZ;
                                                    state.orderTemplate.properties[stateKey][
                                                        'properties'
                                                    ]['type'] = actionArg.properties[argKey].type;
                                                    state.orderTemplate.properties[stateKey][
                                                        'properties'
                                                    ]['data_taken'] =
                                                        state.orderTemplate.properties[stateKey]
                                                            .data_taken === undefined
                                                            ? itm[stateKey].data_taken
                                                            : state.orderTemplate.properties[
                                                                  stateKey
                                                              ].data_taken;
                                                    state.orderTemplate.properties[stateKey][
                                                        'properties'
                                                    ]['field_name'] =
                                                        itm[stateKey].field_name === undefined
                                                            ? state.orderTemplate.properties[
                                                                  stateKey
                                                              ].field_name
                                                            : itm[stateKey].field_name;
                                                    state.orderTemplate.properties[stateKey][
                                                        'properties'
                                                    ]['data_type'] =
                                                        state.orderTemplate.properties[
                                                            stateKey
                                                        ].input_format;
                                                    state.orderTemplate.properties[stateKey][
                                                        'properties'
                                                    ]['isHidden'] =
                                                        state.orderTemplate.properties[
                                                            stateKey
                                                        ].isHidden;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // find some properties and remove it
            let stateProp = state.orderTemplate.properties;
            let actionKey = action.payload.key;
            let foundProperty = null;
            if (actionKey !== null) {
                for (let statePropKey in stateProp) {
                    if (statePropKey == actionKey) {
                        foundProperty = stateProp[statePropKey].properties;
                    }
                }
            }

            if (foundProperty !== null) {
                for (let statePropKey in stateProp) {
                    if (
                        stateProp[statePropKey].properties &&
                        stateProp[statePropKey].properties.alias_name &&
                        foundProperty.alias_name === stateProp[statePropKey].properties.alias_name
                    ) {
                        if (statePropKey !== actionKey) {
                            state.orderTemplate.properties[statePropKey].properties = {
                                to_tags: stateProp[statePropKey].properties.to_tags,
                            };
                        }
                    }
                }
            }
        },
        resetEditedProperties(state) {
            state.orderTemplate.editedProperties = [
                {
                    id: Date.now().toString(),
                    name: null,
                    tags: [],
                    selectedChildren: [],
                    properties: [],
                },
            ];
        },
        setTemplateOptions(state, action) {
            state.orderTemplate.subject_type = action.payload.subject_type;
            state.orderTemplate.name = action.payload.name;
            state.orderTemplate.descriptionKZ = action.payload.descriptionKZ;
            state.orderTemplate.nameKZ = action.payload.nameKZ;
        },
        setTemplateOptionsKz(state, action) {
            state.orderTemplate.subject_type = action.payload.subject_type;
            state.orderTemplate.description = action.payload.description;
        }, // RESET ME ALL FIELDS
        resetConstructor(state) {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHrDocumentsTemplates.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getHrDocumentsTemplates.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.orderTemplates = action.payload;
            })
            .addCase(getHrDocumentsTemplates.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.orderTemplates = [];
            })
            .addCase(actionsTemplate.fulfilled, (state, action) => {
                state.actionsArr = action.payload;
            })
            .addCase(getHrDocumentsTemplateById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getHrDocumentsTemplateById.fulfilled, (state, action) => {
                let props = {};
                let count = 1;


                for (let key in action.payload.properties) {
                    props[key] = {
                        alias_name: action.payload.properties[key].alias_name,
                        data_taken: action.payload.properties[key].data_taken,
                        id: (Date.now() + Number(count)).toString(),
                        idToChange: (Date.now() + Number(count)).toString(),
                        tagname: key,
                        title: action.payload.properties[key].to_tags.title,
                        titleKZ: action.payload.properties[key].to_tags.titleKZ,
                        isHidden: action.payload.properties[key].to_tags.isHidden,
                        input_format:
                            action.payload.properties[key].to_tags.input_format == undefined
                                ? action.payload.properties[key].data_type
                                : action.payload.properties[key].to_tags.input_format,
                        directory: action.payload.properties[key].to_tags.directory,
                        field_name: action.payload.properties[key].field_name,
                        foundInText: action.payload.properties[key].to_tags.foundInText,
                        properties: action.payload.properties[key],
                    };
                    count++;
                }

                state.isLoading = false;
                state.error = '';
                state.orderTemplate = {
                    needAnotherLanguageVariant: action.payload.path !== null,
                    name: action.payload.name,
                    nameKZ: action.payload.nameKZ,
                    subject_type: action.payload.subject_type,
                    description: action.payload.description,
                    descriptionKZ: action.payload.descriptionKZ,
                    id: action.payload.id,
                    path: action.payload.path,
                    pathKz: action.payload.pathKZ,
                    actions: action.payload.actions,
                    editedProperties: [
                        {
                            id: Date.now().toString(),
                            name: null,
                            tags: [],
                            selectedChildren: [],
                            properties: [],
                        },
                    ],
                    editProperties: action.payload.properties,
                    properties: props,
                };
            })
            .addCase(getHrDocumentsTemplateById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.orderTemplates = [];
            })
            .addCase(postHrDocumentSteps.pending, (state) => {
                state.templateIsCreating = true;
            })
            .addCase(postHrDocumentSteps.fulfilled, (state, action) => {
                state.templateIsCreating = false;
                state.error = '';
            })
            .addCase(postHrDocumentSteps.rejected, (state, action) => {
                state.templateIsCreating = false;
                state.error = action.payload;
                state = initialState;
            })
            .addCase(postHrDocumentStepsAutoUser.pending, (state) => {
                state.templateIsCreating = true;
            })
            .addCase(postHrDocumentStepsAutoUser.fulfilled, (state, action) => {
                state.templateIsCreating = false;
                state.error = '';
            })
            .addCase(postHrDocumentStepsAutoUser.rejected, (state, action) => {
                state.templateIsCreating = false;
                state.error = action.payload;
                state = initialState;
            })
            .addCase(deleteHrDocumentsTemplateById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteHrDocumentsTemplateById.fulfilled, (state) => {
                state.isLoading = false;
                state.deleted = true;
                state.error = '';
            })
            .addCase(deleteHrDocumentsTemplateById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    showTagModal,
    changeIsHiddenTag,
    showTagModalPick,
    showHiddenTagModal,
    addArg,
    deleteArg,
    clearArgArr,
    showAddDoc,
    showAddUser,
    setSubjectType,
    saveTextStep,
    changeUserInfo,
    saveTextStepAnotherLanguage,
    showTextStep,
    addUserInfo,
    setOrderTemplateDescriptionKz,
    setOrderTemplateNameKz,
    changeIsHidden,
    deleteUserInfo,
    clearUserInfo,
    setOrderTemplateName,
    changeTitleAnotherLanguage,
    changeTitle,
    changeIsEdited,
    setCanMoveToNextStep,
    changeFoundInText,
    setOrderTemplateDescription,
    removeOrderTemplateProperty,
    removeActions,
    spentEditUser,
    addOrderTemplateProperty,
    changeOrderTemplateProperty,
    saveStaffUnitsId,
    setTemplateOptionsKz,
    setNeedAnotherLanguageVariant,
    setStep,
    saveActions,
    changeUserKey,
    setTemplateOptions,
    addDateAnotherLanguage,
    resetConstructor,
} = ordersConstructorSlice.actions;

export default ordersConstructorSlice.reducer;
