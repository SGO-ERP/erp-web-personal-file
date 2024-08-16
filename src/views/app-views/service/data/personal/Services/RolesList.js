import { DownOutlined, FileTextTwoTone, UpOutlined } from '@ant-design/icons';
import { Timeline } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ModalEditRank from './modals/ModalEditRank';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import CollapseErrorBoundary from '../common/CollapseErrorBoundary';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';

const RolesList = ({ ranks, setModalState }) => {
    const [source, setSource] = useState('get');
    const [showList, setShowList] = useState(true);
    const [currentRank, setCurrentRank] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const sortedRanks = ranks
        .sort((a, b) => new Date(a.date_from) - new Date(b.date_from))
        .reverse();

    const limitedEducations = showList ? sortedRanks.slice(0, 3) : sortedRanks;
    const currentLocale = localStorage.getItem('lan');

    useEffect(() => {
        setShowList(modeRedactor ? false : true);
    }, [modeRedactor]);

    const generatePendingDot = () => {
        if (modeRedactor || ranks.length <= 3) return <></>;

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

    const handleClick = (rank) => {
        if (!modeRedactor) return;
        setCurrentRank(rank);
        setSource(ranks.source ? ranks.source : 'get');
        setShowEditModal(true);
    };
    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentRank && !currentRank.document_link && (
                <ModalEditRank
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                    rank={currentRank}
                />
            )}
            <Timeline mode="left" pending={true} pendingDot={generatePendingDot()} reverse={false}>
                {limitedEducations.map((rank, index) =>
                    !rank.delete ? (
                        <Timeline.Item
                            // TEMP: key={item.id}
                            key={index}
                            dot={
                                rank.document_link === null ||
                                rank.document_link === undefined ? null : (
                                    <FileTextTwoTone
                                        style={{ fontSize: '20px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalState({
                                                open: false,
                                                link: rank.document_link,
                                            });
                                        }}
                                    />
                                )
                            }
                            label={
                                <>
                                    <div className="timeline">
                                        {LocalText.getName(rank) || LocalText.getName(rank.names)}
                                    </div>
                                    <p className="timeline-mute">
                                        {rank?.early_promotion && (
                                            <>
                                                (<IntlMessage id={'early'} />)
                                            </>
                                        )}
                                    </p>
                                </>
                            }
                            className={
                                'font-style' +
                                (modeRedactor && ' clickable-accordion') +
                                (source !== 'get' && index === 0 && ' education-timeline-to-top')
                            }
                            onClick={() => handleClick(rank)}
                        >
                            <p className="timeline"><IntlMessage id={'personal.services.awards.modal.order'} /> №{rank?.document_number || ''}</p>
                            <p className="timeline-mute">
                                {currentLocale==='ru' && <>от &nbsp;</>}
                                {moment(rank?.date_from).format('DD.MM.YYYY')}
                                {currentLocale==='kk' && <>&nbsp; бастап</>}
                            </p>
                        </Timeline.Item>
                    ) : (
                        <></>
                    ),
                )}
            </Timeline>
        </CollapseErrorBoundary>
    );
};

export default RolesList;
