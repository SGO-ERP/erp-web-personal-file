import { components } from 'API/types';
import { ArrayElement, Division, DivisionInput } from 'utils/format/interfaces';
import uuidv4 from '../helpers/uuid';
import { PrivateServices } from '../../API';

export const removeStaffUnitNode = (
    staff_unit_id: string,
    staffDivision:
        | components['schemas']['ArchiveStaffDivisionRead'][]
        | components['schemas']['ArchiveStaffDivisionChildRead'][],
): components['schemas']['ArchiveStaffDivisionRead'][] => {
    const filteredStaffDivision: components['schemas']['ArchiveStaffDivisionRead'][] =
        staffDivision.map((division) => {
            const filteredDivision: components['schemas']['ArchiveStaffDivisionRead'] = JSON.parse(
                JSON.stringify(division),
            );

            if (
                Array.isArray(filteredDivision.staff_units) &&
                filteredDivision.staff_units.length
            ) {
                const filteredStaffUnits = filteredDivision.staff_units.filter(
                    (staff_unit) => staff_unit.id !== staff_unit_id,
                );
                if (filteredStaffUnits.length === 0) {
                    // @ts-expect-error staff_units can be null
                    filteredDivision.staff_units = null;
                } else {
                    filteredDivision.staff_units = filteredStaffUnits;
                }
            }

            if (Array.isArray(filteredDivision.children) && filteredDivision.children.length) {
                const filteredChildren: components['schemas']['ArchiveStaffDivisionRead'][] =
                    removeStaffUnitNode(staff_unit_id, filteredDivision.children);
                if (filteredChildren.length === 0) {
                    // @ts-expect-error children can be null
                    filteredDivision.children = null;
                } else {
                    filteredDivision.children = filteredChildren;
                }
            }

            return filteredDivision;
        });
    return filteredStaffDivision;
};

export const removeStaffUnitNodes = (
    staffUnitIds: (string | null)[],
    staffDivision:
        | components['schemas']['StaffDivisionRead'][]
        | components['schemas']['StaffDivisionChildRead'][],
): components['schemas']['StaffDivisionRead'][] => {
    const filteredStaffDivision: components['schemas']['StaffDivisionRead'][] = staffDivision.map(
        (division) => {
            const filteredDivision: components['schemas']['StaffDivisionRead'] = JSON.parse(
                JSON.stringify(division),
            );

            if (
                Array.isArray(filteredDivision.staff_units) &&
                filteredDivision.staff_units.length
            ) {
                const filteredStaffUnits = filteredDivision.staff_units.filter(
                    (staff_unit) =>
                        staff_unit?.users &&
                        staff_unit.users[0]?.id &&
                        !staffUnitIds.includes(staff_unit.users[0]?.id),
                );

                filteredDivision.staff_units = filteredStaffUnits;
            }

            if (Array.isArray(filteredDivision.children) && filteredDivision.children.length) {
                const filteredChildren: components['schemas']['StaffDivisionRead'][] =
                    removeStaffUnitNodes(staffUnitIds, filteredDivision.children);
                filteredDivision.children = filteredChildren;
            }

            return filteredDivision;
        },
    );

    return filteredStaffDivision;
};

export const removeSubDivisionNode = (
    departmentId: string,
    staffDivisions:
        | components['schemas']['ArchiveStaffDivisionRead'][]
        | components['schemas']['ArchiveStaffDivisionChildRead'][],
): components['schemas']['ArchiveStaffDivisionRead'][] => {
    const staffDivisionsCOPY: components['schemas']['ArchiveStaffDivisionRead'][] = JSON.parse(
        JSON.stringify(staffDivisions),
    );
    if (Array.isArray(staffDivisionsCOPY) && staffDivisionsCOPY.length) {
        const filteredStaffDivisions = staffDivisionsCOPY.filter(
            (item) => item.id !== departmentId,
        );
        filteredStaffDivisions.forEach((item) => {
            if (item.children) {
                item.children = removeSubDivisionNode(departmentId, item.children);
            }
        });
        return filteredStaffDivisions;
    }
    return staffDivisionsCOPY;
};

export const findSubDivisionNode = (
    staffDivisions: components['schemas']['ArchiveStaffDivisionRead'][],
    departmentId?: string | null,
): components['schemas']['ArchiveStaffDivisionRead'] | null | undefined  => {
    if (Array.isArray(staffDivisions) && staffDivisions.length) {
        let department:
            | ArrayElement<components['schemas']['ArchiveStaffDivisionRead']['children']>
            | null
            | undefined = staffDivisions.find((item) => item.id === departmentId);
        if (department) {
            return department as components['schemas']['ArchiveStaffDivisionRead'];
        } else {
            for (let i = 0; i < staffDivisions.length; i++) {
                const item = staffDivisions[i];
                if (item.children) {
                    department = findSubDivisionNode(item.children as components['schemas']['ArchiveStaffDivisionRead'][], departmentId);
                    if (department) {
                        return department as components['schemas']['ArchiveStaffDivisionRead'];
                    }
                }
            }
        }
    }
    return null;
};

export const embedSubDivisionNode = (
    list: components['schemas']['ArchiveStaffDivisionRead'][],
    embedded: components['schemas']['ArchiveStaffDivisionRead'] & { isLocal?: boolean },
    embeddedInto?: components['schemas']['ArchiveStaffDivisionRead'] | string | null,
) => {
    const listCOPY: components['schemas']['ArchiveStaffDivisionRead'][] = JSON.parse(
        JSON.stringify(list),
    );

    const embeddedCOPY: components['schemas']['ArchiveStaffDivisionRead'] = JSON.parse(
        JSON.stringify(embedded),
    );

    if (typeof embeddedInto !== 'string' && (!embeddedInto || embeddedInto?.id === undefined)) {
        const index = listCOPY.findIndex((child) => child.id === embeddedCOPY.id);
        if (index !== -1) {
            listCOPY[index] = embeddedCOPY; // Заменяем существующий объект
        } else {
            listCOPY.push(embeddedCOPY); // Добавляем новый объект в конец
        }
        return listCOPY;
    }

    const embeddedIntoObj = findSubDivisionNode(
        listCOPY,
        typeof embeddedInto === 'string' ? embeddedInto : embeddedInto.id,
    );

    if (embeddedIntoObj) {
        if (Array.isArray(embeddedIntoObj.children)) {
            const index = embeddedIntoObj.children.findIndex(
                (child) => child.id === embeddedCOPY.id,
            );
            if (index !== -1) {
                embeddedIntoObj.children[index] = embeddedCOPY; // Заменяем существующий объект
            } else {
                embeddedIntoObj.children.push(embeddedCOPY); // Добавляем новый объект в конец
            }
        } else if (embeddedIntoObj.children === null) {
            embeddedIntoObj.children = [embeddedCOPY]; // Создаем новый массив и добавляем новый объект
        }
    }
    return listCOPY;
};

export const embedStaffUnitNode = (
    embedded: ArrayElement<components['schemas']['ArchiveStaffDivisionRead']['staff_units']> & {
        isLocal?: boolean;
    },
    embeddedInto: components['schemas']['ArchiveStaffDivisionRead'] | string,
    staffDivision: components['schemas']['ArchiveStaffDivisionRead'][],
) => {
    const embeddedCOPY: ArrayElement<
        components['schemas']['ArchiveStaffDivisionRead']['staff_units']
    > = JSON.parse(JSON.stringify(embedded));
    const listCOPY: components['schemas']['ArchiveStaffDivisionRead'][] = JSON.parse(
        JSON.stringify(staffDivision),
    );
    const embeddedIntoObj = findSubDivisionNode(
        listCOPY,
        typeof embeddedInto === 'string' ? embeddedInto : embeddedInto.id,
    );

    if (embeddedIntoObj && Array.isArray(embeddedIntoObj.staff_units)) {
        const index = embeddedIntoObj.staff_units.findIndex((unit) => unit.id === embeddedCOPY.id);
        if (index !== -1) {
            embeddedIntoObj.staff_units[index] = embeddedCOPY; // Заменяем существующий объект
        } else {
            embeddedIntoObj.staff_units.push(embeddedCOPY); // Добавляем новый объект в конец
        }
    } else if (embeddedIntoObj?.staff_units === null) {
        embeddedIntoObj.staff_units = [embeddedCOPY];
    }
    return listCOPY;
};

export const findStaffUnitNode = (
    staffUnitId: string,
    staffDivision: components['schemas']['ArchiveStaffDivisionRead'][],
): ArrayElement<components['schemas']['ArchiveStaffDivisionRead']['staff_units']> | null => {
    let foundStaffUnitNode: ArrayElement<
        components['schemas']['ArchiveStaffDivisionRead']['staff_units']
    > | null = null;

    staffDivision.forEach((division) => {
        if (Array.isArray(division.staff_units) && division.staff_units.length) {
            const StaffUnitNode = division.staff_units.find((item) => item.id === staffUnitId);
            if (StaffUnitNode) {
                foundStaffUnitNode = StaffUnitNode;
            } else if (Array.isArray(division.children) && division.children.length) {
                const nestedStaffUnitNode = findStaffUnitNode(staffUnitId, division.children as components['schemas']['ArchiveStaffDivisionRead'][]);
                if (nestedStaffUnitNode) {
                    foundStaffUnitNode = nestedStaffUnitNode;
                }
            }
        } else if (Array.isArray(division.children) && division.children.length) {
            const nestedStaffUnitNode = findStaffUnitNode(staffUnitId, division.children as components['schemas']['ArchiveStaffDivisionRead'][]);
            if (nestedStaffUnitNode) {
                foundStaffUnitNode = nestedStaffUnitNode;
            }
        }
    });
    return foundStaffUnitNode;
};

export const deepCopyStaffDivisionWithNewID = (
    staffDivision:
        | components['schemas']['ArchiveStaffDivisionRead']
        | components['schemas']['ArchiveStaffDivisionChildRead'],
    name?: string,
    nameKZ?: string | null,
    staff_division_number?: number | null,
    type?: components['schemas']['StaffDivisionTypeRead'] | null,
) => {
    const newObj: components['schemas']['ArchiveStaffDivisionRead'] = JSON.parse(
        JSON.stringify(staffDivision),
    );

    newObj.id = uuidv4();
    // @ts-expect-error Принимает
    newObj.isLocal = true;
    // }
    if (name && nameKZ && staff_division_number && type) {
        newObj.name = name;
        newObj.nameKZ = nameKZ;
        newObj.staff_division_number = staff_division_number;
        newObj.type = type;
        newObj.type_id = type.id;
    } else if (name && nameKZ) {
        newObj.name = name;
        newObj.nameKZ = nameKZ;
    }
    if (newObj.staff_units) {
        newObj.staff_units = newObj.staff_units.map((unit) => {
            const newUnit = { ...unit };
            newUnit.user_id = null;
            newUnit.user = null;
            newUnit.user_replacing_id = null;
            newUnit.user_replacing = null;
            // @ts-expect-error Принимает
            newUnit.isLocal = true;
            newUnit.id = uuidv4();
            newUnit.staff_division_id = newObj.id;
            newUnit.hr_vacancy = [
                {
                    id: uuidv4(),
                    is_active: true,
                    staff_unit_id: newUnit.id,
                    // @ts-expect-error Accepts
                    isStaffUnitLocal: true,
                    isLocal: true,
                },
            ];
            return newUnit;
        });
    }

    if (newObj.children) {
        newObj.children = newObj.children.map((child) => {
            return {
                ...deepCopyStaffDivisionWithNewID(child),
                parent_group_id: newObj.id,
            };
        });
    }
    return newObj;
};

export const extractUnitsAndDivisions = (
    staffDivision:
        | components['schemas']['ArchiveStaffDivisionRead']
        | components['schemas']['ArchiveStaffDivisionChildRead'],
) => {
    const newObj: components['schemas']['ArchiveStaffDivisionRead'] = JSON.parse(
        JSON.stringify(staffDivision),
    );

    const result: {
        staff_units: components['schemas']['ArchiveStaffUnitRead'][];
        staff_divisions: components['schemas']['ArchiveStaffDivisionRead'][];
    } = {
        staff_units: [],
        staff_divisions: [],
    };
    if (newObj.staff_units) {
        newObj.staff_units.forEach((unit) => {
            delete unit.user_id;
            delete unit.user_replacing_id;
            delete unit.user_replacing;
            delete unit.user;

            unit.staff_division_id = newObj.id;
        });
        result.staff_units.push(...newObj.staff_units);
        delete newObj.staff_units;
    }

    result.staff_divisions.push(newObj);

    if (newObj.children) {
        newObj.children.forEach((child) => {
            const childResult = extractUnitsAndDivisions(child);
            result.staff_units.push(...childResult.staff_units);
            result.staff_divisions.push(...childResult.staff_divisions);
        });
    }

    return result;
};

export const buildTree = (list: DivisionInput[]): Division[] => {
    const map: { [key: string]: number } = {};
    let node: Division;
    const divisionList: Division[] = list.map((item) => ({ ...item, children: [] }));
    const nestedIds: Set<string> = new Set();

    for (let i = 0; i < divisionList.length; i += 1) {
        map[divisionList[i].id] = i; // инициализация map
    }

    for (let i = 0; i < divisionList.length; i += 1) {
        node = divisionList[i];
        if (node.parent_group_id && node.parent_group_id in map) {
            divisionList[map[node.parent_group_id]].children.push(node);
            nestedIds.add(node.id);
        }
    }

    return divisionList.filter((item) => !nestedIds.has(item.id));
};

export const _processDivisions = async (
    divisions: Division[],
    callback: (
        division: Division,
        parent: Division | null,
        createdStaffDivision: components['schemas']['ArchiveStaffDivisionRead'] | null,
    ) => Promise<{
        createdStaffDivision: components['schemas']['ArchiveStaffDivisionRead'];
    }>,
    parent: Division | null = null,
) => {
    for (const division of divisions) {
        const result = await callback(division, parent, null);

        if (division.children && division.children.length > 0) {
            await _processDivisions(
                division.children,
                async (childDivision, childParent, childCreatedStaffDivision) => {
                    return await callback(
                        childDivision,
                        childParent || division,
                        childCreatedStaffDivision || result.createdStaffDivision,
                    );
                },
                division,
            );
        }
    }
};

export const processSubDivision = (
    division: components['schemas']['ArchiveStaffDivisionRead'],
    callback: (
        division: components['schemas']['ArchiveStaffDivisionRead'],
    ) => components['schemas']['ArchiveStaffDivisionRead'] | undefined,
): components['schemas']['ArchiveStaffDivisionRead'] | undefined => {
    const modifiedDivision = callback(division);

    if (modifiedDivision && modifiedDivision.children && modifiedDivision.children.length > 0) {
        for (let i = 0; i < modifiedDivision.children.length; i++) {
            const modifiedChildrens = processSubDivision(modifiedDivision.children[i] as components['schemas']['ArchiveStaffDivisionRead'], callback);
            if (modifiedChildrens) modifiedDivision.children[i] = modifiedChildrens;
        }
    }
    return modifiedDivision;
};

export const separate = <T>(
    array: T[],
    condition: (item: T) => boolean,
): { found: T[]; notFound: T[] } => {
    const found = array.filter(condition);
    const notFound = array.filter((item) => !condition(item));
    return { found, notFound };
};

export function formatYears(num:number) {
    const currentLocale = localStorage.getItem("lan");

    if (num === 0) {
        if(currentLocale==='kk') {
            return '0 жыл';
        } else {
            return '0 лет';
        }
    }

    if (num >= 11 && num <= 14) {
        if(currentLocale==='kk') {
            return num + ' жыл';
        } else {
            return num + ' лет';
        }
    }

    const lastDigit = num % 10;

    switch (lastDigit) {
        case 1:
            if(currentLocale==='kk') {
                return num + ' жыл';
            } else {
                return num + ' год';
            }
        case 2:
        case 3:
        case 4:
            if(currentLocale==='kk') {
                return num + ' жыл';
            } else {
                return num + ' года';
            }
        default:
            if(currentLocale==='kk') {
                return num + ' жыл';
            } else {
                return num + ' лет';
            }
    }
}

export const sumYears = (
    emergencyContract: {
        length_of_service: {
            days: number;
            months: number;
            years: number;
        };
    }[],
) => {
    let sumOfYears = 0;
    let sumOfMonths = 0;
    let sumOfDays = 0;

    for (let i = 0; i < emergencyContract?.length; i++) {
        const { days, months, years } = emergencyContract[i].length_of_service;
        sumOfYears += years;
        sumOfMonths += months;
        sumOfDays += days;

        if (sumOfDays >= 365) {
            const extraYears = Math.floor(sumOfDays / 365);
            sumOfYears += extraYears;
            sumOfDays %= 365;
        }

        if (sumOfMonths >= 12) {
            const extraYears = Math.floor(sumOfMonths / 12);
            sumOfYears += extraYears;
            sumOfMonths %= 12;
        }

        if (sumOfMonths >= 1 && sumOfDays >= 30) {
            const extraMonths = Math.floor(sumOfDays / 30);
            sumOfMonths += extraMonths;
            sumOfDays %= 30;
        }
    }
    return sumOfYears;
};

export const calcStaffFunctionsAvg = (
    staff_functions?: components['schemas']['ArchiveServiceStaffFunctionRead'][],
) => {
    if (!staff_functions) return;
    let total_hours = 0;
    const count = staff_functions?.length;

    staff_functions.forEach((func) => {
        total_hours += Number(func?.hours_per_week ?? 0);
    });
    const average_hours = formatNumber(total_hours / count);

    function formatNumber(value: number): string {
        if (value % 1 === 0) {
            return value.toString();
        } else {
            return value.toFixed(2);
        }
    }

    return `${average_hours}/${total_hours}`;
};

export const deepCopy = (_object: Record<string, any>) => JSON.parse(JSON.stringify(_object));

export const isSubDivisionLast = (
    subDivision: components['schemas']['ArchiveStaffDivisionRead'],
    archiveStaffDivision: components['schemas']['ArchiveStaffDivisionRead'][],
) => {
    const lastElement = archiveStaffDivision[archiveStaffDivision.length - 1];
    if (lastElement.id === subDivision.id) {
        return true;
    }

    return false;
};

export const isStaffUnitInLastSubDivision = (
    staffUnit: components['schemas']['ArchiveStaffUnitRead'],
    archiveStaffDivision: components['schemas']['ArchiveStaffDivisionRead'][],
) => {
    const lastElement = archiveStaffDivision[archiveStaffDivision.length - 1];
    if (lastElement.id === staffUnit.staff_division_id) {
        return true;
    }

    return false;
};

async function fetchData(
    obj:
        | components['schemas']['ArchiveStaffDivisionRead']
        | components['schemas']['ArchiveStaffDivisionChildRead'],
): Promise<components['schemas']['ArchiveStaffDivisionRead'] | undefined> {
    // Отправить запрос и получить данные
    if (obj.id !== undefined) {
        try {
            const response = await PrivateServices.get('/api/v1/archive_staff_division/{id}/', {
                params: { path: { id: obj.id } },
            });
            if (response.data !== undefined) {
                // Обновить данные внутри объекта
                return {
                    ...obj,
                    children: response.data.children,
                    staff_units: response.data.staff_units,
                };
            }
        } catch (error) {
            // Обработка ошибки
            throw new Error('Error');
        }
    }
}

export const treeNotOpen = async (
    archiveStaffDivision: components['schemas']['ArchiveStaffDivisionRead'],
) => {
    const result = await fetchData(archiveStaffDivision);

    if (
        (result?.children !== null || result?.staff_units !== null) &&
        !Object.hasOwnProperty.call(result, 'isLocal') &&
        result
    ) {
        // Создать массив для обновленных дочерних объектов
        const updatedChildren: components['schemas']['ArchiveStaffDivisionRead'][] = [];

        if (result.children && result.children.length > 0) {
            // Обойти каждый дочерний объект
            for (const child of result.children) {
                // Отправить запрос и заполнить данные для дочернего объекта
                const updatedChild: components['schemas']['ArchiveStaffDivisionRead'] | undefined =
                    await fetchData(child);
                if (!updatedChild) {
                    return;
                }

                // Рекурсивно заполнить данные внутри дочернего объекта
                const populatedChild:
                    | components['schemas']['ArchiveStaffDivisionRead']
                    | undefined = await treeNotOpen(updatedChild);
                // Добавить заполненный дочерний объект в массив обновленных дочерних объектов
                if (populatedChild) {
                    updatedChildren.push(populatedChild);
                }
            }
        }

        // Обновить объект с обновленными дочерними объектами
        const updatedObj = { ...result, children: updatedChildren };

        // Вернуть обновленный объект
        return updatedObj;
    }
    return result;
};

export function replaceObjectById(
    json: components['schemas']['ArchiveStaffDivisionRead'][],
    id: string,
    replacement: components['schemas']['ArchiveStaffDivisionRead'],
): components['schemas']['ArchiveStaffDivisionRead'][] {
    return json.map((obj) => {
        if (obj.id === id) {
            return { ...replacement }; // Создаем новый объект
        }

        if (obj.children) {
            return { ...obj, children: replaceObjectById(obj.children as components['schemas']['ArchiveStaffDivisionRead'][], id, replacement) };
        }

        return obj;
    });
}

export const embedStaffUnitNodeActual = (
    embedded: ArrayElement<components['schemas']['StaffDivisionRead']['staff_units']> | any,
    embeddedInto: components['schemas']['StaffDivisionRead'] | string,
    staffDivision: components['schemas']['StaffDivisionRead'][],
) => {
    const embeddedCOPY: ArrayElement<
        components['schemas']['StaffDivisionRead']['staff_units']
    > = JSON.parse(JSON.stringify(embedded));
    const listCOPY: components['schemas']['StaffDivisionRead'][] = JSON.parse(
        JSON.stringify(staffDivision),
    );
    const embeddedIntoObj = findSubDivisionNodeActual(
        listCOPY,
        typeof embeddedInto === 'string' ? embeddedInto : embeddedInto.id,
    );

    if (embeddedIntoObj && Array.isArray(embeddedIntoObj.staff_units)) {
        const index = embeddedIntoObj.staff_units.findIndex((unit) => unit.id === embeddedCOPY.id);
        if (index !== -1) {
            embeddedIntoObj.staff_units[index] = embeddedCOPY; // Заменяем существующий объект
        } else {
            embeddedIntoObj.staff_units.push(embeddedCOPY); // Добавляем новый объект в конец
        }
    } else if (embeddedIntoObj?.staff_units === null) {
        embeddedIntoObj.staff_units = [embeddedCOPY];
    }
    return listCOPY;
};
export const findSubDivisionNodeActual = (
    staffDivisions: components['schemas']['StaffDivisionRead'][],
    departmentId?: string | null,
): components['schemas']['StaffDivisionRead'] | null | undefined  => {
    if (Array.isArray(staffDivisions) && staffDivisions.length) {
        let department:
            | ArrayElement<components['schemas']['StaffDivisionRead']['children']>
            | null
            | undefined = staffDivisions.find((item) => item.id === departmentId);
        if (department) {
            return department as components['schemas']['StaffDivisionRead'];
        } else {
            for (let i = 0; i < staffDivisions.length; i++) {
                const item = staffDivisions[i];
                if (item.children) {
                    department = findSubDivisionNodeActual(item.children as components['schemas']['StaffDivisionRead'][], departmentId);
                    if (department) {
                        return department as components['schemas']['StaffDivisionRead'];
                    }
                }
            }
        }
    }
    return null;
};
