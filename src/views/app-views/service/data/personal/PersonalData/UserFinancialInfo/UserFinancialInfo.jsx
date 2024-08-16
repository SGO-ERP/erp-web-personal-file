import { Col, Row } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import CollapseErrorBoundary from '../../common/CollapseErrorBoundary';
import NoData from '../../NoData';
import { useState } from 'react';
import ModalEditFinancialInfo from './ModalEditFinancialInfo';
import { useSelector } from 'react-redux';
import { useAppSelector } from '../../../../../../../hooks/useStore';
import { PERMISSION } from 'constants/permission';

const UserFinancialInfo = ({ financial, source }) => {
    const [isVisible, setIsVisible] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const financialState = useSelector((state) => state.myInfo.edited.personal_data.financial_info);
    const isEdited = financialState.iban || financialState.housing_payments_iban;

    const handleContainerClick = () => {
        if (!(modeRedactor && isHR)) return;
        setIsVisible(true);
    };

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <ModalEditFinancialInfo
                info={isEdited ? financialState : financial}
                isOpen={isVisible}
                onClose={() => setIsVisible(false)}
                source={source}
            />
            <Row
                gutter={[18, 16]}
                onClick={handleContainerClick}
                className={modeRedactor && 'clickable-accordion'}
            >
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style text-muted'}>
                    IBAN
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                    {isEdited ? financialState.iban || '' : financial.iban || ''}
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style text-muted'}>
                    <IntlMessage id="personal.userFinancialInfo.specialAccount" />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                    {isEdited
                        ? financialState.housing_payments_iban || ''
                        : financial.housing_payments_iban || ''}
                </Col>
            </Row>
        </CollapseErrorBoundary>
    );
};

export default UserFinancialInfo;
