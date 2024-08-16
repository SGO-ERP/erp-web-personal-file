import { Col, Row } from 'antd';
import { PrivateServices } from 'API';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    setAllTabsPersonalDataBiographicInfoCitizenship,
    setInitialTabsPersonalDataBiographicInfoCitizenship,
} from 'store/slices/myInfo/myInfoSlice';
import { SelectPickerMenu } from '../SelectPickerMenu';

export const BiographicInfoCitizenship = ({ bio }) => {
    const dispatch = useAppDispatch();
    const modeRedactor = useAppSelector((state) => state.myInfo.modeRedactor);
    const { t } = useTranslation();

    const citizenshipValue = bio?.citizenship != null ? LocalText.getName(bio.citizenship) : null;
    const citizenshipId = bio?.citizenship != null ? bio.citizenship.id : null;

    const [citizenshipOptions, setCitizenshipOptions] = useState([]);
    const [citizenshipOptionsLoading, setCitizenshipOptionsLoading] = useState(false);

    const getAllCitizenshipOptions = useCallback(async () => {
        try {
            setCitizenshipOptionsLoading(true);

            const url = '/api/v1/personal/citizenship';
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
            setCitizenshipOptions(options);
        } catch (error) {
            console.log(error);
        } finally {
            setCitizenshipOptionsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!modeRedactor) {
            return;
        }
        getAllCitizenshipOptions();
    }, [modeRedactor, getAllCitizenshipOptions]);

    const handleSelectChange = (_, option) => {
        dispatch(setAllTabsPersonalDataBiographicInfoCitizenship(option));
        dispatch(setInitialTabsPersonalDataBiographicInfoCitizenship(option));
    };

    const handleAddNewOption = async ({ kz, ru }) => {
        try {
            const url = '/api/v1/personal/citizenship';
            await PrivateServices.post(url, {
                body: {
                    name: ru,
                    nameKZ: kz,
                },
            });
            getAllCitizenshipOptions();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Row align="middle">
            <Col xs={12} className={'font-style text-muted'}>
                {t('personal.biographicInfo.citizenship')}
            </Col>
            <Col xs={12} className={'font-style'}>
                {modeRedactor ? (
                    <SelectPickerMenu
                        options={citizenshipOptions}
                        defaultValue={citizenshipId}
                        onChange={handleSelectChange}
                        optionsLoading={citizenshipOptionsLoading}
                        handleAddNewOption={handleAddNewOption}
                    />
                ) : (
                    <span>{citizenshipValue}</span>
                )}
            </Col>
        </Row>
    );
};
