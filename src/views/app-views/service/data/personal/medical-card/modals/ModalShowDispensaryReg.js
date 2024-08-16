import React, {useState} from 'react';
import {Button, Col, Modal, Row} from 'antd';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import ShowOnlyForRedactor from '../../common/ShowOnlyForRedactor';
import {useSelector} from 'react-redux';
import CollapseErrorBoundary from '../../common/CollapseErrorBoundary';
import ModalAddDispensaryRegEdit from './ModalAddDispensaryRegEdit';
import RowWithDate from '../../../components/RowWithDate';
import moment from 'moment/moment';
import {FileTextTwoTone} from '@ant-design/icons';
import {useAppSelector} from '../../../../../../../hooks/useStore';
import LocalizationText from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import { PERMISSION } from 'constants/permission';

const DispensaryList = ({setModalState, dispensaryL, source = 'get'}) => {
    const [currentDispensary, setCurrentDispensary] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem('lan');

    const handleClick = (dispensary) => {
        if (!modeRedactor) return;
        setCurrentDispensary(dispensary);
        setShowEditModal(true);
    };


    if (!dispensaryL) return null;


    return (
        <CollapseErrorBoundary fallback={<IntlMessage id='myInfo.dataLoadError'/>}>
            {currentDispensary && (
                <ModalAddDispensaryRegEdit
                    dispensaryObject={currentDispensary}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                />
            )}
            {dispensaryL.length > 0 &&
                dispensaryL.map((item, i) => {
                    return (
                        <div
                            // TEMP: key={item.id}
                            key={i}
                        >
                            <React.Fragment key={i}>
                                <Row
                                    gutter={[18, 16]}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Col
                                        xs={20}
                                        md={20}
                                        xl={20}
                                        lg={20}
                                        onClick={() => handleClick(item)}
                                    >
                                        <Row gutter={16}>
                                            <Col lg={20} className={'font-style'}>
                                                    <span style={{color: '#1A3353'}}>
                                                        <LocalizationText text={item}/>
                                                    </span>
                                                <RowWithDate
                                                    firstString={(currentLocale==='kk' ? item.initiatorKZ : item.initiator) || ''}
                                                    start_date={moment(item.start_date).format(
                                                        'DD.MM.YYYY',
                                                    )}
                                                    end_date={
                                                        item.end_date === null
                                                            ? moment(Date.now()).format(
                                                                'DD.MM.YYYY',
                                                            )
                                                            : moment(item.end_date).format(
                                                                'DD.MM.YYYY',
                                                            )
                                                    }
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
                        </div>
                    );
                })}
        </CollapseErrorBoundary>
    );
};
const ModalShowDispensaryReg = ({isOpen, onClose, setModalState}) => {
    const medicalDataRemote = useSelector((state) => state.medicalInfo.medicalInfo);
    const medicalDataLocal = useSelector((state) => state.myInfo.allTabs.medical_card);
    const editedData = useSelector((state) => state.myInfo.edited.medical_card);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    return (
        <Modal
            title={<IntlMessage id={'personal.medicalCard.medicalMonitoring'}/>}
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
                <DispensaryList
                    dispensaryL={
                        medicalDataRemote.dispensary_registrations
                    }
                    setModalState={setModalState}
                />
                {isHR &&
                    <ShowOnlyForRedactor
                        forRedactor={
                            <div>
                                <DispensaryList
                                    dispensaryL={
                                        medicalDataLocal.dispensary_reg
                                    }
                                    source='added'
                                    setModalState={setModalState}
                                />
                                <DispensaryList
                                    dispensaryL={
                                        editedData.dispensary_reg
                                    }
                                    source='edited'
                                    setModalState={setModalState}
                                />
                            </div>
                        }
                    />
                }
            </div>
            <Row style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                <Button type={'primary'} onClick={onClose}>
                    Ок
                </Button>
            </Row>
        </Modal>
    );
};

export default ModalShowDispensaryReg;
