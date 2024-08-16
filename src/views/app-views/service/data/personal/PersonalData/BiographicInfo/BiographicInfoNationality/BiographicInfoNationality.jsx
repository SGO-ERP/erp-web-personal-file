import { Col, Row } from 'antd';
import { PrivateServices } from 'API';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    setAllTabsPersonalDataBiographicInfoNationality,
    setInitialTabsPersonalDataBiographicInfoNationality,
} from 'store/slices/myInfo/myInfoSlice';
import { SelectPickerMenu } from '../SelectPickerMenu';

export const BiographicInfoNationality = ({ bio }) => {
    const dispatch = useAppDispatch();
    const modeRedactor = useAppSelector((state) => state.myInfo.modeRedactor);
    const { t } = useTranslation();

    const nationalityValue = bio?.nationality != null ? LocalText.getName(bio.nationality) : null;
    const nationalityId = bio?.nationality != null ? bio.nationality.id : null;

    const [nationalityOptions, setNationalityOptions] = useState([]);
    const [nationalityOptionsLoading, setNationalityOptionsLoading] = useState(false);

    const getAllNationalityOptions = useCallback(async () => {
        try {
            setNationalityOptionsLoading(true);

            const url = '/api/v1/personal/nationality';
            const response = await PrivateServices.get(url, {
                params: {
                    query: {
                        skip: 0,
                        limit: 10000,
                    },
                },
            });
            const options = response.data.map((place) => ({
                value: place.id,
                label: LocalText.getName(place),
            }));
            setNationalityOptions(options);
        } catch (error) {
            console.log(error);
        } finally {
            setNationalityOptionsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!modeRedactor) {
            return;
        }
        getAllNationalityOptions();
    }, [modeRedactor, getAllNationalityOptions]);

    const handleSelectChange = (_, option) => {
        dispatch(setAllTabsPersonalDataBiographicInfoNationality(option));
        dispatch(setInitialTabsPersonalDataBiographicInfoNationality(option));
    };

    const handleAddNewOption = async ({ kz, ru }) => {
        try {
            const url = '/api/v1/personal/nationality';
            await PrivateServices.post(url, {
                body: {
                    name: ru,
                    nameKZ: kz,
                },
            });
            getAllNationalityOptions();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Row align="middle">
            <Col xs={12} className={'font-style text-muted'}>
                {t('personal.biographicInfo.nationality')}
            </Col>
            <Col xs={12} className={'font-style'}>
                {modeRedactor ? (
                    <SelectPickerMenu
                        options={nationalityOptions}
                        defaultValue={nationalityId}
                        onChange={handleSelectChange}
                        optionsLoading={nationalityOptionsLoading}
                        handleAddNewOption={handleAddNewOption}
                    />
                ) : (
                    <span>{nationalityValue}</span>
                )}
            </Col>
        </Row>
    );
};
