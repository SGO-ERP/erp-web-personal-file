import React, { useEffect } from 'react';
import './index.css';
import {
    Card,
    Checkbox,
    Empty,
    Input,
    notification,
    Radio,
    Select,
    Skeleton,
    Space,
    Typography,
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { PrivateServices } from '../../../../../../API';
import { components } from '../../../../../../API/types';

type AnsweredUser = {
    father_name: string;
    first_name: string;
    last_name: string;
    user_id: string;
};

type Answer = components['schemas']['AnswerRead'];

const Index = () => {
    const { id: surveyId, userid } = useParams();
    const [users, setUsers] = React.useState<AnsweredUser[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<AnsweredUser | null>(
        (users && users[0]) || null,
    );
    const [currentUserAnswers, setCurrentUserAnswers] = React.useState<Answer[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const idxOfSelectedUser = selectedUser ? users?.indexOf(selectedUser) : 0;
    const isLeftArrowDisabled = idxOfSelectedUser === 0;
    const isRightArrowDisabled = users && idxOfSelectedUser === users?.length - 1;

    const usersForSelect = users.map((user) => ({
        label: `${user.first_name} ${user.last_name}`,
        value: user.user_id,
    }));

    useEffect(() => {
        if (!userid) return;
        const user = users.find((user) => user.user_id === userid);
        if (user) {
            setSelectedUser(user);
        }
    }, [userid, users]);

    useEffect(() => {
        void getUsers();
    }, []);

    useEffect(() => {
        if (!selectedUser) return;
        void getAnswers(selectedUser.user_id);
    }, [selectedUser]);

    const getUsers = async () => {
        if (!surveyId) return;
        setIsLoading(true);
        const response = await PrivateServices.get('/api/v1/answers/survey/{survey_id}/users', {
            params: {
                path: {
                    survey_id: surveyId,
                },
            },
        });
        const data: AnsweredUser[] = (response.data as AnsweredUser[]) || [];

        if (!data) {
            notification.error({
                message: 'Ошибка при загрузке списка пользователей',
            });
        }
        setUsers(data);
        setSelectedUser(data[0]);
        setIsLoading(false);
    };

    const getAnswers = async (userId: string) => {
        if (!surveyId) return;
        setIsLoading(true);
        const response = await PrivateServices.get('/api/v1/answers/survey/{survey_id}', {
            params: {
                path: {
                    survey_id: surveyId,
                },
                query: {
                    user_id: userId,
                },
            },
        });
        const data: Answer[] = (response.data as Answer[]) || [];

        if (!data) {
            notification.error({
                message: 'Ошибка при загрузке списка ответов',
            });
        }
        setCurrentUserAnswers(data);
        setIsLoading(false);
    };

    const handleLeftArrowClick = () => {
        if (idxOfSelectedUser) {
            setSelectedUser(users?.[idxOfSelectedUser - 1] || null);
        }
    };

    const handleRightArrowClick = () => {
        if (idxOfSelectedUser < users?.length - 1) {
            setSelectedUser(users?.[idxOfSelectedUser + 1] || null);
        }
    };

    const handleSelect = (value: string) => {
        const selectedUser = users?.find((user) => user.user_id === value) || null;
        setSelectedUser(selectedUser);
    };

    if (!isLoading && !users?.length) {
        return (
            <div className="by-user-container">
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
        <div className="by-user-container">
            <Select
                options={usersForSelect}
                value={selectedUser?.user_id}
                onSelect={handleSelect}
                style={{ width: 300 }}
                loading={isLoading}
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
                <Typography>{idxOfSelectedUser ? idxOfSelectedUser + 1 : 1}</Typography>
                <RightOutlined
                    style={{
                        padding: 10,
                        cursor: isRightArrowDisabled ? 'not-allowed' : 'pointer',
                        color: isRightArrowDisabled ? '#E7EBF1' : '#446DEE',
                    }}
                    onClick={handleRightArrowClick}
                />
            </Space>

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

            {!isLoading &&
                currentUserAnswers.map((answer) => {
                    const questionType = answer.question?.question_type;
                    const Group = questionType === 'Один из списка' ? Radio.Group : Checkbox.Group;

                    return (
                        <Card style={{ marginTop: 20 }} key={answer.id}>
                            <Typography.Text
                                style={{ fontSize: 16, display: 'block', marginBottom: 12 }}
                            >
                                {answer.question?.text}
                            </Typography.Text>

                            <Group
                                style={{ display: 'block' }}
                                value={
                                    questionType === 'Один из списка'
                                        ? answer?.options?.[0].id
                                        : answer?.options?.map((opt) => opt.id)
                                }
                            >
                                <Space
                                    direction="vertical"
                                    size={15}
                                    style={{
                                        display:
                                            answer.question?.question_type === 'Текст'
                                                ? 'block'
                                                : 'inline-flex',
                                    }}
                                >
                                    {answer.question?.question_type === 'Один из списка' &&
                                        answer.question?.options?.map((option) => (
                                            <Radio value={option.id} key={option.id}>
                                                {option.text}
                                            </Radio>
                                        ))}

                                    {answer.question?.question_type === 'Несколько из списка' &&
                                        answer.question?.options?.map((option) => (
                                            <Checkbox value={option.id} key={option.id}>
                                                {option.text}
                                            </Checkbox>
                                        ))}

                                    {answer.question?.question_type === 'Текст' && (
                                        <Input
                                            placeholder={answer.text}
                                            disabled
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </Space>
                            </Group>
                        </Card>
                    );
                })}
        </div>
    );
};

export default Index;
