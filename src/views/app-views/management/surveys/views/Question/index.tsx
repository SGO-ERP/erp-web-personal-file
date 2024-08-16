import React, { useEffect } from 'react';
import {
    Button,
    Card,
    Checkbox,
    Collapse,
    Dropdown,
    MenuProps,
    notification,
    Radio,
    Select,
    Skeleton,
    Space,
    Typography,
} from 'antd';
import { DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { components } from '../../../../../../API/types';
import './index.css';
import { getStringByNumber } from '../../../../../../utils/helpers/common';
import { PrivateServices } from '../../../../../../API';
import { Link, useNavigate } from 'react-router-dom';

type RespondedUser = {
    first_name: string;
    id: string;
    last_name: string;
};

type AnswerCountByOption = {
    option_id: string;
    answer: number;
    responded_users: RespondedUser[];
};

type QuestionsResponse = {
    options: {
        answer_count: number;
        option_id: string;
        option_text: string;
        option_textKZ: string;
        responded_users: RespondedUser[];
    }[];
    question_id: string;
    question_text: string;
    question_textKZ: string;
}[];

type TextAnswersResponse = {
    question_id: string;
    question_text: string;
    question_textKZ: string;
    answers: {
        answer_text: string;
        answer_count: number;
        responded_users: RespondedUser[];
    }[];
};

type Props = {
    questions?: components['schemas']['QuestionRead'][];
    survey: components['schemas']['SurveyRead'];
};

const Question = (props: Props) => {
    const { questions, survey } = props;
    const [selectedQuestion, setSelectedQuestion] = React.useState<
        components['schemas']['QuestionRead'] | null
    >((questions && questions[0]) || null);
    const [answersCountByOption, setAnswersCountByOption] = React.useState<AnswerCountByOption[]>(
        [],
    );
    const [textAnswers, setTextAnswers] = React.useState<TextAnswersResponse[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const idxOfSelectedQuestion = selectedQuestion ? questions?.indexOf(selectedQuestion) : 0;
    const isLeftArrowDisabled = idxOfSelectedQuestion === 0;
    const isRightArrowDisabled = questions && idxOfSelectedQuestion === questions?.length - 1;
    const navigate = useNavigate();

    const optionsForDropdown =
        questions?.map((question) => ({
            label: question.text,
            value: question.id,
        })) || [];

    const handleSelect = (value: string) => {
        const selectedQuestion = questions?.find((question) => question.id === value) || null;
        setSelectedQuestion(selectedQuestion);
    };

    const handleLeftArrowClick = () => {
        if (idxOfSelectedQuestion) {
            setSelectedQuestion(questions?.[idxOfSelectedQuestion - 1] || null);
        }
    };

    const handleRightArrowClick = () => {
        if (!questions || (idxOfSelectedQuestion !== 0 && !idxOfSelectedQuestion)) return;
        if (idxOfSelectedQuestion !== questions?.length - 1) {
            setSelectedQuestion(questions?.[idxOfSelectedQuestion + 1]);
        }
    };

    const generateOptionsByType = (
        type: components['schemas']['QuestionRead']['question_type'],
    ) => {
        if (!type) return;
        if (type === 'Один из списка') {
            return (
                <Space direction="vertical" size={15}>
                    {selectedQuestion?.options?.map((option) => (
                        <Radio value={option.id} key={option.id}>
                            {option.text}
                        </Radio>
                    ))}
                </Space>
            );
        }
        if (type === 'Несколько из списка') {
            return (
                <Space direction="vertical" size={15}>
                    {selectedQuestion?.options?.map((option) => (
                        <Checkbox key={option.id}>{option.text}</Checkbox>
                    ))}
                </Space>
            );
        }
    };

    const getAnswersCountByOption = async () => {
        setIsLoading(true);
        const response = await PrivateServices.get('/api/v1/answers/survey/{survey_id}/questions', {
            params: {
                path: {
                    survey_id: selectedQuestion?.survey_id || '',
                },
            },
        });
        const data: QuestionsResponse = (response.data as QuestionsResponse) || [];

        if (!data) {
            notification.error({
                message: 'Ошибка при загрузке ответов на вопросы',
            });
        }

        setAnswersCountByOption(
            data.flatMap((item) => {
                return item.options.map((option) => ({
                    option_id: option.option_id,
                    answer: option.answer_count, // Use 'answer' property instead of 'answer_count'
                    responded_users: option.responded_users,
                }));
            }),
        );
        setIsLoading(false);
    };

    const getTextAnswers = async () => {
        setIsLoading(true);
        const response = await PrivateServices.get('/api/v1/answers/question-text/{question_id}/', {
            params: {
                path: {
                    question_id: selectedQuestion?.id || '',
                },
            },
        });
        const data: TextAnswersResponse[] = (response.data as TextAnswersResponse[]) || [];

        if (!data) {
            notification.error({
                message: 'Ошибка при загрузке ответов на вопрос',
            });
        }

        if (data.length !== 0) {
            setTextAnswers([...textAnswers, data[0]]);
        }

        setIsLoading(false);
    };

    const getTextAnswersByQuestionId = (question_id: string) => {
        return textAnswers.find((answer) => answer.question_id === question_id)?.answers || [];
    };

    const getOptionCount = (option_id: string | undefined) => {
        if (!option_id) return;
        return answersCountByOption.find((option) => option.option_id === option_id)?.answer || 0;
    };

    const getOptionRespondedUsersForMenu = (option_id: string | undefined): MenuProps['items'] => {
        if (!option_id) return [];
        return (
            answersCountByOption.find((option) => option.option_id === option_id)
                ?.responded_users || []
        ).map((user) => ({
            key: user.id,
            label: `${user.first_name} ${user.last_name}`,
            onClick: () => {
                navigate(`/management/surveys/results/${survey.id}/${user.id}`, {
                    state: survey,
                });
            },
        }));
    };

    useEffect(() => {
        void getAnswersCountByOption();
    }, []);

    useEffect(() => {
        if (!selectedQuestion || !selectedQuestion?.id) {
            return;
        }
        if (
            selectedQuestion?.question_type === 'Текст' &&
            getTextAnswersByQuestionId(selectedQuestion.id).length === 0
        ) {
            void getTextAnswers();
        }
    }, [selectedQuestion]);

    return (
        <div className="by-question-container">
            <Select
                options={optionsForDropdown}
                style={{ width: 300 }}
                value={selectedQuestion?.text}
                onSelect={handleSelect}
            />
            <Space style={{ marginLeft: 15 }}>
                <LeftOutlined
                    style={{
                        padding: 10,
                        cursor: isLeftArrowDisabled ? 'not-allowed' : 'pointer',
                        color: isLeftArrowDisabled ? '#E7EBF1' : '#446DEE',
                    }}
                    onClick={handleLeftArrowClick}
                />
                <Typography>{idxOfSelectedQuestion ? idxOfSelectedQuestion + 1 : 1}</Typography>
                <RightOutlined
                    style={{
                        padding: 10,
                        cursor: isRightArrowDisabled ? 'not-allowed' : 'pointer',
                        color: isRightArrowDisabled ? '#E7EBF1' : '#446DEE',
                    }}
                    onClick={handleRightArrowClick}
                />
            </Space>
            <Card style={{ marginTop: 20 }}>
                <Typography.Text style={{ fontSize: 16, display: 'block', marginBottom: 12 }}>
                    {selectedQuestion?.text || ''}
                </Typography.Text>
                {selectedQuestion?.question_type !== 'Текст' && (
                    <Collapse ghost defaultActiveKey={['1']}>
                        <Collapse.Panel
                            header={
                                <Button size="small" style={{ paddingLeft: 30 }}>
                                    Варианты
                                </Button>
                            }
                            key="1"
                        >
                            <Radio.Group>
                                {generateOptionsByType(selectedQuestion?.question_type)}
                            </Radio.Group>
                        </Collapse.Panel>
                    </Collapse>
                )}
            </Card>
            {selectedQuestion?.question_type === 'Один из списка' &&
                selectedQuestion?.options?.map((option) => (
                    <Card key={option.id}>
                        <Radio value={1} style={{ display: 'block', marginBottom: 12 }}>
                            {option.text}
                        </Radio>
                        <Dropdown
                            menu={{ items: getOptionRespondedUsersForMenu(option.id) }}
                            trigger={['click']}
                        >
                            <Button>
                                <Space>
                                    <span>
                                        {getOptionCount(option.id)}{' '}
                                        {getStringByNumber(getOptionCount(option.id) || 0, [
                                            'ответ',
                                            'ответа',
                                            'ответов',
                                        ])}
                                    </span>
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </Card>
                ))}

            {selectedQuestion?.question_type === 'Несколько из списка' &&
                selectedQuestion?.options?.map((option) => (
                    <Card key={option.id}>
                        <Checkbox>{option.text}</Checkbox> <br />
                        <Dropdown
                            menu={{ items: getOptionRespondedUsersForMenu(option.id) }}
                            trigger={['click']}
                        >
                            <Button style={{ marginTop: 12 }}>
                                <Space>
                                    <span>
                                        {getOptionCount(option.id)}{' '}
                                        {getStringByNumber(getOptionCount(option.id) || 0, [
                                            'ответ',
                                            'ответа',
                                            'ответов',
                                        ])}
                                    </span>
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </Card>
                ))}

            {selectedQuestion?.question_type === 'Текст' &&
                selectedQuestion.id &&
                getTextAnswersByQuestionId(selectedQuestion.id).map((answer, idx) => (
                    <Card key={idx}>
                        <Typography.Text
                            style={{ fontSize: 16, display: 'block', marginBottom: 12 }}
                        >
                            {answer.answer_text}
                        </Typography.Text>
                        {answer.responded_users.map((user) => (
                            <Link
                                to={`/management/surveys/results/${survey.id}/${user.id}`}
                                state={survey}
                                key={user.id}
                            >
                                <Button
                                    style={{ marginRight: 10, marginBottom: 10 }}
                                    type="default"
                                >
                                    {user.first_name} {user.last_name}
                                </Button>
                            </Link>
                        ))}
                    </Card>
                ))}

            {isLoading && (
                <div style={{ marginTop: 20 }}>
                    <Card>
                        <Skeleton active paragraph={{ width: 300, rows: 1 }} title={false} />
                        <Skeleton.Button active />
                    </Card>
                    <Card>
                        <Skeleton active paragraph={{ width: 300, rows: 1 }} title={false} />
                        <Skeleton.Button active />
                    </Card>
                    <Card>
                        <Skeleton active paragraph={{ width: 300, rows: 1 }} title={false} />
                        <Skeleton.Button active />
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Question;
