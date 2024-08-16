import { Col } from 'antd';
import LocalizationText, {
    LocalText,
} from '../../../../../../components/util-components/LocalizationText/LocalizationText';

export const StaffUnitDivisionItem = ({ division }) => {
    if (division.type === null) {
        return (
            <Col xs={24} style={{ color: '#366EF6', display: 'flex', justifyContent: 'flex-end' }}>
                <LocalizationText text={division} />
            </Col>
        );
    }
    return (
        <Col xs={24} style={{ color: '#366EF6', display: 'flex', justifyContent: 'flex-end' }}>
            {division?.staff_division_number + ' ' + LocalText.getName(division?.type)}
        </Col>
    );
};
