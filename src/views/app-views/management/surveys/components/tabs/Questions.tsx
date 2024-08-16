import React from 'react';

import { Button, Card, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import Question from '../cards/Question';
import { addName, addNewQuestion, deleteNewQuestion } from 'store/slices/surveys/surveysSlice';
import { useDispatch, useSelector } from 'react-redux';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';

const Questions = () => {
    const { surveyInfo } = useSelector((state: any) => state.surveys);
    const dispatch = useDispatch();
    const currentLocale = localStorage.getItem('lan');
    const descriptionHolder =
        currentLocale !== 'kk' ? 'Описание (необязательно)' : 'Сипаттама (міндетті емес)';
    const nameHolder = currentLocale !== 'kk' ? 'Новый опрос' : 'Жаңа сауалнама';
    const nameQuestion = currentLocale !== 'kk' ? 'Наименование опроса' : 'Сауалнама атауы';
    const nameLabel = currentLocale !== 'kk' ? 'Описание' : 'Сипаттама';

    const addDescription = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        if (name === 'name') {
            dispatch(addName(e.target.value));
        } else {
            console.log('question desc: ', e.target.value);
        }
    };

    const addQuestionCard = (id: any) => {
        dispatch(addNewQuestion({ id }));
    };

    const deleteQuestionCard = (id: any) => {
        dispatch(deleteNewQuestion({ id }));
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Card
                    style={{
                        marginTop: '24px',
                        width: '70%',
                    }}
                >
                    <Form.Item label={nameQuestion} required>
                        <Input
                            onChange={(e) => addDescription(e, 'name')}
                            value={surveyInfo.nameBlock.name}
                            placeholder={nameHolder}
                        />
                    </Form.Item>
                    <Form.Item
                        label={nameLabel}
                        style={{
                            marginBottom: '0',
                        }}
                    >
                        <Input
                            placeholder={descriptionHolder}
                            onChange={(e) => addDescription(e, 'desc')}
                        />
                    </Form.Item>
                </Card>
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                {surveyInfo.questions.map((field: any) => {
                    return (
                        <div style={{ width: '70%' }} key={field.key}>
                            <Form.Item>
                                <Question
                                    field={field}
                                    remove={() => {
                                        const question = surveyInfo.questions;
                                        const number = question.length;

                                        if (number !== 1) {
                                            deleteQuestionCard(field.key);
                                        }
                                    }}
                                />
                            </Form.Item>
                        </div>
                    );
                })}
                <Form.Item
                    style={{
                        width: '70%',
                    }}
                >
                    <Button
                        onClick={() => {
                            const index = surveyInfo.questions.length - 1;
                            addQuestionCard(surveyInfo.questions[index].key + 1);
                        }}
                        style={{
                            width: '100%',
                        }}
                        type="dashed"
                    >
                        <PlusOutlined />
                    </Button>
                </Form.Item>
            </div>
        </div>
    );
};

export default Questions;
