import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface CourseTypeRead {
    total: number;
    objects: components["schemas"]["CourseRead"][];
}

interface TableTypes {
    course_types: {
        data: CourseTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedCourse: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    course_types: {
        data: {
            total: 0,
            objects: [],
        },
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedCourse: null,
    modalLoading: false,
};

export const getCourseTypes = createAsyncThunk(
    "adminCourses/getCourseTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/education/course_providers", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminCourses = createSlice({
    name: "adminCourses",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedCourse: (state, action) => {
            state.selectedCourse = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCourseTypes.pending, (state) => {
            state.course_types.loading = true;
            state.course_types.error = null;
            state.course_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getCourseTypes.fulfilled, (state, action) => {
            state.course_types.loading = false;
            state.course_types.data = action.payload as CourseTypeRead;
        });
        builder.addCase(getCourseTypes.rejected, (state, action) => {
            state.course_types.loading = false;
            state.course_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedCourse, setLoadingModal } =
    adminCourses.actions;

export default adminCourses.reducer;
