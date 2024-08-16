import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { useSearchParams } from 'react-router-dom';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { useEdit } from 'hooks/schedule/useEdit';
import { QuestionCircleFilled } from '@ant-design/icons/lib/icons';
import { PrivateServices } from '../../../../../../API';
import { TreeContext } from '../../edit';

const ModalDuplicateDivision = ({ isOpen, onClose, staffDivision }) => {
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();
    const staffListId = searchParams.get('staffListId');
    const { duplicateStaffDivision } = useEdit();
    const [staff_division_number, setNumber] = useState();
    const [typeDiv, setTypeDiv] = useState([]);
    const [type, setType] = useState();
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setIsLoading } = useContext(TreeContext);

    useEffect(() => {
        if (typeDiv.length === 0) {
            const createdStaffUnit = PrivateServices.get('/api/v1/staff_division/types', {
                params: {
                    query: {
                        skip: 0,
                        limit: 100,
                    },
                },
            }).then((response) => {
                setTypeDiv(response.data);
            });
        }
    }, []);

    useEffect(() => {
        if (
            isOpen &&
            (staffDivision?.children?.length === 0 || staffDivision?.staff_units?.length === 0) &&
            !Object.hasOwnProperty.call(staffDivision, 'isLocal')
        ) {
            PrivateServices.get('/api/v1/archive_staff_division/{id}/', {
                params: { path: { id: staffDivision.id } },
            }).then((response) => {
                setResponse(response.data);
                setLoading(true);
            });
        }
    }, [staffDivision]);

    // Функция для отправки запроса и заполнения данных
    async function fetchData(obj) {
        // Отправить запрос и получить данные
        const response = await PrivateServices.get('/api/v1/archive_staff_division/{id}/', {
            params: { path: { id: obj.id } },
        });
        const result = await response.data;

        // Обновить данные внутри объекта
        const updatedObj = { ...obj, children: result.children, staff_units: result.staff_units };

        // Вернуть обновленный объект
        return updatedObj;
    }

    // Функция для рекурсивного заполнения данных в объекте
    async function populateData(obj) {
        // Проверить, есть ли у объекта дочерние элементы
        if (obj.children && obj.children.length > 0) {
            // Создать массив для обновленных дочерних объектов
            const updatedChildren = [];

            // Обойти каждый дочерний объект
            for (const child of obj.children) {
                // Отправить запрос и заполнить данные для дочернего объекта
                const updatedChild = await fetchData(child);

                // Рекурсивно заполнить данные внутри дочернего объекта
                const populatedChild = await populateData(updatedChild);

                // Добавить заполненный дочерний объект в массив обновленных дочерних объектов
                updatedChildren.push(populatedChild);
            }

            // Обновить объект с обновленными дочерними объектами
            const updatedObj = { ...obj, children: updatedChildren };

            // Вернуть обновленный объект
            return updatedObj;
        }

        // Если у объекта нет дочерних элементов, вернуть его без изменений
        return obj;
    }

    useEffect(() => {
        if (response.children !== null) {
            populateData(response)
                .then((updatedObj) => {
                    setLoading(false);
                    setResponse(updatedObj);
                })
                .catch((error) => {
                    // Обработка ошибок при отправке запросов или заполнении данных
                    console.error('Error:', error);
                });
        }
    }, [loading]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { name, nameKz } = values;

            if (!name || !nameKz) {
                throw new Error('Введите название подразделения');
            }
            setIsLoading(true);
            if (staffListId) {
                if (Object.hasOwnProperty.call(staffDivision, 'isLocal')) {
                    duplicateStaffDivision(
                        staffDivision,
                        name,
                        nameKz,
                        staff_division_number,
                        type,
                    );
                    setIsLoading(false);
                    handleCancel();
                }
                if (
                    staffDivision.children === null &&
                    staffDivision.staff_units === null &&
                    !Object.hasOwnProperty.call(staffDivision, 'isLocal')
                ) {
                    duplicateStaffDivision(
                        staffDivision,
                        name,
                        nameKz,
                        staff_division_number,
                        type,
                    );
                    setIsLoading(false);
                    handleCancel();
                } else if (
                    staffDivision.children === null &&
                    staffDivision.staff_units.length === 0 &&
                    !Object.hasOwnProperty.call(staffDivision, 'isLocal')
                ) {
                    duplicateStaffDivision(response, name, nameKz, staff_division_number, type);
                    setIsLoading(false);
                    handleCancel();
                } else if (
                    staffDivision.children.length > 0 &&
                    staffDivision.staff_units.length > 0 &&
                    !Object.hasOwnProperty.call(staffDivision, 'isLocal')
                ) {
                    duplicateStaffDivision(
                        staffDivision,
                        name,
                        nameKz,
                        staff_division_number,
                        type,
                    );
                    setIsLoading(false);
                    handleCancel();
                } else if (!Object.hasOwnProperty.call(staffDivision, 'isLocal')) {
                    duplicateStaffDivision(response, name, nameKz, staff_division_number, type);
                    setIsLoading(false);
                    handleCancel();
                }
            }
        } catch (error) {
            const errorMessage =
                error.message === 'Введите название подразделения' ? [error.message] : [];

            form.setFields([
                {
                    name: 'name',
                    errors: errorMessage,
                },
                {
                    name: 'nameKz',
                    errors: errorMessage,
                },
            ]);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const validateSpaces = (_, value, callback) => {
        if (value && value.trim() === '') {
            callback('Введите название подразделения');
        } else {
            callback();
        }
    };

    const handle = (e) => {
        const foundItem = typeDiv.find((item) => item.id === e);

        if (foundItem) {
            setType(foundItem);
        }
    };

    return (
        <Modal
            title={<IntlMessage id={'schedule.duplicate'} />}
            open={isOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={<IntlMessage id={'activeTable.duplicate'} />}
            cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
            disabled={loading}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={
                        <>
                            <IntlMessage id="schedule.add.department.type" />
                            <QuestionCircleFilled
                                style={{
                                    color: ' rgba(114, 132, 154, 0.4)',
                                    marginLeft: '5px',
                                }}
                            />
                        </>
                    }
                    name="divisionType"
                    style={{ marginBottom: 0 }}
                >
                    <Form.Item
                        name="divisionTypeId"
                        style={{ display: 'inline-block', width: '10%' }}
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: <IntlMessage id={'candidates.title.must'} />,
                        //     },
                        // ]}
                    >
                        <Input
                            onChange={(e) => {
                                setNumber(parseInt(e.target.value, 10));
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="divisionTypeName"
                        style={{
                            display: 'inline-block',
                            width: 'calc(90% - 8px)',
                            marginLeft: '8px',
                        }}
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: <IntlMessage id={'candidates.title.must'} />,
                        //     },
                        // ]}
                    >
                        <Select
                            style={{ width: '100%' }}
                            options={typeDiv.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                            onChange={(e) => handle(e)}
                        />
                    </Form.Item>
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id={'staffSchedule.modal.departmentNameRu'} />}
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Введите название подразделения',
                            validator: validateSpaces,
                        },
                    ]}
                    required
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id={'staffSchedule.modal.departmentNameKz'} />}
                    name="nameKz"
                    rules={[
                        {
                            required: true,
                            message: 'Введите название подразделения',
                            validator: validateSpaces,
                        },
                    ]}
                    required
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalDuplicateDivision;
