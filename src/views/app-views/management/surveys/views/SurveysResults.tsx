import React, { useEffect, useState } from 'react';

import { Button, Col, Empty, PageHeader, Row, Space, Tabs } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { components } from 'API/types';
import Summary from './Summary';
import Question from './Question';
import User from './User';

enum TabTypes {
    Summary = 'summary',
    Questions = 'questions',
    User = 'user',
}

const SurveysResults = () => {
    const location = useLocation();
    const { userid } = useParams();
    const [activeTab, setActiveTab] = useState<string>(() => {
        return userid ? TabTypes.User : TabTypes.Summary;
    });
    const survey: components['schemas']['SurveyRead'] = location.state;
    const isNonEmpty = survey?.questions && survey?.questions.length > 0;
    const navigate = useNavigate();

    useEffect(() => {
        if (userid) {
            setActiveTab(TabTypes.User);
        }
    }, [userid]);


    return (
        <React.Fragment>
            <Row justify="space-between" align="middle">
                <PageHeader
                    footer={
                        isNonEmpty ? (
                            <Tabs
                                activeKey={activeTab}
                                items={[
                                    {
                                        label: 'Сводка',
                                        key: TabTypes.Summary,
                                        children: <Summary id={survey?.id} />,
                                    },
                                    {
                                        label: 'Вопросы',
                                        key: TabTypes.Questions,
                                        children: (
                                            <Question
                                                questions={survey?.questions}
                                                survey={survey}
                                            />
                                        ),
                                    },
                                    {
                                        label: 'Отдельный пользователь',
                                        key: TabTypes.User,
                                        children: <User />,
                                    },
                                ]}
                                key={activeTab}
                                onChange={(key) => {
                                    if (Object.values(TabTypes).includes(key as any)) {
                                        setActiveTab(key as string);

                                        // Change the route based on the active tab
                                        if (key === TabTypes.User && userid) {
                                            navigate(
                                                `/management/surveys/results/${survey.id}/${userid}`,
                                                { state: survey },
                                            );
                                        } else if (
                                            key === TabTypes.Questions ||
                                            key === TabTypes.Summary
                                        ) {
                                            navigate(`/management/surveys/results/${survey.id}`, {
                                                state: survey,
                                            });
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <Space
                                style={{ minHeight: 400, width: '100%', justifyContent: 'center' }}
                                direction="horizontal"
                                align="center"
                            >
                                <Empty />
                            </Space>
                        )
                    }
                    extra={
                        <Col style={{ paddingRight: 25 }}>
                            <Button type="primary">Выгрузить справку по результатам</Button>
                        </Col>
                    }
                    title={`Результаты по опросу "${survey.name}"`}
                    style={{
                        backgroundColor: 'white',
                        width: 'calc(100% + 75px)',
                        margin: '-25px -25px 25px -25px',
                    }}
                />
            </Row>
        </React.Fragment>
    );
};

export default SurveysResults;
