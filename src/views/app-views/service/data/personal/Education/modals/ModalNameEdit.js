import { Col, Input, Modal, Row } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFieldValue } from 'store/slices/myInfo/myInfoSlice';

const ModalNameEdit = ({ onClose, isOpen }) => {
    const [initials, setInitials] = useState({ first_name: '', last_name: '', father_name: '' });

    const dispatch = useDispatch();

    const handleOk = () => {
        dispatch(
            setFieldValue({
                fieldPath: 'allTabs.personal_data.biographic_info.initials',
                value: initials,
            }),
        );
        onClose();
    };

    const handleInput = (type, text) => {
        setInitials((prevInitials) => {
            if (type === 'name') {
                return { ...prevInitials, first_name: text.target.value };
            } else if (type === 'last') {
                return { ...prevInitials, last_name: text.target.value };
            } else {
                return { ...prevInitials, father_name: text.target.value };
            }
        });
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                open={isOpen}
                onOk={handleOk}
                onCancel={onClose}
                cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
                title={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginRight: '20px',
                            alignItems: 'center',
                        }}
                    >
                        <span>
                            <IntlMessage id={'personal.personalData.nameChangesHistory'} />
                        </span>
                    </div>
                }
                okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
            >
                <Row align="middle" style={{ marginBottom: 10 }}>
                    <Col xs={7}>
                        <IntlMessage id="personal.personalData.surname" />
                    </Col>
                    <Col xs={17}>
                        <Input onChange={(e) => handleInput('last', e)} />
                    </Col>
                </Row>
                <Row align="middle" style={{ marginBottom: 10 }}>
                    <Col xs={7}>
                        <IntlMessage id="personal.personalData.fatherName" />
                    </Col>
                    <Col xs={17}>
                        <Input onChange={(e) => handleInput('father', e)} />
                    </Col>
                </Row>
                <Row align="middle">
                    <Col xs={7}>
                        <IntlMessage id="personal.personalData.name" />
                    </Col>
                    <Col xs={17}>
                        <Input onChange={(e) => handleInput('name', e)} />
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default ModalNameEdit;
