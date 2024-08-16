import { Col, Row } from 'antd';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { useCountryOptions } from 'hooks/useCountryOptions/useCountryOptions';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    setAllTabsPersonalDataBiographicInfoCountry,
    setInitialTabsPersonalDataBiographicInfoCountry,
} from 'store/slices/myInfo/myInfoSlice';
import { SelectPickerMenu } from '../SelectPickerMenu';
import {
    setAllTabsPersonalDataBiographicInfoCityOrVillage,
    setAllTabsPersonalDataBiographicInfoRegion,
} from '../../../../../../../../store/slices/myInfo/myInfoSlice';

const defaultOption = {
    value: '',
    label: '',
};
export const BiographicInfoCountry = ({ bio, setSelectedFields }) => {
    const dispatch = useAppDispatch();
    const modeRedactor = useAppSelector((state) => state.myInfo.modeRedactor);
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language;

    const country = useAppSelector(
        (state) => state.myInfo.allTabs.personal_data.biographic_info.country,
    );

    const countryValue =
        bio?.birthplace?.country != null ? LocalText.getName(bio.birthplace.country) : null;
    const countryId = bio?.birthplace?.country_id != null ? bio.birthplace.country_id : null;

    const { countryOptions, countryOptionsLoading, getCountryOptions, createNew } =
        useCountryOptions(currentLocale);

    useEffect(() => {
        if (!modeRedactor) {
            return;
        }
        getCountryOptions();
    }, [modeRedactor, getCountryOptions]);

    useEffect(() => {
        setSelectedFields((prev) => ({ ...prev, country: !!countryId }));
    }, [countryId]);

    useEffect(() => {
        if (bio?.birthplace?.country_id == null) {
            return;
        }
        const foundCountry = countryOptions.find((c) => c.value === bio?.birthplace?.country_id);
        if (!foundCountry) {
            return;
        }
        dispatch(setAllTabsPersonalDataBiographicInfoCountry(foundCountry));
        dispatch(setInitialTabsPersonalDataBiographicInfoCountry(foundCountry));
        setSelectedFields((prev) => ({ ...prev, country: true }));
    }, [countryOptions, bio?.birthplace?.country_id]);

    const handleSelectChange = (_, option) => {
        dispatch(setAllTabsPersonalDataBiographicInfoCountry(option));
        dispatch(setInitialTabsPersonalDataBiographicInfoCountry(option));
        setSelectedFields((prev) => ({ ...prev, country: true }));

        dispatch(setAllTabsPersonalDataBiographicInfoRegion(defaultOption));
        dispatch(setAllTabsPersonalDataBiographicInfoCityOrVillage(defaultOption));
    };

    const handleAddNewCountry = ({ kz, ru }) => {
        createNew({ name: ru, nameKZ: kz }).then(() => {
            getCountryOptions();
        });
    };

    return (
        <Row align="middle">
            <Col xs={12} className={'font-style text-muted'}>
                {t('personal.biographicInfo.country')}
            </Col>
            <Col xs={12} className={'font-style'}>
                {modeRedactor ? (
                    <SelectPickerMenu
                        options={countryOptions}
                        defaultValue={null}
                        value={country.id}
                        onChange={handleSelectChange}
                        optionsLoading={countryOptionsLoading}
                        handleAddNewOption={handleAddNewCountry}
                    />
                ) : (
                    <span>{countryValue}</span>
                )}
            </Col>
        </Row>
    );
};
