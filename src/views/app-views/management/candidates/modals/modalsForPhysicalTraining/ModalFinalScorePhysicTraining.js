import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { saveAndSign } from '../../../../../../store/slices/candidates/answersSlice/answersSlice';
import { APP_PREFIX_PATH } from '../../../../../../configs/AppConfig';
import { selectedCandidateInfo } from '../../../../../../store/slices/candidates/selectedCandidateSlice';
import { candidatesAllListByStaffId } from '../../../../../../store/slices/candidates/candidateStageInfoSlice';
import IntlMessage, {
    IntlMessageText,
} from '../../../../../../components/util-components/IntlMessage';

const ModalFinalScorePhysicTraining = ({ modalCase, openModal, isPhysical, stage, setStage }) => {
    const [openFinalScorePhysicTrain, setOpenFinalScorePhysicTrain] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const path = `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}`;

    const [isLoading, setLoading] = useState(true);
    const [loading, setIsLoading] = useState(false);

    const [answer, setAnswer] = useState(0);
    const [answerId, setAnswerId] = useState(null);
    const [questionId, setQuestionId] = useState(null);
    const [question, setQuestion] = useState(null);

    const [stageStatus, setStageStatus] = useState('Не начат');
    const currentPage = useSelector((state) => state.candidateDocumentTableController.currentPage);
    const pageSize = useSelector((state) => state.candidateDocumentTableController.pageSize);
    const search = useSelector((state) => state.candidateStageInfoStaffId.search);
    const navigate = useNavigate();

    const [value, setValue] = useState('');

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
        let status = 'Пройден успешно';
        if (answer <= 69) {
            status = 'Завален';
        }
        const data = {
            'status': status,
        };
        const answers = [];
        const answer1 = createAnswerJsonData(answer, question, 'String', id, answerId);
        answers.push(answer1);

        await dispatch(
            saveAndSign({ answers: answers, stageId: stage.candidate_stage_info.id, data: data }),
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

    useEffect(() => {
        if (stage !== null) {
            if (stage?.name === 'Результаты физической подготовки') {
                setQuestion(stage?.questions[0]);
                setQuestionId(stage?.questions[0]?.id);
                setAnswer(stage?.questions[0]?.answer?.answer_str);
                setAnswerId(stage?.questions[0]?.answer?.id);
                setStageStatus(stage?.candidate_stage_info?.status);
                setLoading(false);
            }
        } else {
            setLoading(true);
        }
    }, [stage]);

    function handleCancel() {
        setStage(null);
        setOpenFinalScorePhysicTrain(false);
        modalCase.showModalPhysicTrainForTrainer(openFinalScorePhysicTrain);
        setLoading(true);
    }

    const onOk = async () => {
        try {
            setIsLoading(true);
            // dispatch();
            handleSignSave();
            modalCase.showModalPhysicTrainForTrainer(openFinalScorePhysicTrain);
        } catch (error) {
            setIsLoading(false);
            throw new Error(error);
        }
    };

    return (
        <div>
            <Modal
                title={
                    isPhysical.attempt_number === 1
                        ? 'Повторное прохождение физической подготовки'
                        : 'Прохождение физической подготовки'
                }
                open={openModal}
                onCancel={handleCancel}
                onOk={onOk}
                okText={
                    isPhysical.attempt_number === 1 ? (
                        <IntlMessage id={'candidates.title.offsetAgain'} />
                    ) : (
                        <IntlMessage id={'candidates.title.offset'} />
                    )
                }
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
                    <div
                        style={{
                            backgroundColor: '#FFF1F0',
                            border: '2px solid #CF1322',
                            borderRadius: '10px',
                        }}
                    >
                        <div style={{ margin: '10px' }}>
                            <IntlMessage id={'candidates.title.warning'} />
                        </div>
                    </div>
                    <Form
                        fields={[
                            {
                                name: ['result'],
                                value: answer,
                            },
                        ]}
                        layout={'vertical'}
                        form={form}
                    >
                        <Form.Item
                            label={<IntlMessage id={'candidates.title.score'} />}
                            tooltip={{
                                icon: <QuestionCircleOutlined />,
                            }}
                            name={'result'}
                            rules={[{ required: true, message: 'Поле обязательно для заполнения' }]}
                        >
                            <Input
                                onChange={(e) => {
                                    if (!isNaN(e.target.value)) {
                                        if (Number(e.target.value) > 100) {
                                            setAnswer(value);
                                        } else {
                                            setAnswer(e.target.value);
                                        }
                                    } else {
                                        setAnswer(value);
                                    }
                                }}
                                placeholder={IntlMessageText.getText({
                                    id: 'candidates.title.score',
                                })}
                                value={answer}
                                maxLength={3}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                disabled={
                                    stageStatus === 'Пройден успешно' || stageStatus === 'Завален'
                                }
                            />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

export default ModalFinalScorePhysicTraining;
