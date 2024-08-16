import React, { useEffect } from 'react';
import { Button, Col, Row } from 'antd';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { useDispatch, useSelector } from 'react-redux';

import { getProfile } from 'store/slices/ProfileSlice';
import { getUserID } from 'utils/helpers/common';

const SaveButton = ({ isSend, saveAnswer, isDisabled, handleSignSave, handleSignSend }) => {
    const profile = useSelector((state) => state.profile.data);
    const user = useSelector((state) => state.users.user);

    const dispatch = useDispatch();
    useEffect(() => {
        const getUser = async () => {
            dispatch(getProfile({ id: await getUserID() }));
        };
        getUser();
    }, []);
    return (
        <div>
            <Row gutter={6}>
                <Col xs={18} style={{ textAlign: 'end' }}>
                    <Button
                        disabled={
                            isDisabled === 'Пройден успешно' ||
                            isDisabled === 'В прогрессе' ||
                            isDisabled === 'Завален'
                        }
                        onClick={saveAnswer}
                    >
                        <IntlMessage id={'personal.button.save'} />
                    </Button>
                </Col>
                {isSend === true ? (
                    <Col xs={6}>
                        <Button
                            disabled={isDisabled !== 'Не начат'}
                            type="primary"
                            onClick={handleSignSend}
                        >
                            <IntlMessage id={'candidates.button.signAndSend'} />
                        </Button>
                    </Col>
                ) : isSend === false ? (
                    <Col xs={6}>
                        <Button
                            disabled={isDisabled !== 'Не начат'}
                            onClick={handleSignSave}
                            type="primary"
                        >
                            <IntlMessage id={'candidates.button.signAndSave'} />
                        </Button>
                    </Col>
                ) : null}
            </Row>
        </div>
    );
};

export default SaveButton;
