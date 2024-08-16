import { Col, Row } from 'antd';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { useRegionOptions } from 'hooks/useRegionOptions/useRegionOptions';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    setAllTabsPersonalDataBiographicInfoRegion,
    setInitialTabsPersonalDataBiographicInfoRegion,
} from 'store/slices/myInfo/myInfoSlice';
import { SelectPickerMenu } from '../SelectPickerMenu';
import { setAllTabsPersonalDataBiographicInfoCityOrVillage } from '../../../../../../../../store/slices/myInfo/myInfoSlice';

const defaultOption = {
    value: '',
    label: '',
};
export const BiographicInfoRegion = ({ bio, selectedFields, setSelectedFields }) => {
    const dispatch = useAppDispatch();
    const modeRedactor = useAppSelector((state) => state.myInfo.modeRedactor);
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language;

    const countryId =
        useAppSelector((state) => state.myInfo.allTabs.personal_data.biographic_info.country.id) ||
        bio?.birthplace?.country_id;

    const region = useAppSelector(
        (state) => state.myInfo.allTabs.personal_data.biographic_info.region,
    );
    const regionValue =
        bio?.birthplace?.region != null ? LocalText.getName(bio.birthplace.region) : null;
    const regionId = bio?.birthplace?.region_id != null ? bio.birthplace.region_id : null;

    const { regionOptions, regionOptionsLoading, getRegionOptions, createNew } = useRegionOptions(
        currentLocale,
        [countryId],
        countryId,
    );

    useEffect(() => {
        if (!modeRedactor) {
            return;
        }
        getRegionOptions();
    }, [modeRedactor, getRegionOptions]);

    useEffect(() => {
        if (bio?.birthplace?.region_id == null) {
            return;
        }
        const foundRegion = regionOptions.find((c) => c.value === bio?.birthplace?.region_id);
        if (!foundRegion) {
            return;
        }
        dispatch(setAllTabsPersonalDataBiographicInfoRegion(foundRegion));
        dispatch(setInitialTabsPersonalDataBiographicInfoRegion(foundRegion));
        setSelectedFields((prev) => ({ ...prev, region: true }));
    }, [regionOptions, bio?.birthplace?.region_id]);

    const handleSelectChange = (_, option) => {
        dispatch(setAllTabsPersonalDataBiographicInfoRegion(option));
        dispatch(setInitialTabsPersonalDataBiographicInfoRegion(option));
        setSelectedFields((prev) => ({ ...prev, region: true }));

        dispatch(setAllTabsPersonalDataBiographicInfoCityOrVillage(defaultOption));
    };

    useEffect(() => {
        setSelectedFields((prev) => ({ ...prev, region: !!regionId }));
    }, [regionId]);

    const handleAddNewRegion = ({ ru, kz }) => {
        createNew({ name: ru, nameKZ: kz }).then(() => {
            getRegionOptions();
        });
    };

    return (
        <Row align="middle">
            <Col xs={12} className={'font-style text-muted'}>
                {t('personal.biographicInfo.region')}
            </Col>
            <Col xs={12} className={'font-style'}>
                {modeRedactor ? (
                    <SelectPickerMenu
                        disabled={!selectedFields.country}
                        options={regionOptions}
                        value={region.id}
                        defaultValue={null}
                        onChange={handleSelectChange}
                        optionsLoading={regionOptionsLoading}
                        handleAddNewOption={handleAddNewRegion}
                    />
                ) : (
                    <span>{regionValue}</span>
                )}
            </Col>
        </Row>
    );
};
