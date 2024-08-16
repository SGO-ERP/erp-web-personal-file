import { Col, Row } from 'antd';
import { useAppSelector } from 'hooks/useStore';
import React, { useEffect, useState } from 'react';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { PrivateServices } from 'API';
import ModalAddEditUserRepacingInActual from '../modals/ModalAddEditUserRepacingInActual';
import { StaffUnitFunctions } from './StaffUnitFunctions';
import { StaffUnitScheduleSubstitute } from './StaffUnitScheduleSubstitute';
import { StaffUnitDivisionEdit } from './StaffUnitDivistionEdit/StaffUnitDivistionEdit';
import { PERMISSION } from 'constants/permission';

export const TreeStaffSecondCol = ({ staff_unit, selectedItem }) => {
    const [divisionParents, setDivisionParents] = useState([]);
    const [isOpenUserRepl, setIsOpenUserRepl] = useState(false);
    const [type, setType] = useState('');

    const myPermissions = useAppSelector((state) => state.profile.permissions);

    const canEditSchedule = myPermissions?.includes(PERMISSION.STAFF_LIST_EDITOR);

    useEffect(() => {
        function getDivisionParents(division) {
            const updatedParents = [
                {
                    id: division?.id,
                    name: division.name,
                    nameKZ: division.nameKZ,
                    type: division.type,
                    staff_division_number: division.staff_division_number,
                },
            ];
            if (division.children && division.children.length > 0) {
                getDivisionParents(division.children[0], updatedParents);
            } else {
                setDivisionParents(updatedParents);
            }
        }

        const seeLastChildren = async () => {
            if (staff_unit?.actual_users?.length <= 0) {
                return;
            }
            try {
                const r = await PrivateServices.get(
                    '/api/v1/staff_division/division_parents/{id}/',
                    {
                        params: {
                            path: {
                                id: staff_unit?.staff_division_id,
                            },
                        },
                    },
                );
                getDivisionParents(r.data);
            } catch (error) {
                console.error(error);
            }
        };

        seeLastChildren();
    }, []);

    return (
        <div>
            <ModalAddEditUserRepacingInActual
                isOpen={isOpenUserRepl}
                staffUnit={staff_unit}
                onClose={() => setIsOpenUserRepl(false)}
                type={type}
            />
            <div
                style={{
                    background: '#F9F9FA',
                    border: '1px solid #E6EBF1',
                    borderRadius: '10px',
                    alignItems: 'center',
                    padding: '12px',
                    marginBottom: '12px',
                }}
            >
                <Row gutter={16}>
                    <Col xs={staff_unit.user_replacing !== null ? 14 : 24}>
                        <Row>
                            <IntlMessage id={'scheduel.substitute'} />:
                        </Row>
                        <StaffUnitScheduleSubstitute
                            staff_unit={staff_unit}
                            canEditSchedule={canEditSchedule}
                            setType={setType}
                            setIsOpenUserRepl={setIsOpenUserRepl}
                        />
                    </Col>
                    <StaffUnitDivisionEdit
                        divisionParents={divisionParents}
                        staff_unit={staff_unit}
                        canEditSchedule={canEditSchedule}
                        setType={setType}
                        setIsOpenUserRepl={setIsOpenUserRepl}
                    />
                </Row>
            </div>
            <div>
                <IntlMessage id={'scheduel.functional'} />
            </div>
            <StaffUnitFunctions />
        </div>
    );
};
