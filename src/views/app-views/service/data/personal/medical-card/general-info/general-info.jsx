import { Col, Row, Select } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFieldValue, setFieldValue } from '../../../../../../../store/slices/myInfo/myInfoSlice';
import EditInput from '../../common/EditInput';
import CollapseErrorBoundary from '../../common/CollapseErrorBoundary';
import NoData from '../../NoData';
import { useAppSelector } from '../../../../../../../hooks/useStore';
import { PERMISSION } from 'constants/permission';

const GeneralInfo = ({ generalData }) => {
    const dispatch = useDispatch();
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const field = useSelector((state) =>
        getFieldValue(state, 'allTabs.medical_card.general.blood_group'),
    );

    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    const profile = useSelector((state) => state.profile.data);

    const handleChange = (e) => {
        dispatch(
            setFieldValue({ fieldPath: 'allTabs.medical_card.general.blood_group', value: e }),
        );
    };

    useEffect(() => {
        if (generalData) {
            dispatch(
                setFieldValue({
                    fieldPath: 'allTabs.medical_card.general.blood_group',
                    value: generalData.blood_group,
                }),
            );
            dispatch(
                setFieldValue({
                    fieldPath: 'initialTabs.medical_card.general.blood_group',
                    value: generalData.blood_group,
                }),
            );
        }
    }, []);

    if (!generalData || generalData?.length === 0) {
        return <NoData />;
    }

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <Row gutter={[18, 16]}>
                <Col
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ color: '#72849A' }}
                    className={'font-style text-muted'}
                >
                    <IntlMessage id="personal.medicalCard.generalInfo.height" />
                    {modeRedactor && ' (см)'}
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                    <EditInput
                        defaultValue={generalData?.height || ''}
                        fieldName="allTabs.medical_card.general.height"
                        fieldNameGet="initialTabs.medical_card.general.height"
                    />
                    {!modeRedactor && ' cм'}
                </Col>
                <Col
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ color: '#72849A' }}
                    className={'font-style text-muted'}
                >
                    <IntlMessage id="personal.medicalCard.generalInfo.weight" />
                    {modeRedactor && ' (кг)'}
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                    <EditInput
                        defaultValue={generalData?.weight || ''}
                        fieldName="allTabs.medical_card.general.weight"
                        fieldNameGet="initialTabs.medical_card.general.weight"
                    />
                    {!modeRedactor && ' кг'}
                </Col>
                <Col
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ color: '#72849A' }}
                    className={'font-style text-muted'}
                >
                    <IntlMessage id="personal.medicalCard.generalInfo.bloodGroup" />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                    {modeRedactor ? (
                        <Select
                            value={field}
                            style={{ width: '100%' }}
                            onChange={handleChange}
                            options={[
                                { value: 'O (I) Rh+', label: 'O (I) Rh+' },
                                { value: 'O (I) Rh-', label: 'O (I) Rh-' },
                                { value: 'A (II) Rh+', label: 'A (II) Rh+' },
                                { value: 'B (III) Rh+', label: 'B (III) Rh+' },
                                { value: 'B (III) Rh-', label: 'B (III) Rh-' },
                                { value: 'AB (IV) Rh+', label: 'AB (IV) Rh+' },
                                { value: 'AB (IV) Rh-', label: 'AB (IV) Rh-' },
                            ]}
                            disabled={!isHR}
                        />
                    ) : (
                        generalData?.blood_group ?? 'Нет данных'
                    )}
                </Col>
                <Col
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ color: '#72849A' }}
                    className={'font-style text-muted'}
                >
                    <IntlMessage id="personal.medicalCard.generalInfo.ageGroup" />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                    {generalData?.age_group ?? 'Нет данных'}
                </Col>
            </Row>
        </CollapseErrorBoundary>
    );
};

export default GeneralInfo;
