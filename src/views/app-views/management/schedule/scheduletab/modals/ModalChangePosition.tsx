import { Cascader, Col, Form, Modal, Row, Select, Spin, Switch } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import ApiService from '../../../../../../auth/FetchInterceptor';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { PrivateServices } from 'API';

interface PropsTypes {
    isOpen: boolean;
    onClose: () => void;
}

interface UnemployedUsersParams {
    which: boolean;
    skip: number;
    limit: number;
}

interface UsersTypes {
    father_name: string;
    first_name: string;
    icon: string;
    id: string;
    last_name: string;
    rank: {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        nameKZ: string;
    };
    staff_unit_id: string;
}

const LIMIT = 9999;
const SKIP = 0;
const ModalChangePosition = ({ isOpen, onClose }: PropsTypes) => {
    const [userList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [divisionList, setDivisionList] = useState([]);
    const [positionList, setPositionList] = useState([]);
    const [actualPositionList, setActualPositionList] = useState([]);
    const [rankOptions, setRankOptions] = useState([])
    const [rankOptionsLoading, setRankOptionsLoading] = useState(false)
    const [currentUserType, setCurrentUserType] = useState(false);

    const [form] = useForm();

    useEffect(() => {
        if (!isOpen) return;

        renderUsers({
            which: currentUserType,
            skip: SKIP,
            limit: LIMIT,
        }).then(() => renderDivisions().then(() => renderPosition()));

        const getRankOptions = async () => {
            try {
                setRankOptionsLoading(true)

                const url = '/api/v1/ranks'
                const response = await PrivateServices.get(url, {
                    params: {
                        query: {
                            limit: 10_000
                        }
                    }
                })

                const rankOptions = (response.data?.objects as any).map((rank: any) => ({
                    value: rank.id,
                    label: LocalText.getName(rank),
                }))
                setRankOptions(rankOptions)
            } catch (error) {
                console.log(error)
            } finally {
                setRankOptionsLoading(false)
            }
        }
        getRankOptions()
    }, [isOpen]);

    const renderPosition = async () => {
        setLoading(true);
        try {
            const response = await ApiService.get(`/positions/get_short_positions`);

            setPositionList(
                response.data.map((item: any) => ({
                    value: item.id,
                    label: `${LocalText.getName(item.type)} (${item.category_code}) (${LocalText.getName(item.max_rank)})`,
                })),
            );
            setActualPositionList(
                response.data.map((item: any) => ({
                    value: item.id,
                    label: `${LocalText.getName(item.type)} (${item.category_code}) (${LocalText.getName(item.max_rank)})`,
                })),
            );
        } catch (error: any) {
            console.log(error);
        }
        setLoading(false);
    };

    const renderDivisions = async () => {
        setLoading(true);
        try {
            const response = await ApiService.get(`/staff_division/recursive`);

            setDivisionList(transformToCascader(response.data));
        } catch (error: any) {
            console.log(error);
        }
    };

    const transformToCascader = (data: any) => {
        return data.map((node: any) => ({
            value: node.id,
            label: node.name,
            children: node.children ? transformToCascader(node.children) : undefined,
        }));
    };

    const renderUsers = async ({ which, skip, limit }: UnemployedUsersParams) => {
        setLoading(true);
        try {
            const response = await ApiService.get(
                `/users/unemployed/${which}?skip=${skip}&limit=${limit}`,
            );

            setUsersList(
                response.data.map((item: UsersTypes) => ({
                    value: item.staff_unit_id,
                    label: `${item.first_name} ${item.last_name}${
                        item.father_name ? ' ' + item.father_name : ''
                    }`,
                })),
            );
        } catch (error: any) {
            console.log(error);
        }
        setLoading(false);
    };

    const changeUsersList = (e: boolean) => {
        renderUsers({
            which: e,
            skip: SKIP,
            limit: LIMIT,
        });
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            let data = {
                id: values.users,
                staff_division_id: Array.isArray(values.division) ? values.division[values.division.length - 1] : undefined,
                actual_position_id: values.position_actual,
                position_id: values.position,
                rank_id: values.rank,
            };
            if (values.position === '') {
                data.actual_position_id = null
                data.position_id = values.position_actual
            }

            await ApiService.put('/staff_unit/update_staff_unit_overwrite', data);

            handleClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setUsersList([]);
        setDivisionList([]);
        setLoading(false);
        setCurrentUserType(false);
        onClose();
    };

    return (
        <Modal open={isOpen} onCancel={handleClose} onOk={handleOk} title={'change position'}>
            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={
                            <Row>
                                <Col>Сотрудники</Col>
                                <Col style={{ marginLeft: 10 }}>
                                    <Switch onChange={changeUsersList} />
                                </Col>
                            </Row>
                        }
                        name={'users'}
                        required
                        rules={[
                            {
                                required: true,
                                message: 'Выберите сотрудника',
                            },
                        ]}
                    >
                        <Select
                            options={userList}
                            placeholder={'Сотрудники...'}
                            filterOption={(inputValue, option: any) =>
                                option.label.toLowerCase().includes(inputValue.toLowerCase())
                            }
                            showSearch
                        />
                    </Form.Item>
                    <Form.Item
                        label={'Подразделения'}
                        name={'division'}
                    >
                        <Cascader
                            options={divisionList}
                            placeholder={'Подразделения...'}
                            changeOnSelect
                        />
                    </Form.Item>
                    <Form.Item
                        label={'Позиция'}
                        name={'position_actual'}
                    >
                        <Select
                            options={positionList}
                            placeholder={'Позиции...'}
                            filterOption={(inputValue, option: any) =>
                                option.label.toLowerCase().includes(inputValue.toLowerCase())
                            }
                            showSearch
                        />
                    </Form.Item>
                    <Form.Item label={'За счет позиции'} name={'position'}>
                        <Select
                            options={actualPositionList}
                            placeholder={'Зз счет позиции...'}
                            allowClear
                            filterOption={(inputValue, option: any) =>
                                option.label.toLowerCase().includes(inputValue.toLowerCase())
                            }
                            showSearch
                        />
                    </Form.Item>
                    <Form.Item label={'Звание'} name={'rank'}>
                        <Select
                            options={rankOptions}
                            loading={rankOptionsLoading}
                            placeholder={'Звание'}
                            filterOption={(inputValue, option: any) =>
                                option.label.toLowerCase().includes(inputValue.toLowerCase())
                            }
                            showSearch
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default ModalChangePosition;
