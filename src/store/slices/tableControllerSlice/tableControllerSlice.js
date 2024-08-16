import { createSlice } from '@reduxjs/toolkit';

export const Tabs = {
    letter: 'letter',
    history: 'history',
    draft: 'draft',
    candidates: 'candidates',
};

export const initialState = {
    showHideSecondCard: false,
    showStepsModal: false,
    showHideThirdCard: false,
    userCard: {},
    currentTab: Tabs.letter,
    currentPage: 1,
    pageSize: 5,
    commenMoodal: false,
    searchValue: '',
    modalSecondCard: false,
};

export const tableControllerSlice = createSlice({
    name: 'tableController',
    initialState,
    reducers: {
        showHideSecondCardAction: (state, action) => {
            state.showHideSecondCard = !state.showHideSecondCard;
            state.userCard = action.payload;
        },
        notShowHideSecondCard: (state, action) => {
            state.showHideSecondCard = false;
            state.modalSecondCard = false;
            state.userCard = action.payload;
        },

        showHideThirdCardAction: (state, action) => {
            state.showHideThirdCard = !state.showHideThirdCard;
            state.userCard = action.payload;
        },
        notShowHideThirdCard: (state, action) => {
            state.showHideThirdCard = false;
            state.userCard = action.payload;
        },

        changeTabAction(state, action) {
            state.currentTab = action.payload;
        },
        changeCurrentPage(state, action) {
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
        showHideCommentModal(state, action) {
            state.commenMoodal = action.payload;
        },
        querySearch(state, action) {
            state.searchValue = action.payload;
        },
    },
});

export const {
    changeTabAction,
    showHideSecondCardAction,
    showHideCommentModal,
    showStepsModal,
    showHideThirdCardAction,
    notShowHideThirdCard,
    changeCurrentPage,
    querySearch,
    notShowHideSecondCard,
} = tableControllerSlice.actions;

export default tableControllerSlice.reducer;
