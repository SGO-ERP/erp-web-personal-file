import React, { useEffect, useState } from 'react';

import { Button, Col, Row, Table } from 'antd';

import { useAppDispatch, useAppSelector } from '../../../../../../../hooks/useStore';
import { RootState } from '../../../../../../../store';

import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { getLessonsBsp } from '../../../../../../../store/slices/bsp/month-plan/tableMonthPlanSlice';
import { components } from '../../../../../../../API/types';
import { LocalText } from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import { APP_PREFIX_PATH } from '../../../../../../../configs/AppConfig';
import { useNavigate } from 'react-router';
import {SelectValue} from 'antd/lib/select';

interface Props {
    lessons_data: components['schemas']['ScheduleYearReadPagination'];
    setChooseItem: (value: components['schemas']['ScheduleYearRead']) => void;
    setCurrent: (value: number) => void;
    setPageSize: (value: number) => void;
    year:number;
    selectedMonths:SelectValue;
    current:number;
    pageSize:number;
}

const LessonTable = ({ lessons_data, setChooseItem,year,selectedMonths,current,setCurrent,pageSize,setPageSize }: Props) => {
    const [defaultPageSize] = React.useState<number>(10);
    const [showSizeChanger] = React.useState<boolean>(true);

    const loading = useAppSelector((state: RootState) => state.tableMonthPlan.lessons.loading);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const read = 'read';

    const click = (item: components['schemas']['ScheduleYearRead']) => {
        setChooseItem(item);
        navigate(
            `${APP_PREFIX_PATH}/management/combat-starting-position/month-plan/?schedule_year_id=${item?.id}&month=${item?.activity_months?.[0].name}`,
        );
    };

    const list = (record: components['schemas']['ScheduleYearRead']) => {
        if (
            record &&
            record?.months &&
            record.months[0]?.days &&
            record.months[0].days[0]?.activity_dates
        ) {
            navigate(
                `${APP_PREFIX_PATH}/management/combat-starting-position/list-present-users/?schedule_year_id=${record?.id}&&month=${record?.activity_months?.[0]?.name}&mode=${read}`,
            );
        }
    };

    const column = [
        {
            title: <IntlMessage id={'csp.create.year.plan.setting.table.column.first'} />,
            dataIndex: 'staff_divisions',
            key: 'staff_divisions',
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <>
                    {record?.staff_divisions &&
                        record?.staff_divisions?.map((item, index) => {
                            if (record?.staff_divisions?.length) {
                                const name = LocalText.getName(item);
                                return index === record?.staff_divisions?.length - 1
                                    ? name
                                    : name + ', ';
                            }
                        })}
                </>
            ),
            sorter: (
                a: components['schemas']['ScheduleYearRead'],
                b: components['schemas']['ScheduleYearRead'],
            ) => {
                const currentLocale = localStorage.getItem('lan');

                const nameARu = `${a?.staff_divisions?.[0].name}`;
                const nameBRu = `${b?.staff_divisions?.[0].name}`;

                const nameAKz = `${a?.staff_divisions?.[0].nameKZ}`;
                const nameBKz = `${b?.staff_divisions?.[0].nameKZ}`;

                if (currentLocale === 'kk') {
                    return nameAKz.localeCompare(nameBKz);
                } else {
                    return nameARu.localeCompare(nameBRu);
                }
            },
        },
        {
            dataIndex: 'month',
            key: 'month',
            title: <IntlMessage id={'csp.create.month.plan.table.column.second'} />,
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <div>
                    {record?.activity_months && LocalText.getName(record?.activity_months[0])}
                </div>
            ),
            sorter: (
                a: components['schemas']['ScheduleYearRead'],
                b: components['schemas']['ScheduleYearRead'],
            ) => {
                const currentLocale = localStorage.getItem('lan');

                const nameARu = `${a?.activity_months?.[0].name}`;
                const nameBRu = `${b?.activity_months?.[0].name}`;

                const nameAKz = `${a?.activity_months?.[0].nameKZ}`;
                const nameBKz = `${b?.activity_months?.[0].nameKZ}`;

                if (currentLocale === 'kk') {
                    return nameAKz.localeCompare(nameBKz);
                } else {
                    return nameARu.localeCompare(nameBRu);
                }
            },
        },
        {
            dataIndex: 'activity',
            key: 'activity',
            title: <IntlMessage id={'csp.create.year.plan.setting.table.column.second'} />,
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <div>{record?.activity && LocalText.getName(record?.activity)}</div>
            ),
            sorter: (
                a: components['schemas']['ScheduleYearRead'],
                b: components['schemas']['ScheduleYearRead'],
            ) => {
                const currentLocale = localStorage.getItem('lan');

                const nameARu = `${a?.activity?.name}`;
                const nameBRu = `${b?.activity?.name}`;

                const nameAKz = `${a?.activity?.nameKZ}`;
                const nameBKz = `${b?.activity?.nameKZ}`;

                if (currentLocale === 'kk') {
                    return nameAKz.localeCompare(nameBKz);
                } else {
                    return nameARu.localeCompare(nameBRu);
                }
            },
        },
        {
            dataIndex: 'created_at',
            key: 'created_at',
            title: <IntlMessage id={'sidenav.management.combat-starting-position.month.plan'} />,
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <Row gutter={24}>
                    <Col xs={10}>
                        <Button
                            type="text"
                            style={{ color: '#366EF6' }}
                            onClick={() => {
                                click(record);
                            }}
                            disabled={record?.activity_months && record?.activity_months?.length > 0 && !record?.activity_months?.[0]?.has_schedule_month}
                        >
                            <IntlMessage id={'csp.create.month.plan.table.column.last'} />
                        </Button>
                    </Col>
                    {record?.activity_months && record?.activity_months?.length > 0 && !record?.activity_months?.[0]?.has_schedule_month && (
                        <Col xs={10}>
                            <Button
                                type="text"
                                style={{ color: '#366EF6' }}
                                onClick={() => {
                                    list(record);
                                }}
                            >
                                <IntlMessage id={'csp.list'} />
                            </Button>
                        </Col>
                    )}
                </Row>
            ),
        },
    ];

    return (
        <>
            <Table
                dataSource={lessons_data.objects}
                columns={column}
                loading={loading}
                pagination={{
                current: current,
                defaultPageSize: defaultPageSize,
                pageSize: pageSize,
                pageSizeOptions: ['10', '20', '50', '100'],
                showSizeChanger: showSizeChanger,
                total: lessons_data.total,
                onChange: (page: number) => {
                    setCurrent(page);
                    dispatch(
                        getLessonsBsp({
                            query: {
                                skip: (page - 1) * pageSize,
                                limit: pageSize,
                                filter_year:year.toString(),
                                filter_month:selectedMonths?.toString(),
                            },
                        }),
                    );
                },
                onShowSizeChange: (current: number, size: number) => {
                    setPageSize(size);
                    setCurrent(current);
                    dispatch(
                        getLessonsBsp({
                            query: {
                                skip: (current - 1) * pageSize,
                                limit: pageSize,
                                filter_year:year.toString(),
                                filter_month:selectedMonths?.toString(),
                            },
                        }),
                    );
                },
            }}
            rowKey="id" />
        </>
    );
};

export default LessonTable;
