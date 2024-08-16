import React from 'react';
import moment from 'moment';

import { Button, Divider, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PrivateServices } from 'API';
import { components } from 'API/types';

import { TableWithPagination } from './TableWithPagination';

const { Fragment } = React;
const { useEffect, useState } = React;
const { Text } = Typography;

const Drafts = () => {
    const [dataSource, setDataSource] = useState<Array<components['schemas']['SurveyRead']>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>();

    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        setIsLoading(true);

        PrivateServices.get('/api/v1/surveys/drafts', {
            params: {
                query: {},
            },
        })
            .then((res) => {
                setDataSource(res.data?.objects);
                setTotal(res.data?.total);
            })
            .catch((err) => {
                setDataSource([]);
                setTotal(0);

                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const columns = [
        {
            dataIndex: 'name',
            key: 'name',
            title: t('surveys.table.header.column.name'),
        },
        {
            dataIndex: 'type',
            filters: [
                {
                    text: 'Анонимный',
                    value: 'Анонимный',
                },
                {
                    text: 'Открытый',
                    value: 'Открытый',
                },
            ],
            key: 'type',
            title: t('surveys.table.header.column.type'),
        },
        {
            dataIndex: 'jurisdiction_type',
            key: 'jurisdiction_type',
            title: t('surveys.table.header.column.jurisdiction'),
        },
        {
            dataIndex: 'end_date',
            key: 'end_date',
            title: t('surveys.table.header.column.calendar'),
            render: (_: string, record: components['schemas']['SurveyRead']) => (
                <Text>{moment(record?.end_date).format('DD MMM YYYY')}</Text>
            ),
        },
        {
            dataIndex: 'more',
            key: 'more',
            title: t('surveys.table.header.column.actions'),
            render: (_: string, row: Record<string, string>) => (
                <Space align="center">
                    <Button
                        type="text"
                        style={{
                            color: '#3e79f7',
                        }}
                        onClick={() => {
                            navigate(`/app/management/surveys/results/${row.id}`);
                        }}
                    >
                        {/* TODO: add localization */}
                        Продолжить
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        type="text"
                        style={{
                            color: '#3e79f7',
                        }}
                    >
                        {/* TODO: add localization */}
                        Дублировать
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Fragment>
            <TableWithPagination
                columns={columns}
                dataSource={dataSource || []}
                isLoading={isLoading}
                total={total || 0}
            />
        </Fragment>
    );
};

export default Drafts;
