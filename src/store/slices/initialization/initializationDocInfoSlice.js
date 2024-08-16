import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    kzError: "Мәтінді жүктеу мәселелері",
    ruError: "Проблемы с загрузкой текста",
    textKz: "",
    textRu: "",
    textLanguage: true,
    twoLanguage: false,
    isPositionChange: false,
    tagsInfo: [],
    tagsValue: {},
    dueDate: null,
    comment: "",
    steps: {},
    stepsArray: {},
    stepsToSend: {},
    needSteps: false,
    loading: true,
};

export const initializationDocInfoSlice = createSlice({
    name: "initializationDocInfo",
    initialState,
    reducers: {
        setPositionChange: (state, action) => {
            state.isPositionChange = action.payload;
        },
        setText: (state, action) => {
            const { value, lang } = action.payload;
            state[`text${lang === "kz" ? "Kz" : "Ru"}`] = value;
        },
        setLanguage: (state, action) => {
            state.textLanguage = action.payload;
        },
        setTextLanguage: (state, action) => {
            state.textLanguage = action.payload;
        },
        setTwoLanguage: (state, action) => {
            state.twoLanguage = action.payload;
        },
        setTags: (state, action) => {
            state.tagsInfo = action.payload;
        },
        setValueTags: (state, action) => {
            state.tagsValue = action.payload;
        },
        setTagsOptions: (state, action) => {
            const filteredStaffUnits = action.payload.value.filter(
                (unit) => unit.users.length === 0,
            );
            const updatedTagsInfo = state.tagsInfo.map((tag) => {
                if (tag.titleRU === action.payload.key) {
                    return { ...tag, options: filteredStaffUnits };
                }
                return tag;
            });
            state.tagsInfo = updatedTagsInfo;
        },
        setSteps: (state, action) => {
            const { id, val } = action.payload;
            state.steps[id] = val;
        },
        setStepsArray: (state, action) => {
            state.stepsArray = action.payload;
        },
        setStepsToSend: (state, action) => {
            state.stepsToSend = action.payload;
        },
        setNeedSteps: (state, action) => {
            state.needSteps = action.payload;
        },
        setDueDate: (state, action) => {
            state.dueDate = action.payload;
        },
        setComment: (state, action) => {
            state.comment = action.payload;
        },
        resetValueTags: (state) => {
            state.tagsValue = {};
        },
        resetDocInfo: () => {
            return initialState;
        },
    },
});

export const {
    setPositionChange,
    setText,
    setTags,
    setLanguage,
    setTextLanguage,
    setTwoLanguage,
    setValueTags,
    setTagsOptions,
    setSteps,
    setStepsArray,
    setStepsToSend,
    setNeedSteps,
    setDueDate,
    setComment,
    resetValueTags,
    resetDocInfo,
} = initializationDocInfoSlice.actions;

export default initializationDocInfoSlice.reducer;
