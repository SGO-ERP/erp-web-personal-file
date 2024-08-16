import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { components } from 'API/types';
import { List, Row, Col, notification } from 'antd';
import LocalizationText from 'components/util-components/LocalizationText/LocalizationText';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import React, { useState } from 'react';
import { embedStaffUnitNode } from 'utils/schedule/utils';
import ModalEditPositionFunction from '../../modals/ModalEditPositionFunction';
import { change } from 'store/slices/schedule/archiveStaffDivision';
import IntlMessage from 'components/util-components/IntlMessage';
import {
    removeLocalStaffFunction,
    removeRemoteStaffFunction,
} from 'store/slices/schedule/Edit/staffFunctions';

interface Props {
    staffUnit: components['schemas']['ArchiveStaffUnitRead'];
}

export const Functions = ({ staffUnit }: Props) => {
    const dispatch = useAppDispatch();
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);
    const [isEdit, setIsEdit] = useState(false);
    const [selected, setSelected] =
        useState<components['schemas']['ArchiveServiceStaffFunctionRead']>();
    const functionDeleteStaffFunc = (
        _function: components['schemas']['ArchiveStaffFunctionRead'],
    ) => {
        if (!staffUnit?.id || !_function.id || !staffUnit.staff_division_id) {
            notification.error({
                message: <IntlMessage id="schedule.vacancy.error.message" />,
            });
            return;
        }
        const isLocal = Object.prototype.hasOwnProperty.call(_function, 'isLocal');
        if (isLocal) {
            dispatch(
                removeLocalStaffFunction({
                    id: _function.id,
                }),
            );
        } else {
            dispatch(
                removeRemoteStaffFunction({
                    id: _function.id,
                    staff_unit_id: staffUnit?.id,
                }),
            );
        }

        const { staff_functions, ...rest } = staffUnit;
        const filteredStaffFunctions = staff_functions?.filter((_item) => {
            if (_item?.id !== _function?.id) {
                return true;
            }
            return false;
        });
        const updatedStaffUnit = { ...rest, staff_functions: filteredStaffFunctions };
        dispatch(
            change(
                embedStaffUnitNode(
                    updatedStaffUnit,
                    staffUnit.staff_division_id,
                    archiveStaffDivision,
                ),
            ),
        );
    };

    const renderCards = () => {
        if (staffUnit?.staff_functions !== null && staffUnit.staff_functions !== undefined) {
            const cards = Array.from((staffUnit.staff_functions ?? []).values()).map(
                (_function) => (
                    <List.Item key={_function.id}>
                        <Row
                            key={_function.id}
                            style={{
                                background: '#F9F9FA',
                                border: '1px solid #E6EBF1',
                                borderRadius: '10px',
                                alignItems: 'center',
                                padding: '10px',
                                marginBottom: '10px',
                            }}
                        >
                            <Col xs={2}>{_function?.hours_per_week}</Col>&nbsp;
                            <Col xs={17}>
                                <LocalizationText text={_function} />
                            </Col>
                            <Col xs={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {_function.discriminator === 'service_staff_function' && (
                                    <>
                                        <EditTwoTone
                                            onClick={() => {
                                                setIsEdit(true);
                                                setSelected(_function);
                                            }}
                                        />
                                        &nbsp;&nbsp;
                                        <DeleteTwoTone
                                            twoToneColor="#FF4D4F"
                                            onClick={() => {
                                                functionDeleteStaffFunc(_function);
                                            }}
                                        />
                                    </>
                                )}
                            </Col>
                        </Row>
                    </List.Item>
                ),
            );

            return cards;
        }
    };

    return (
        <>
            <ModalEditPositionFunction
                isOpen={isEdit}
                onClose={() => setIsEdit(false)}
                staffUnit={staffUnit}
                _function={selected}
            />
            <List
                className="scrollbar"
                grid={{ gutter: 12, column: 1 }}
                dataSource={renderCards()}
                renderItem={(_function) => _function}
                style={{ overflowY: 'auto', overflowX: 'hidden', height: '250px', width: '100%' }}
            />
        </>
    );
};
