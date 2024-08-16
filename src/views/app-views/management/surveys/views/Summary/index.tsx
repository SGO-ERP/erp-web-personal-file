import React, { useEffect, useState } from 'react';
import { Card, Empty, notification, Space, Typography } from 'antd';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { PrivateServices } from '../../../../../../API';
import Spinner from '../../../../service/data/personal/common/Spinner';

type Props = {
    id?: string;
};

const Summary = (props: Props) => {
    const { id } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [allQuestionsData, setAllQuestionsData] = useState<any[]>([]);

    const fetchSummary = async (id: string) => {
        setLoading(true);
        const result = await PrivateServices.get('/api/v1/answers/survey/{survey_id}/statistics', {
            params: {
                path: {
                    survey_id: id,
                },
            },
        });

        if (!result || !result?.data) {
            notification.error({
                message: 'Не удалось получить данные по опросу',
            });
            setLoading(false);
            return;
        }

        setAllQuestionsData(result.data);
        setLoading(false);
    };

    useEffect(() => {
        if (!id) return;
        void fetchSummary(id);
    }, [id]);

    if (loading) {
        return (
            <div
                style={{
                    margin: '0 -25px -25px -25px',
                    padding: '30px 50px',
                    backgroundColor: 'rgb(250, 250, 251)',
                }}
            >
                <Spinner />
            </div>
        );
    }

    if (!allQuestionsData.length && !loading) {
        return (
            <div
                style={{
                    margin: '0 -25px -25px -25px',
                    padding: '30px 50px',
                    backgroundColor: 'rgb(250, 250, 251)',
                }}
            >
                <Space
                    style={{ minHeight: 400, width: '100%', justifyContent: 'center' }}
                    direction="horizontal"
                    align="center"
                >
                    <Empty />
                </Space>
            </div>
        );
    }

    return (
        <div
            style={{
                margin: '0 -25px -25px -25px',
                padding: '30px 50px',
                backgroundColor: 'rgb(250, 250, 251)',
            }}
        >
            {allQuestionsData.map((questionData, index) => {
                const reshapedData = questionData.options.map((option: any) => {
                    const obj: any = { name: option.option_text };
                    option.answers.forEach((answer: any) => {
                        obj[answer.name] = answer.count;
                    });
                    return obj;
                });

                return (
                    <Card key={index}>
                        <Typography.Title level={3} style={{ paddingLeft: 25, marginBottom: 30 }}>
                            {questionData.question_text}
                        </Typography.Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={reshapedData}>
                                <CartesianGrid horizontal vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 'dataMax']} allowDecimals={false} />
                                <Tooltip cursor={false} wrapperClassName="survey-result-bar" />
                                <Legend />
                                {Object.keys(reshapedData[0] || {})
                                    .filter((key) => key !== 'name')
                                    .map((key, index) => (
                                        <Bar
                                            key={key}
                                            dataKey={key}
                                            stackId="a"
                                            fill={index % 2 === 0 ? '#A078DF' : '#7FCEE5'}
                                            maxBarSize={150}
                                        >
                                            <LabelList position="middle" fill="white" />
                                        </Bar>
                                    ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                );
            })}
        </div>
    );
};

export default Summary;
