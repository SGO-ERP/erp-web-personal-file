import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import HRVacancyService from '../../../services/vacancy/HRVacancyService';

const currentLocale = localStorage.getItem('lan');

interface surveyState {
    surveyInfo: {
        nameBlock: {
            name: string;
            description: string;
        };
        questions: {
            name: {
                RU: string;
                KZ: string;
            };
            type: string;
            radios: {
                id: string;
                name: string;
                text: string;
                textKZ: string;
                settings: {
                    ru: { reference: string; diagram: string };
                    kz: { reference: string; diagram: string };
                };
            }[];
            checkbox: {
                id: string;
                name: string;
                text: string;
                textKZ: string;
                settings: {
                    ru: { reference: string; diagram: string };
                    kz: { reference: string; diagram: string };
                };
            }[];
            id: number;
            key: number;
            priority: boolean;
        }[];
        settingsInfo: {
            isReport: boolean;
            isAnonym: boolean;
            isDouble: boolean;
            name: string;
            divisionID: [];
            official: string;
            selected: { name: string; id: number }[];
            comp_form_for_id: string;
        };
        calendarInfo: {
            range: any;
            repeat: string;
            time1: any;
            time2: any;
        };
    };
    isLoading: boolean;
    error: any;
}

const initialState: surveyState = {
    surveyInfo: {
        nameBlock: {
            name: '',
            description: '',
        },
        questions: [
            {
                name: {
                    RU: '',
                    KZ: '',
                },
                type: 'Текст',
                radios: [
                    {
                        id: '0.0',
                        name: '',
                        text: '',
                        textKZ: '',
                        settings: {
                            ru: { reference: '', diagram: '' },
                            kz: { reference: '', diagram: '' },
                        },
                    },
                ],
                checkbox: [
                    {
                        id: '0.0',
                        name: '',
                        text: '',
                        textKZ: '',
                        settings: {
                            ru: { reference: '', diagram: '' },
                            kz: { reference: '', diagram: '' },
                        },
                    },
                ],
                id: 0,
                key: 0,
                priority: false,
            },
        ],
        settingsInfo: {
            isReport: false,
            isAnonym: false,
            isDouble: false,
            name: '',
            divisionID: [],
            official: '',
            selected: [],
            // comp_form_for_id - id of user для бланка компетенции (на кого проходить)
            comp_form_for_id: '',
        },
        calendarInfo: {
            range: {},
            repeat: 'never',
            time1: '',
            time2: '',
        },
    },
    isLoading: false,
    error: null,
};

export const getByDepartmentId = createAsyncThunk(
    'vacancies/getByDepartmentId',
    async (id: string) => {
        const response = await HRVacancyService.getByDepartmentId(id);
        return response;
    },
);

export const time = [
    { id: 1, time: '06:00' },
    { id: 2, time: '06:30' },
    { id: 3, time: '07:00' },
    { id: 4, time: '07:30' },
    { id: 5, time: '08:00' },
    { id: 6, time: '08:30' },
    { id: 7, time: '09:00' },
    { id: 8, time: '09:30' },
    { id: 9, time: '10:00' },
    { id: 10, time: '10:30' },
    { id: 11, time: '11:00' },
    { id: 12, time: '11:30' },
    { id: 13, time: '12:00' },
    { id: 14, time: '12:30' },
    { id: 15, time: '13:00' },
    { id: 16, time: '13:30' },
    { id: 17, time: '14:00' },
    { id: 18, time: '14:30' },
    { id: 19, time: '15:00' },
    { id: 20, time: '15:30' },
    { id: 21, time: '16:00' },
    { id: 22, time: '16:30' },
    { id: 23, time: '17:00' },
    { id: 24, time: '17:30' },
    { id: 25, time: '18:00' },
    { id: 26, time: '18:30' },
    { id: 27, time: '19:00' },
    { id: 28, time: '19:30' },
    { id: 29, time: '20:00' },
    { id: 30, time: '20:30' },
    { id: 31, time: '21:00' },
    { id: 32, time: '21:30' },
    { id: 33, time: '22:00' },
];

export const surveysSlice = createSlice({
    name: 'surveysSlice',
    initialState,
    reducers: {
        addName: (state, action) => {
            state.surveyInfo.nameBlock.name = action.payload;
        },
        setCompFormForId: (state, action) => {
            state.surveyInfo.settingsInfo.comp_form_for_id = action.payload;
        },
        addNewQuestion: (state, action) => {
            const index = state.surveyInfo.questions.length - 1;
            const id =
                state.surveyInfo.questions[index]?.id !== undefined
                    ? state.surveyInfo.questions[index]?.id + 1
                    : 0;

            state.surveyInfo.questions.push({
                name: {
                    RU: '',
                    KZ: '',
                },
                type: 'Текст',
                radios: [
                    {
                        id: `${id}.0`,
                        name: '',
                        text: '',
                        textKZ: '',
                        settings: {
                            ru: { reference: '', diagram: '' },
                            kz: { reference: '', diagram: '' },
                        },
                    },
                ],
                checkbox: [
                    {
                        id: `${id}.0`,
                        name: '',
                        text: '',
                        textKZ: '',
                        settings: {
                            ru: { reference: '', diagram: '' },
                            kz: { reference: '', diagram: '' },
                        },
                    },
                ],
                id: id,
                key: action.payload.id,
                priority: false,
            });
        },
        deleteNewQuestion: (state, action) => {
            state.surveyInfo.questions = state.surveyInfo.questions.filter(
                (question) => question.key !== action.payload.id,
            );
        },
        addQuestionName: (state, action) => {
            state.surveyInfo.questions.forEach((question) => {
                if (question.id === action.payload.id) {
                    if (action.payload.lang === 'KZ') {
                        question.name.KZ = action.payload.name;
                    } else {
                        question.name.RU = action.payload.name;
                    }
                }
            });
        },
        addQuestionType: (state, action) => {
            state.surveyInfo.questions.forEach((question) => {
                if (action.payload.id === question.id) {
                    question.type = action.payload.type;
                }
            });
        },
        clearQuestionType: (state, action) => {
            state.surveyInfo.questions.forEach((question) => {
                if (action.payload === question.id) {
                    question.radios = [
                        {
                            id: `${action.payload}.0`,
                            name: 'Вариант 1',
                            text: '',
                            textKZ: '',
                            settings: {
                                ru: { reference: '', diagram: '' },
                                kz: { reference: '', diagram: '' },
                            },
                        },
                    ];
                    question.checkbox = [
                        {
                            id: `${action.payload}.0`,
                            name: 'Вариант 1',
                            text: '',
                            textKZ: '',
                            settings: {
                                ru: { reference: '', diagram: '' },
                                kz: { reference: '', diagram: '' },
                            },
                        },
                    ];
                }
            });
        },
        addQuestionRadio: (state, action) => {
            state.surveyInfo.questions.forEach((question) => {
                if (action.payload.id === question.id) {
                    question.radios.push({
                        id: `${action.payload.id}.${question.radios.length}`,
                        name: action.payload.radio,
                        text: action.payload.text,
                        textKZ: action.payload.textKZ,
                        settings: action.payload.settings,
                    });
                }
            });
        },
        addTextQuestionRadio: (state, action) => {
            state.surveyInfo.questions.forEach((question) => {
                if (action.payload.id === question.id) {
                    question.radios.forEach((radio) => {
                        if (radio.id === action.payload.radioID) {
                            if (action.payload.lang == 'ru') {
                                radio.text = action.payload.text;
                            } else {
                                radio.textKZ = action.payload.text;
                            }
                        }
                    });
                }
            });
        },
        addQuestionBox: (state, action) => {
            state.surveyInfo.questions.forEach((question) => {
                if (action.payload.id === question.id) {
                    question.checkbox.push({
                        id: `${action.payload.id}.${question.checkbox.length}`,
                        name: action.payload.box,
                        text: action.payload.text,
                        textKZ: action.payload.textKZ,
                        settings: action.payload.settings,
                    });
                }
            });
        },
        addTextQuestionBox: (state, action) => {
            state.surveyInfo.questions.forEach((question) => {
                if (action.payload.id === question.id) {
                    question.checkbox.forEach((box) => {
                        if (box.id === action.payload.boxID) {
                            if (action.payload.lang == 'ru') {
                                box.text = action.payload.text;
                            } else {
                                box.textKZ = action.payload.text;
                            }
                        }
                    });
                }
            });
        },
        addQuestionDescription: (state, action) => {
            state.surveyInfo.questions.forEach((question) => {
                if (action.payload.id.split('.')[0] == question.id) {
                    const which = action.payload.which == 'radios' ? 'radios' : 'checkbox';
                    const setting = action.payload.type == 'diagram' ? 'diagram' : 'reference';
                    const lang = action.payload.lang == 'ru' ? 'ru' : 'kz';
                    question[which].forEach((item: any) => {
                        if (item.id === action.payload.id) {
                            item.settings[lang][setting] = action.payload.text;
                        }
                    });
                }
            });
        },
        addQuestionPriority: (state, action) => {
            state.surveyInfo.questions.forEach((question) => {
                if (action.payload.id === question.id) {
                    question.priority = action.payload.priority;
                }
            });
        },
        addSettingsSurveyTo: (state, action) => {
            state.surveyInfo.settingsInfo.name = action.payload;
        },
        addSettingsDivision: (state, action) => {
            state.surveyInfo.settingsInfo.divisionID = action.payload;
        },
        addSettingsService: (state, action) => {
            state.surveyInfo.settingsInfo.official = action.payload;
        },
        addSettingsSelected: (state, action) => {
            state.surveyInfo.settingsInfo.selected.push(action.payload);
        },
        deleteSettingsSelected: (state, action) => {
            state.surveyInfo.settingsInfo.selected = state.surveyInfo.settingsInfo.selected.filter(
                (item: any) => item.id !== action.payload,
            );
        },
        clearSettings: (state) => {
            state.surveyInfo.settingsInfo.name = '';
            state.surveyInfo.settingsInfo.divisionID = [];
            state.surveyInfo.settingsInfo.official = '';
        },
        addCheckboxPoll: (state, action) => {
            if (action.payload.type === 'report') {
                state.surveyInfo.settingsInfo.isReport = action.payload.bool;
            } else if (action.payload.type === 'anonym') {
                state.surveyInfo.settingsInfo.isAnonym = action.payload.bool;
            } else {
                state.surveyInfo.settingsInfo.isDouble = action.payload.bool;
            }
        },
        addCalendarData: (state, action) => {
            state.surveyInfo.calendarInfo = action.payload;
        },
        resetSlice: () => {
            return initialState;
        },
    },
});

export const {
    addName,
    addNewQuestion,
    deleteNewQuestion,
    addQuestionName,
    addQuestionType,
    clearQuestionType,
    addQuestionRadio,
    addTextQuestionRadio,
    addQuestionBox,
    addTextQuestionBox,
    addQuestionDescription,
    addQuestionPriority,
    addSettingsSurveyTo,
    addSettingsDivision,
    addSettingsService,
    addSettingsSelected,
    deleteSettingsSelected,
    clearSettings,
    addCheckboxPoll,
    addCalendarData,
    resetSlice,
    setCompFormForId,
} = surveysSlice.actions;

export default surveysSlice.reducer;
