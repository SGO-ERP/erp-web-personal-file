import { DownOutlined, FileTextTwoTone, UpOutlined } from '@ant-design/icons';
import { Timeline } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import plural from '../../../../../../utils/helpers/plural';
import getDateForTimeLine from 'utils/format/getDateForTimeline';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import CollapseErrorBoundary from '../common/CollapseErrorBoundary';
import NoData from '../NoData';
import { useSelector } from 'react-redux';
import ModalEditContract from './modals/ModalEditContract';
import LocalizationText from "../../../../../../components/util-components/LocalizationText/LocalizationText";

const ContractsList = ({ contractsList, setModalState }) => {
    const [source, setSource] = useState('get');
    const [currentContract, setCurrentContract] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showList, setShowList] = useState(true);

    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem("lan");

    const sortedList = contractsList
        .sort((a, b) => new Date(a.date_from) - new Date(b.date_from))
        .reverse();
    const limitedList = showList ? sortedList.slice(0, 3) : sortedList;

    useEffect(() => {
        setShowList(modeRedactor ? false : true);
    }, [modeRedactor]);

    const generatePendingDot = () => {
        if (modeRedactor || contractsList.length <= 3) return <></>;

        return showList ? (
            <DownOutlined
                onClick={() => setShowList(!showList)}
                style={{ color: 'grey', fontSize: '16px' }}
            />
        ) : (
            <UpOutlined
                onClick={() => setShowList(!showList)}
                style={{ color: 'grey', fontSize: '16px' }}
            />
        );
    };

    const handleClick = (contract) => {
        if (contract.document_link) return;
        if (!modeRedactor) return;
        setCurrentContract(contract);
        setSource(contractsList.source ? contractsList.source : 'get');
        setShowEditModal(true);
    };

    if (!contractsList) return null;
    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentContract && (
                <ModalEditContract
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                    contract={currentContract}
                />
            )}
            <Timeline mode="left" pending={true} pendingDot={generatePendingDot()} reverse={false}>
                {limitedList.length > 0
                    ? limitedList.map((contract, index) =>
                          contract.delete ? null : (
                              <Timeline.Item
                                  // TEMP: key={contract.id}
                                  key={index}
                                  dot={
                                      contract.document_link === null ||
                                      contract.document_link === undefined ? null : (
                                          <FileTextTwoTone
                                              style={{ fontSize: '16px' }}
                                              onClick={() => {
                                                  setModalState({
                                                      open: false,
                                                      link: contract.document_link,
                                                  });
                                              }}
                                          />
                                      )
                                  }
                                  label={
                                      contract.experience_years ? (
                                          <div>
                                              <div className="timeline">
                                                  {getDateForTimeLine(contract?.date_from)} -{' '}
                                                  {contract?.date_to !== null &&
                                                  contract.experience_years !== null ? (
                                                      getDateForTimeLine(contract?.date_to)
                                                  ) : (
                                                      <>н.с.</>
                                                  )}
                                              </div>
                                              <div className="timeline">
                                                  {contract?.experience_years || ''}{' '}
                                                  {plural(contract?.experience_years, [
                                                      currentLocale==='kk' ? 'жыл' : 'год',
                                                      currentLocale==='kk' ? 'жыл' : 'года',
                                                      currentLocale==='kk' ? 'жыл' : 'лет',
                                                  ])}
                                              </div>
                                          </div>
                                      ) : (
                                          <div className="timeline">
                                              {getDateForTimeLine(contract?.date_from)}
                                          </div>
                                      )
                                  }
                                  onClick={() => handleClick(contract)}
                              >
                                  <p className="timeline-mute">
                                      {<LocalizationText text={contract} /> || ''}{' '}
                                      {contract?.document_number
                                          ? contract?.document_number.includes('№')
                                              ? contract?.document_number
                                              : ` №${contract?.document_number}`
                                          : ''}
                                  </p>
                                  <p className="timeline-mute">
                                      {
                                          contract.date_credited!==null &&
                                          <> {currentLocale==='ru' && <>от &nbsp;</>}
                                              {moment(contract?.date_credited).format('DD.MM.YYYY')}
                                              {currentLocale==='kk' && <>&nbsp; бастап</>}
                                          </>
                                      }
                                  </p>
                              </Timeline.Item>
                          ),
                      )
                    : source === 'get' && null}
            </Timeline>
        </CollapseErrorBoundary>
    );
};

export default ContractsList;
