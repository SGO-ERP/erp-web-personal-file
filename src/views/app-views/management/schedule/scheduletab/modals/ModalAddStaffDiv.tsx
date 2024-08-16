import { components } from 'API/types';
import { Form, Modal, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { change } from 'store/slices/schedule/archiveStaffDivision';
import { embedSubDivisionNode, findSubDivisionNode } from 'utils/schedule/utils';
import Flex from '../../../../../../components/shared-components/Flex';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/useStore';
import uuidv4 from '../../../../../../utils/helpers/uuid';
import AddEditPosition from './AddEditPosition';
import {
    addLocalStaffDivision,
    addRemoteStaffDivision,
    editLocalStaffDivision,
    editRemoteStaffDivision,
} from 'store/slices/schedule/Edit/staffDivision';
import { addLocalStaffUnit } from 'store/slices/schedule/Edit/staffUnit';
import { addLocalVacancy } from 'store/slices/schedule/Edit/vacancy';
import AddEditDepartmentWithDivision from './AddEditDepartmentWithDivision';
import { PrivateServices } from '../../../../../../API';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    staffDivision?: components['schemas']['ArchiveStaffDivisionRead'];
}

const ModalAddStaffDiv = ({ isOpen, onClose, staffDivision }: Props) => {
    const [searchParams] = useSearchParams();

    const dispatch = useAppDispatch();
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);

    const staffListId = searchParams.get('staffListId');
    const [form] = Form.useForm();

    const [nameStaffDiv, setNameStaffDiv] = useState<string>('');
    const [nameStaffDivKZ, setNameStaffDivKZ] = useState<string>('');
    const [curatorDep, setCuratorDep] = useState<string>('');
    const [position, setPosition] = useState<components['schemas']['PositionRead']>();
    const [isLeader, setIsLeader] = useState(false);
    const [isCurator, setIsCurator] = useState(false);
    const [whichEdit, setWhichEdit] = useState('division');
    const [typeDiv, setTypeDiv] = useState<components['schemas']['StaffDivisionTypeRead'][]>([]);
    const [number, setNumber] = useState<number>(0);
    const [type, setType] = useState<components['schemas']['StaffDivisionTypeRead']>();

    const [response, setResponse] = useState<components['schemas']['ArchiveStaffDivisionRead']>();
    const [structure, setStructure] =
        useState<components['schemas']['ArchiveStaffDivisionRead'][]>(archiveStaffDivision);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setWhichEdit('division');
    }, [isOpen]);


    useEffect(() => {
        if (isOpen) {
            if (
                (staffDivision?.children?.length === 0 ||
                    staffDivision?.staff_units?.length === 0) &&
                !Object.hasOwnProperty.call(staffDivision, 'isLocal')
            ) {
                if (!staffDivision.id) return;
                PrivateServices.get('/api/v1/archive_staff_division/{id}/', {
                    params: { path: { id: staffDivision.id } },
                }).then((response) => {
                    if (response.data !== undefined) {
                        setResponse(response.data);
                        setLoading(true);
                    }
                });
            } else {
                setResponse(staffDivision);
            }
        }
    }, [staffDivision]);

    // Функция для отправки запроса и заполнения данных
    async function fetchData(
        obj:
            | components['schemas']['ArchiveStaffDivisionRead']
            | components['schemas']['ArchiveStaffDivisionChildRead'],
    ): Promise<components['schemas']['ArchiveStaffDivisionRead'] | undefined> {
        if (!obj.id) return;
        // Отправить запрос и получить данные
        const response = await PrivateServices.get('/api/v1/archive_staff_division/{id}/', {
            params: { path: { id: obj.id } },
        });
        const result = await response.data;

        if (result !== undefined) {
            const updatedObj = {
                ...obj,
                children: result.children,
                staff_units: result.staff_units,
            };

            // Вернуть обновленный объект
            return updatedObj;
        }
    }

    // Функция для рекурсивного заполнения данных в объекте
    async function populateData(
        obj: components['schemas']['ArchiveStaffDivisionRead'],
    ): Promise<components['schemas']['ArchiveStaffDivisionRead'] | undefined> {
        // Проверить, есть ли у объекта дочерние элементы
        if (
            (obj?.children !== null || obj?.staff_units !== null) &&
            !Object.hasOwnProperty.call(obj, 'isLocal') &&
            obj
        ) {
            // Создать массив для обновленных дочерних объектов
            const updatedChildren: components['schemas']['ArchiveStaffDivisionRead'][] = [];

            if (obj.children && obj.children.length > 0) {
                // Обойти каждый дочерний объект
                for (const child of obj.children) {
                    // Отправить запрос и заполнить данные для дочернего объекта
                    const updatedChild:
                        | components['schemas']['ArchiveStaffDivisionRead']
                        | undefined = await fetchData(child);
                    if (!updatedChild) {
                        return;
                    }

                    // Рекурсивно заполнить данные внутри дочернего объекта
                    const populatedChild:
                        | components['schemas']['ArchiveStaffDivisionRead']
                        | undefined = await populateData(updatedChild);
                    // Добавить заполненный дочерний объект в массив обновленных дочерних объектов
                    if (populatedChild) {
                        updatedChildren.push(populatedChild);
                    }
                }
            }

            // Обновить объект с обновленными дочерними объектами
            const updatedObj = { ...obj, children: updatedChildren };

            // Вернуть обновленный объект
            return updatedObj;
        }

        // Если у объекта нет дочерних элементов, вернуть его без изменений
        return obj;
    }

    useEffect(() => {
        if (response !== undefined) {
            if (response.children !== null)
                populateData(response).then((updatedObj) => {
                    setLoading(false);
                    setResponse(updatedObj);
                });
        }
    }, [loading]);

    useEffect(() => {
        if (typeDiv.length === 0 && isOpen) {
            const createdStaffUnit = PrivateServices.get('/api/v1/staff_division/types', {
                params: {
                    query: {
                        skip: 0,
                        limit: 100,
                    },
                },
            }).then((response) => {
                response.data !== undefined && setTypeDiv(response.data);
            });
        }
    }, []);

    const updateChildrenRecursively = (
        items:
            | components['schemas']['ArchiveStaffDivisionRead'][]
            | components['schemas']['ArchiveStaffDivisionChildRead'][],
        id: string,
        newData: components['schemas']['ArchiveStaffDivisionRead'],
    ): components['schemas']['ArchiveStaffDivisionRead'][] | components['schemas']['ArchiveStaffDivisionChildRead'][] => {
        return (items as components['schemas']['ArchiveStaffDivisionRead'][]).map((item) => {
            if (item.id === id) {
                return { ...item, children: newData.children, staff_units: newData.staff_units };
            } else if (item?.children) {
                return { ...item, children: updateChildrenRecursively(item.children, id, newData) };
            }
            return item;
        });
    };

    useEffect(() => {
        if (
            isOpen &&
            !Object.hasOwnProperty.call(staffDivision, 'isLocal') &&
            (staffDivision?.children?.length === 0 || staffDivision?.staff_units?.length === 0)
        ) {
            if (!staffDivision?.id) return;
            PrivateServices.get('/api/v1/archive_staff_division/{id}/', {
                params: { path: { id: staffDivision?.id } },
            }).then((response) => {
                setStructure((prevStructure) => {
                    return prevStructure.map((child) => {
                        if (
                            response.data !== undefined &&
                            child.children &&
                            staffDivision.id !== undefined
                        ) {
                            const updatedStructure = updateChildrenRecursively(
                                child.children,
                                staffDivision?.id,
                                response?.data,
                            );
                            return { ...child, children: updatedStructure };
                        }
                        return child;
                    });
                    return prevStructure;
                });
            });
        }
    }, []);

    const handleOk = async () => {
        await form.validateFields();
        const values = form.getFieldsValue() as Record<string, string>;

        const isFormEmpty = Object.values(values).every((value) => (value && value.trim()) === '');
        if (isFormEmpty) {
            form.setFields([
                {
                    name: 'nameRu',
                    errors: ['Поле обязательно для заполнения'],
                },
                {
                    name: 'nameKz',
                    errors: ['Поле обязательно для заполнения'],
                },
            ]);
            return;
        }
        if (!staffDivision) return;
        if (whichEdit === 'division' && staffDivision && staffListId) {
            const staffDivisionId = uuidv4();

            const number_and_type = {
                ...(number && type
                    ? {
                          type_id: type?.id,
                          staff_division_number: number,
                          type: type,
                      }
                    : {
                          type_id: null,
                          staff_division_number: null,
                      }),
            };

            dispatch(
                addLocalStaffDivision({
                    isLocal: true,
                    id: staffDivisionId,
                    name: nameStaffDiv ?? '',
                    nameKZ: nameStaffDivKZ ?? '',
                    staff_list_id: staffListId,
                    parent_group_id: staffDivision.id,
                    ...number_and_type,
                }),
            );
            const parentGroupId = {
                ...(staffDivision.name === 'Управление службой'
                    ? { parent_group_id: null }
                    : { parent_group_id: staffDivision.id }),
            };

            dispatch(
                change(
                    embedSubDivisionNode(
                        structure,
                        {
                            id: staffDivisionId,
                            ...parentGroupId,
                            ...number_and_type,
                            name: nameStaffDiv ?? '',
                            nameKZ: nameStaffDivKZ ?? '',
                            staff_list_id: staffListId,
                            hr_vacancy: [],
                            isLocal: true,
                            // @ts-expect-error Accepts
                            staff_units: null,
                            // @ts-expect-error Accepts
                            children: null,
                        },
                        staffDivision,
                    ),
                ),
            );
            handleCancel();
        }

        if (!position) return;
        else if (
            whichEdit === 'position' &&
            typeof staffDivision.id === 'string' &&
            typeof position.id === 'string'
        ) {
            const staffUnitId = uuidv4();
            const newVacancy = {
                id: uuidv4(),
                staff_unit_id: staffUnitId,
                isLocal: true,
                is_active: false,
                isStaffUnitLocal: true,
            };
            dispatch(addLocalVacancy(newVacancy));
            if (isCurator) {
                dispatch(
                    addLocalStaffUnit({
                        id: staffUnitId,
                        isLocal: true,
                        staff_division_id: staffDivision.id,
                        position_id: position.id,
                        position: position,
                        curator_of_id: curatorDep
                    }),
                );
            } else {
                dispatch(
                    addLocalStaffUnit({
                        id: staffUnitId,
                        isLocal: true,
                        staff_division_id: staffDivision.id,
                        position_id: position.id,
                        position: position
                    }),
                );
            }
            const leader = {
                ...(isLeader && {
                    leader_id: staffUnitId,
                }),
            };
            const curator = {
                ...(isCurator ? {
                    curator_of_id: curatorDep,
                } : {
                    curator_of_id: null
                }),
            };
            if (!response) return;
            dispatch(
                change(
                    embedSubDivisionNode(
                        archiveStaffDivision,
                        {
                            ...response,
                            ...leader,
                            staff_units: [
                                ...(response.staff_units ?? []),
                                {
                                    id: staffUnitId,
                                    position_id: position.id,
                                    staff_division_id: staffDivision.id,
                                    // @ts-expect-error Accepts
                                    isLocal: true,
                                    position: position,
                                    // @ts-expect-error Accepts
                                    actual_position: null,
                                    // @ts-expect-error Accepts
                                    actual_position_id: null,
                                    user: null,
                                    hr_vacancy: [newVacancy],
                                    user_id: null,
                                    user_replacing_id: null,
                                    type_id: staffDivision.type_id,
                                    type: staffDivision.type,
                                    staff_division_number: number,
                                    ...curator
                                },
                            ],
                        },
                        staffDivision.parent_group_id,
                    ),
                ),
            );
            if (isLeader) {
                if (Object.prototype.hasOwnProperty.call(staffDivision, 'isLocal')) {
                    if (type !== undefined)
                        dispatch(
                            editLocalStaffDivision({
                                ...staffDivision,
                                isLocal: true,
                                id: staffDivision.id,
                                leader_id: staffUnitId,
                                type_id: staffDivision.type_id,
                                staff_division_number: staffDivision.staff_division_number,
                            }),
                        );
                } else {
                    if (!response) return;
                    const foundStaffDiv = findSubDivisionNode(
                        archiveStaffDivision,
                        staffDivision.id,
                    );

                    if (foundStaffDiv)
                        if (type !== undefined)
                            dispatch(
                                editRemoteStaffDivision({
                                    ...response,
                                    id: staffDivision.id,
                                    leader_id: staffUnitId,
                                    type_id: staffDivision.type_id,
                                    staff_division_number: staffDivision.staff_division_number,
                                }),
                            );
                        else
                            dispatch(
                                addRemoteStaffDivision({
                                    ...response,
                                    id: staffDivision.id,
                                    leader_id: staffUnitId,
                                    type_id: staffDivision.type_id,
                                    staff_division_number: staffDivision.staff_division_number,
                                }),
                            );
                }
            }
            handleCancel();
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };
    return (
        <Modal
            title={
                whichEdit === 'division' ? (
                    <IntlMessage id={'staffSchedule.modal.addDivision'} />
                ) : (
                    <IntlMessage id={'staffSchedule.modal.editPosition'} />
                )
            }
            open={isOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={<IntlMessage id="staffSchedule.history.save" />}
            cancelText={<IntlMessage id="staffSchedule.cancel" />}
        >
            <Flex alignItems="center" justifyContent="center" mobileFlex={false}>
                <Radio.Group value={whichEdit}>
                    <Radio.Button
                        value="division"
                        // @ts-expect-error value doesn't exist on type EventTarget
                        onClick={(e) => setWhichEdit(e.target.value)}
                    >
                        <IntlMessage id="personal.generalInfo.division" />
                    </Radio.Button>
                    <Radio.Button
                        // disabled={staffDivision?.parent_group_id === null}
                        value="position"
                        // @ts-expect-error value doesn't exist on type EventTarget
                        onClick={(e) => setWhichEdit(e.target.value)}
                    >
                        <IntlMessage id="personal.generalInfo.post" />
                    </Radio.Button>
                </Radio.Group>
            </Flex>
            <br />
            {whichEdit === 'division' ? (
                <AddEditDepartmentWithDivision
                    setNumber={setNumber}
                    setType={setType}
                    setNameStaffDiv={setNameStaffDiv}
                    setNameStaffDivKZ={setNameStaffDivKZ}
                    form={form}
                    typeDiv={typeDiv}
                    staffDivision={staffDivision}
                />
            ) : (
                whichEdit === 'position' && (
                    <AddEditPosition
                        setIsLeader={setIsLeader}
                        staffDivision={staffDivision}
                        form={form}
                        setPosition={setPosition}
                        isCurator={isCurator}
                        setIsCurator={setIsCurator}
                        isOpen={isOpen}
                        setCuratorDep={setCuratorDep}
                    />
                )
            )}
        </Modal>
    );
};
export default ModalAddStaffDiv;
