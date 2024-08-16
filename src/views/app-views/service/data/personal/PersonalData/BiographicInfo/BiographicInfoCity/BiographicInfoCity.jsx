import { Col, Row } from 'antd';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { useCityOptions } from 'hooks/useCityOptions/useCityOptions';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    setAllTabsPersonalDataBiographicInfoCityOrVillage,
    setInitialTabsPersonalDataBiographicInfoCityOrVillage,
} from 'store/slices/myInfo/myInfoSlice';
import { SelectPickerMenu } from '../SelectPickerMenu';

export const BiographicInfoCity = ({ bio, selectedFields, setSelectedFields }) => {
    const dispatch = useAppDispatch();
    const modeRedactor = useAppSelector((state) => state.myInfo.modeRedactor);
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language;

    const city = useAppSelector(
        (state) => state.myInfo.allTabs.personal_data.biographic_info.cityOrVillage,
    );
    const isVillage = useAppSelector(
        (state) => state.myInfo.allTabs.personal_data.biographic_info.isVillage,
    );

    const regionId =
        useAppSelector((state) => state.myInfo.allTabs.personal_data.biographic_info.region.id) ||
        bio?.birthplace?.region_id;

    const cityOrVillageValue =
        bio?.birthplace?.city != null ? LocalText.getName(bio.birthplace.city) : null;

    const { cityOptions, cityOptionsLoading, getCityOptions, createNew } = useCityOptions(
        currentLocale,
        [regionId],
        regionId,
    );
    const cityId = cityOptions.some((c) => c.value === city.id) ? city.id : '';

    useEffect(() => {
        if (!modeRedactor) {
            return;
        }
        getCityOptions();
    }, [modeRedactor, getCityOptions, isVillage]);

    useEffect(() => {
        if (bio?.birthplace?.city_id == null) {
            return;
        }
        const foundCity = cityOptions.find((c) => c.value === bio?.birthplace?.city_id);
        if (!foundCity) {
            return;
        }
        dispatch(setAllTabsPersonalDataBiographicInfoCityOrVillage(foundCity));
        dispatch(setInitialTabsPersonalDataBiographicInfoCityOrVillage(foundCity));
        setSelectedFields((prev) => ({ ...prev, cityOrVillage: true }));
    }, [cityOptions, bio?.birthplace?.city_id]);

    const handleSelectChange = (_, option) => {
        dispatch(setAllTabsPersonalDataBiographicInfoCityOrVillage(option));
        dispatch(setInitialTabsPersonalDataBiographicInfoCityOrVillage(option));
        setSelectedFields((prev) => ({ ...prev, cityOrVillage: true }));
    };

    const handleAddNewCity = ({ kz, ru }) => {
        createNew({ name: ru, nameKZ: kz }).then(() => {
            getCityOptions();
        });
    };

    if (isVillage) {
        return null;
    }
    return (
        <Row align="middle">
            <Col xs={12} className={'font-style text-muted'}>
                {t('personal.biographicInfo.city')}
            </Col>
            <Col xs={12} className={'font-style'}>
                {modeRedactor ? (
                    <SelectPickerMenu
                        disabled={!selectedFields.country || !selectedFields.region}
                        options={cityOptions}
                        defaultValue={null}
                        value={!isVillage && cityId}
                        onChange={handleSelectChange}
                        optionsLoading={cityOptionsLoading}
                        handleAddNewOption={handleAddNewCity}
                    />
                ) : (
                    <span>{cityOrVillageValue}</span>
                )}
            </Col>
        </Row>
    );
};
