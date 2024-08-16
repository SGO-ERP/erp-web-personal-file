import { Button, Col, Form, Input, Mentions, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { showHideCommentModal } from 'store/slices/tableControllerSlice/tableControllerSlice';
import IntlMessage, {
    IntlMessageText,
} from '../../../../../components/util-components/IntlMessage';
import {
    getActiveUsers,
    setSearchTextForStaff,
} from '../../../../../store/slices/users/usersStaffSlice';
import { AVATAR_PLACEHOLDER } from 'components/shared-components/AvatarFallback';

const { TextArea } = Input;

const CommentCard = ({ onChildData, recordCheckbox }) => {
    // it is sign_in
    const [text, setText] = useState('');
    const openModal = useSelector((state) => state.tableController.commenMoodal);

    const list = useSelector((state) => state.usersStaff.active.data);
    const myProfile = useSelector((state) => state.profile.data);

    const { t } = useTranslation();

    const [form] = Form.useForm();

    let dispatch = useDispatch();

    useEffect(() => {
        if (openModal) {
            dispatch(setSearchTextForStaff(''));
            dispatch(getActiveUsers({ page: 1, limit: 100 }));
        }
    }, [openModal]);

    function handleAddComment() {
        onChildData(
            text,
            recordCheckbox.id,
            recordCheckbox.checked,
            recordCheckbox.can_cancel,
            recordCheckbox.isSigned,
        );
        setText('');
        dispatch(showHideCommentModal(false));
    }

    const handleCancel = () => {
        setText('');
        dispatch(showHideCommentModal(false));
    };

    function textControler(e) {
        setText(e);
    }

    function addAdditionalText(additionalText) {
        setText((text + additionalText).replaceAll('@', ''));
    }

    function deleteSobachka(e) {
        addAdditionalText(e.value);
    }

    return (
        <div>
            <Modal
                title={<IntlMessage id={'addComment'} />}
                open={openModal}
                footer={null}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    fields={[
                        {
                            name: ['comment'],
                            value: text,
                        },
                    ]}
                >
                    <Row gutter={12}>
                        <Col>
                            <Button
                                type="default"
                                style={{
                                    padding: '5px 15px',
                                    borderRadius: '25px',
                                    height: 'auto',
                                }}
                                onClick={() => {
                                    addAdditionalText(t('notSuitableFor'));
                                }}
                            >
                                <IntlMessage id={'notSuitableFor'} />
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="default"
                                style={{
                                    padding: '5px 15px',
                                    borderRadius: '25px',
                                    height: 'auto',
                                }}
                                onClick={() => {
                                    addAdditionalText(t('compliant'));
                                }}
                            >
                                <IntlMessage id={'compliant'} />
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '3%' }}>
                        <Col xs={3}>
                            <Row>
                                <img
                                    src={myProfile?.icon || ''}
                                    alt="avatar"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        objectPosition: 'top',
                                    }}
                                    onError={`this.onerror=null;this.src='${AVATAR_PLACEHOLDER}';`}
                                />
                            </Row>
                        </Col>
                        <Col xs={21}>
                            <Form.Item name="comment">
                                <Row>
                                    <Mentions
                                        value={text}
                                        onChange={(e) => {
                                            textControler(e);
                                        }}
                                        placeholder={IntlMessageText.getText({
                                            id: 'writeComment',
                                        })}
                                        rows={5}
                                        onSelect={(e) => {
                                            deleteSobachka(e);
                                        }}
                                        options={list?.users?.map((item) => ({
                                            value:
                                                item.last_name +
                                                ' ' +
                                                item.first_name +
                                                ' ' +
                                                item.father_name,
                                            label:
                                                item.last_name +
                                                ' ' +
                                                item.first_name +
                                                ' ' +
                                                item.father_name,
                                        }))}
                                    />
                                </Row>
                            </Form.Item>
                            <Row justify="end" style={{ marginTop: '15px' }}>
                                <Button
                                    disabled={text.length < 5}
                                    type="primary"
                                    className="commentBtn"
                                    onClick={handleAddComment}
                                >
                                    <IntlMessage id={'leaveComment'} />
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default CommentCard;
