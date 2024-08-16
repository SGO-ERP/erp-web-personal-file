import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    cascaderValue: [],
    cascaderValue2: [],
    language: false,
    spinTagsCard: false,
    candidateUser: '',
    candidateDoc: '',
    languageCheck: false,
    newSteps: {},
};

export const initializationSlice = createSlice({
    name: 'initialization',
    initialState,
    reducers: {
        addNewSteps: (state, action) => {
            const obj1 = state.newSteps;
            const newObj2 = { ...action.payload };

            if (Object.keys(obj1).length > 0) {
                const updatedSteps = {};
                for (const key in obj1) {
                    if (newObj2[key] !== obj1[key] && !Array.isArray(obj1[key])) {
                        updatedSteps[key] = obj1[key];
                    }
                }
                state.newSteps = { ...newObj2, ...updatedSteps };
            } else {
                state.newSteps = newObj2;
            }
        },
        cascaderChanges: (state, action) => {
            state.cascaderValue = action.payload;
        },
        cascaderChanges2: (state, action) => {
            state.cascaderValue2 = action.payload;
        },
        changeLanguage: (state, action) => {
            state.language = action.payload;
        },
        spinnigTags: (state, action) => {
            state.spinTagsCard = action.payload;
        },
        selectCandidatesUser: (state, action) => {
            state.candidateUser = action.payload;
        },
        selectCandidatesDoc: (state, action) => {
            state.candidateDoc = action.payload;
        },
        saveLanguageCheck: (state, action) => {
            state.languageCheck = action.payload;
        },
        updateCascaderState: (state, action) => {
            state.cascaderValue = {
                ...state.cascaderValue,
                [action.payload.id]: action.payload.value,
            };
        },
    },
});

export const {
    cascaderChanges,
    cascaderChanges2,
    changeLanguage,
    spinnigTags,
    selectCandidatesUser,
    selectCandidatesDoc,
    addNewSteps,
    saveLanguageCheck,
    updateCascaderState,
} = initializationSlice.actions;

export default initializationSlice.reducer;
