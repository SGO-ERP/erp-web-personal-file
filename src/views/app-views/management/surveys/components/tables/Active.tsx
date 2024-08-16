import React from 'react';
import moment from 'moment';

import { Button, Divider, notification, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import IntlMessage from 'components/util-components/IntlMessage';

import { PrivateServices } from 'API';
import { components } from 'API/types';

import { TableWithPagination } from './TableWithPagination';
import { archiveSurvey, deleteSurvey } from '../../businessLogic/surveysLogic';

const { Fragment } = React;
const { useEffect, useState } = React;
const { Text } = Typography;

const Active = () => {
    const [dataSource, setDataSource] = useState<Array<components['schemas']['SurveyRead']>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);

    const { t } = useTranslation();

    const updateDataSource = (id: string) => {
        setIsLoading(true);

        setDataSource(dataSource?.filter((item) => item.id !== id));
        setTotal(total - 1);

        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);

        PrivateServices.get('/api/v1/surveys', {
            params: {
                query: {},
            },
        })
            .then((res) => {
                setDataSource(res.data?.objects);
                setTotal(res.data?.total || 0);
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
            render: (_: string, record: components['schemas']['SurveyRead']) => {
                if (record?.comp_form_for_id) {
                    return (
                        <>
                            {record.name}{' '}
                            <span style={{ color: '#c7c7c7', marginLeft: 10 }}>
                                {record?.comp_form_for?.first_name} {record?.comp_form_for?.last_name}
                            </span>{' '}
                        </>
                    );
                }
                return <>{record.name}</>;
            },
        },
        {
            dataIndex: 'type',
            filters: [
                {
                    text: 'Опрос',
                    value: 'Опрос',
                },
                {
                    text: 'Тест',
                    value: 'Тест',
                },
            ],
            key: 'type',
            title: t('surveys.table.header.column.type'),
        },
        {
            dataIndex: 'jurisdiction_type',
            key: 'jurisdiction_type',
            title: 'Подразделения',
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
            render: (_: string, record: components['schemas']['SurveyRead']) => (
                <Space align="center">
                    <Button
                        type="text"
                        style={{
                            color: '#3e79f7',
                        }}
                    >
                        <Link to={`results/${record.id}`} state={record}>
                            <IntlMessage id="surveys.surveys.table.body.row.actions.results" />
                        </Link>
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        type="text"
                        style={{
                            color: '#3e79f7',
                        }}
                        onClick={() => {
                            archiveSurvey(record)
                                .then(() => updateDataSource(record.id || ''))
                                .then(() => {
                                    notification.success({
                                        message: 'Архивирование',
                                        description: 'Опрос успешно архивирован',
                                    });
                                })
                                .catch(() => {
                                    notification.error({
                                        message: 'Архивирование',
                                        description: 'Ошибка при архивировании опроса',
                                    });
                                });
                        }}
                    >
                        <IntlMessage id="surveys.surveys.table.body.row.actions.archive" />
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        type="text"
                        danger
                        onClick={() => {
                            deleteSurvey(record)
                                .then(() => updateDataSource(record.id || ''))
                                .then(() => {
                                    notification.success({
                                        message: 'Удаление',
                                        description: 'Опрос успешно удален',
                                    });
                                })
                                .catch(() => {
                                    notification.error({
                                        message: 'Удаление',
                                        description: 'Ошибка при удалении опроса',
                                    });
                                });
                        }}
                    >
                        <IntlMessage id="surveys.surveys.table.body.row.actions.delete" />
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
                total={total}
            />
        </Fragment>
    );
};

export default Active;
