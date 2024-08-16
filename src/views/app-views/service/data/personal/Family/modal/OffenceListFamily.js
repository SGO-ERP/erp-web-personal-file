import {Col, DatePicker, Input, Row, Typography} from 'antd';
import React from 'react';
import moment from 'moment/moment';
import IntlMessage from 'components/util-components/IntlMessage';
import {useSelector} from 'react-redux';
import {useAppDispatch, useAppSelector} from '../../../../../../../hooks/useStore';
import CollapseErrorBoundary from '../../common/CollapseErrorBoundary';
import LocalizationText from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import {CloudSyncOutlined, DeleteTwoTone} from '@ant-design/icons';
import {addFieldValue, deleteByPathMyInfo} from '../../../../../../../store/slices/myInfo/myInfoSlice';
import constructorNewSlice from 'store/slices/newConstructorSlices/constructorNewSlice';
import { PERMISSION } from 'constants/permission';

const OffenceListFamily = ({ offences, setObject, object, currentLanguage }) => {
    const currentLocale = localStorage.getItem('lan');
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const dispatch = useAppDispatch();

    const family_member_violations = useSelector((state) => state.myInfo.allTabs.family.family_violations.remote);
    const local_family_member_violations = useSelector((state) => state.myInfo.allTabs.family.family_violations.local);

    if (!offences) return null;

    const changeInput =(id, type, value) => {
       const obj = offences.find((item) => item.id === id);

       const find_object = object.length > 0 && object.find((item) => item.id === id);

       if (!find_object) {

           const newObj = {
              ...obj,
              [type]: value
           };

           const newArray = [...object, newObj];

           setObject(newArray);

       } else if (find_object) {
           const newObj = {
               ...find_object,
               [type]: value
           };

           const filter_obj = object.filter((item) => item.id !== id);
           const newArray = [...filter_obj, newObj];
           setObject(newArray);
       }
    }

    const deleteViolation = (offence) => {
        const find = local_family_member_violations.find((item) => item.id === offence.id);
        const find_remote = family_member_violations.find((item) => item.id === offence.id);

        if (!find && !find_remote) {
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.family.family_violations.remote',
                    value: {id:offence.id, delete: true},
                }),
            );
        } else if (Object.hasOwnProperty.call(offence, 'local_id') && find) {
            dispatch(
                deleteByPathMyInfo({
                    path: 'allTabs.family.family_violations.local',
                    id: offence.id
                }),
            );
        } else if (Object.hasOwnProperty.call(offence, 'family_id') && find_remote) {
            dispatch(
                deleteByPathMyInfo({
                    path: 'allTabs.family.family_violations.remote',
                    id: offence.id
                }),
            );
        }
    }

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id='myInfo.dataLoadError' />}>
            <Row gutter={[18, 16]}>
                {offences.map((offence) => (
                    <React.Fragment key={offence.id || ''}>
                        <Col xs={24} md={24} lg={24} xl={24} className={'font-style'}>
                            <Typography style={{ fontWeight: 500 }}>
                                {<LocalizationText text={offence.violation_type} /> || ''}
                                {(isHR && modeRedactor) &&
                                    <DeleteTwoTone
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            deleteViolation(offence)
                                        }}
                                        style={{ marginLeft: '10px' }}
                                        twoToneColor='red'
                                    />
                                }
                            </Typography>
                        </Col>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ color: '#72849A' }}
                            className={'font-style text-muted'}
                        >
                            <IntlMessage id='personal.additional.offenceList.date' />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                            {(isHR && modeRedactor
                                ?
                                <DatePicker
                                    defaultValue={moment(offence.date)}
                                    style={{width:'100%'}}
                                    onChange={e => changeInput(offence.id, 'date', e)}
                                />
                                :
                                moment(offence.date).format('DD.MM.YYYY')) || ''}
                        </Col>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ color: '#72849A' }}
                            className={'font-style text-muted'}
                        >
                            <IntlMessage id='personal.additional.offenceList.committedBy' />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                            {(isHR && modeRedactor
                                ?
                                <>
                                <Input
                                    defaultValue={(currentLanguage==='kaz' ? offence.issued_byKZ : offence.issued_by)}
                                    onChange={(e) =>
                                        changeInput(offence.id,
                                            currentLanguage==='kaz' ? 'issued_byKZ' : 'issued_by',
                                        e.target.value)
                                }
                                />
                                <p className="fam_invisible_text">
                                    {currentLanguage === 'kaz' ? offence.issued_byKZ : offence.issued_by}
                                </p>
                                </>
                                :
                                currentLanguage === 'kaz' ? offence.issued_byKZ : offence.issued_by) || ''}

                        </Col>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ color: '#72849A' }}
                            className={'font-style text-muted'}
                        >
                            <IntlMessage id='personal.additional.offenceList.articleNumber' />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                            {(isHR && modeRedactor
                                ?
                                <>
                                <Input
                                    defaultValue={(currentLanguage==='kaz' ? offence.article_numberKZ : offence.article_number)}
                                    onChange={(e) =>
                                        changeInput(offence.id,
                                            currentLanguage==='kaz' ? 'article_numberKZ' : 'article_number',
                                            e.target.value)}
                                />
                                <p className="fam_invisible_text">
                                    {currentLanguage === 'kaz' ? offence.article_numberKZ : offence.article_number}
                                </p>
                                </>
                                :
                                (currentLocale==='kk' ? offence.article_numberKZ : offence.article_number)) || ''}
                        </Col>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ color: '#72849A' }}
                            className={'font-style text-muted'}
                        >
                            <IntlMessage id='personal.additional.offenceList.consequences' />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                            {(isHR && modeRedactor
                                ?
                                <>
                                <Input
                                    defaultValue={(currentLanguage==='kaz' ? offence.consequenceKZ : offence.consequence)}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        changeInput(
                                            offence.id,
                                            currentLanguage === 'kaz' ? 'consequenceKZ' : 'consequence',
                                            newValue)
                                    }}
                                />
                                <p className="fam_invisible_text">
                                    {currentLanguage === 'kaz' ? offence.consequenceKZ : offence.consequence}
                                </p>
                                </>
                                :
                                (currentLocale==='kk' ? offence.consequenceKZ : offence.consequence)) || ''}
                        </Col>
                    </React.Fragment>
                ))}
            </Row>
        </CollapseErrorBoundary>
    );
};

export default OffenceListFamily;
