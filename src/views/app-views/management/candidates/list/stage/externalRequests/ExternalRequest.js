import { Button, Col, Form, Row, Spin } from 'antd';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../BreadcrumbItems';
import EditorComponent from '../EditorComponent';

import { saveAndSign } from '../../../../../../../store/slices/candidates/answersSlice/answersSlice';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getProfile } from 'store/slices/ProfileSlice';
import { getUserID } from 'utils/helpers/common';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';

import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { getUser } from '../../../../../../../store/slices/users/usersSlice';
import { profileCandidateById } from '../../../../../../../store/slices/candidates/selectedCandidateSlice';
import HtmlHelper from '../../../../../../../utils/HtmlHelper';
import RenderTemplateService from '../../../../../../../services/candidates/RenderTemplate';
import saveAs from 'file-saver';
import { S3_BASE_URL } from '../../../../../../../configs/AppConfig';
import { useNavigate } from 'react-router';

const ExternalRequest = () => {
    const { id } = useParams();
    const selectedCandidate = useSelector((state) => state.selectedCandidate.data);
    const [selectedCandidateFullName, setSelectedCandidateFullName] = useState('');
    const dispatch = useDispatch();
    const path = `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}`;

    // const [isLoading, setLoading] = useState(true);
    const isLoading = useSelector((state) => state.selectedCandidateStages.isLoading);

    const allStages = useSelector((state) => state.selectedCandidateStages.stages);

    const { stageId } = useParams();

    const [stageInfo, setStageInfo] = useState(null);
    const [stageStatus, setStageStatus] = useState(null);

    const [form] = Form.useForm();
    const [form2] = Form.useForm();

    const profile = useSelector((state) => state.profile.data);
    const user = useSelector((state) => state.users.user);
    const candidateProfile = useSelector((state) => state.selectedCandidate.profile);
    const [selectedCandidateUser, setSelectedCandidateUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const profile = async () => {
            dispatch(getProfile({ id: await getUserID() }));
        };
        profile();
    }, []);

    const [value, setValue] = useState('');

    const [pathFile, setPathFile] = useState(`${S3_BASE_URL}/static/кандидаты1.html`);
    const [question, setQuestion] = useState({});
    const [answerId, setAnswerId] = useState(null);

    const [templateContent, setTemplateContent] = useState('');

    const [recipient_organization_name, setRecipient_organization_name] = useState('');
    const [recipient_position, setRecipient_position] = useState('');
    const [recipient_rank, setRecipient_rank] = useState('');
    const [recipient_name, setRecipient_name] = useState('');
    const [recipient_father_name, setRecipient_father_name] = useState('');
    const [recipient_surname, setRecipient_surname] = useState('');
    const [recipient_city, setRecipient_city] = useState('');
    const [check_information, setСheck_information] = useState('');

    const [candidate_surname, setCandidate_surname] = useState('');
    const [candidate_name, setCandidate_name] = useState('');
    const [candidate_father_name, setCandidate_father_name] = useState('');
    const [candidate_IIN, setCandidate_IIN] = useState('');
    const [candidate_birth_date, setCandidate_birth_date] = useState('');
    const [candidate_birth_place, setCandidate_birth_place] = useState('');
    const [candidate_nationality, setCandidate_nationality] = useState('');
    const [candidate_residence_address, setCandidate_residence_address] = useState('');
    const [approving_position, setApproving_position] = useState('');
    const [approving_rank, setApproving_rank] = useState('');
    const [approving_surname, setApproving_surname] = useState('');
    const [approving_name, setApproving_name] = useState('');
    const [approving_father_name, setApproving_father_name] = useState('');
    const [date_of_signature, setDate_of_signature] = useState('');

    useEffect(() => {
        if (selectedCandidate !== null) {
            setSelectedCandidateFullName(
                selectedCandidate?.staff_unit?.users[0]?.first_name +
                    ' ' +
                    selectedCandidate?.staff_unit?.users[0]?.last_name +
                    ' ' +
                    selectedCandidate?.staff_unit?.users[0]?.father_name,
            );
            setCandidate_surname(selectedCandidate?.staff_unit?.users[0]?.last_name);
            setCandidate_name(selectedCandidate?.staff_unit?.users[0]?.first_name);
            setCandidate_father_name(selectedCandidate?.staff_unit?.users[0]?.father_name);
            setApproving_position(user?.actual_staff_unit?.position?.name);
            setApproving_rank(user?.rank?.name);
            setApproving_surname(selectedCandidate?.staff_unit_curator?.users[0]?.last_name);
            setApproving_name(selectedCandidate?.staff_unit_curator?.users[0]?.first_name);
            setApproving_father_name(selectedCandidate?.staff_unit_curator?.users[0]?.father_name);
            setDate_of_signature(new Date().toLocaleDateString());

            dispatch(getUser(selectedCandidate.staff_unit.users[0].id));
        }
    }, [selectedCandidate]);

    useEffect(() => {
        if (user?.id === selectedCandidate?.staff_unit.users[0].id) {
            if (candidateProfile === null) {
                dispatch(profileCandidateById(user?.id));
            } else {
                setCandidate_IIN(candidateProfile?.profile?.user.iin);
                setCandidate_birth_date(candidateProfile?.profile?.user.date_birth);
                setCandidate_birth_place(candidateProfile?.biographic_info?.place_birth);
                setCandidate_nationality(candidateProfile?.biographic_info?.nationality);
                setCandidate_residence_address(
                    candidateProfile?.biographic_info?.residence_address,
                );

                allStages.forEach((item) => {
                    if (stageId === item.id) {
                        if (item.name === 'Запросы с внешних источников (др. гос органы)') {
                            setStageInfo(item);
                            setAnswer(item.questions[0]);
                            setStageStatus(item.candidate_stage_info.status);
                        }
                    }
                });
            }
        }
    }, [user, candidateProfile]);

    function setAnswer(question) {
        // const answer = question?.answer?.answer === undefined ? null : question?.answer?.answer;
        if (question.answer !== null) {
            setValue(question.answer.answer);
            setPathFile(null);
        } else {
            handleDownloadTemplate();
        }
        setAnswerId(question.answer?.id);
        setQuestion(question);
    }

    function handleSignSave() {
        const data = {
            'status': 'Пройден успешно',
        };

        const answers = [];
        const answer1 = createAnswerJsonData(value, question, 'Text', id, answerId);
        answers.push(answer1);
        dispatch(
            saveAndSign({
                answers: answers,
                stageId: stageInfo.candidate_stage_info.id,
                data: data,
            }),
        );
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
        if (type === 'Document') {
            data.document_link = answerStr === undefined ? '' : answerStr;
        }
        return data;
    }

    async function handleDownloadTemplate() {
        if (pathFile !== null) {
            const file = await FileUploaderService.getFileByLink(pathFile);
            file.text().then((r) => {
                setTemplate(HtmlHelper.htmlForEditor(r));
            });
        }
    }

    function setTemplate(templateValue) {
        setTemplateContent(templateValue);
        templateValue = replaceAutoProperties(templateValue);
        templateValue = templateValue.replaceAll('<ins', '<u');
        templateValue = templateValue.replaceAll('ins>', 'u>');

        setValue(templateValue);
    }

    function replaceAutoProperties(resultValue) {
        resultValue = resultValue.replace('{{candidate.surname}}', candidate_surname);
        resultValue = resultValue.replace('{{candidate.name}}', candidate_name);
        resultValue = resultValue.replace('{{candidate.father_name}}', candidate_father_name);
        resultValue = resultValue.replace('{{candidate.IIN}}', candidate_IIN);
        resultValue = resultValue.replace('{{candidate.birth_date}}', candidate_birth_date);
        resultValue = resultValue.replace('{{candidate.birth_place}}', candidate_birth_place);
        resultValue = resultValue.replace('{{candidate.nationality}}', candidate_nationality);
        resultValue = resultValue.replace(
            '{{candidate.residence_address}}',
            candidate_residence_address,
        );
        resultValue = resultValue.replace('{{approving.position}}', approving_position);
        resultValue = resultValue.replace('{{approving.rank}}', approving_rank);
        resultValue = resultValue.replace('{{approving.surname}}', approving_surname);
        resultValue = resultValue.replace('{{approving.name}}', approving_name);
        resultValue = resultValue.replace('{{approving.father_name}}', approving_father_name);
        resultValue = resultValue.replace('{{date_of_signature}}', date_of_signature);
        return resultValue;
    }

    async function exportDoc() {
        if (stageStatus === 'Пройден успешно') {
            const file = await RenderTemplateService.renderHTML2PDF(
                HtmlHelper.correctHtml(value),
                `${stageInfo?.candidate_stage_info.id}.pdf`,
            );
            saveAs(file);
        } else {
            const file = await RenderTemplateService.renderHTML2PDF(
                HtmlHelper.correctHtml(value),
                `${stageInfo?.candidate_stage_info.id}.pdf`,
            );
            saveAs(file);
            const formData = new FormData();
            formData.append('file', file);
            const response = await FileUploaderService.upload(formData);
            const document_link = response.link;
            handleSignSave();
        }
    }

    return (
        <div>
            <Spin
                spinning={isLoading && stageInfo !== null}
                size="large"
                style={{ position: 'absolute', top: 120 }}
            >
                <Row>
                    <Row justify="space-between">
                        <Col xs={16}>
                            <Breadcrumbs
                                path={path}
                                main={
                                    <IntlMessage id={'candidates.title.stage-request-external'} />
                                }
                                userName={selectedCandidateFullName}
                            />
                        </Col>
                        <Row gutter={16}>
                            <Col>
                                <Button
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                >
                                    <IntlMessage id={'initiate.back'} />
                                </Button>
                            </Col>
                            <Col>
                                <Button type="primary" onClick={exportDoc}>
                                    Экспорт
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={24}>
                        <Spin
                            spinning={isLoading && stageInfo !== null}
                            size="large"
                            style={{ position: 'absolute', top: 120 }}
                        >
                            {candidateProfile !== null ? (
                                <EditorComponent
                                    disabled={stageStatus === 'Пройден успешно'}
                                    waterMarkerText={selectedCandidateFullName}
                                    value={value}
                                    setValue={setValue}
                                    style={{ maxWidth: '100%' }}
                                />
                            ) : (
                                ''
                            )}
                        </Spin>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default ExternalRequest;
