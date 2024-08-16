import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Modal, Row, Typography } from 'antd';
import { change } from 'store/slices/schedule/archiveStaffDivision';
import {
    embedStaffUnitNode,
    embedSubDivisionNode,
    findSubDivisionNode,
    removeStaffUnitNode,
} from 'utils/schedule/utils';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/useStore';
import {
    editRemoteStaffUnit,
    editLocalStaffUnit,
    addRemoteStaffUnit,
} from 'store/slices/schedule/Edit/staffUnit';
import { useEdit } from 'hooks/schedule/useEdit';
import { addRemoteDisposal } from 'store/slices/schedule/Edit/disposal';
import uuidv4 from 'utils/helpers/uuid';
import { addLocalVacancy } from 'store/slices/schedule/Edit/vacancy';
import { useNavigate } from 'react-router-dom';
import { components } from 'API/types';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { objectToQueryString } from 'utils/helpers/common';
const { Text } = Typography;

const ModalConfirmRemoveCandidatePosition = ({
    modalCase,
    openModal,
    staffUnit,
    staffDivision,
}) => {
    const navigate = useNavigate();
    const currentLocale = localStorage.getItem('lan');
    const dispatch = useAppDispatch();
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);
    // const localArchiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.local);
    // const remoteArchiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.remote);
    const [searchParams] = useSearchParams();
    const staffListId = searchParams.get('staffListId');

    const mode = searchParams.get('mode');
    const [isEdit, setIsEdit] = useState(false);
    useEffect(() => {
        if (mode === 'edit') {
            setIsEdit(true);
        }
    }, [mode, searchParams]);
    const { duplicateStaffUnit } = useEdit();

    const handleOk = () => {
        const foundStaffDivision = findSubDivisionNode(
            archiveStaffDivision,
            staffUnit.staff_division_id,
        );
        if (!Object.prototype.hasOwnProperty.call(staffUnit, 'isLocal')) {
            duplicateStaffUnit(staffUnit);

            dispatch(addRemoteDisposal(staffUnit));
            const newStaffUnitId = uuidv4();
            const newVacancy = {
                id: uuidv4(),
                is_active: true,
                staff_unit_id: newStaffUnitId,
                archive_staff_unit_id: newStaffUnitId,
                isStaffUnitLocal: true,
            };
            dispatch(addLocalVacancy(newVacancy));
            const dispositionList = archiveStaffDivision[archiveStaffDivision.length - 1];
            const newDispositionList = {
                ...dispositionList,
                staff_units: [...(dispositionList.staff_units ?? []), staffUnit],
            };
            dispatch(
                change(
                    embedStaffUnitNode(
                        {
                            ...staffUnit,
                            id: newStaffUnitId,
                            user_id: null,
                            user: null,
                            hr_vacancy: [newVacancy],
                        },
                        foundStaffDivision,
                        embedSubDivisionNode(
                            removeStaffUnitNode(staffUnit.id, archiveStaffDivision),
                            newDispositionList,
                            null,
                        ),
                    ),
                ),
            );
        }

        const queryParams = {
            ...(isEdit && {
                'mode': mode,
            }),
            'type': 'staffDivision',
            'staffDivision': staffDivision.id,
            'staffListId': staffListId,
        };
        navigate(
            `${APP_PREFIX_PATH}/management/schedule/${
                isEdit ? 'edit/' : 'history/'
            }?${objectToQueryString(queryParams)}`,
        );

        modalCase.showModalWarningDelUser(false);
    };

    function handleCancel() {
        modalCase.showModalWarningDelUser(false);
    }

    return (
        <Modal
            open={openModal}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={<IntlMessage id="yes" />}
            cancelText={<IntlMessage id="no" />}
        >
            <Row justify="center">
                <Col xs={2} className="gutter-row">
                    <ExclamationCircleOutlined style={{ fontSize: '1.4rem', color: '#FAAD14' }} />
                </Col>
                <Col xs={20} className="gutter-row">
                    <Row>
                        <Text strong>
                            <IntlMessage id="staffSchedule.confirmRemoveCandidatePosition" />
                        </Text>
                    </Row>
                    <Row style={{ marginTop: '4px' }}>
                        {currentLocale === 'kk' ? (
                            <Text>
                                Егер сіз{' '}
                                {staffUnit?.user?.last_name + ' ' + staffUnit?.user?.first_name}{' '}
                                қызметкерді басқа позицияға, өзгерістерді сақтамас бұрын қоймасаңыз
                                , ол <b>“билік ету“</b> тізіміне енгізіледі.
                            </Text>
                        ) : (
                            <Text>
                                Если вы не поместите сотрудника{' '}
                                {staffUnit?.user?.last_name + ' ' + staffUnit?.user?.first_name} на
                                другую позицию перед сохранением изменений, он(-а) будет занесен в
                                списки <b>“В распоряжение”</b>.
                            </Text>
                        )}
                    </Row>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalConfirmRemoveCandidatePosition;
