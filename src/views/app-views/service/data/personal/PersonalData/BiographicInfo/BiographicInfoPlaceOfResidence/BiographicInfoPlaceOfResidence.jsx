import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import EditInput from '../../../common/EditInput';

export const BiographicInfoPlaceOfResidence = ({ bio }) => {
    const { t } = useTranslation()

    return (
        <Row align="middle">
            <Col xs={12} className={'font-style text-muted'}>
                {t("personal.biographicInfo.placeOfResidence")}
            </Col>
            <Col xs={12} className={'font-style'}>
                <EditInput
                    defaultValue={bio?.address || ''}
                    fieldName="allTabs.personal_data.biographic_info.address"
                    fieldNameGet="initialTabs.personal_data.biographic_info.address"
                />
            </Col>
        </Row>
    )
}