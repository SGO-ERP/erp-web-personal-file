import { Button, Cascader, Form, Input, message, Modal, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import './style.css';
import ListUsers from '../ListUsers/ListUsers';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendStageInfo } from '../../../../../store/slices/candidates/candidateStageInfoSlice';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { PrivateServices } from '../../../../../API';
import ScriptLoader from 'components/shared-components/ScriptLoader';
import { ReloadOutlined } from '@ant-design/icons';

export default function SignECP({
    modalCase,
    openModal,
    handleSignSaveForSubmitForTheAgreements,
    stageInfoId,
    stageName,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { id } = useParams();

    const dispatch = useDispatch();

    const [choosedU, setChoosedU] = useState([]);
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState([]);
    const [user, setUser] = useState([]);
    const [staffUnitUser, setStaffUnitUser] = useState();
    const [form] = Form.useForm();
    const handleCancel = () => {
        setIsModalOpen(false);
        modalCase.showModalDigitalSignature2(isModalOpen);
    };

    const departmentUsers = useSelector((state) => state.candidateHrDoc.data);

    function isDepartment(department) {
        if (department.id === choosedU) {
            message.error('Нельзя выбрать департамент/управление/отделение');
            throw new Error('Нельзя выбрать департамент/управление/отделение');
        }
        department?.children?.forEach((departmentChildren) => {
            isDepartment(departmentChildren);
        });
    }

    function validateDepartmentUsers() {
        if (departmentUsers.length > 0) {
            departmentUsers.forEach((department) => {
                isDepartment(department);
            });
        }
    }

    useEffect(() => {
        PrivateServices.get('/api/v1/positions', {
            params: {
                query: {
                    skip: 0,
                    limit: 100,
                },
            },
        }).then((response) => {
            if (response?.data) {
                setPosition(
                    response.data.filter((position) => position.name.toLowerCase() === 'психолог'),
                );
            }
        });
    }, []);

    useEffect(() => {
        if (position.length > 0) {
            PrivateServices.get('/api/v1/users/position/{id}', {
                params: {
                    path: {
                        id: position[0]?.id,
                    },
                },
            }).then((response) => {
                if (response?.data) {
                    setUser(response.data);
                }
            });
        }
    }, [position]);

    const onOk = async () => {
        try {
            setLoading(true);
            if (stageName !== 'Беседа с психологом') {
                validateDepartmentUsers();
            }
            const values = await form.getFieldsValue(); // Получение значений полей формы
            const { user } = values;
            const selectedUserId =
                stageName !== 'Беседа с психологом'
                    ? user.split(',')[user.split(',').length - 1]
                    : user;
            const data = {
                'staff_unit_coordinate_id': selectedUserId,
            };

            await handleSignSaveForSubmitForTheAgreements();

            const dataStatus = {
                'status': 'В прогрессе',
            };

            await dispatch(
                sendStageInfo({
                    stageInfoId: stageInfoId,
                    data: data,
                    dataStatus: dataStatus,
                }),
            )
                .then(() => {
                    handleCancel();
                    modalCase.showModalDigitalSignature2(isModalOpen);
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            setLoading(false);
            console.log('Form validation error', error);
        }
    };

    function handleCascaderChange(e) {
        setStaffUnitUser(e[0]);
    }

    const handleScriptsLoaded = () => {
        console.log('ready');
    };

    return (
        <Modal
            title={<IntlMessage id={'candidates.title.signEDS'} />}
            open={openModal}
            onOk={onOk}
            okText={<IntlMessage id={'candidates.title.send'} />}
            cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
            onCancel={handleCancel}
            width={400}
        >
            <ScriptLoader
                scripts={[
                    '/js/jquery-2.1.4.js',
                    '/js/jquery.blockUI.js',
                    '/js/sign/CryptoApi.js',
                    '/js/sign/CryptoApiTumar.js',
                    '/js/sign/CryptoApiNew.js',
                    '/js/sign/tumsocket.js',
                    '/js/sign/app.js',
                ]}
                onScriptsLoaded={handleScriptsLoaded}
            />
            <Spin spinning={loading} size="large">
                <Form
                    fields={[
                        {
                            name: ['user'],
                            value: stageName !== 'Беседа с психологом' ? choosedU : staffUnitUser,
                        },
                    ]}
                    layout={'vertical'}
                    form={form}
                >
                    <Form.Item
                        label={<IntlMessage id={'candidates.title.choose'} />}
                        name={'user'}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={'candidates.title.must'} />,
                            },
                        ]}
                    >
                        {stageName === 'Беседа с психологом' ? (
                            <Cascader
                                options={
                                    user &&
                                    user.map((item) => ({
                                        value: item.staff_unit.id,
                                        label: item.first_name + ' ' + item.last_name,
                                    }))
                                }
                                onChange={handleCascaderChange}
                            />
                        ) : (
                            <ListUsers
                                positionName={
                                    stageName === 'Беседа с психологом' ? 'Психолог' : undefined
                                }
                                ids={choosedU}
                                setIds={setChoosedU}
                            />
                        )}
                    </Form.Item>
                    <Form.Item name="token" label="Токен">
                        <Space.Compact size={10} block>
                            <select
                                className="ecp-select"
                                placeholder="Токен"
                                id="profiles"
                                style={{ padding: '10px', width: '312px', display: 'block' }}
                            >
                                <option value="1">
                                    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzNTZmMjZmYS1jMTgxLTQ3YmEtOTcyZC1hZDE3ZDEzMmMwY2QiLCJpYXQiOjE2OTI5NTk2NjYsIm5iZiI6MTY5Mjk1OTY2NiwianRpIjoiODdjNjYyMjktZjlhMy00ZWZiLWE4YmUtYTFhMDlhZDNlN2U0IiwiZXhwIjoxNjk2NTU5NjY2LCJ0eXBlIjoiYWNjZXNzIiwiZnJlc2giOmZhbHNlLCJyb2xlIjoiYTIxNGZmMTQtNDcxMS00OWFjLWExNGEtYjI5NjBjMGI0MmZlIiwiaWluIjoiMTIzNDU2Nzg5MDEyIn0.TMFVMFJDJxt1XmEcHkOoLkDMvwteF-MR7w1IQksAUeE
                                </option>
                            </select>
                            <Button
                                icon={<ReloadOutlined />}
                                type="primary"
                                onClick={() => window.loadProfiles()}
                            />
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item name="keys" label="Ключ">
                        <Space.Compact size={10} block>
                            <select
                                className="ecp-select"
                                placeholder="Токен"
                                id="certificates"
                                style={{ padding: '10px', width: '312px', display: 'block' }}
                            >
                                <option value="1">Card key 1</option>
                            </select>
                            <Button
                                icon={<ReloadOutlined />}
                                type="primary"
                                onClick={() => window.loadKeysFromProfile()}
                            />
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item name="pwd" label="Пароль">
                        <Space.Compact size={10} block>
                            <Input
                                placeholder="Пароль"
                                type="password"
                                id="password"
                                value="123456"
                            />
                            <Button icon={<ReloadOutlined />} type="primary" />
                        </Space.Compact>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}
