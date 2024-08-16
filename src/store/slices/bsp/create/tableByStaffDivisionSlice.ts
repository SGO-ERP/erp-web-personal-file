import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { components } from '../../../../API/types';
import { PrivateServices } from 'API';
import { DataNode } from 'antd/lib/tree';

interface TableTypes {
    data: components['schemas']['ScheduleYearRead'][];
    loading: boolean;
    error: any;
}
const initialState: TableTypes = {
    data: [],
    loading: false,
    error: null,
};

type GetPlanStaffDivArgs = {
    filteredMainArray: DataNode[];
    bsp_plan_id: string;
};

export const getPlanStaffDiv = createAsyncThunk(
    'bsp/getStaffDiv',
    async ({ filteredMainArray, bsp_plan_id }: GetPlanStaffDivArgs) => {
        const arrayStaffDiv: components['schemas']['ScheduleYearRead'][] = [];
        const addedIds: string[] = [];

        const promises = filteredMainArray.map((item) => {
            if (typeof item.key === 'string' && !isIdAlreadyAdded(item.key)) {
                return PrivateServices.get('/api/v1/schedule_year/division_plan/{id}/', {
                    params: { path: { id: item?.key }, query: { plan_id: bsp_plan_id } },
                })
                    .then((response) => {
                        if (response.data !== undefined && response.data.objects) {
                            const objectsArray = response?.data
                                ?.objects as components['schemas']['ScheduleYearRead'][]; // Приведение типа
                            arrayStaffDiv.push(...objectsArray);
                            if (typeof item.key === 'string') {
                                addAddedId(item.key);
                            }
                        }
                    })
                    .catch((error) => {
                        // Обработка ошибок при выполнении запроса
                        console.error('Error:', error);
                    });
            }
            return Promise.resolve();
        });

        await Promise.all(promises);

        // Функция для добавления идентификатора в список добавленных
        function addAddedId(id: string): void {
            addedIds.push(id);
        }

        // Функция для проверки, был ли идентификатор уже добавлен
        function isIdAlreadyAdded(id: string): boolean {
            return addedIds.includes(id);
        }

        const flattenedArray = arrayStaffDiv.flatMap((innerArray) => innerArray);
        return flattenedArray;
    },
);

export const tableByStaffDivision = createSlice({
    name: 'tableByStaffDivision',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getPlanStaffDiv.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.data = [];
        });
        builder.addCase(getPlanStaffDiv.fulfilled, (state, action) => {
            if (action?.payload) {
                state.loading = false;
                state.data = action.payload;
            }
        });
        builder.addCase(getPlanStaffDiv.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
export default tableByStaffDivision.reducer;
