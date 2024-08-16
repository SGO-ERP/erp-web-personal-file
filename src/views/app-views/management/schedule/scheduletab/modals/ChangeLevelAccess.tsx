import { Checkbox, Col, Form, Modal, Row, Spin } from 'antd';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import React, { useEffect, useState } from 'react';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { components } from '../../../../../../API/types';
import { PrivateServices } from '../../../../../../API';
import LocalizationText from '../../../../../../components/util-components/LocalizationText/LocalizationText';
import { LoadingOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    chosenItemStaffUnit: components['schemas']['schemas__staff_division__StaffUnitRead'];
}

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);
const ChangeLevelAccess = ({ isOpen, onClose, chosenItemStaffUnit }: Props) => {
    const [typePermissions, setTypePermissions] = useState<
        components['schemas']['PermissionTypeRead'][]
    >([]);
    const [userPermissions, setUserPermissions] = useState<
        components['schemas']['PermissionRead'][]
    >([]);
    const [clickType, setClickType] = useState<components['schemas']['PermissionTypeRead'][]>([]);
    const [delPermission, setDelPermission] = useState<components['schemas']['PermissionRead'][]>(
        [],
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = useForm();

    const handleOk = () => {
        return;
        if (chosenItemStaffUnit && chosenItemStaffUnit?.users) {
            if (clickType.length > 0) {
                clickType.map(async (item) => {
                    if (
                        item &&
                        chosenItemStaffUnit &&
                        chosenItemStaffUnit?.users &&
                        chosenItemStaffUnit?.users[0]?.id &&
                        item.id
                    ) {
                        await PrivateServices.post('/api/v1/permissions', {
                            body: {
                                type_id: item.id,
                                user_id: chosenItemStaffUnit?.users[0]?.id,
                            },
                        });
                    }
                });
            }
            if (delPermission.length > 0) {
                delPermission.map(async (response) => {
                    if (response && response.id) {
                        await PrivateServices.del('/api/v1/permissions/{id}/', {
                            params: {
                                path: {
                                    id: response.id,
                                },
                            },
                        });
                    }
                });
            }
            form.resetFields();
            setLoading(false);
            onClose();
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };
    const onChangeCheckbox = (
        e: CheckboxChangeEvent,
        per: components['schemas']['PermissionTypeRead'],
    ) => {
        if (e.target.checked) {
            setClickType([...clickType, per]);
        } else {
            const find = userPermissions.find((perm) => perm.type_id === per.id);
            if (find) {
                setDelPermission([...delPermission, find]);
            } else {
                const finish_result = clickType.filter((click) => click.id !== per.id);
                setClickType(finish_result);
            }
        }
    };

    useEffect(() => {
        const setInitialValues = async () => {
            if (chosenItemStaffUnit && chosenItemStaffUnit?.users) {
                setLoading(true);
                const response = await PrivateServices.get('/api/v1/permissions/user_permissions', {
                    params: {
                        query: {
                            user_id: chosenItemStaffUnit?.users[0]?.id,
                        },
                    },
                });
                if (response.data) {
                    setLoading(false);
                    setUserPermissions(response.data);
                }

                const typeResponse = await PrivateServices.get('/api/v1/permissions/types', {
                    params: {
                        query: {
                            skip: 0,
                            limit: 100,
                        },
                    },
                });
                if (typeResponse.data) {
                    setLoading(false);
                    setTypePermissions(typeResponse.data);
                    typeResponse.data.forEach((permission) => {
                        if (!permission.name || !response.data) return;
                        form.setFieldValue(
                            permission.name,
                            !!response.data.find((perm) => perm.type_id === permission.id),
                        );
                    });
                }
            }
        };
        if (isOpen) {
            void setInitialValues();
        }
    }, [isOpen]);

    return (
        <Modal
            width={550}
            open={isOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            afterClose={handleCancel}
            okText={<IntlMessage id="initiate.save" />}
            cancelText={<IntlMessage id="candidates.warning.cancel" />}
            title={IntlMessageText.getText({ id: 'schedule.setting' })}
        >
            {' '}
            <Spin
                spinning={loading}
                indicator={antIcon}
                size="large"
                style={{ position: 'absolute', top: 120 }}
            >
                <Row gutter={[16, 16]}>
                    <Form form={form}>
                        {typePermissions.map((per, index) => (
                            <Col xs={24} key={index}>
                                <Form.Item name={per.name} key={per.id}>
                                    <Checkbox defaultChecked={form.getFieldValue(per.name || '')}>
                                        <LocalizationText text={per} />
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        ))}
                    </Form>
                </Row>
            </Spin>
        </Modal>
    );
};

export default ChangeLevelAccess;
