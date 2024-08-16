import { FileTextTwoTone } from '@ant-design/icons';
import { Col, Divider, notification, Row } from 'antd';
import moment from 'moment/moment';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ModalAllAchievementsEdit from '../modals/ModalAllAchievementsEdit';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { LocalText } from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import CollapseErrorBoundary from '../../common/CollapseErrorBoundary';
import { useAppSelector } from '../../../../../../../hooks/useStore';
import { PERMISSION } from 'constants/permission';

const SportAchievement = ({ setModalState, achievements, source = 'get' }) => {
    const [currentAchievement, setCurrentAchievement] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    const profile = useSelector((state) => state.profile.data);
    const handleClick = (achievement) => {
        if (!modeRedactor) {
            return;
        }
        if (!isHR) {
            notification.warn({ message: <IntlMessage id={'personal.positionNotHR'} /> });
            return;
        }
        if (profile === null) {
            notification.warn({ message: <IntlMessage id={'personal.positionNotHR'} /> });
            return;
        }
        if (!modeRedactor) return;
        setCurrentAchievement(achievement);
        setShowEditModal(true);
    };

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <Row
                gutter={[18, 16]}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                {currentAchievement && (
                    <ModalAllAchievementsEdit
                        achievement={currentAchievement}
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        source={source}
                    />
                )}
                {achievements?.length !== 0 &&
                    achievements
                        .filter((item) => !item.delete)
                        .map((achievement, i) => (
                            <React.Fragment key={i}>
                                <Col
                                    xs={20}
                                    className={
                                        'font-style' + (modeRedactor && ' clickable-accordion')
                                    }
                                    onClick={() => handleClick(achievement)}
                                >
                                    <h5>{LocalText.getName(achievement.sport_type)}</h5>
                                    {LocalText.getName(achievement)}
                                    <p
                                        style={{ color: '#366EF6', fontSize: '12px' }}
                                        className={'font-style'}
                                    >
                                        {moment(achievement.assignment_date).format('DD.MM.YYYY')}
                                    </p>
                                </Col>

                                {achievement.document_link === null ||
                                achievement.document_link === undefined ? null : (
                                    <Col>
                                        <FileTextTwoTone
                                            style={{ fontSize: '20px' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({
                                                    open: false,
                                                    link: achievement.document_link,
                                                });
                                            }}
                                        />
                                    </Col>
                                )}

                                {i < achievement.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
            </Row>
        </CollapseErrorBoundary>
    );
};

export default SportAchievement;
