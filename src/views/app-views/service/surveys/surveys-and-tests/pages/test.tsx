import React from 'react';

import { Button, Card, Checkbox, Form, Input, notification, PageHeader, Radio } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { PrivateServices } from 'API';
import { components } from 'API/types';

const { Fragment } = React;
const { useState } = React;

enum QuestionTypes {
    MultipleChoice = 'Несколько из списка',
    OneOfTheList = 'Один из списка',
    Text = 'Текст',
}

export default function Test() {
    const location = useLocation();

    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const survey: components['schemas']['SurveyRead'] = location.state;

    const renderOptions = (question: components['schemas']['QuestionRead']) => {
        const { options, question_type } = question;

        if (question_type === QuestionTypes.MultipleChoice) {
            return (
                <Checkbox.Group
                    disabled={isDisabled}
                    options={options?.map((item) => ({
                        label: item.text || '',
                        value: item.id || '',
                    }))}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                />
            );
        } else if (question_type === QuestionTypes.OneOfTheList) {
            return (
                <Radio.Group
                    disabled={isDisabled}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                >
                    {options?.map((item) => (
                        <Radio key={item.id} value={item.id}>
                            {item.text}
                        </Radio>
                    ))}
                </Radio.Group>
            );
        } else if (question_type === QuestionTypes.Text) {
            return (
                <Input
                    disabled={isDisabled}
                    placeholder="Введите ответ"
                    style={{
                        display: 'block',
                    }}
                />
            );
        } else {
            return <></>;
        }
    };

    return (
        <Fragment>
            <Form
                colon={false}
                layout={'vertical'}
                onFinish={async (values) => {
                    setIsLoading(true);
                    setIsDisabled(true);

                    const answers = [];

                    for (const key in values) {
                        try {
                            const options = key.split('|');

                            const question_id = options[0];
                            const question_type = options[1];
                            const option_id = values[key];

                            if (question_type === QuestionTypes.MultipleChoice) {
                                answers.push({
                                    question_id,
                                    option_ids: option_id,
                                });
                            } else if (question_type === QuestionTypes.OneOfTheList) {
                                answers.push({
                                    question_id,
                                    option_ids: [option_id],
                                });
                            } else {
                                answers.push({
                                    question_id,
                                    text: option_id,
                                });
                            }
                        } catch (err) {
                            notification.error({
                                message: 'Ошибка',
                                description: 'Заполните все ответы',
                            });
                        }
                    }

                    try {
                        await PrivateServices.post('/api/v1/answers', {
                            body: answers,
                        });
                        notification.success({
                            message: 'Успешно',
                            description: 'Ответы успешно отправлены',
                        });
                        navigate('/duty/my-surveys-and-tests');

                        setIsDisabled(false);
                        setIsLoading(false);
                    } catch (err) {
                        notification.error({
                            message: 'Ошибка',
                            description: 'Не удалось отправить ответы',
                        });
                    }
                }}
                onFinishFailed={() =>
                    notification.error({
                        message: 'Ошибка',
                        description: 'Заполните все ответы',
                    })
                }
            >
                <PageHeader
                    extra={
                        <Fragment>
                            <Button>Отмена</Button>
                            <Button htmlType="submit" loading={isLoading} type={'primary'}>
                                Отправить
                            </Button>
                        </Fragment>
                    }
                    style={{
                        backgroundColor: 'white',
                        width: 'calc(100% + 50px)',
                        margin: '-25px 0 25px -25px',
                    }}
                    title={survey.name}
                />
                {survey.questions?.map((question) => {
                    return (
                        <Card key={question.id}>
                            <Form.Item
                                label={question.text}
                                name={`${question.id}|${question.question_type}`}
                                rules={[
                                    {
                                        required: question.is_required,
                                        message: 'Пожалуйста, введите ответ',
                                    },
                                ]}
                                style={{
                                    marginBottom: '0',
                                }}
                            >
                                {renderOptions(question)}
                            </Form.Item>
                        </Card>
                    );
                })}
            </Form>
        </Fragment>
    );
}
