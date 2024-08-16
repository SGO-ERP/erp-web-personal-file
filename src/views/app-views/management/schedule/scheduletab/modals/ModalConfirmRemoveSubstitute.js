import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Modal, Row, Typography } from 'antd';
import React from 'react';
import { change } from 'store/slices/schedule/archiveStaffDivision';
import { embedStaffUnitNode, findSubDivisionNode } from 'utils/schedule/utils';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/useStore';
import { editLocalStaffUnit } from '../../../../../../store/slices/schedule/Edit/staffUnit';
import {
    addRemoteStaffUnit,
    editRemoteStaffUnit,
} from '../../../../../../store/slices/schedule/Edit/staffUnit';

const { Text } = Typography;

const ModalConfirmRemoveSubstitute = ({ modalCase, openModal, staffUnit }) => {
    const currentLocale = localStorage.getItem('lan');
    const dispatch = useAppDispatch();
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);

    const LOCAL_archiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.local);
    const REMOTE_archiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.remote);

    const handleOk = () => {
        const foundStaffDivision = findSubDivisionNode(
            archiveStaffDivision,
            staffUnit.staff_division_id,
        );
        if (Object.prototype.hasOwnProperty.call(staffUnit, 'isLocal')) {
            const isExists = LOCAL_archiveStaffUnit.find((item) => item.id === staffUnit.id);
            if (isExists) {
                dispatch(
                    editLocalStaffUnit({
                        ...staffUnit,
                        isLocal: true,
                        user_replacing_id: null,
                    }),
                );
            }

            dispatch(
                change(
                    embedStaffUnitNode(
                        {
                            ...staffUnit,
                            isLocal: true,
                            user_replacing_id: null,
                        },
                        foundStaffDivision,
                        archiveStaffDivision,
                    ),
                ),
            );
        } else {
            const isExists = REMOTE_archiveStaffUnit.find(
                (staffUnit) => staffUnit.id === staffUnit?.id,
            );
            if (isExists) {
                dispatch(
                    editRemoteStaffUnit({
                        ...staffUnit,
                        user_replacing_id: null,
                    }),
                );
                dispatch(
                    change(
                        embedStaffUnitNode(
                            {
                                ...staffUnit,
                                user_replacing_id: null,
                            },
                            foundStaffDivision,
                            archiveStaffDivision,
                        ),
                    ),
                );
            } else {
                dispatch(
                    addRemoteStaffUnit({
                        ...staffUnit,
                        user_replacing_id: null,
                    }),
                );
                dispatch(
                    change(
                        embedStaffUnitNode(
                            {
                                ...staffUnit,
                                user_replacing_id: null,
                            },
                            foundStaffDivision,
                            archiveStaffDivision,
                        ),
                    ),
                );
            }
        }
        modalCase.showModalWarningDelSub(false);
    };

    function handleCancel() {
        modalCase.showModalWarningDelSub(false);
    }

    return (
        <Modal
            width={572}
            open={openModal}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={<IntlMessage id="schedule.modal.substitude.approve" />}
            cancelText={<IntlMessage id="staffSchedule.cancel" />}
        >
            <Row>
                <Col xs={2}>
                    <ExclamationCircleOutlined style={{ fontSize: '1.4rem', color: '#FAAD14' }} />
                </Col>
                <Col xs={20}>
                    <Row>
                        <Text strong>
                            <IntlMessage id="staffSchedule.confirmRemoveSubstitute" />
                        </Text>
                    </Row>
                    <Row style={{ marginTop: '4px' }}>
                        {currentLocale === 'kk' ? (
                            staffUnit?.user?.last_name && staffUnit?.user?.first_name ? (
                                <Text>
                                    Қызметкер{' '}
                                    {staffUnit?.user?.last_name + ' ' + staffUnit?.user?.first_name}{' '}
                                    сіз басқа алмастырушыны тағайындағанға дейін алмастырушысыз
                                    қалады
                                </Text>
                            ) : (
                                <Text>
                                    Қызметкер{' '}
                                    {staffUnit?.user_replacing?.last_name +
                                        ' ' +
                                        staffUnit?.user_replacing?.first_name}{' '}
                                    алмастырушының рөлінен алынып тасталады
                                </Text>
                            )
                        ) : staffUnit?.user?.last_name && staffUnit?.user?.first_name ? (
                            <Text>
                                Сотрудник{' '}
                                {staffUnit?.user?.last_name + ' ' + staffUnit?.user?.first_name}{' '}
                                останется без замещающего, пока вы не назначите другого замещающего
                            </Text>
                        ) : (
                            <Text>
                                Сотрудник{' '}
                                {staffUnit?.user_replacing?.last_name +
                                    ' ' +
                                    staffUnit?.user_replacing?.first_name}{' '}
                                будет убран с роли замещающего
                            </Text>
                        )}
                    </Row>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalConfirmRemoveSubstitute;
