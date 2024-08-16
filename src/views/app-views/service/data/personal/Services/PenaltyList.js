import { FileTextTwoTone } from '@ant-design/icons';
import { Col, Row, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import IntlMessage from 'components/util-components/IntlMessage';
import CollapseErrorBoundary from '../common/CollapseErrorBoundary';
import { PrivateServices } from 'API';
import LocalizationText from 'components/util-components/LocalizationText/LocalizationText';
import ModalPenaltyEdit from './modals/ModalPenaltyEdit';
import { useSelector } from 'react-redux';
import ModalShowReasonPenalty from './modals/ModalShowReasonPenalty';

const PenaltyList = ({ penalty, setModalState, source = 'get' }) => {
    const [penalties, setPenalties] = useState([]);
    const [currentPenalty, setCurrentPenalty] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [open, setOpen] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const today = moment();
    const fullDate = today.format('DD.MM.YYYY');
    const currentLocale = localStorage.getItem('lan');

    const handleClick = (secondment) => {
        setCurrentPenalty(secondment);
        if (!modeRedactor) {
            setOpen(true);
        } else {
            setShowEditModal(true);
        }
    };

    useEffect(() => {
        fetchPenalty();
    }, [penalty]);

    const fetchPenalty = async () => {
        const penalties = await PrivateServices.get('/api/v1/penalty_types');
        setPenalties(penalties.data.objects);
    };

    if (!penalty) return null;
    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentPenalty && !currentPenalty.document_link && (
                <ModalPenaltyEdit
                    penalty={currentPenalty}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                />
            )}
            {currentPenalty && currentPenalty?.reason && (
                <ModalShowReasonPenalty
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    penalty={currentPenalty}
                />
            )}
            {penalty.length > 0
                ? penalty.map((penalty, index) =>
                      penalty.delete ? null : (
                          <div key={index}>
                              <Row
                                  gutter={[18, 16]}
                                  align="middle"
                                  style={{ ...(index !== 0 ? { marginTop: 10 } : {}) }}
                              >
                                  <Col
                                      xs={22}
                                      md={22}
                                      xl={22}
                                      lg={22}
                                      onClick={() => handleClick(penalty)}
                                  >
                                      <div>
                                          {penalties.length === 0 ? (
                                              <Spin spinning={true} />
                                          ) : (
                                              <Row gutter={8}>
                                                  <Col>
                                                      <LocalizationText
                                                          text={
                                                              penalties.filter(
                                                                  (item) =>
                                                                      item.id === penalty.status ||
                                                                      item.name === penalty.status,
                                                              )?.[0] ?? ''
                                                          }
                                                      />
                                                  </Col>
                                                  <Col>
                                                      {penalty?.date_to !== null &&
                                                          moment(penalty?.date_to).isSameOrBefore(
                                                              fullDate,
                                                          ) && (
                                                              <div className={'text-muted'}>
                                                                  (
                                                                  <IntlMessage
                                                                      id={'removed.by.order'}
                                                                  />
                                                                  &nbsp; №
                                                                  {penalty.document_number || ''}
                                                                  {currentLocale==='ru' && <>&nbsp;от&nbsp;</>}
                                                                  {moment(penalty?.date_to).format(
                                                                      'DD.MM.YYYY',
                                                                  )}
                                                                  {currentLocale==='kk' && <>&nbsp;бастап</>}
                                                                  )
                                                              </div>
                                                          )}
                                                  </Col>
                                              </Row>
                                          )}
                                      </div>
                                      <span style={{ fontSize: '12px' }} className={'font-style'}>
                                          {penalty.document_number && (
                                              <span>
                                                  <IntlMessage id={'schedule.order_signed_by'} /> №{' '}
                                              </span>
                                          )}
                                          <span>{penalty.document_number || ''} {currentLocale==='ru' && <>&nbsp;от&nbsp;</>} </span>
                                          <span>
                                              {moment(penalty.date_from).format('DD.MM.YYYY')}
                                              {currentLocale==='kk' && <>&nbsp;бастап&nbsp;</>}
                                          </span>
                                          {penalty?.date_to && (
                                              <span>
                                                  {' '}
                                                  до {moment(penalty.date_to).format('DD.MM.YYYY')}
                                              </span>
                                          )}
                                      </span>
                                  </Col>
                                  {penalty.document_link === null ||
                                  penalty.document_link === undefined ? null : (
                                      <Col>
                                          <FileTextTwoTone
                                              style={{ fontSize: '20px' }}
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setModalState({
                                                      open: false,
                                                      link: penalty.document_link,
                                                  });
                                              }}
                                          />
                                      </Col>
                                  )}
                              </Row>
                          </div>
                      ),
                  )
                : null}
        </CollapseErrorBoundary>
    );
};

export default PenaltyList;
