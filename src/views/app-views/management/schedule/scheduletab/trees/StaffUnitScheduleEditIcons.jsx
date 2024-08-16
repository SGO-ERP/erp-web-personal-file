import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { Col, Row } from 'antd';

export const StaffUnitDivisionEditIcon = ({
    canEditSchedule,
    handleEditTwoToneClick,
    handleDeleteTwoToneClick,
}) => {
    if (!canEditSchedule) {
        return null;
    }
    return (
        <Col xs={2}>
            <Row style={{ display: 'flex', justifyContent: 'end' }}>
                <Col xs={24}>
                    <EditTwoTone onClick={handleEditTwoToneClick} />
                </Col>
                <Col xs={24}>
                    <DeleteTwoTone twoToneColor="#FF4D4F" onClick={handleDeleteTwoToneClick} />
                </Col>
            </Row>
        </Col>
    );
};
