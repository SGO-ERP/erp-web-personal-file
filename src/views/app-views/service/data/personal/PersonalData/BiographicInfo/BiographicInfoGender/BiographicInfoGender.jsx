import { Col, Row } from 'antd';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { useAppSelector } from 'hooks/useStore';
import { useTranslation } from 'react-i18next';
import EditSelect from '../../../common/EditSelect';
import { defaultText, genderOptions } from '../data';

export const BiographicInfoGender = ({ bio }) => {
    const modeRedactor = useAppSelector((state) => state.myInfo.modeRedactor);
    const { i18n, t } = useTranslation();
    const currentLocale = i18n.language;

    return (
        <Row align="middle">
            <Col xs={12} className={'font-style text-muted'}>
                {t('personal.biographicInfo.gender')}
            </Col>
            <Col xs={12} className={'font-style'}>
                {modeRedactor ? (
                    <EditSelect
                        options={genderOptions}
                        defaultValue={bio ? (bio.gender ? 'Мужчина' : 'Женщина') : ''}
                        fieldName="allTabs.personal_data.biographic_info.gender"
                        fieldNameGet="initialTabs.personal_data.biographic_info.gender"
                    />
                ) : bio ? (
                    bio.gender ? (
                        currentLocale === 'kk' ? (
                            'Ер адам'
                        ) : (
                            'Мужчина'
                        )
                    ) : currentLocale === 'kk' ? (
                        'Әйел'
                    ) : (
                        'Женщина'
                    )
                ) : (
                    LocalText.getName(defaultText)
                )}
            </Col>
        </Row>
    );
};
