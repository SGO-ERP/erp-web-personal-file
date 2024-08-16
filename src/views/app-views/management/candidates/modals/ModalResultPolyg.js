import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, Spin, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    saveAndSign,
    saveAnswers,
} from '../../../../../store/slices/candidates/answersSlice/answersSlice';
import { APP_PREFIX_PATH } from '../../../../../configs/AppConfig';
import { selectedCandidateInfo } from '../../../../../store/slices/candidates/selectedCandidateSlice';
import { candidatesAllListByStaffId } from '../../../../../store/slices/candidates/candidateStageInfoSlice';
import IntlMessage from '../../../../../components/util-components/IntlMessage';

const ModalResultPolyg = ({ modalCase, openModal, stage, setStage }) => {
    const [openPolygRes, setOpenPolygRes] = useState(false);
    const [form] = Form.useForm();

    const { id } = useParams();

    const path = `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}`;

    const [value, setValue] = useState(null);

    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);

    const [answer, setAnswer] = useState('');
    const [answerId, setAnswerId] = useState(null);
    const [questionId, setQuestionId] = useState(null);
    const [question, setQuestion] = useState(null);
    const [loading, setIsLoading] = useState(false);

    const [stageStatus, setStageStatus] = useState('Не начат');
    const navigate = useNavigate();

    const currentPage = useSelector((state) => state.candidateDocumentTableController.currentPage);
    const pageSize = useSelector((state) => state.candidateDocumentTableController.pageSize);
    const search = useSelector((state) => state.candidateStageInfoStaffId.search);

    function createAnswerJsonData(answerStr, question, type, candidateId, answerId) {
        const data = {
            'candidate_stage_question_id': question.id,
            'type': type,
            'answer_str': null,
            'answer_bool': null,
            'answer': null,
            'document_link': null,
            'document_number': null,
            'candidate_essay_type_id': null,
            'candidate_id': candidateId,
            'category_id': null,
            'answer_id': answerId === undefined ? null : answerId,
            'is_sport_passed': false,
        };
        if (type === 'String') {
            data.answer_str = answerStr === undefined ? '' : answerStr;
        }
        if (type === 'Text') {
            data.answer = answerStr === undefined ? '' : answerStr;
        }
        return data;
    }

    async function handleSignSave() {
        let status = 'Не начат';
        if (value !== null) {
            if (value === 'passed') {
                status = 'Пройден успешно';
            } else {
                status = 'Завален';
            }
            const data = {
                'status': status,
            };
            const answers = [];
            const answer1 = createAnswerJsonData(answer, question, 'String', id, answerId);
            answers.push(answer1);
            await dispatch(
                saveAndSign({
                    answers: answers,
                    stageId: stage.candidate_stage_info.id,
                    data: data,
                }),
            )
                .then(() => {
                    handleCancel();
                })
                .finally(() => {
                    setIsLoading(false);
                });
            await dispatch(
                candidatesAllListByStaffId({
                    page: currentPage,
                    limit: pageSize,
                }),
            );
            setTimeout(() => {
                navigate(`${APP_PREFIX_PATH}/management/candidates/documentstosign`);
            }, 300);
        }
    }

    useEffect(() => {
        if (stage !== null) {
            if (stage.name === 'Результаты полиграфологического исследования') {
                setQuestion(stage.questions[0]);
                setQuestionId(stage.questions[0].id);
                setAnswer(stage.questions[0].answer?.answer_str);
                setAnswerId(stage.questions[0].answer?.id);
                setStageStatus(stage.candidate_stage_info.status);
                if (stage.candidate_stage_info.status === 'Пройден успешно') {
                    setValue('passed');
                }
                if (stage.candidate_stage_info?.status === 'Завален') {
                    setValue('notPassed');
                }
                setLoading(false);
            }
        } else {
            setLoading(true);
        }
    }, [stage]);

    function handleCancel() {
        setStage(null);
        setOpenPolygRes(false);
        modalCase.showModalPolygRes(openPolygRes);
        setLoading(true);
    }

    const onOk = async () => {
        try {
            setIsLoading(true);
            await form.validateFields(); // Валидация формы
            // Дополнительная логика для сохранения данных
            // handleCancel();
            // modalCase.showModalPolygRes(openPolygRes);
            handleSignSave();
        } catch (error) {
            setIsLoading(false);
            // Вывод сообщения об ошибке
            message.error('Пожалуйста, заполните обязательные поля');
        }
    };

    if (isLoading) {
        return '';
    }

    return (
        <div>
            <Modal
                title={<IntlMessage id={'candidates.title.resultPolyg'} />}
                open={openModal}
                onCancel={handleCancel}
                onOk={onOk}
                okText={<IntlMessage id={'personal.button.save'} />}
                cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
                style={{ height: '100%', width: '100%' }}
                okButtonProps={{
                    disabled: stageStatus === 'Пройден успешно' || stageStatus === 'Завален',
                }}
                cancelButtonProps={{
                    disabled: stageStatus === 'Пройден успешно' || stageStatus === 'Завален',
                }}
            >
                <Spin spinning={loading} size="large">
                    <div>
                        <Form
                            fields={[
                                {
                                    name: ['registrationNumber'],
                                    value: answer,
                                },
                                {
                                    name: ['status'],
                                    value: value,
                                },
                            ]}
                            form={form}
                            layout={'vertical'}
                        >
                            <Form.Item
                                label={<IntlMessage id={'letters.historytable.status'} />}
                                tooltip={{
                                    icon: <QuestionCircleOutlined />,
                                }}
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id={'candidates.title.must'} />,
                                    },
                                ]}
                            >
                                <Radio.Group
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value);
                                    }}
                                    disabled={
                                        stageStatus === 'Пройден успешно' ||
                                        stageStatus === 'Завален'
                                    }
                                >
                                    <Radio value="passed">
                                        <IntlMessage id={'candidates.title.req'} />
                                    </Radio>
                                    <Radio value="notPassed">
                                        <IntlMessage id={'candidates.title.noReq'} />
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                label={<IntlMessage id={'candidates.title.regNumber'} />}
                                tooltip={{
                                    icon: <QuestionCircleOutlined />,
                                }}
                                name="registrationNumber"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id={'candidates.title.must'} />,
                                    },
                                ]}
                            >
                                <Input
                                    onChange={(e) => {
                                        setAnswer(e.target.value);
                                    }}
                                    disabled={
                                        stageStatus === 'Пройден успешно' ||
                                        stageStatus === 'Завален'
                                    }
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        </div>
    );
};

export default ModalResultPolyg;
