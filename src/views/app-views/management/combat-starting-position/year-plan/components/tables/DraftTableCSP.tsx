import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Avatar, Button, Col, Modal, notification, Row, Table, Typography } from 'antd';
import moment from 'moment/moment';
import { components } from '../../../../../../../API/types';
import { APP_PREFIX_PATH } from '../../../../../../../configs/AppConfig';

import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { useAppDispatch, useAppSelector } from '../../../../../../../hooks/useStore';
import { PrivateServices } from '../../../../../../../API';

import { getDraftBsp } from '../../../../../../../store/slices/bsp/year-plan/tableSlice';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AvatarFallback from 'components/shared-components/AvatarFallback';

const DraftTableCsp = () => {
    const [current, setCurrent] = React.useState<number>(1);
    const [defaultPageSize] = React.useState<number>(10);
    const [pageSize, setPageSize] = React.useState<number>(10);
    const [showSizeChanger] = React.useState<boolean>(true);

    const draftTable = useAppSelector((state) => state.tableBSP.draft.dataDraft);
    const loading = useAppSelector((state) => state.tableBSP.draft.loading);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(
            getDraftBsp({
                query: {
                    skip: (current - 1) * pageSize,
                    limit: pageSize,
                },
            }),
        );
    }, [dispatch]);

    const warning = (record: components['schemas']['BspPlanRead']) => {
        const currentLocale = localStorage.getItem('lan');

        Modal.confirm({
            title:
                currentLocale === 'kk'
                    ? 'Сіз шынымен жобаны жойғыңыз келе ме?'
                    : 'Вы действительно хотите удалить черновик?',
            icon: <ExclamationCircleOutlined style={{ fontSize: '1.4rem', color: '#FC5555' }} />,
            okText: currentLocale === 'kk' ? 'Ия' : 'Да',
            cancelText: currentLocale === 'kk' ? 'Жоқ' : 'Нет',
            onOk: () => {
                record?.id && deleteSignedBsp(record?.id);
            },
        });
    };

    const deleteSignedBsp = (id: string) => {
        PrivateServices.del('/api/v1/plan/{id}/', {
            params: { path: { id: id } },
        }).then((response) => {
            notification.success({
                message: <IntlMessage id={'csp.clases.notification.delete.success'} />,
            });
            dispatch(
                getDraftBsp({
                    query: {
                        skip: (current - 1) * pageSize,
                        limit: pageSize,
                    },
                }),
            );
        });
    };

    const columns: any = [
        {
            dataIndex: 'created_at',
            key: 'created_at',
            title: <IntlMessage id={'service.data.modalAddPsycho.dateCreate'} />,
            render: (_: string, record: components['schemas']['BspPlanRead']) => (
                <>{moment(record?.created_at).format('DD.MM.YYYY')}</>
            ),
            sorter: (
                a: {
                    created_at: string;
                },
                b: {
                    created_at: string;
                },
            ) => {
                if (a.created_at === null) {
                    return -1;
                } else if (b.created_at === null) {
                    return 1;
                } else {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);

                    return dateB.getTime() - dateA.getTime();
                }
            },
            width: '15%',
        },
        {
            dataIndex: 'year',
            key: 'year',
            title: <IntlMessage id={'csp.table.plan.years'} />,
            sorter: (
                a: {
                    year: number;
                },
                b: {
                    year: number;
                },
            ) => {
                if (a.year === null) {
                    return -1;
                } else if (b.year === null) {
                    return 1;
                } else {
                    const dateA = new Date(a.year);
                    const dateB = new Date(b.year);

                    return dateB.getTime() - dateA.getTime();
                }
            },
            width: '15%',
        },
        {
            dataIndex: ['last_name', 'first_name', 'father_name'],
            key: 'full_name',
            title: <IntlMessage id={'csp.table.creator'} />,
            render: (_: string, record: components['schemas']['BspPlanRead']) => (
                <div className="d-flex">
                    <Row align="middle">
                        <Col
                            style={{
                                marginRight: '12px',
                            }}
                        >
                            <Avatar size={40} src={record?.creator?.icon} icon={<AvatarFallback />}>
                                {`${record?.creator?.last_name} ${record?.creator?.first_name}`}
                            </Avatar>
                        </Col>
                        <Col>
                            <Typography.Text>{`${record?.creator?.last_name} ${
                                record?.creator?.first_name
                            } ${record?.creator?.father_name || ''}`}</Typography.Text>
                        </Col>
                    </Row>
                </div>
            ),
            sorter: (
                a: components['schemas']['BspPlanRead'],
                b: components['schemas']['BspPlanRead'],
            ) => {
                const nameA = `${a?.creator?.last_name} ${a.creator?.first_name} ${
                    a.creator?.father_name || ''
                }`;
                const nameB = `${b?.creator?.last_name} ${b.creator?.first_name} ${
                    b.creator?.father_name || ''
                }`;

                return nameA.localeCompare(nameB);
            },
        },
        {
            dataIndex: 'id',
            key: 'id',
            title: <IntlMessage id={'letters.historytable.actions'} />,
            render: (_: string, record: components['schemas']['BspPlanRead']) => (
                <>
                    <Row gutter={16}>
                        <Col xs={12}>
                            <Button
                                type="text"
                                style={{
                                    color: '#366EF6',
                                }}
                                onClick={() => {
                                    navigate(
                                        `${APP_PREFIX_PATH}/management/combat-starting-position/year-plan/create/?bsp-plan-id=${record.id}&year=${record.year}`,
                                    );
                                }}
                            >
                                <IntlMessage id={'continue'} />
                            </Button>
                        </Col>

                        <Col xs={12}>
                            <Button
                                type="text"
                                style={{
                                    color: '#FC5555',
                                }}
                                onClick={() => {
                                    warning(record);
                                }}
                            >
                                <IntlMessage id={'initiate.deleteAll'} />
                            </Button>
                        </Col>
                    </Row>
                </>
            ),
            width: '20%',
        },
    ];

    return (
        <React.Fragment>
            <Table
                dataSource={draftTable?.objects}
                columns={columns}
                loading={loading}
                pagination={{
                    current: current,
                    defaultPageSize: defaultPageSize,
                    pageSize: pageSize,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showSizeChanger: showSizeChanger,
                    total: draftTable?.total,
                    onChange: (page: number) => {
                        setCurrent(page);
                        dispatch(
                            getDraftBsp({
                                query: {
                                    skip: (page - 1) * pageSize,
                                    limit: pageSize,
                                },
                            }),
                        );
                    },
                    onShowSizeChange: (current: number, size: number) => {
                        setPageSize(size);
                        setCurrent(current);
                        dispatch(
                            getDraftBsp({
                                query: {
                                    skip: (current - 1) * size,
                                    limit: size,
                                },
                            }),
                        );
                    },
                }}
            />
        </React.Fragment>
    );
};

export default DraftTableCsp;
