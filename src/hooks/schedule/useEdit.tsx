import { components } from 'API/types';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { addLocalStaffDivision } from 'store/slices/schedule/Edit/staffDivision';
import { addLocalStaffUnit } from 'store/slices/schedule/Edit/staffUnit';
import { addLocalVacancy } from 'store/slices/schedule/Edit/vacancy';
import { change } from 'store/slices/schedule/archiveStaffDivision';
import uuidv4 from 'utils/helpers/uuid';
import {
    findSubDivisionNode,
    embedStaffUnitNode,
    embedSubDivisionNode,
    extractUnitsAndDivisions,
    deepCopyStaffDivisionWithNewID,
} from 'utils/schedule/utils';

export const useEdit = () => {
    const dispatch = useAppDispatch();

    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);

    const duplicateStaffUnit = (item: components['schemas']['ArchiveStaffUnitRead']) => {
        // Принимаем staffUnit которого нужно продублировать
        if (item.staff_division_id && item.position_id) {
            const staffUnitId = uuidv4();

            dispatch(
                addLocalStaffUnit({
                    isLocal: true,
                    id: staffUnitId,
                    position_id: item.position_id,
                    staff_division_id: item.staff_division_id,
                }),
            );
            const newVacancy = {
                is_active: false,
                id: uuidv4(),
                isStaffUnitLocal: true,
                isLocal: true,
                staff_unit_id: staffUnitId,
            };
            dispatch(addLocalVacancy(newVacancy));

            const foundStaffUnitNode = findSubDivisionNode(
                archiveStaffDivision,
                item.staff_division_id,
            );
            if (foundStaffUnitNode)
                dispatch(
                    change(
                        embedStaffUnitNode(
                            {
                                isLocal: true,
                                id: staffUnitId,
                                position_id: item.position_id,
                                staff_division_id: item.staff_division_id,
                                user: null,
                                user_id: null,
                                user_replacing: null,
                                user_replacing_id: null,
                                hr_vacancy: [newVacancy],
                                requirements: item.requirements,
                                staff_functions: item.staff_functions,
                                position: {
                                    name: item.position?.name ?? '',
                                    nameKZ: item.position?.name ?? '',
                                    ...item.position,
                                    id: item.position_id,
                                },
                            },
                            foundStaffUnitNode,
                            archiveStaffDivision,
                        ),
                    ),
                );
        }
    };

    const duplicateStaffDivision = (
        staffDivision: components['schemas']['ArchiveStaffDivisionRead'],
        name: string,
        nameKZ: string,
        staff_division_number: number,
        type: components['schemas']['StaffDivisionTypeRead'],
    ) => {
        const foundStaffDivisionNode = findSubDivisionNode(
            archiveStaffDivision,
            staffDivision.parent_group_id,
        );

        const deepCopy = deepCopyStaffDivisionWithNewID(
            staffDivision,
            name,
            nameKZ,
            staff_division_number,
            type,
        );
        dispatch(
            change(embedSubDivisionNode(archiveStaffDivision, deepCopy, foundStaffDivisionNode)),
        );

        const { staff_divisions, staff_units } = extractUnitsAndDivisions(deepCopy);
        staff_divisions.forEach((staffDivision) => {
            if (staffDivision.id)
                dispatch(
                    addLocalStaffDivision({
                        isLocal: true,
                        id: staffDivision.id,
                        ...staffDivision,
                    }),
                );
        });

        staff_units.forEach((staffUnit) => {
            if (staffUnit.id && staffUnit.position_id && staffUnit.staff_division_id) {
                dispatch(
                    addLocalStaffUnit({
                        isLocal: true,
                        id: staffUnit.id,
                        position_id: staffUnit.position_id,
                        staff_division_id: staffUnit.staff_division_id,
                        ...staffUnit,
                    }),
                );
                // @ts-expect-error some fields doesn't satisfy
                dispatch(addLocalVacancy(staffUnit.hr_vacancy[0]));
            }
        });
    };

    return { duplicateStaffUnit, duplicateStaffDivision };
};
