import { Button, Col, notification, Row, Spin, Typography } from 'antd';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from 'store/slices/users/usersSlice';
import { resetValues, save, setMode } from '../../../../../../store/slices/myInfo/myInfoSlice';
import EditInput from '../common/EditInput';
import IntlMessage from 'components/util-components/IntlMessage';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

export const PersonalInfoCandidate = ({ id }) => {
    let user = useSelector((state) => state.users.user);
    let isLoading = useSelector((state) => state.users.loading);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const { i18n } = useTranslation();

    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUser(id));
    }, []);

    const handleSave = async () => {
        try {
            await dispatch(save(user.id));
            window.location.reload();
            notification.success({
                message: 'Данные успешно сохранены',
            });
            dispatch(setMode(false));
        } catch (e) {
            notification.error({
                message: 'Некоторые данные могли не сохраниться',
            });
        }
    };

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '200px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    const discardChanges = () => {
        dispatch(setMode(false));
        dispatch(resetValues());
        window.location.reload();
    };

    // TODO: ADD LATER
    return (
        <div>
            {isLoading ? (
                <div
                    style={{
                        minHeight: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {/* Row for name  */}
                    <Row justifyContent="space-between">
                        <Col xxs={24} xs={24} md={24} lg={12} xl={14}>
                            <Row>
                                <Col>
                                    <Typography className="name">
                                        {user.father_name
                                            ? user.last_name +
                                              ' ' +
                                              user.first_name +
                                              ' ' +
                                              user.father_name
                                            : user.last_name + ' ' + user.first_name}
                                    </Typography>
                                </Col>
                            </Row>
                        </Col>
                        <Col xxs={24} xs={24} md={24} lg={12} xl={10}>
                            <Row gutter={4}>
                                <Col style={{ paddingLeft: 0 }}>
                                    <Button shape="round" size={'small'}>
                                        {' '}
                                        <IntlMessage id="personal.button.updateData" />{' '}
                                    </Button>
                                </Col>
                                <Col>
                                    {modeRedactor && (
                                        <Button
                                            shape="round"
                                            size={'small'}
                                            onClick={discardChanges}
                                        >
                                            {' '}
                                            <IntlMessage id="personal.button.undoChanges" />{' '}
                                        </Button>
                                    )}
                                    {!modeRedactor && (
                                        <Button
                                            shape="round"
                                            size={'small'}
                                            onClick={() => dispatch(setMode(true))}
                                        >
                                            {' '}
                                            <IntlMessage id="personal.button.edit" />{' '}
                                        </Button>
                                    )}
                                </Col>
                                <Col>
                                    {!modeRedactor && (
                                        <Button type="primary" shape="round" size={'small'}>
                                            {' '}
                                            <IntlMessage id="personal.button.download" />{' '}
                                        </Button>
                                    )}
                                    {modeRedactor && (
                                        <Button
                                            type="primary"
                                            shape="round"
                                            size={'small'}
                                            onClick={handleSave}
                                        >
                                            {' '}
                                            <IntlMessage id="personal.button.save" />{' '}
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Row for avatar and etc. */}
                    <Row style={{ marginTop: '20px', alignItems: 'center' }} gutter={16}>
                        <Col xl={3} style={{ marginBottom: '20px' }}>
                            <AvatarStatus size={120} src={user.icon} style={{ margin: '20px' }} />
                        </Col>
                        <Col xl={6} lg={6}>
                            <Row className="user-info-container">
                                <span>
                                    <Text style={{ fontWeight: 500 }}>
                                        <IntlMessage id="personal.family.IIN" />:
                                    </Text>
                                </span>
                                {user.iin ?? 'Нет данных'}
                            </Row>
                            <Row className="user-info-container">
                                <span>
                                    <Text style={{ fontWeight: 500 }}>
                                        <IntlMessage id="personal.generalInfo.birthday" />
                                    </Text>
                                </span>
                                <span>{moment(user.date_birth).format('DD.MM.YYYY')}</span>
                            </Row>
                            <Row className="user-info-container">
                                <span>
                                    <Text style={{ fontWeight: 500 }}>
                                        <IntlMessage id="personal.generalInfo.mobilePhone" />
                                    </Text>
                                </span>
                                <EditInput
                                    style={{ width: 150 }}
                                    defaultValue={user.phone_number}
                                    fieldName="allTabs.user_info.phone_number"
                                    fieldNameGet="initialTabs.user_info.phone_number"
                                />
                            </Row>
                        </Col>
                        <Col xl={9} lg={8}>
                            <Row className="user-info-container">
                                <span>
                                    <Text style={{ fontWeight: 500 }}>
                                        <IntlMessage id="personal.generalInfo.oath" />:
                                    </Text>
                                </span>
                                <span>
                                    {i18n.language === 'kk' ? user.rank?.nameKZ : user.rank?.name}
                                </span>
                            </Row>
                            <Row className="user-info-container">
                                <span>
                                    <Text style={{ fontWeight: 500 }}>
                                        <IntlMessage id="personal.generalInfo.personalNum" />
                                    </Text>
                                </span>
                                <EditInput
                                    style={{ width: 90 }}
                                    defaultValue={user?.id_number ?? 'Данных нет'}
                                    fieldName="allTabs.user_info.id_number"
                                    fieldNameGet="initialTabs.user_info.id_number"
                                />
                            </Row>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};
export default PersonalInfoCandidate;
