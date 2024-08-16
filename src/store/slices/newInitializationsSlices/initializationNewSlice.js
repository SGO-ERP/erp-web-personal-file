import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HrDocumentTemplatesService from "services/HrDocumentTemplatesService";
import UserService from "services/UserService";

export const initialState = {
    isLoading: false,
    error: null,
    hrDocumentsTemplates: null,
    documentTemplate: {},
    needRusLanguage: false,
    changeOnRus: false,
    textApiKZ: null,
    textApiRU: null,
    users: [],
    lastFetchedUsers: [],
    selectUser: {},
    selectUserInitials: {},
    itemsValue: {},
    userDisable: true,
    collectProperties: [],
    propertiesToSend: [],
    collectItems: [],
    //true - kz
    orderLanguage: true,
    textes: {
        kz: null,
        ru: null,
    },
    initButtonDisable: true,
    dueDate: null,
    needDueDate: false,
    comment: null,
    needComment: false,
    steps: {},
    stepsArray: {},
    stepsToSend: {},
    needSteps: false,
    needCounting: false,

    isPositionChange: false,
};

//запрос получение всех доступных документов
export const fetchDocuments = createAsyncThunk(
    "hrDocument/fetchDocuments",
    async (id, { dispatch, thunkAPI }) => {
        const response = await HrDocumentTemplatesService.get_hr_documents_template_by_user_id(id);
        return response;
    },
);

export const fetchUsers = createAsyncThunk(
    "hrDocument/fetchUsers",
    async ({ id, text, skip, limit }, { dispatch, thunkAPI }) => {
        try {
            return await UserService.info_user(id, text ? text : "", skip, limit);
        } catch (e) {
            console.error(e);
        }
    },
);
export const fetchPositionChangeUsers = createAsyncThunk(
    "hrDocument/fetchPositionChangeUsers",
    async ({ id, text, skip, limit }, { dispatch, thunkAPI }) => {
        try {
            return await UserService.position_change_users(id, text ? text : "", skip, limit);
        } catch (e) {
            console.error(e);
        }
    },
);

export const initializationNewSlice = createSlice({
    name: "initializationNew",
    initialState,
    reducers: {
        //добавление выброного документа и заполнение контента
        getDocument: (state, action) => {
            state.documentTemplate = action.payload;
            state.needComment = action.payload.is_initial_comment_required;
            state.needDueDate = action.payload.is_due_date_required;
            state.userDisable = false;

            if (action.payload && action.payload.path) {
                state.needRusLanguage = true;
                state.textApiRU = action.payload.path;
            }

            if (action.payload.pathKZ && action.payload.pathKZ.length > 0) {
                state.textApiKZ = action.payload.pathKZ;
            }

            const actions = Object.keys(action.payload.actions.args[0]);
            state.isPositionChange = actions.includes("position_change");
        },
        getUser: (state, action) => {
            state.selectUser = action.payload[0];
        },
        getNeedSteps: (state, action) => {
            state.needSteps = action.payload;
        },
        getProperties: (state, action) => {
            state.collectProperties = action.payload;
        },
        pushProperties: (state, action) => {
            const isDuplicate = state.collectProperties.some(
                (property) => property.wordInOrder === action.payload.wordInOrder,
            );

            if (!isDuplicate) {
                state.collectProperties.push(action.payload);
            }
        },
        deleteProperties: (state, action) => {
            state.collectProperties = state.collectProperties.filter(
                (property) => property.key !== action.payload,
            );
        },
        changesDropdownProperties: (state, action) => {
            state.collectItems.forEach((item) => {
                if (item.tagName === action.payload.tagName) {
                    item.dropdownItems = action.payload.options;
                }
            });
        },
        changeNamesProperties: (state, action) => {
            state.collectProperties.forEach((item) => {
                if (item.wordInOrder === action.payload.tagName) {
                    item.newWord = action.payload.transformedText;
                    item.newWordKZ = action.payload.transformedTextKZ;
                    item.ids = action.payload.ids;
                } else if (item.wordInOrder === action.payload.wordInOrder) {
                    if (action.payload.transformedTextKZ && action.payload.transformedText) {
                        item.newWordKZ = action.payload.transformedTextKZ;
                        item.newWord = action.payload.transformedText;
                    } else if (state.orderLanguage) {
                        item.newWordKZ = action.payload.transformedTextKZ || " ";
                    } else {
                        item.newWord = action.payload.transformedText || " ";
                    }
                }
            });
        },
        addItem: (state, action) => {
            const isDuplicate = state.collectItems.some(
                (property) => property.inputVal === action.payload.inputVal,
            );

            if (!isDuplicate) {
                state.collectItems.push(action.payload);
            }

            state.needCounting = true;
        },
        deleteItem: (state, action) => {
            state.collectItems = state.collectItems.filter((item) => item.id !== action.payload);
            state.collectProperties = state.collectProperties.filter(
                (item) => item.key !== action.payload,
            );

            state.needCounting = false;
        },
        getItems: (state, action) => {
            state.collectItems = action.payload;
        },
        setItemValue: (state, action) => {
            const { id, name, nameKZ } = action.payload;
            let existingItem = state.itemsValue[id];

            // If name is not empty, update, else keep old value
            let updatedName = name !== " " ? name : existingItem?.name || "";

            // If nameKZ is not empty, update, else keep old value
            let updatedNameKZ = nameKZ !== " " ? nameKZ : existingItem?.nameKZ || "";

            if (
                !existingItem ||
                existingItem.name !== updatedName ||
                existingItem.nameKZ !== updatedNameKZ
            ) {
                state.itemsValue[id] = { name: updatedName, nameKZ: updatedNameKZ };
            }
        },
        removeItem: (state, action) => {
            const { [action.payload]: _, ...newItemValue } = state.itemsValue;
            state.itemsValue = newItemValue;
        },
        clearItemValue: (state) => {
            state.itemsValue = {};
        },
        changeButton: (state, action) => {
            state.initButtonDisable = action.payload;
        },
        changeText: (state, action) => {
            if (action.payload.lang === "kz") {
                state.textes.kz = action.payload.text;
            } else {
                state.textes.ru = action.payload.text;
            }
        },
        getDueDate: (state, action) => {
            state.dueDate = action.payload;
        },
        getComment: (state, action) => {
            state.comment = action.payload;
        },
        getStepsArray: (state, action) => {
            state.stepsArray = action.payload;
        },
        getStepsToSend: (state, action) => {
            state.stepsToSend = action.payload;
        },
        getPropertiesToSend: (state, action) => {
            state.propertiesToSend = action.payload;
        },
        getInitials: (state, action) => {
            state.selectUserInitials = action.payload;
        },
        getSteps: (state, action) => {
            const { id, val } = action.payload;
            state.steps[id] = val;
        },
        resetSliceByUser: (state) => {
            return {
                ...initialState,
                hrDocumentsTemplates: state.hrDocumentsTemplates,
                needRusLanguage: state.needRusLanguage,
                changeOnRus: state.changeOnRus,
                textApiKZ: state.textApiKZ,
                textApiRU: state.textApiRU,
                documentTemplate: state.documentTemplate,
                textes: state.textes,
                userDisable: state.userDisable,
                collectItems: state.collectItems,
            };
        },
        resetSliceByOrder: () => {
            return initialState;
        },
        changeLangOrder: (state, action) => {
            state.changeOnRus = action.payload;
            state.orderLanguage = !action.payload;
        },
        resetUsers: (state) => {
            state.users = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDocuments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.hrDocumentsTemplates = action.payload;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hrDocumentsTemplates = [];
            })
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.lastFetchedUsers = action.payload.users;
                const newUsers = action.payload.users;

                // Use a JavaScript Set to filter out duplicates
                // This assumes each user has a unique 'id' field
                state.users = Array.from(
                    new Set([...state.users, ...newUsers].map((user) => user.id)),
                ).map((id) => {
                    // return the first found user by this id:
                    return (
                        newUsers.find((user) => user.id === id) ||
                        state.users.find((user) => user.id === id)
                    );
                });
            })

            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.users = [];
            })
            .addCase(fetchPositionChangeUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPositionChangeUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.lastFetchedUsers = action.payload;
                const newUsers = action.payload;

                // Use a JavaScript Set to filter out duplicates
                // This assumes each user has a unique 'id' field
                state.users = Array.from(
                    new Set([...state.users, ...newUsers].map((user) => user.id)),
                ).map((id) => {
                    // return the first found user by this id:
                    return (
                        newUsers.find((user) => user.id === id) ||
                        state.users.find((user) => user.id === id)
                    );
                });
            })

            .addCase(fetchPositionChangeUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.users = [];
            });
    },
});

export const {
    getDocument,
    getUser,
    getProperties,
    addItem,
    deleteItem,
    getItems,
    pushProperties,
    changeNamesProperties,
    changesDropdownProperties,
    changeText,
    changeButton,
    setItemValue,
    removeItem,
    clearItemValue,
    getDueDate,
    getComment,
    getStepsArray,
    getStepsToSend,
    getSteps,
    getPropertiesToSend,
    resetSliceByUser,
    resetSliceByOrder,
    deleteProperties,
    getInitials,
    getNeedSteps,
    changeLangOrder,
    resetUsers,
} = initializationNewSlice.actions;

export default initializationNewSlice.reducer;
