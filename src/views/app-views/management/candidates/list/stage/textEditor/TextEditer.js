import { Col, notification, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import LocalizationText from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import { APP_PREFIX_PATH } from '../../../../../../../configs/AppConfig';
import {
    saveAndSignEcp,
    saveAnswers,
} from '../../../../../../../store/slices/candidates/answersSlice/answersSlice';
import SignECP from '../../../modals/SignECP';
import EditorComponent from '../EditorComponent';
import ExternalForButtonViewInfo from '../externalRequests/ExternalForButtonViewInfo';
import SaveButton from '../externalRequests/SaveButton';
import SignAndRejectButtons from '../externalRequests/SignAndRejectButtons';
import SignEcp from '../../../../../../../components/shared-components/SignEcp';

const TextEditer = ({ props }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const selectedCandidate = useSelector((state) => state.selectedCandidate.data);
    const [selectedCandidateFullName, setSelectedCandidateFullName] = useState('');
    const dispatch = useDispatch();
    const path = `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}`;

    // const [isLoading, setLoading] = useState(true);
    const isLoading = useSelector((state) => state.selectedCandidateStages.isLoading);

    const allStages = useSelector((state) => state.selectedCandidateStages.stages);

    const { stageId } = useParams();

    const [stageInfo, setStageInfo] = useState(null);

    const [essayTopic, setEssayTopic] = useState(null);

    const [realText, setRealText] = useState('');

    const [value, setValue] = useState('');
    const [answerId, setAnswerId] = useState(null);
    const [question, setQuestion] = useState({});

    const [searchParams, setSearchParams] = useSearchParams();
    const selectedStageId = searchParams.get('stageId');

    const [openDigitalSignature, setOpenDigitalSignature] = useState(false);
    const showModalDigitalSignature = (bool) => {
        setOpenDigitalSignature(bool);
    };

    const [openDigitalSignature2, setOpenDigitalSignature2] = useState(false);
    const showModalDigitalSignature2 = (bool) => {
        setOpenDigitalSignature2(bool);
    };

    useEffect(() => {
        const full_name =
            selectedCandidate?.staff_unit.users[0].first_name +
            ' ' +
            selectedCandidate?.staff_unit.users[0].last_name +
            ' ' +
            selectedCandidate?.staff_unit.users[0].father_name;

        const full_name_without_father =
            selectedCandidate?.staff_unit.users[0].first_name +
            ' ' +
            selectedCandidate?.staff_unit.users[0].last_name;
        if (selectedCandidate?.staff_unit.users[0].father_name !== null) {
            setSelectedCandidateFullName(full_name);
        } else {
            setSelectedCandidateFullName(full_name_without_father);
        }

        allStages.forEach((item) => {
            if (stageId === item.id) {
                if (item.name === props.name) {
                    setStageInfo(item);
                    setAnswer(item.questions[0]);
                }
                if (item?.name === 'Рецензия на эссе') {
                    setEssayTopic(selectedCandidate?.essay);
                }
            }
        });
    }, [selectedCandidate]);

    // const myProfile = useSelector((state) => state.profile.data);
    // const user = useSelector((state) => state.users.user);
    //
    // useEffect(() => {
    //     if (myProfile !== null) {
    //         dispatch(getUser(myProfile.id));
    //     } else {
    //         dispatch(profileUser());
    //     }
    // }, [myProfile]);

    function handleSaveAnswers() {
        const answers = [];
        const answer1 = createAnswerJsonData(value, question, 'Text', id, answerId);
        answers.push(answer1);
        dispatch(saveAnswers(answers));
    }

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

    function setAnswer(question) {
        const answer = question?.answer?.answer === undefined ? '' : question?.answer?.answer;
        setValue(answer);
        setAnswerId(question?.answer?.id);
        // setAnswerId(question?.candidate_stage_answers[0]?.id);
        setQuestion(question);
    }

    function isPage() {
        if (selectedStageId !== null) {
            return (
                <SignAndRejectButtons
                    stageInfo={stageInfo}
                    selectedStageId={selectedStageId}
                    saveAnswer={handleSaveAnswers}
                />
            );
        } else {
            if (
                props.name === 'Беседа о проф. пригодности' ||
                props.name === 'Справка по результатам оперативного задания (не обязательно)' ||
                props.name === 'Беседа с психологом' ||
                props.name === 'Беседа с руководителем структурного подразделения' ||
                props.name === 'Беседа с руководством департамента кадров' ||
                props.name === 'Заключение о зачислении' ||
                props.name === 'Беседа с представителем УСБ'
            ) {
                return (
                    <SaveButton
                        isDisabled={stageInfo?.candidate_stage_info.status}
                        saveAnswer={handleSaveAnswers}
                        handleSignSend={showModalDigitalSignature2}
                        isSend={true}
                    />
                );
            } else if (props.name === 'Запросы с внешних источников (др. гос органы)') {
                return null;
            } else if (
                props.name === 'Беседа о религии' ||
                props.name === 'Беседа с родителями' ||
                props.name === 'Дополнительная беседа' ||
                props.name === 'Рецензия на эссе' ||
                props.name === 'Заключение по спец. проверке'
            ) {
                return (
                    <SaveButton
                        isDisabled={stageInfo?.candidate_stage_info.status}
                        saveAnswer={handleSaveAnswers}
                        handleSignSave={showModalDigitalSignature}
                        isSend={false}
                    />
                );
            }
        }
    }

    function handleSignSave() {
        if (realText.replaceAll(' ', '').length <= 1) {
            notification.error({
                message: 'Данные пустые',
            });
            throw new Error('Error');
        } else {
            const data = {
                'status': 'Пройден успешно',
            };

            const answers = [];
            const answer1 = createAnswerJsonData(value, question, 'Text', id, answerId);
            answers.push(answer1);
            dispatch(
                saveAndSignEcp({
                    answers: answers,
                    stageId: stageInfo.candidate_stage_info.id,
                    data: data,
                }),
            );
        }
    }

    function handleSignSaveForSubmitForTheAgreements() {
        if (realText.replaceAll(' ', '').length <= 1) {
            notification.error({
                message: 'Данные пустые',
            });
            throw new Error('Error');
        } else {
            const data = {
                'status': 'В прогрессе',
            };

            const answers = [];
            const answer1 = createAnswerJsonData(value, question, 'Text', id, answerId);
            answers.push(answer1);
            dispatch(
                saveAndSignEcp({
                    answers: answers,
                    stageId: stageInfo.candidate_stage_info.id,
                    data: data,
                }),
            );
        }
    }

    return (
        <div>
            <Spin spinning={isLoading} size="large" style={{ position: 'absolute', top: 120 }}>
                <Row>
                    <ExternalForButtonViewInfo
                        path={path}
                        main={props}
                        username={selectedCandidateFullName}
                        selectedCandidate={selectedCandidate}
                    />
                </Row>
                {essayTopic !== null ? (
                    <Row>
                        <p>
                            <IntlMessage id="candidates.title.essayTopic" /> :
                            {<LocalizationText text={essayTopic} />}
                        </p>
                    </Row>
                ) : (
                    ''
                )}
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={24}>
                        <EditorComponent
                            setRealText={setRealText}
                            disabled={stageInfo?.candidate_stage_info.status === 'Пройден успешно'}
                            waterMarkerText={selectedCandidateFullName}
                            value={value}
                            setValue={setValue}
                            style={{ maxWidth: '100%' }}
                        />
                    </Col>
                    <Col xs={24} lg={24}>
                        {isPage()}
                    </Col>
                </Row>
                <SignEcp
                    open={openDigitalSignature}
                    onClose={() => setOpenDigitalSignature(false)}
                    callback={handleSignSave}
                />
                <SignECP
                    stageName={stageInfo?.name}
                    stageInfoId={stageInfo?.candidate_stage_info.id}
                    handleSignSaveForSubmitForTheAgreements={
                        handleSignSaveForSubmitForTheAgreements
                    }
                    modalCase={{ showModalDigitalSignature2 }}
                    openModal={openDigitalSignature2}
                />
            </Spin>
        </div>
    );
};

export default TextEditer;
