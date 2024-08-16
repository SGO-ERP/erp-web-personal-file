import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EducationService from "../../../services/myInfo/EducationService";

let initialState = {
    educationData: {
        data: [],
        loading: true,
        error: "",
    },
    institutionDegreeType: {
        data: [],
        loading: true,
        error: "",
    },
    specialties: {
        data: [],
        loading: true,
        error: "",
    },
    languages: {
        data: [],
        loading: true,
        error: "",
    },
    sciences: {
        data: [],
        loading: true,
        error: "",
    },
    institutions: {
        data: [],
        loading: true,
        error: "",
    },
    institutionsMilitary: {
        data: [],
        loading: true,
        error: "",
    },
    course_provider: {
        data: [],
        loading: true,
        error: "",
    },
    academic_degree: {
        data: [],
        loading: true,
        error: "",
    },
    academic_title_degree: {
        data: [],
        loading: true,
        error: "",
    },
};

export const getEducation = createAsyncThunk(
    "education/getEducation",
    async (userId, { rejectedWithValue }) => {
        try {
            return await EducationService.get_education(userId);
        } catch (e) {
            return rejectedWithValue(e.response.data);
        }
    },
);
export const getInstitutionDegreeType = createAsyncThunk(
    "education/getInstitutionDegreeType",
    async (_, thunkAPI) => {
        try {
            return await EducationService.get_institution_degree_types();
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    },
);
export const getSpecialties = createAsyncThunk("education/getSpecialties", async (_, thunkAPI) => {
    try {
        return await EducationService.get_specialties();
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response.data);
    }
});
export const getLanguages = createAsyncThunk("education/getLanguages", async (_, thunkAPI) => {
    try {
        return await EducationService.get_language();
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response.data);
    }
});
export const getSciences = createAsyncThunk("education/getSciences", async (_, thunkAPI) => {
    try {
        return await EducationService.get_sciences();
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response.data);
    }
});
export const getInstitution = createAsyncThunk("education/getInstitution", async (_, thunkAPI) => {
    try {
        return await EducationService.get_institutions();
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response.data);
    }
});
export const getInstitutionMilitary = createAsyncThunk(
    "education/militaryEducation",
    async (_, thunkAPI) => {
        try {
            return await EducationService.get_institutions_military();
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    },
);
export const getCourseProviders = createAsyncThunk(
    "education/getCourseProvider",
    async (_, thunkAPI) => {
        try {
            return await EducationService.get_course_provider();
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    },
);
export const getAcademicDegreeType = createAsyncThunk(
    "education/getAcademicDegreeType",
    async (_, thunkAPI) => {
        try {
            return await EducationService.get_academic_degree_types();
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    },
);
export const getAcademicTitleDegreeType = createAsyncThunk(
    "education/getAcademicTitleDegreeType",
    async (_, thunkAPI) => {
        try {
            return await EducationService.get_academic_title_degree();
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    },
);

export const createEducation = createAsyncThunk(
    "education/createSportDegrees",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const add_education = state.myInfo.allTabs.education.add_education;

            if (add_education.length === 0) {
                return;
            }
            const promises = add_education
                .filter((item) => !item.delete)
                .map((education) => {
                    const clone = (({ id, source, ...o }) => o)(education);
                    const body = {
                        ...clone,
                        profile_id: state.education.educationData.data.id,
                        start_date: education.start_date.toISOString().substring(0, 10),
                        end_date: education.end_date.toISOString().substring(0, 10),
                        date_of_issue: education.date_of_issue.toISOString().substring(0, 10),
                    };
                    return EducationService.post_add_education(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateEducation = createAsyncThunk(
    "education/updateEducation",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const educations = state.myInfo.edited.education.add_education;

            if (educations.length === 0) {
                return;
            }
            const promises = educations
                .filter((item) => !item.delete)
                .map((education) => {
                    const clone = (({ id, source, ...o }) => o)(education);
                    const body = {
                        ...clone,
                    };
                    return EducationService.update_education(body, education.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const deleteEducation = createAsyncThunk(
    "education/deleteEducation",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const add_education = state.myInfo.edited.education.add_education;

            if (add_education.length === 0) {
                return;
            }
            const promises = add_education
                .filter((item) => item.delete)
                .map((add_education) => {
                    return EducationService.delete_add_education(add_education.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createCourse = createAsyncThunk(
    "education/createCourse",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const add_course = state.myInfo.allTabs.education.add_course;

            if (add_course.length === 0) {
                return;
            }
            const promises = add_course
                .filter((course) => !course.delete)
                .map((course) => {
                    const cloneData = course;

                    const body = {
                        ...cloneData,
                        profile_id: state.education.educationData.data.id,
                        start_date: course.start_date.toISOString().substring(0, 10),
                        end_date: course.end_date.toISOString().substring(0, 10),
                    };

                    return EducationService.post_add_course(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateCourse = createAsyncThunk(
    "education/updateCourse",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const courses = state.myInfo.edited.education.add_course;

            if (courses.length === 0) {
                return;
            }
            const promises = courses
                .filter((course) => !course.delete)
                .map((course) => {
                    const clone = (({ id, end_date, start_date, ...o }) => o)(course);

                    const body = {
                        ...clone,
                        profile_id: state.education.educationData.data.id,
                        end_date: course.end_date.toISOString().substring(0, 10),
                        start_date: course.start_date.toISOString().substring(0, 10),
                    };

                    return EducationService.update_course(body, course.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const deleteCourse = createAsyncThunk(
    "education/deleteCourse",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const add_course = state.myInfo.edited.education.add_course;

            if (add_course.length === 0) {
                return;
            }

            const promises = add_course
                .filter((course) => course.delete)
                .map((course) => {
                    return EducationService.delete_add_course(course.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createLanguage = createAsyncThunk(
    "education/createLanguage",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const add_language = state.myInfo.allTabs.education.add_language;

            if (add_language.length === 0) {
                return;
            }
            const promises = add_language
                .filter((item) => !item.delete)
                .map((language) => {
                    const clone = (({ id, ...o }) => o)(language);
                    const body = {
                        level: language.level,
                        profile_id: state.education.educationData.data.id,
                        ...clone,
                    };
                    return EducationService.post_add_language(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateLanguage = createAsyncThunk(
    "education/updateCourse",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const languages = state.myInfo.edited.education.add_language;

            if (languages.length === 0) {
                return;
            }
            const promises = languages
                .filter((item) => !item.delete)
                .map((language) => {
                    const clone = (({ id, ...o }) => o)(language);
                    const body = {
                        ...clone,
                    };
                    return EducationService.update_language(body, language.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);

export const deleteLanguage = createAsyncThunk(
    "education/deleteLanguage",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const add_language = state.myInfo.edited.education.add_language;

            if (add_language.length === 0) {
                return;
            }

            const promises = add_language
                .filter((item) => item.delete)
                .map((add_language) => {
                    return EducationService.delete_add_language(add_language.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createAcademicDegree = createAsyncThunk(
    "education/createAcademicDegree",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const add_academic_degree = state.myInfo.allTabs.education.add_academic_degree;

            if (add_academic_degree.length === 0) {
                return;
            }
            const promises = add_academic_degree
                .filter((item) => !item.delete)
                .map((academic_degree) => {
                    const body = {
                        degree_id: academic_degree.degree_id,
                        science_id: academic_degree.science_id,
                        specialty_id: academic_degree.specialty_id,
                        document_number: academic_degree.document_number,
                        document_link: academic_degree.document_link,
                        assignment_date: academic_degree.date.toISOString().substring(0, 10),
                        profile_id: state.education.educationData.data.id,
                    };
                    return EducationService.post_add_academic_degrees(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateAcademicDegree = createAsyncThunk(
    "education/updateAcademicDegree",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const degrees = state.myInfo.edited.education.add_academic_degree;

            if (degrees.length === 0) {
                return;
            }
            const promises = degrees
                .filter((item) => !item.delete)
                .map((degree) => {
                    const clone = (({ id, ...o }) => o)(degree);
                    const body = {
                        ...clone,
                        assignment_date: degree.assignment_date.toISOString().substring(0, 10),
                    };
                    return EducationService.update_academic_degree(body, degree.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const deleteAcademicDegree = createAsyncThunk(
    "education/deleteAcademicDegree",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const add_academic_degree = state.myInfo.edited.education.add_academic_degree;

            if (add_academic_degree.length === 0) {
                return;
            }
            const promises = add_academic_degree
                .filter((item) => item.delete)
                .map((add_academic_degree) => {
                    return EducationService.delete_academic_degree(add_academic_degree.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const createAcademicTitle = createAsyncThunk(
    "education/createAcademicDegree",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const add_academic_title = state.myInfo.allTabs.education.add_academic_title;

            if (add_academic_title.length === 0) {
                return;
            }
            const promises = add_academic_title
                .filter((item) => !item.delete)
                .map((academic_title) => {
                    const body = {
                        degree_id: academic_title.degree_id,
                        specialty_id: academic_title.specialty_id,
                        document_number: academic_title.document_number,
                        document_link: academic_title.document_link,
                        assignment_date: academic_title.assignment_date
                            .toISOString()
                            .substring(0, 10),
                        profile_id: state.education.educationData.data.id,
                    };
                    return EducationService.post_add_academic_title(body);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const updateAcademicTitle = createAsyncThunk(
    "education/updateAcademicTitle",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const titles = state.myInfo.edited.education.add_academic_title;

            if (titles.length === 0) {
                return;
            }
            const promises = titles
                .filter((item) => !item.delete)
                .map((title) => {
                    const clone = (({ id, ...o }) => o)(title);
                    const body = {
                        ...clone,
                        assignment_date: title.assignment_date.toISOString().substring(0, 10),
                    };
                    return EducationService.update_academic_title(body, title.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    },
);
export const deleteAcademicTitle = createAsyncThunk(
    "education/deleteAcademicTitle",
    async (userId, { dispatch, getState }) => {
        try {
            const state = getState();
            const add_academic_title = state.myInfo.edited.education.add_academic_title;

            if (add_academic_title.length === 0) {
                return;
            }
            const promises = add_academic_title
                .filter((item) => item.delete)
                .map((add_academic_title) => {
                    return EducationService.delete_academic_title(add_academic_title.id);
                });

            const responses = await Promise.all(promises);
            dispatch(getEducation(userId));
            return responses;
        } catch (e) {
            throw new Error(e);
        }
    },
);

export const educationSlice = createSlice({
    name: "education",
    initialState,
    reducers: {
        deleteByPathEducation: (state, action) => {
            const { path, id } = action.payload;
            const pathParts = path.split(".");
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
        builder.addCase(getEducation.pending, (state) => {
            state.educationData.loading = true;
        });
        builder.addCase(getEducation.fulfilled, (state, action) => {
            state.educationData.loading = false;
            state.educationData.error = "";
            state.educationData.data = action.payload;
        });
        builder.addCase(getEducation.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING

            state.educationData.loading = false;
            state.educationData.error = action.payload;

            state.educationData.error = "Данные об образовании не найдены";
        });
        builder.addCase(getInstitutionDegreeType.pending, (state) => {
            state.institutionDegreeType.loading = true;
        });
        builder.addCase(getInstitutionDegreeType.fulfilled, (state, action) => {
            state.institutionDegreeType.loading = false;
            state.institutionDegreeType.error = "";
            state.institutionDegreeType.data = action.payload;
        });
        builder.addCase(getInstitutionDegreeType.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING

            state.institutionDegreeType.loading = false;
            state.institutionDegreeType.error = action.payload;

            state.institutionDegreeType.error = "Данные об степени образовании не найдены";
        });
        builder.addCase(getSpecialties.pending, (state) => {
            state.specialties.loading = true;
        });
        builder.addCase(getSpecialties.fulfilled, (state, action) => {
            state.specialties.loading = false;
            state.specialties.error = "";
            state.specialties.data = action.payload;
        });
        builder.addCase(getSpecialties.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING

            state.specialties.loading = false;
            state.specialties.error = action.payload;

            state.specialties.error = "Данные об специальности не найдены";
        });
        builder.addCase(getLanguages.pending, (state) => {
            state.languages.loading = true;
        });
        builder.addCase(getLanguages.fulfilled, (state, action) => {
            state.languages.loading = false;
            state.languages.error = "";
            state.languages.data = action.payload;
        });
        builder.addCase(getLanguages.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING

            state.languages.loading = false;
            state.languages.error = action.payload;

            state.languages.error = "Данные об языках не найдены";
        });
        builder.addCase(getSciences.pending, (state) => {
            state.sciences.loading = true;
        });
        builder.addCase(getSciences.fulfilled, (state, action) => {
            state.sciences.loading = false;
            state.sciences.error = "";
            state.sciences.data = action.payload;
        });
        builder.addCase(getSciences.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING

            state.sciences.loading = false;
            state.sciences.error = action.payload;

            state.sciences.error = "Данные о науках не найдены";
        });
        builder.addCase(getInstitution.pending, (state) => {
            state.institutions.loading = true;
        });
        builder.addCase(getInstitution.fulfilled, (state, action) => {
            state.institutions.loading = false;
            state.institutions.error = "";
            state.institutions.data = action.payload;
        });
        builder.addCase(getInstitution.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING

            state.institutions.loading = false;
            state.institutions.error = action.payload;

            state.institutions.error = "Данные о наименование учебного заведения не найден";
        });
        builder.addCase(getInstitutionMilitary.pending, (state) => {
            state.institutionsMilitary.loading = true;
        });
        builder.addCase(getInstitutionMilitary.fulfilled, (state, action) => {
            state.institutionsMilitary.loading = false;
            state.institutionsMilitary.error = "";
            state.institutionsMilitary.data = action.payload;
        });
        builder.addCase(getInstitutionMilitary.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING

            state.institutionsMilitary.loading = false;
            state.institutionsMilitary.error = action.payload;

            state.institutionsMilitary.error =
                "Данные о наименование военого учебного заведения не найден";
        });
        builder.addCase(getCourseProviders.pending, (state) => {
            state.course_provider.loading = true;
        });
        builder.addCase(getCourseProviders.fulfilled, (state, action) => {
            state.course_provider.loading = false;
            state.course_provider.error = "";
            state.course_provider.data = action.payload;
        });
        builder.addCase(getCourseProviders.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING

            state.course_provider.loading = false;
            state.course_provider.error = action.payload;

            state.course_provider.error = "Данные о курсах не найдены";
        });
        builder.addCase(getAcademicDegreeType.pending, (state) => {
            state.academic_degree.loading = true;
        });
        builder.addCase(getAcademicDegreeType.fulfilled, (state, action) => {
            state.academic_degree.loading = false;
            state.academic_degree.error = "";
            state.academic_degree.data = action.payload;
        });
        builder.addCase(getAcademicDegreeType.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING

            state.academic_degree.loading = false;
            state.academic_degree.error = action.payload;

            state.academic_degree.error = "Данные о курсах не найдены";
        });
        builder.addCase(getAcademicTitleDegreeType.pending, (state) => {
            state.academic_title_degree.loading = true;
        });
        builder.addCase(getAcademicTitleDegreeType.fulfilled, (state, action) => {
            state.academic_title_degree.loading = false;
            state.academic_title_degree.error = "";
            state.academic_title_degree.data = action.payload;
        });
        builder.addCase(getAcademicTitleDegreeType.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING

            state.academic_title_degree.loading = false;
            state.academic_title_degree.error = action.payload;

            state.academic_title_degree.error = "Данные о курсах не найдены";
        });
    },
});

export const { education, deleteByPathEducation } = educationSlice.actions;

export default educationSlice.reducer;
