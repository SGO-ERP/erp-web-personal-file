import React, {useState} from 'react';
import {Button, Col, Modal, Row, Tag} from 'antd';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import ShowOnlyForRedactor from '../../common/ShowOnlyForRedactor';
import {useSelector} from 'react-redux';
import {useAppSelector} from '../../../../../../../hooks/useStore';
import CollapseErrorBoundary from '../../common/CollapseErrorBoundary';
import ModalAddReleaseDetailEdit from './ModalAddReleaseDetailEdit';
import RowWithDate from '../../../components/RowWithDate';
import moment from 'moment/moment';
import {FileTextTwoTone} from '@ant-design/icons';
import LocalizationText from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import { PERMISSION } from 'constants/permission';

const ReleaseList = ({setModalState, releaseList, source = 'get'}) => {
    const [currentRelease, setCurrentRelease] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem('lan');

    const handleClick = (release) => {
        if (!modeRedactor) return;
        setCurrentRelease(release);
        setShowEditModal(true);
    };

    if (!releaseList) return null;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id='myInfo.dataLoadError'/>}>
            {currentRelease && (
                <ModalAddReleaseDetailEdit
                    releaseObject={currentRelease}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                />
            )}
            {releaseList.length > 0 &&
                releaseList.map((item, i) => {
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
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Col
                                        xs={24}
                                        md={20}
                                        xl={20}
                                        lg={20}
                                        onClick={() => handleClick(item)}
                                    >
                                        <Row gutter={16}>
                                                  <span>
                                                      <span className='paddingLR8' style={{color: 'black'}}>
                                                          {currentLocale==='kk' ? item.reasonKZ : item.reason}
                                                      </span>
                                                  <span>

                                            {
                                                item.liberation_ids.map((liberation) => (
                                                    <>
                                                        <Tag
                                                            color='#F0F5FF'
                                                            style={{
                                                                fontSize: '10px',
                                                                borderColor: '#ADC6FF',
                                                                color: '#2F54EB',
                                                                borderRadius: '15px',
                                                                lineHeight: '16px',
                                                                marginRight: '10px',
                                                            }}
                                                            className={'font-style'}
                                                        >
                                                            {<LocalizationText text={liberation}/>}
                                                        </Tag>
                                                    </>
                                                ))
                                            }
                                                  </span>
                                                </span>
                                        </Row>
                                        <RowWithDate
                                            firstString={(currentLocale==='kk' ? item.initiatorKZ : item.initiator) || ''}
                                            start_date={moment(item.start_date).format(
                                                'DD.MM.YYYY',
                                            )}
                                            end_date={moment(item.end_date).format(
                                                'DD.MM.YYYY',
                                            )}
                                        ></RowWithDate>
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

const ModalShowReleaseDetail = ({isOpen, onClose, setModalState}) => {
    const medicalDataRemote = useSelector((state) => state.medicalInfo.medicalInfo);
    const medicalDataLocal = useSelector((state) => state.myInfo.allTabs.medical_card);
    const editedData = useSelector((state) => state.myInfo.edited.medical_card);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    return (
        <Modal
            title={<IntlMessage id={'personal.medicalCard.releases'}/>}
            onClick={(e) => e.stopPropagation()}
            open={isOpen}
            footer={null}
            width={'40%'}
        >
            <div className="scrollbar"
                 style={{
                     overflowY: 'auto',
                     overflowX: 'hidden',
                     height: '210px',
                     width: '100%',
                     marginTop: '10px',
                 }}>
                <ReleaseList
                    releaseList={
                        medicalDataRemote.user_liberations
                    }
                    setModalState={setModalState}
                />
                {isHR && (
                    <ShowOnlyForRedactor
                        forRedactor={
                            <div>
                                <ReleaseList
                                    releaseList={
                                        medicalDataLocal.release_detail
                                    }
                                    source='added'
                                    setModalState={
                                        setModalState
                                    }
                                />
                                <ReleaseList
                                    releaseList={
                                        editedData.release_detail
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

export default ModalShowReleaseDetail;
