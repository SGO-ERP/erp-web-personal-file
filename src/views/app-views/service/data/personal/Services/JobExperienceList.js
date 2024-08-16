import React, { useEffect, useState } from 'react';
import { Timeline } from 'antd';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import ModalEditWorkExperience from './modals/ModalEditWorkExperience';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import CollapseErrorBoundary from '../common/CollapseErrorBoundary';
import {DownOutlined, FileTextTwoTone, UpOutlined} from '@ant-design/icons';

const JobExperienceList = ({ jobsList, setModalState }) => {
    const [currentExperience, setCurrentExperience] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [source, setSource] = useState('get');
    const [showList, setShowList] = useState(true);

    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem('lan');

    const sortedList = jobsList
        .sort((a, b) => new Date(a.date_from) - new Date(b.date_from))
        .reverse();
    const limitedList = showList ? sortedList.slice(0, 3) : sortedList;

    useEffect(() => {
        setShowList(modeRedactor ? false : true);
    }, [modeRedactor]);

    const handleClick = (experience) => {
        if (!modeRedactor) return;
        setCurrentExperience(experience);
        setSource(jobsList.source ? jobsList.source : 'get');
        setShowEditModal(true);
    };

    const generatePendingDot = () => {
        if (modeRedactor || jobsList.length <= 3) return <></>;

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

    if (!jobsList) return null;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentExperience && (
                <ModalEditWorkExperience
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                    experience={currentExperience}
                />
            )}
            <Timeline mode="left" pending={true} pendingDot={generatePendingDot()}>
                {limitedList.length > 0 &&
                    limitedList.map((item, index) =>
                        item.delete ? null : (
                            <Timeline.Item
                                key={index}
                                dot={
                                    item.document_link === null ||
                                    item.document_link === undefined ? null : (
                                        <FileTextTwoTone
                                            style={{ fontSize: '16px' }}
                                            onClick={() => {
                                                setModalState({
                                                    open: false,
                                                    link: item.document_link,
                                                });
                                            }}
                                        />
                                    )
                                }
                                label={
                                    <div>
                                        <div className="timeline">
                                            {moment(item.date_from).format('DD.MM.YYYY')} -{' '}
                                            {moment(item.date_to).format('DD.MM.YYYY')}
                                        </div>
                                    </div>
                                }
                                className={
                                    'font-style' +
                                    (modeRedactor && ' clickable-accordion') +
                                    (source !== 'get' &&
                                        index === 0 &&
                                        ' education-timeline-to-top')
                                }
                                onClick={() => handleClick(item)}
                            >
                                <p className="timeline">
                                    {(currentLocale === 'kk'
                                        ? item.position_work_experienceKZ
                                        : item.position_work_experience) || ''}
                                </p>
                                <p className="timeline-mute">
                                    {(currentLocale === 'kk'
                                        ? item.name_of_organizationKZ
                                        : item.name_of_organization) || ''}
                                </p>
                                {item?.is_credited === true && (
                                    <p className="timeline-mute">
                                        <IntlMessage id={'order.counted'} /> № {item.document_number || ''} {currentLocale!=='kk' && <>от</>}{' '}
                                        {moment(item.date_from).format('DD.MM.YYYY')}
                                    </p>
                                )}
                            </Timeline.Item>
                        ),
                    )}
            </Timeline>
        </CollapseErrorBoundary>
    );
};

export default JobExperienceList;
