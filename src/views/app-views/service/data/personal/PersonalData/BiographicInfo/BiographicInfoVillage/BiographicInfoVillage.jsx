import { Col, Row } from 'antd';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useVillageOptions } from 'hooks/useVillageOptions/useVillageOptions';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    setAllTabsPersonalDataBiographicInfoCityOrVillage,
    setInitialTabsPersonalDataBiographicInfoCityOrVillage,
} from 'store/slices/myInfo/myInfoSlice';
import { SelectPickerMenu } from '../SelectPickerMenu';

export const BiographicInfoVillage = ({ bio, selectedFields, setSelectedFields }) => {
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

    const villageValue =
        bio?.birthplace?.city != null ? LocalText.getName(bio.birthplace.city) : null;

    const { villageOptions, villageOptionsLoading, getVillageOptions, createNew } =
        useVillageOptions(currentLocale, [regionId], regionId);

    const villageId = villageOptions.some((village) => village.value === city.id) ? city.id : '';

    useEffect(() => {
        if (!modeRedactor) {
            return;
        }
        getVillageOptions();
    }, [modeRedactor, getVillageOptions, isVillage]);

    useEffect(() => {
        const currentCity = bio?.birthplace?.city;
        if (!currentCity) return;
        const foundVillage = villageOptions.find(
            (c) => c.value === currentCity.id && currentCity.is_village,
        );
        if (!foundVillage) return;
        dispatch(setAllTabsPersonalDataBiographicInfoCityOrVillage(foundVillage));
        dispatch(setInitialTabsPersonalDataBiographicInfoCityOrVillage(foundVillage));
        setSelectedFields((prev) => ({ ...prev, cityOrVillage: true }));
    }, [villageOptions, bio?.birthplace?.city_id]);

    const handleSelectChange = (_, option) => {
        dispatch(setAllTabsPersonalDataBiographicInfoCityOrVillage(option));
        dispatch(setInitialTabsPersonalDataBiographicInfoCityOrVillage(option));
        setSelectedFields((prev) => ({ ...prev, cityOrVillage: true }));
    };

    const handleAddNewVillage = ({ kz, ru }) => {
        createNew({ name: ru, nameKZ: kz }).then(() => {
            getVillageOptions();
        });
    };

    if (!isVillage) {
        return null;
    }

    return (
        <Row align="middle">
            <Col xs={12} className={'font-style text-muted'}>
                {t('personal.biographicInfo.village')}
            </Col>
            <Col xs={12} className={'font-style'}>
                {modeRedactor ? (
                    <SelectPickerMenu
                        disabled={!selectedFields.country || !selectedFields.region}
                        options={villageOptions}
                        defaultValue={null}
                        value={isVillage && villageId}
                        onChange={handleSelectChange}
                        optionsLoading={villageOptionsLoading}
                        handleAddNewOption={handleAddNewVillage}
                    />
                ) : (
                    <span>{villageValue}</span>
                )}
            </Col>
        </Row>
    );
};
