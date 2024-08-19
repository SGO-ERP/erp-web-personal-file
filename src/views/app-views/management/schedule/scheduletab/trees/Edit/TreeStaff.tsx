import { components } from 'API/types';
import { Card, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { findStaffUnitNode, findSubDivisionNode } from 'utils/schedule/utils';
import { useAppSelector } from '../../../../../../../hooks/useStore';
import { FirstCol } from './FirstCol';
import { SecondCol } from './SecondCol';
import EditTextAreaCard from './TextAreaCard';

const TreeStaff = () => {
    const [searchParams] = useSearchParams();
    const staffDivisionID = searchParams.get('staffDivision');
    const staffUnitID = searchParams.get('staffUnit');
    const selected = searchParams.get('type');
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);
    const [staffDivision, setStaffDivision] =
        useState<components['schemas']['ArchiveStaffDivisionRead']>();
    const [staffUnit, setStaffUnit] = useState<components["schemas"]["ArchiveStaffUnitRead"] & { curator_of_id: string }>();
    const [staffUnitParent, setStaffUnitParent] =
        useState<components['schemas']['ArchiveStaffDivisionRead']>();

    useEffect(() => {
        if (selected !== 'staffDivision' && !staffDivisionID) {
            return;
        }
        const foundStaffDivision = findSubDivisionNode(archiveStaffDivision, staffDivisionID);
        foundStaffDivision && setStaffDivision(foundStaffDivision);
    }, [staffDivisionID, searchParams, selected, archiveStaffDivision]);

    useEffect(() => {
        if (selected === 'staffUnit' && staffUnitID) {
            const foundStaffUnit: components["schemas"]["ArchiveStaffUnitRead"] & { curator_of_id: string } = findStaffUnitNode(staffUnitID, archiveStaffDivision) as components["schemas"]["ArchiveStaffUnitRead"] & { curator_of_id: string };
            foundStaffUnit && setStaffUnit(foundStaffUnit);
        }
    }, [selected, staffUnitID, searchParams, archiveStaffDivision]);

    useEffect(() => {
        const foundStaffDivision = findSubDivisionNode(
            archiveStaffDivision,
            staffUnit?.staff_division_id,
        );
        foundStaffDivision && setStaffUnitParent(foundStaffDivision);
    }, [staffUnitID, selected, searchParams, archiveStaffDivision, staffUnit]);

    return (
        <div>
            {selected === 'staffDivision' && staffDivision && (
                <EditTextAreaCard key={staffDivision.id} selectedItem={staffDivision} />
            )}
            {selected === 'staffUnit' && staffUnit && staffUnitParent && (
                <Card key={staffUnit.id}>
                    <Row
                        gutter={[18, 18]}
                        style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Col xs={24} sm={24} lg={12}>
                            <FirstCol staffUnit={staffUnit} staffDivision={staffUnitParent} />
                        </Col>
                        <Col xs={24} sm={24} lg={12}>
                            <SecondCol staffUnit={staffUnit} staffDivision={staffUnitParent} />
                        </Col>
                    </Row>
                </Card>
            )}
        </div>
    );
};

export default TreeStaff;
