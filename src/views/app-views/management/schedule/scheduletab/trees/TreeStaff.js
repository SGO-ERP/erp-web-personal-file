import { Card, Col, Row } from 'antd';
import { useAppSelector } from 'hooks/useStore';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { findStaffUnitNode, findSubDivisionNode } from 'utils/schedule/utils';
import TextAreaCard from './TextAreaCard';
import { TreeStaffFirstCol } from './TreeStaffFirstCol';
import { TreeStaffSecondCol } from './TreeStaffSecondCol';

const TreeStaff = () => {
    const [searchParams] = useSearchParams();

    const staffDivisionID = searchParams.get('staffDivision');
    const staffUnitID = searchParams.get('staffUnit');
    const selected = searchParams.get('type');

    const staffDivision = useAppSelector((state) => state.staffScheduleSlice.data);

    const [list, setList] = useState(null);
    const [staffUnit, setStaffUnit] = useState();
    const [staffUnitParent, setStaffUnitParent] = useState();

    useEffect(() => {
        if (selected !== 'staffDivision') {
            setList(null);
            return;
        }

        const divisionNode = findSubDivisionNode(staffDivision, staffDivisionID);
        if (divisionNode == null) {
            setList(null);
            return;
        }

        setList(divisionNode);
    }, [staffDivisionID, selected, staffDivision]);

    useEffect(() => {
        if (selected === 'staffUnit') {
            const foundStaffUnit = findStaffUnitNode(staffUnitID, staffDivision);
            setStaffUnit(foundStaffUnit);
            foundStaffUnit &&
                setStaffUnitParent(
                    findSubDivisionNode(staffDivision, foundStaffUnit?.staff_division_id),
                );
        }
    }, [selected, staffUnitID, searchParams, staffDivision]);

    return (
        <div>
            {selected === 'staffDivision' && list && <TextAreaCard selectedItem={list} />}
            {selected === 'staffUnit' && staffUnit && staffUnitParent && (
                <Card>
                    <Row
                        gutter={[18, 18]}
                        style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Col xs={24} lg={12} style={{ width: '50%' }}>
                            <TreeStaffFirstCol
                                staff_unit={staffUnit}
                                selectedItem={staffUnitParent}
                            />
                        </Col>
                        <Col xs={24} lg={12}>
                            <TreeStaffSecondCol
                                staff_unit={staffUnit}
                                selectedItem={staffUnitParent}
                            />
                        </Col>
                    </Row>
                </Card>
            )}
        </div>
    );
};

export default TreeStaff;
