import React, {useState} from 'react';
import {Button, Col, Modal, Row} from 'antd';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import ShowOnlyForRedactor from '../../common/ShowOnlyForRedactor';
import {useSelector} from 'react-redux';
import CollapseErrorBoundary from '../../common/CollapseErrorBoundary';
import ModalSickListEdit from './ModalSickListEdit';
import RowWithDate from '../../../components/RowWithDate';
import moment from 'moment/moment';
import {FileTextTwoTone} from '@ant-design/icons';
import {useAppSelector} from '../../../../../../../hooks/useStore';
import { PERMISSION } from 'constants/permission';

const SickList = ({setModalState, sickList, source = 'get'}) => {
    const [currentSick, setCurrentSick] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem('lan');

    const handleClick = (sick) => {
        if (!modeRedactor) return;
        setCurrentSick(sick);
        setShowEditModal(true);
    };

    if (!sickList) return null;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id='myInfo.dataLoadError'/>}>
            {currentSick && (
                <ModalSickListEdit
                    sickObject={currentSick}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                />
            )}

            {sickList.length > 0 &&
                sickList.map((item, i) => {
                    return (
                        <React.Fragment key={i}>
                            <Row
                                gutter={[18, 16]}
                                style={{display: 'flex', justifyContent: 'space-between'}}
                            >
                                <Col
                                    xs={20}
                                    md={20}
                                    xl={20}
                                    lg={20}
                                    onClick={() => handleClick(item)}
                                >
                                    <Row gutter={16}>
                                        <Col className={'font-style'}>
                                            {(currentLocale==='kk' ? item.reasonKZ : item.reason) || ''}
                                            {item.code !== null && ` (${item.code || ''})`}
                                            <RowWithDate
                                                firstString={(currentLocale==='kk' ? item.placeKZ : item.place)}
                                                start_date={moment(item.start_date).format(
                                                    'DD.MM.YYYY',
                                                )}
                                                end_date={moment(item.end_date).format(
                                                    'DD.MM.YYYY',
                                                )}
                                            ></RowWithDate>
                                        </Col>
                                    </Row>
                                </Col>
                                {item.document_link === null ||
                                item.document_link === undefined ? null : (
                                    <Col style={{display: 'flex', alignItems: 'center'}}>
                                        <FileTextTwoTone
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({
                                                    open: false,
                                                    link: item.document_link,
                                                });
                                            }}
                                            style={{fontSize: '20px'}}
                                        />
                                    </Col>
                                )}
                            </Row>
                        </React.Fragment>
                    );
                })}
        </CollapseErrorBoundary>
    );
};
const ModalShowSickList = ({isOpen, onClose, setModalState}) => {
    const medicalDataRemote = useSelector((state) => state.medicalInfo.medicalInfo);
    const medicalDataLocal = useSelector((state) => state.myInfo.allTabs.medical_card);
    const editedData = useSelector((state) => state.myInfo.edited.medical_card);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    return (
        <Modal
            title={<IntlMessage id={'personal.medicalCard.sickLeave'}/>}
            onClick={(e) => e.stopPropagation()}
            open={isOpen}
            footer={null}
            width={'40%'}
        >
            <div className='scrollbar'
                 style={{
                     overflowY: 'auto',
                     overflowX: 'hidden',
                     height: '210px',
                     width: '100%',
                     marginTop: '10px',
                 }}>
                <SickList
                    sickList={medicalDataRemote.hospital_datas}
                    setModalState={setModalState}
                />
                {isHR && (
                    <ShowOnlyForRedactor
                        forRedactor={
                            <div>
                                <SickList
                                    sickList={
                                        medicalDataLocal.sick_list
                                    }
                                    source='added'
                                    setModalState={
                                        setModalState
                                    }
                                />
                                <SickList
                                    sickList={
                                        editedData.sick_list
                                    }
                                    source={'edited'}
                                    setModalState={
                                        setModalState
                                    }
                                />
                            </div>
                        }
                    />
                )}
            </div>
            <Row style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                <Button type={'primary'} onClick={onClose}>
                    Ок
                </Button>
            </Row>
        </Modal>
    );
};

export default ModalShowSickList;
