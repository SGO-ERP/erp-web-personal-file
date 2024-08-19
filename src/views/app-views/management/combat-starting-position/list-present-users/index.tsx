import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
    Avatar,
    Button,
    Card,
    Checkbox,
    Col,
    notification,
    PageHeader, Radio,
    Row,
    Table,
    Typography,
} from 'antd';

import IntlMessage from '../../../../../components/util-components/IntlMessage';
import ModalReason from './ModalReason';
import { RootState } from '../../../../../store';
import { components } from '../../../../../API/types';
import {
    clearCustomzationData,
    clearData,
    removeData,
} from '../../../../../store/slices/bsp/month-plan/listPresentUsers';
import { useAppSelector } from '../../../../../hooks/useStore';
import { PrivateServices } from '../../../../../API';
import { APP_PREFIX_PATH } from '../../../../../configs/AppConfig';
import { getUsersBySchedule } from '../../../../../store/slices/bsp/month-plan/ListUsersData';
import { getLessonsBsp } from '../../../../../store/slices/bsp/month-plan/tableMonthPlanSlice';
import {
    getUsersAbsent
} from '../../../../../store/slices/bsp/month-plan/tableAbsentAttendanceSlice';
import { ColumnsType } from 'antd/es/table';

const Index = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<string>('present');
    const [data, setData] = useState<components['schemas']['schemas__user__UserRead']>();

    const [current, setCurrent] = useState<number>(1);
    const [defaultPageSize] = useState<number>(10);
    const [pageSize, setPageSize] = useState<number>(10);
    const [showSizeChanger] = useState<boolean>(true);
    const [checkboxValue, setCheckboxValue] = useState<boolean>(false);
    const [weeks, setWeeks] = useState<string[]>([]);

    const [currentAbsent, setCurrentAbsent] = useState<number>(1);
    const [defaultPageSizeAbsent] = useState<number>(10);
    const [pageSizeAbsent, setPageSizeAbsent] = useState<number>(10);
    const [showSizeChangerAbsent] = useState<boolean>(true);

    const dataSource = useSelector((state: RootState) => state.listUserData.data);
    const loading = useSelector((state: RootState) => state.listUserData.loading);
    const list = useAppSelector((state: RootState) => state.listPresentUsers.data);
    const customization_data = useAppSelector(
        (state: RootState) => state.listPresentUsers.customization_data,
    );

    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const schedule_year_id = searchParams.get('schedule_year_id');
    const mode = searchParams.get('mode');

    const dataListAbsentUsers = useAppSelector((state: RootState) => state.tableAbsentAttendance.data);


    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();


    const navigate = useNavigate();

    useEffect(() => {
        if (schedule_year_id) {
            dispatch(
                getUsersBySchedule({
                    path: { id: schedule_year_id },
                    query: {
                        skip: (current - 1) * pageSize,
                        limit: pageSize,
                    },
                }),
            );

            dispatch(
                getUsersAbsent({
                    path: { id: schedule_year_id },
                    // query: {
                    //     skip: (currentAbsent - 1) * pageSizeAbsent,
                    //     limit: pageSizeAbsent,
                    // },
                }),
            );
        }
    }, [schedule_year_id]);


    const column: ColumnsType<any> = [
        {
            dataIndex: ['last_name', 'first_name', 'father_name'],
            key: 'full_name',
            title: <IntlMessage id={'csp.list.users.participant'} />,
            render: (_: string, record: components['schemas']['UserShortRead']) => (
                <div className="d-flex">
                    <Row align="middle">
                        <Col
                            style={{
                                marginRight: '12px',
                            }}
                        >
                            <Avatar size={40} src={record?.icon}>
                                {`${record.last_name} ${record.first_name}`}
                            </Avatar>
                        </Col>
                        <Col>
                            <Typography.Text>{`${record.last_name} ${record.first_name} ${record?.father_name || ''
                                }`}</Typography.Text>
                        </Col>
                    </Row>
                </div>
            ),
            sorter: (
                a: { last_name: string; first_name: string; father_name?: string },
                b: { last_name: string; first_name: string; father_name?: string },
            ) => {
                const nameA = `${a.last_name} ${a.first_name} ${a.father_name || ''}`;
                const nameB = `${b.last_name} ${b.first_name} ${b.father_name || ''}`;

                return nameA.localeCompare(nameB);
            },
            width: '70%',
        },
        {
            dataIndex: 'checkbox',
            key: 'checkbox',
            title: <IntlMessage id={'csp.list.users.participant.table.checkbox'} />,
            render: (_: string, record: components['schemas']['UserShortRead']) => (
                <Checkbox
                    onClick={() => {
                        setData(record);
                    }}
                    onChange={(e) => checked(e.target.checked)}
                    checked={!!list.find((l) => l.user_id === record.id)}
                    style={{ display: 'flex', justifyContent: 'center' }}
                />
            ),
            width: '20%',
        },
    ];



    const checked = (value: boolean) => {
        if (!value) {
            if (data?.id) {
                dispatch(
                    removeData({
                        id: data?.id,
                    }),
                );
            }
        } else if (value) {
            setIsOpen(true);
        }
    };

    const save = async () => {
        if (customization_data && list.length > 0 && mode === 'edit') {
            await PrivateServices.post('/api/v1/schedule_month', {
                body: customization_data,
            }).then(() => {
                dispatch(clearCustomzationData());
                list.map(async (item) => {
                    await PrivateServices.post('/api/v1/attendance/status_change/schedule', {
                        body: item,
                    }).then(async (response) => {
                        await dispatch(
                            getLessonsBsp({
                                query: {
                                    skip: 0,
                                    limit: 10,
                                    filter_year: currentYear?.toString(),
                                    filter_month: currentMonth?.toString(),
                                },
                            }),
                        );
                        navigate(
                            `${APP_PREFIX_PATH}/management/combat-starting-position/month-plan`,
                        );
                        notification.success({
                            message: <IntlMessage id={'bsp.month.plan.success'} />,
                        });
                        dispatch(clearData());
                    });
                });
            });
        } else if (mode === 'read') {
            list.map(async (item) => {
                await PrivateServices.post('/api/v1/attendance/status_change/schedule', {
                    body: item,
                }).then(async (response) => {
                    await dispatch(
                        getLessonsBsp({
                            query: {
                                skip: 0,
                                limit: 10,
                                filter_year: currentYear?.toString(),
                                filter_month: (currentMonth + 1)?.toString(),
                            },
                        }),
                    );
                    navigate(`${APP_PREFIX_PATH}/management/combat-starting-position/month-plan`);
                    notification.success({
                        message: <IntlMessage id={'bsp.month.plan.success'} />,
                    });
                    dispatch(clearData());
                });
            });
        }
    };

    const notAttemptPeople = async () => {
        if (customization_data) {
            await PrivateServices.post('/api/v1/schedule_month', {
                body: customization_data,
            }).then(async () => {
                dispatch(clearCustomzationData());
                await dispatch(
                    getLessonsBsp({
                        query: {
                            skip: 0,
                            limit: 500,
                        },
                    }),
                );
                navigate(`${APP_PREFIX_PATH}/management/combat-starting-position/month-plan`);
                notification.success({
                    message: <IntlMessage id={'bsp.month.plan.success'} />,
                });
                dispatch(clearData());
            });
        }
    };

    return (
        <div>
            <ModalReason
                onClose={() => setIsOpen(false)}
                isOpen={isOpen}
                data={data}
                setCheckboxValue={setCheckboxValue}
                selectedTable={selectedTable}
            />

            <PageHeader
                title={<IntlMessage id={'sidenav.management.combat-starting-position'} />}
                subTitle={
                    selectedTable === 'absent' ? (
                        <IntlMessage id={'watch.subtitle'} />
                    ) : (
                        <IntlMessage id={'csp.create.list.users.subTitle'} />
                    )
                }
                extra={
                    <>
                        <Button
                            onClick={() => {
                                dispatch(clearCustomzationData());
                                navigate(
                                    `${APP_PREFIX_PATH}/management/combat-starting-position/month-plan`,
                                );
                            }}
                        >
                            <IntlMessage id={'initiate.back'} />
                        </Button>
                    </>
                }
                backIcon={false}
                style={{
                    backgroundColor: 'white',
                    width: 'calc(100% + 50px)',
                    marginLeft: '-25px',
                    marginTop: '-25px',
                }}
            />


            <Card>
                <Radio.Group
                    defaultValue="present"
                    value={selectedTable}
                    onChange={(evt) => {
                        setSelectedTable(evt.target.value);
                    }}
                >
                    <Radio.Button value="present">
                        <IntlMessage
                            id={'csp.month.plan.attendance.first.present'}
                        />
                    </Radio.Button>

                    <Radio.Button value="absent" disabled={mode === 'edit'}>
                        <IntlMessage id={'csp.month.plan.attendance.second.absent'} />
                    </Radio.Button>
                </Radio.Group>

                <Typography.Title level={4} style={{ marginTop: '15px' }}>
                    <Typography.Text strong>
                        {selectedTable === 'absent' ? (
                            <IntlMessage id={'watch.title'} />
                        ) : (
                            <IntlMessage id={'csp.create.list.users.title'} />
                        )}
                    </Typography.Text>
                </Typography.Title>
                {selectedTable === 'present' &&
                    <div style={{ marginTop: '15px' }}>
                        <Table
                            dataSource={dataSource.objects}
                            columns={column}
                            loading={loading}
                            pagination={{
                                current: current,
                                defaultPageSize: defaultPageSize,
                                pageSize: pageSize,
                                pageSizeOptions: ['10', '20', '50', '100'],
                                showSizeChanger: showSizeChanger,
                                total: dataSource.total,
                                onChange: (page: number) => {
                                    setCurrent(page);
                                    schedule_year_id &&
                                        dispatch(
                                            getUsersBySchedule({
                                                path: { id: schedule_year_id },
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
                                        schedule_year_id &&
                                        getUsersBySchedule({
                                            path: { id: schedule_year_id },
                                            query: {
                                                skip: (current - 1) * pageSize,
                                                limit: pageSize,
                                            },
                                        }),
                                    );
                                },
                            }}
                            rowKey="id"
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Row gutter={16}>
                                <Col>
                                    <Button
                                        onClick={() => {
                                            notAttemptPeople();
                                        }}
                                    >
                                        <IntlMessage id={'not.have.people.absent'} />
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        type={'primary'}
                                        onClick={() => {
                                            save();
                                        }}
                                        disabled={
                                            !(list.length > 0)
                                        }
                                    >
                                        <IntlMessage id={'service.data.modalAddPsycho.save'} />
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                }
                {selectedTable === 'absent' &&
                    <div style={{ marginTop: '15px' }}>
                        <Table
                            dataSource={dataListAbsentUsers.objects}
                            columns={column}
                            loading={loading}
                            pagination={{
                                current: currentAbsent,
                                defaultPageSize: defaultPageSizeAbsent,
                                pageSize: pageSizeAbsent,
                                pageSizeOptions: ['10', '20', '50', '100'],
                                showSizeChanger: showSizeChangerAbsent,
                                total: dataListAbsentUsers.total,
                                onChange: (page: number) => {
                                    setCurrent(page);
                                    schedule_year_id &&
                                        dispatch(
                                            getUsersAbsent({
                                                path: { id: schedule_year_id },
                                                // query: {
                                                //     skip: (page - 1) * pageSizeAbsent,
                                                //     limit: pageSizeAbsent,
                                                // },
                                            }),
                                        );
                                },
                                onShowSizeChange: (currentAbsent: number, size: number) => {
                                    setPageSize(size);
                                    setCurrent(currentAbsent);
                                    dispatch(
                                        schedule_year_id &&
                                        getUsersAbsent({
                                            path: { id: schedule_year_id },
                                            // query: {
                                            //     skip: (currentAbsent - 1) * pageSizeAbsent,
                                            //     limit: pageSizeAbsent,
                                            // },
                                        }),
                                    );
                                },
                            }}
                            rowKey="id"
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                            <Row gutter={16}>
                                <Col>
                                    <Button
                                        type={'primary'}
                                        onClick={() => {
                                            save();
                                        }}
                                        disabled={
                                            !(list.length > 0)
                                        }
                                    >
                                        <IntlMessage id={'service.data.modalAddPsycho.save'} />
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                }
            </Card>
        </div>
    );
};

export default Index;
