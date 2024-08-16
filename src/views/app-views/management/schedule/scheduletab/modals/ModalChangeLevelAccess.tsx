import { Checkbox, Modal, Spin } from 'antd';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import React, { useEffect, useState } from 'react';
import { components } from '../../../../../../API/types';
import { PrivateServices } from '../../../../../../API';
import { LoadingOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

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
const ModalChangeLevelAccess = ({ isOpen, onClose, chosenItemStaffUnit }: Props) => {
    const [typePermissions, setTypePermissions] = useState<
        components['schemas']['PermissionTypeRead'][]
    >([]);
    const [userPermissions, setUserPermissions] = useState<
        components['schemas']['PermissionRead'][]
    >([]);
    const [clickType, setClickType] = useState<CheckboxValueType[]>([]);
    const [delPermission, setDelPermission] = useState<components['schemas']['PermissionRead'][]>(
        [],
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [defaultValue, setDefaultValue] = useState<string[]>([]);
    const [form] = useForm();
    const [word, setWord] = useState<string>('');

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
                    // typeResponse.data.forEach((permission) => {
                    //     if (!permission.name || !response.data) return;
                    //     form.setFieldValue(permission.name, !!response.data.find((perm) => perm.type_id === permission.id))
                    // })
                    // Объединяем массивы
                }
                if (typeResponse.data && response.data) {
                    const combinedArray = response.data.map((item) => {
                        // Находим соответствующий объект в typeResponse по условию
                        const correspondingType = typeResponse.data.find(
                            (typeItem) => typeItem.id === item.type_id,
                        );
                        // Возвращаем объединенный объект, если найден
                        if (correspondingType) {
                            return correspondingType.id;
                        }
                        return [];
                    });
                    if (combinedArray !== undefined) {
                        const filteredArray = combinedArray.filter(
                            (item) => item !== undefined,
                        ) as string[];
                        if (filteredArray.length > 0) {
                            setDefaultValue(filteredArray);
                        } else {
                            setWord('null');
                        }
                        setDefaultValue(filteredArray);
                    }
                }
            }
        };
        if (isOpen) {
            void setInitialValues();
        }
    }, [isOpen]);

    const handleOk = () => {
        if (chosenItemStaffUnit && chosenItemStaffUnit?.users) {
            if (clickType.length > 0) {
                clickType.map(async (item) => {
                    if (
                        chosenItemStaffUnit &&
                        chosenItemStaffUnit?.users &&
                        chosenItemStaffUnit?.users[0]?.id &&
                        item
                    ) {
                        if (defaultValue.find((value) => value === item) === undefined) {
                            await PrivateServices.post('/api/v1/permissions', {
                                body: {
                                    type_id: item.toString(),
                                    user_id: chosenItemStaffUnit?.users[0]?.id,
                                },
                            });
                        }
                    }
                });
            }
        }
        const objectsNotInClickType = userPermissions.filter(
            (item) => !clickType.includes(item.type_id),
        );
        if (objectsNotInClickType.length > 0) {
            objectsNotInClickType.map(async (response) => {
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
        setLoading(false);
        setWord('');
        setDefaultValue([]);
        onClose();
    };

    const handleCancel = () => {
        setWord('');
        setDefaultValue([]);
        onClose();
    };

    return (
        <Modal
            width={550}
            open={isOpen}
            onCancel={handleCancel}
            onOk={handleOk}
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
                {defaultValue.length > 0 && (
                    <Checkbox.Group
                        options={typePermissions?.map((item) => {
                            return {
                                value: item.id || '',
                                label: item.name || '',
                            };
                        })}
                        defaultValue={defaultValue}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}
                        onChange={(newSelectedValues) => {
                            setClickType(newSelectedValues);
                        }}
                    />
                )}
                {word === 'null' && (
                    <Checkbox.Group
                        options={typePermissions?.map((item) => {
                            return {
                                value: item.id || '',
                                label: item.name || '',
                            };
                        })}
                        defaultValue={defaultValue}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}
                        onChange={(newSelectedValues) => {
                            setClickType(newSelectedValues);
                        }}
                    />
                )}
            </Spin>
        </Modal>
    );
};

export default ModalChangeLevelAccess;
