import { Col, Row, Select } from 'antd';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useTranslation } from 'react-i18next';
import {
    setAllTabsPersonalDataBiographicInfoFamilyStatus,
    setInitialTabsPersonalDataBiographicInfoFamilyStatus,
} from '../../../../../../../../store/slices/myInfo/myInfoSlice';
import { defaultText } from '../data';

export const BiographicInfoFamilyStatus = ({ bio }) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const familyStatuses = useAppSelector((state) => state.personalInfo.familyStatuses);
    const modeRedactor = useAppSelector((state) => state.myInfo.modeRedactor);

    const familyStatusOptions = familyStatuses?.map((item) => ({
        label: LocalText.getName(item),
        value: item.id,
    }));
    const foundFamilyStatus = familyStatuses?.find((item) => item.id === bio?.family_status_id);

    const handleFamilyStatusChange = (_, option) => {
        dispatch(setAllTabsPersonalDataBiographicInfoFamilyStatus(option));
        dispatch(setInitialTabsPersonalDataBiographicInfoFamilyStatus(option));
    };

    return (
        <Row align="middle">
            <Col xs={12} className={'font-style text-muted'}>
                {t('personal.biographicInfo.familyStatus')}
            </Col>
            <Col xs={12} className={'font-style'}>
                {modeRedactor ? (
                    <Select
                        showSearch
                        defaultValue={foundFamilyStatus?.id || ''}
                        options={familyStatusOptions}
                        onChange={handleFamilyStatusChange}
                        style={{ width: '100%' }}
                    />
                ) : bio ? (
                    LocalText.getName(
                        familyStatuses?.find((item) => item.id === bio?.family_status_id),
                    )
                ) : (
                    LocalText.getName(defaultText)
                )}
            </Col>
        </Row>
    );
};
