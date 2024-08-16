import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Modal, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { change } from 'store/slices/schedule/archiveStaffDivision';
import { removeSubDivisionNode } from 'utils/schedule/utils';
import { components } from '../../../../../../API/types';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { LocalText } from '../../../../../../components/util-components/LocalizationText/LocalizationText';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/useStore';
import {
    removeRemoteStaffDivision,
    removeLocalStaffDivision,
} from '../../../../../../store/slices/schedule/Edit/staffDivision';
import { addRemoteDisposal } from 'store/slices/schedule/Edit/disposal';
import { removeLocalStaffUnit } from 'store/slices/schedule/Edit/staffUnit';
import { PrivateServices } from '../../../../../../API';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    item?: components['schemas']['ArchiveStaffDivisionRead'];
}

const ModalDeleteStaffDivision = ({ isOpen, onClose, item }: Props) => {
    const dispatch = useAppDispatch();
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);
    const LOCAL_archiveStaffDivision = useAppSelector(
        (state) => state.editArchiveStaffDivision.local,
    );
    const LOCAL_archiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.local);
    const [responce, setResponce] = useState<components['schemas']['ArchiveStaffDivisionRead']>();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getArchiveStaffUnitsFromParent = (
        staff_division: components['schemas']['ArchiveStaffDivisionRead'],
    ) => {
        let res: components['schemas']['ArchiveStaffUnitRead'][] = [];
        staff_division?.staff_units?.forEach(
            (staffUnit: components['schemas']['ArchiveStaffUnitRead']) => {
                res.push(staffUnit);
            },
        );
        if (staff_division?.children !== undefined && staff_division?.children?.length > 0) {
            for (const child of staff_division.children) {
                res = res.concat(getArchiveStaffUnitsFromParent(child));
            }
        }
        return res;
    };

    useEffect(() => {
        if (item?.id !== undefined)
            if (isOpen && !Object.prototype.hasOwnProperty.call(item, 'isLocal')) {
                PrivateServices.get('/api/v1/archive_staff_division/{id}/', {
                    params: { path: { id: item.id } },
                }).then((response) => {
                    if (response.data !== undefined) setResponce(response.data);
                    setLoading(true);
                });
            }
    }, [item]);

    async function fetchData(obj: components['schemas']['ArchiveStaffDivisionRead']) {
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
    async function populateData(obj: components['schemas']['ArchiveStaffDivisionRead']) {
        // Проверить, есть ли у объекта дочерние элементы
        if (obj.children && obj.children.length > 0) {
            // Создать массив для обновленных дочерних объектов
            const updatedChildren = [];

            // Обойти каждый дочерний объект
            for (const child of obj.children) {
                // Отправить запрос и заполнить данные для дочернего объекта
                const updatedChild: components['schemas']['ArchiveStaffDivisionRead'] =
                    await fetchData(child);

                // Рекурсивно заполнить данные внутри дочернего объекта
                const populatedChild: components['schemas']['ArchiveStaffDivisionRead'] =
                    await populateData(updatedChild);

                // Добавить заполненный дочерний объект в массив обновленных дочерних объектов
                updatedChildren.push(populatedChild);
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
        if (responce !== undefined)
            if (responce.children !== null) {
                populateData(responce).then((updatedObj) => {
                    setLoading(false);
                    setResponce(updatedObj);
                });
            }
    }, [loading]);

    const handleOk = () => {
        setIsLoading(true);
        if (item) {
            if (!item.id) return;
            if (Object.prototype.hasOwnProperty.call(item, 'isLocal')) {
                dispatch(
                    removeLocalStaffDivision({
                        id: item.id,
                    }),
                );
                setIsLoading(false);
                LOCAL_archiveStaffDivision.forEach((staffDivision) => {
                    if (staffDivision.parent_group_id === item.id) {
                        dispatch(
                            removeLocalStaffDivision({
                                id: staffDivision.id,
                            }),
                        );
                    }
                });
                LOCAL_archiveStaffUnit.forEach((archiveStaffUnit) => {
                    if (archiveStaffUnit.staff_division_id === item.id) {
                        dispatch(
                            removeLocalStaffUnit({
                                id: archiveStaffUnit.id,
                            }),
                        );
                    }
                });
            } else {
                getArchiveStaffUnitsFromParent(responce).forEach((staffUnit) => {
                    if (staffUnit.user_id !== null) {
                        dispatch(addRemoteDisposal(staffUnit));
                    }
                });
                dispatch(
                    removeRemoteStaffDivision({
                        id: item.id,
                    }),
                );
                setIsLoading(false);
            }
            dispatch(change(removeSubDivisionNode(item.id, archiveStaffDivision)));
            onClose();
        }
    };

    if (item === undefined) {
        return null;
    }

    return (
        <Modal
            title={<IntlMessage id={'modal.delete.staffDiv'} />}
            open={isOpen}
            onCancel={onClose}
            onOk={handleOk}
            okText={<IntlMessage id="initiate.deleteAll" />}
            cancelText={<IntlMessage id="staffSchedule.cancel" />}
        >
            <Spin spinning={isLoading}>
                <Row justify="center">
                    <Col xs={2} className="gutter-row">
                        <ExclamationCircleOutlined
                            style={{ fontSize: '1.4rem', color: '#FAAD14' }}
                        />
                    </Col>
                    <Col xs={20} className="gutter-row">
                        <Row>
                            <IntlMessage id="modal.delete.staffDiv" /> &nbsp;
                            {LocalText.getName(item)}?
                        </Row>
                    </Col>
                </Row>
            </Spin>
        </Modal>
    );
};

export default ModalDeleteStaffDivision;
