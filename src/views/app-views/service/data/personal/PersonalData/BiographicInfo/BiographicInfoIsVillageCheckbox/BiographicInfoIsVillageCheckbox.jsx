import { Col, Radio, Row } from 'antd';
import { useAppSelector } from 'hooks/useStore';
import { useTranslation } from 'react-i18next';
import {
    setAllTabsPersonalDataBiographicInfoCityOrVillage,
    setIsVillage,
} from '../../../../../../../../store/slices/myInfo/myInfoSlice';
import { useAppDispatch } from '../../../../../../../../hooks/useStore';
import { useCountryOptions } from '../../../../../../../../hooks/useCountryOptions/useCountryOptions';
import { useVillageOptions } from '../../../../../../../../hooks/useVillageOptions/useVillageOptions';

const defaultOption = {
    value: '',
    label: '',
};
export const BiographicInfoIsVillageCheckbox = ({ bio }) => {
    const modeRedactor = useAppSelector((state) => state.myInfo.modeRedactor);
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language;
    const regionId =
        useAppSelector((state) => state.myInfo.allTabs.personal_data.biographic_info.region.id) ||
        bio?.birthplace?.region_id;

    const { getCountryOptions } = useCountryOptions(currentLocale, [regionId], regionId);
    const { getVillageOptions } = useVillageOptions(currentLocale, [regionId], regionId);

    const dispatch = useAppDispatch();

    const handleChange = (event) => {
        dispatch(setIsVillage(event.target.value === 'village'));
        dispatch(setAllTabsPersonalDataBiographicInfoCityOrVillage(defaultOption));
        getCountryOptions();
        getVillageOptions();
    };

    if (!modeRedactor) {
        return null;
    }
    return (
        <Row align="middle">
            <Col xs={12} className={'font-style text-muted'}>
                {t('personal.biographicInfo.cityOrVillage')}
            </Col>
            <Col xs={12} className={'font-style'}>
                <Radio.Group
                    defaultValue={!bio?.birthplace?.city?.is_village ? 'city' : 'village'}
                    onChange={handleChange}
                >
                    <Radio value={'city'}>{t('personal.biographicInfo.city')}</Radio>
                    <Radio value={'village'}>{t('personal.biographicInfo.village')}</Radio>
                </Radio.Group>
            </Col>
        </Row>
    );
};
