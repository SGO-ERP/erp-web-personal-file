import { Col, Modal, Row } from 'antd';
import LocalizationText from '../../../../../../components/util-components/LocalizationText/LocalizationText';

export const StaffUnitFunctions = ({ staff_unit }) => {
    if (!staff_unit?.staff_functions?.length) {
        return null;
    }
    return (
        <div
            className="scrollbar"
            style={{
                overflowY: 'auto',
                overflowX: 'hidden',
                height: '210px',
                width: '100%',
                marginTop: '10px',
            }}
        >
            {staff_unit?.staff_functions?.map((item) => {
                return (
                    <Row
                        key={item.id}
                        style={{
                            background: '#F9F9FA',
                            border: '1px solid #E6EBF1',
                            borderRadius: '10px',
                            alignItems: 'center',
                            padding: '10px',
                            marginBottom: '10px',
                        }}
                    >
                        <Col xs={2}>{item.hours_per_week}</Col>
                        <Col xs={20}>{<LocalizationText text={item} />}</Col>
                    </Row>
                );
            })}
        </div>
    );
};
