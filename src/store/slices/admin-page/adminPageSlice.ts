import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { DataNode } from "antd/lib/tree";
import { components, paths } from "../../../API/types";

interface RankPaginationRead {
    total: number;
    objects: components["schemas"]["RankRead"][];
}
interface BadgeTypePaginationRead {
    total: number;
    objects: components["schemas"]["BadgeTypeRead"][];
}
interface PositionPaginationRead {
    total: number;
    objects: components["schemas"]["PositionRead"][];
}
interface PositionPaginationRead {
    total: number;
    objects: components["schemas"]["PositionRead"][];
}
interface PenaltyPaginationRead {
    total: number;
    objects: components["schemas"]["PenaltyTypeRead"][];
}

interface PermissionPaginationRead {
    total: number;
    objects: components["schemas"]["PermissionTypeRead"][];
}
interface PropertyTypePaginationRead {
    total: number;
    objects: components["schemas"]["PropertyTypeRead"][];
}

interface SportTypePaginationRead {
    total: number;
    objects: components["schemas"]["SportTypeRead"][];
}

interface StatusTypePaginationRead {
    total: number;
    objects: components["schemas"]["StatusTypeRead"][];
}

interface StatusTypePaginationRead {
    total: number;
    objects: components["schemas"]["StatusTypeRead"][];
}

interface TableTypes {
    ranks: {
        data: RankPaginationRead;
        loading: boolean;
        error: any;
    };
    position: {
        data: PositionPaginationRead;
        loading: boolean;
        error: any;
    };
    penalty_types: {
        data: PenaltyPaginationRead;
        loading: boolean;
        error: any;
    };
    permissions: {
        data: PermissionPaginationRead;
        loading: boolean;
        error: any;
    };
    property_types: {
        data: PropertyTypePaginationRead;
        loading: boolean;
        error: any;
    };
    sport_types: {
        data: SportTypePaginationRead;
        loading: boolean;
        error: any;
    };
    status_types: {
        data: StatusTypePaginationRead;
        loading: boolean;
        error: any;
    };
    specialties: {
        data: components["schemas"]["SpecialtyRead"][];
        loading: boolean;
        error: any;
    };
    academic_degree: {
        data: components["schemas"]["AcademicDegreeDegreeRead"][];
        loading: boolean;
        error: any;
    };
    academic_title: {
        data: components["schemas"]["AcademicTitleDegreeRead"][];
        loading: boolean;
        error: any;
    };
    country: {
        data: components["schemas"]["CountryRead"][];
        loading: boolean;
        error: any;
    };
    course_provider: {
        data: components["schemas"]["CourseProviderRead"][];
        loading: boolean;
        error: any;
    };
    institution_degree_type: {
        data: components["schemas"]["InstitutionDegreeTypeRead"][];
        loading: boolean;
        error: any;
    };
    institution: {
        data: components["schemas"]["InstitutionRead"][];
        loading: boolean;
        error: any;
    };
    language: {
        data: components["schemas"]["LanguageRead"][];
        loading: boolean;
        error: any;
    };
    science: {
        data: components["schemas"]["ScienceRead"][];
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    tableSearch: string;
}

const initialState: TableTypes = {
    ranks: {
        data: {
            total: 0,
            objects: [],
        },
        loading: false,
        error: null,
    },
    position: {
        data: {
            total: 0,
            objects: [],
        },
        loading: false,
        error: null,
    },
    penalty_types: {
        data: {
            total: 0,
            objects: [],
        },
        loading: false,
        error: null,
    },
    permissions: {
        data: {
            total: 0,
            objects: [],
        },
        loading: false,
        error: null,
    },
    property_types: {
        data: {
            total: 0,
            objects: [],
        },
        loading: false,
        error: null,
    },
    sport_types: {
        data: {
            total: 0,
            objects: [],
        },
        loading: false,
        error: null,
    },
    status_types: {
        data: {
            total: 0,
            objects: [],
        },
        loading: false,
        error: null,
    },
    specialties: {
        data: [],
        loading: false,
        error: null,
    },
    academic_degree: {
        data: [],
        loading: false,
        error: null,
    },
    academic_title: {
        data: [],
        loading: false,
        error: null,
    },
    country: {
        data: [],
        loading: false,
        error: null,
    },
    course_provider: {
        data: [],
        loading: false,
        error: null,
    },
    institution_degree_type: {
        data: [],
        loading: false,
        error: null,
    },
    institution: {
        data: [],
        loading: false,
        error: null,
    },
    language: {
        data: [],
        loading: false,
        error: null,
    },
    science: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    tableSearch: "",
};
export const getRanks = createAsyncThunk(
    "adminPage/getRanks",
    (options: paths["/api/v1/ranks"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/ranks", {
            params: options,
        });
    },
);

export const getPosition = createAsyncThunk(
    "adminPage/getPosition",
    (options: paths["/api/v1/positions/all"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/positions/all", {
            params: options,
        });
    },
);

export const getPenaltyTypes = createAsyncThunk(
    "adminPage/getPenaltyTypes",
    (options: paths["/api/v1/penalty_types"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/penalty_types", {
            params: options,
        });
    },
);

export const getPermissions = createAsyncThunk(
    "adminPage/getPermissions",
    (options: paths["/api/v1/permissions"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/permissions", {
            params: options,
        });
    },
);

export const getPropertyTypes = createAsyncThunk(
    "adminPage/getPropertyTypes",
    (options: paths["/api/v1/additional/property_types"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/additional/property_types", {
            params: options,
        });
    },
);

export const getSportTypes = createAsyncThunk(
    "adminPage/getSportTypes",
    (options: paths["/api/v1/personal/sport_type"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/personal/sport_type", {
            params: options,
        });
    },
);

export const getStatusTypes = createAsyncThunk(
    "adminPage/getStatusTypes",
    (options: paths["/api/v1/status_types"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/status_types", {
            params: options,
        });
    },
);

export const getSpecialties = createAsyncThunk(
    "adminPage/getSpecialties",
    (options: paths["/api/v1/education/specialties"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/education/specialties", {
            params: options,
        });
    },
);

export const getAcademicDegree = createAsyncThunk(
    "adminPage/getAcademicDegree",
    (options: paths["/api/v1/education/academic_degree_degrees"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/education/academic_degree_degrees", {
            params: options,
        });
    },
);

export const getAcademicTitle = createAsyncThunk(
    "adminPage/getAcademicTitle",
    (options: paths["/api/v1/education/academic_title_degrees"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/education/academic_title_degrees", {
            params: options,
        });
    },
);

export const getCountry = createAsyncThunk(
    "adminPage/getCountry",
    (options: paths["/api/v1/additional/country"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/additional/country", {
            params: options,
        });
    },
);

export const getCourseProvider = createAsyncThunk(
    "adminPage/getCourseProvider",
    (options: paths["/api/v1/education/course_providers"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/education/course_providers", {
            params: options,
        });
    },
);

export const getInstitutyionDegreeType = createAsyncThunk(
    "adminPage/getInstitutyionDegreeType",
    (options: paths["/api/v1/education/institution_degree_types"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/education/institution_degree_types", {
            params: options,
        });
    },
);

export const getInstitutyion = createAsyncThunk(
    "adminPage/getInstitutyion",
    (options: paths["/api/v1/education/institutions"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/education/institutions", {
            params: options,
        });
    },
);

export const getLanguage = createAsyncThunk(
    "adminPage/getLanguage",
    (options: paths["/api/v1/education/languages"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/education/languages", {
            params: options,
        });
    },
);

export const getScience = createAsyncThunk(
    "adminPage/getScience",
    (options: paths["/api/v1/education/sciences"]["get"]["parameters"]) => {
        return PrivateServices.get("/api/v1/education/sciences", {
            params: options,
        });
    },
);

export const adminPage = createSlice({
    name: "adminPage",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setTableSearch: (state, action) => {
            state.tableSearch = action.payload;
        },
    },
    extraReducers: (builder) => {
        //RANKS
        builder.addCase(getRanks.pending, (state) => {
            state.ranks.loading = true;
            state.ranks.error = null;
            state.ranks.data = { total: 0, objects: [] };
        });
        builder.addCase(getRanks.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.ranks.loading = false;
                state.ranks.data = action.payload.data as RankPaginationRead;
            }
        });
        builder.addCase(getRanks.rejected, (state, action) => {
            state.ranks.loading = false;
            state.ranks.error = action.payload;
        });

        //position
        builder.addCase(getPosition.pending, (state) => {
            state.position.loading = true;
            state.position.error = null;
            state.position.data = { total: 0, objects: [] };
        });
        builder.addCase(getPosition.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.position.loading = false;
                state.position.data = action.payload.data as PositionPaginationRead;
            }
        });
        builder.addCase(getPosition.rejected, (state, action) => {
            state.position.loading = false;
            state.position.error = action.payload;
        });

        //penalty_types
        builder.addCase(getPenaltyTypes.pending, (state) => {
            state.penalty_types.loading = true;
            state.penalty_types.error = null;
            state.penalty_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getPenaltyTypes.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.penalty_types.loading = false;
                state.penalty_types.data = action.payload.data as PenaltyPaginationRead;
            }
        });
        builder.addCase(getPenaltyTypes.rejected, (state, action) => {
            state.penalty_types.loading = false;
            state.penalty_types.error = action.payload;
        });

        //permissions
        builder.addCase(getPermissions.pending, (state) => {
            state.permissions.loading = true;
            state.permissions.error = null;
            state.permissions.data = { total: 0, objects: [] };
        });
        builder.addCase(getPermissions.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.permissions.loading = false;
                state.permissions.data = action.payload.data as PermissionPaginationRead;
            }
        });
        builder.addCase(getPermissions.rejected, (state, action) => {
            state.permissions.loading = false;
            state.permissions.error = action.payload;
        });

        //property_types
        builder.addCase(getPropertyTypes.pending, (state) => {
            state.property_types.loading = true;
            state.property_types.error = null;
            state.property_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getPropertyTypes.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.property_types.loading = false;
                state.property_types.data = action.payload.data as PropertyTypePaginationRead;
            }
        });
        builder.addCase(getPropertyTypes.rejected, (state, action) => {
            state.property_types.loading = false;
            state.property_types.error = action.payload;
        });

        //sport_types
        builder.addCase(getSportTypes.pending, (state) => {
            state.sport_types.loading = true;
            state.sport_types.error = null;
            state.sport_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getSportTypes.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.sport_types.loading = false;
                state.sport_types.data = action.payload.data as SportTypePaginationRead;
            }
        });
        builder.addCase(getSportTypes.rejected, (state, action) => {
            state.sport_types.loading = false;
            state.sport_types.error = action.payload;
        });

        //status_types
        builder.addCase(getStatusTypes.pending, (state) => {
            state.status_types.loading = true;
            state.status_types.error = null;
            state.status_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getStatusTypes.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.status_types.loading = false;
                state.status_types.data = action.payload.data as StatusTypePaginationRead;
            }
        });
        builder.addCase(getStatusTypes.rejected, (state, action) => {
            state.status_types.loading = false;
            state.status_types.error = action.payload;
        });

        //specialties
        builder.addCase(getSpecialties.pending, (state) => {
            state.specialties.loading = true;
            state.specialties.error = null;
            state.specialties.data = [];
        });
        builder.addCase(getSpecialties.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.specialties.loading = false;
                state.specialties.data = action.payload.data as components["schemas"]["SpecialtyRead"][];
            }
        });
        builder.addCase(getSpecialties.rejected, (state, action) => {
            state.specialties.loading = false;
            state.specialties.error = action.payload;
        });

        //academic-degree
        builder.addCase(getAcademicDegree.pending, (state) => {
            state.academic_degree.loading = true;
            state.academic_degree.error = null;
            state.academic_degree.data = [];
        });
        builder.addCase(getAcademicDegree.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.academic_degree.loading = false;
                state.academic_degree.data = action.payload.data as components["schemas"]["AcademicDegreeDegreeRead"][];
            }
        });
        builder.addCase(getAcademicDegree.rejected, (state, action) => {
            state.academic_degree.loading = false;
            state.academic_degree.error = action.payload;
        });

        //academic-title
        builder.addCase(getAcademicTitle.pending, (state) => {
            state.academic_title.loading = true;
            state.academic_title.error = null;
            state.academic_title.data = [];
        });
        builder.addCase(getAcademicTitle.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.academic_title.loading = false;
                state.academic_title.data = action.payload.data as components["schemas"]["AcademicTitleDegreeRead"][];
            }
        });
        builder.addCase(getAcademicTitle.rejected, (state, action) => {
            state.academic_title.loading = false;
            state.academic_title.error = action.payload;
        });

        //country
        builder.addCase(getCountry.pending, (state) => {
            state.country.loading = true;
            state.country.error = null;
            state.country.data = [];
        });
        builder.addCase(getCountry.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.country.loading = false;
                state.country.data = action.payload.data as components["schemas"]["CountryRead"][];
            }
        });
        builder.addCase(getCountry.rejected, (state, action) => {
            state.country.loading = false;
            state.country.error = action.payload;
        });

        //course-provider
        builder.addCase(getCourseProvider.pending, (state) => {
            state.course_provider.loading = true;
            state.course_provider.error = null;
            state.course_provider.data = [];
        });
        builder.addCase(getCourseProvider.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.course_provider.loading = false;
                state.course_provider.data = action.payload.data as components["schemas"]["CourseProviderRead"][];
            }
        });
        builder.addCase(getCourseProvider.rejected, (state, action) => {
            state.course_provider.loading = false;
            state.course_provider.error = action.payload;
        });

        //institution-degree-type
        builder.addCase(getInstitutyionDegreeType.pending, (state) => {
            state.institution_degree_type.loading = true;
            state.institution_degree_type.error = null;
            state.institution_degree_type.data = [];
        });
        builder.addCase(getInstitutyionDegreeType.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.institution_degree_type.loading = false;
                state.institution_degree_type.data = action.payload.data as components["schemas"]["InstitutionDegreeTypeRead"][];
            }
        });
        builder.addCase(getInstitutyionDegreeType.rejected, (state, action) => {
            state.institution_degree_type.loading = false;
            state.institution_degree_type.error = action.payload;
        });

        //institution
        builder.addCase(getInstitutyion.pending, (state) => {
            state.institution.loading = true;
            state.institution.error = null;
            state.institution.data = [];
        });
        builder.addCase(getInstitutyion.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.institution.loading = false;
                state.institution.data = action.payload.data as components["schemas"]["InstitutionRead"][];
            }
        });
        builder.addCase(getInstitutyion.rejected, (state, action) => {
            state.institution.loading = false;
            state.institution.error = action.payload;
        });

        //language
        builder.addCase(getLanguage.pending, (state) => {
            state.language.loading = true;
            state.language.error = null;
            state.language.data = [];
        });
        builder.addCase(getLanguage.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.language.loading = false;
                state.language.data = action.payload.data as components["schemas"]["LanguageRead"][];
            }
        });
        builder.addCase(getLanguage.rejected, (state, action) => {
            state.language.loading = false;
            state.language.error = action.payload;
        });

        //science
        builder.addCase(getScience.pending, (state) => {
            state.science.loading = true;
            state.science.error = null;
            state.science.data = [];
        });
        builder.addCase(getScience.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.science.loading = false;
                state.science.data = action.payload.data as components["schemas"]["ScienceRead"][];
            }
        });
        builder.addCase(getScience.rejected, (state, action) => {
            state.science.loading = false;
            state.science.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setTableSearch } = adminPage.actions;

export default adminPage.reducer;
