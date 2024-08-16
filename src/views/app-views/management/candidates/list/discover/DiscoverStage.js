import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import {
    CheckCircleTwoTone,
    ClockCircleTwoTone,
    CloseCircleTwoTone,
    DownOutlined,
} from '@ant-design/icons';

import { getProfile } from 'store/slices/ProfileSlice';
import { getUserID } from 'utils/helpers/common';
import { Button, Card, Col, Dropdown, Menu, PageHeader, Row, Spin } from 'antd';
import CompleteStudy from '../../modals/CompleteStudy';
import SubmitStudy from '../../modals/SubmitStudy';
import { useDispatch, useSelector } from 'react-redux';
import { selectedCandidateInfo } from '../../../../../../store/slices/candidates/selectedCandidateSlice';
import image from '../image/circle.png';
import ModalChooseEssay from '../../modals/ModalChooseEssay';
import { useNavigate } from 'react-router';
import ModalMiltaryMedlExam from '../../modals/ModalMiltaryMedlExam';
import ModalResultPolyg from '../../modals/ModalResultPolyg';
import ModalKnowledgeLegislation from '../../modals/ModalKnowledgeLegislation';
import ModalPhysicTrain from '../../modals/ModalsendForCredit/ModalPhysicTrain';
import ModalFinalScorePhysicTraining from '../../modals/modalsForPhysicalTraining/ModalFinalScorePhysicTraining';
import ModalPolygraphSend from '../../modals/ModalsendForCredit/ModalPolygraphSend';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import LocalizationText from '../../../../../../components/util-components/LocalizationText/LocalizationText';
import moment from 'moment';
import { candidatesAllArchive } from '../../../../../../store/slices/candidates/candidateArchiveSlice';
import { resetSliceByOrder } from 'store/slices/newInitializationsSlices/initializationNewSlice';

const POLYGRAPH_EXAMINER = 'Полиграфолог';
const PSYCHOLOGIST = 'Психолог';
const INSTRUCTOR = 'Инструктор';

const findByName = (name, arr) => {
    return arr.find((item) => item.name === name);
};

const findById = (id, arr) => {
    return arr.find((item) => item.id === id);
};

const DiscoverStage = () => {
    const { id } = useParams();
    const selectedCandidate = useSelector((state) => state.selectedCandidate.data);
    const [openSubmitStudy, setopenSubmitStudy] = useState(false);
    const [openCompleteStudy, setOpenCompleteStudy] = useState(false);
    const isLoading = useSelector((state) => state.selectedCandidateStages.isLoading);
    const dispatch = useDispatch();
    const allStages = useSelector((state) => state.selectedCandidateStages.stages);
    const [open, setOpen] = useState(false);
    const [openPhysicTrain, setOpenPhysicTrain] = useState(false);
    const [openMiltMed, setOpenMiltMed] = useState(false);
    const [openPolygRes, setOpenPolygRes] = useState(false);
    const [openKnowlLegis, setOpenKnowlLegis] = useState(false);
    const [openFinalScorePhysicTrain, setOpenFinalScorePhysicTrain] = useState(false);
    const [openPolygraphSend, setOpenPolygraphSend] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedStageId = searchParams.get('stageId');

    const [selectedModalStage, setSelectedModalStage] = useState(null);

    const categories = useSelector((state) => state.candidateCategories.data);
    const profile = useSelector((state) => state.profile.data);
    const user = useSelector((state) => state.users.user);
    const get_all_candidates = useSelector(
        (state) => state.сandidateArchive.candidatesAllArchive.data,
    );
    const currentPage = useSelector((state) => state.candidateTableArchieveController.currentPage);
    const pageSize = useSelector((state) => state.candidateTableArchieveController.pageSize);

    const navigate = useNavigate();

    const path = `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}`;

    const redirectAnswers = useSelector((state) => state.candidateStageAnswers.redirect);
    useEffect(() => {
        if (redirectAnswers === 'saveAndSign') {
            dispatch(selectedCandidateInfo(id));
            navigate(path);
        }
        if (redirectAnswers === 'saveAnswers') {
            dispatch(selectedCandidateInfo(id));
        }
        if (get_all_candidates.length === 0) {
            dispatch(candidatesAllArchive({ page: currentPage, limit: pageSize }));
        }
    }, [redirectAnswers]);

    const showModal = (bool) => {
        setOpen(bool);
    };

    const showModalPolygraphSend = (bool) => {
        setOpenPolygraphSend(bool);
    };

    const showModalPhysicTrainForTrainer = (bool) => {
        setOpenFinalScorePhysicTrain(bool);
    };

    const showModalPhysicTrain = (bool) => {
        setOpenPhysicTrain(bool);
    };
    const showModalMiltaryMedExam = (bool) => {
        setOpenMiltMed(bool);
    };

    const showModalPolygRes = (bool) => {
        setOpenPolygRes(bool);
    };
    const showModalKnowlLegs = (bool) => {
        setOpenKnowlLegis(bool);
    };

    useEffect(() => {
        if (selectedCandidate !== null) {
            if (selectedCandidate.id !== id) {
                dispatch(selectedCandidateInfo(id));
            }
        } else {
            dispatch(selectedCandidateInfo(id));
        }
    }, [id]);

    useEffect(() => {
        const profile = async () => {
            dispatch(getProfile({ id: await getUserID() }));
        };
        profile();
    }, []);

    function isDisabledEndBtns() {
        if (findById(id, get_all_candidates)) {
            return true;
        }
        if (profile?.staff_unit_id === selectedCandidate?.staff_unit_curator_id) {
            return false;
        }
        return true;
    }

    function isDisabledGiveCandidateButton() {
        if (isSendCandidate() === false) {
            return true;
        }
        if (findById(id, get_all_candidates)) {
            return true;
        }
        if (profile?.staff_unit_id === selectedCandidate?.staff_unit_curator_id) {
            return false;
        }
        return true;
    }

    function isSendCandidate() {
        let bool = true;
        if (findByName('Первичная беседа', allStages)?.candidate_stage_info?.status === 'Завален') {
            bool = false;
        } else {
            if (
                findByName('Первичная беседа', allStages)?.candidate_stage_info.status ===
                'Пройден успешно'
            ) {
                if (
                    findById(
                        findByName('Первичная беседа', allStages)?.questions[10].answer?.answer_str,
                        categories,
                    )?.name ===
                        'Инженерно-техническая, медицинская, административная и хозяйственная служба СГО РК' ||
                    findById(
                        findByName('Первичная беседа', allStages)?.questions[10].answer?.answer_str,
                        categories,
                    )?.name ===
                        'Инженерно-техническая, медицинская, административная и хозяйственная воинская служба СОО СГО РК'
                ) {
                    if (
                        findByName('Беседа о проф. пригодности', allStages)?.candidate_stage_info
                            ?.status === 'Завален'
                    ) {
                        bool = false;
                    }
                }
            }
        }
        if (
            findByName('Запросы с внешних источников (др. гос органы)', allStages)
                ?.candidate_stage_info?.status === 'Завален'
        ) {
            bool = false;
        }
        if (findByName('Рецензия на эссе', allStages)?.candidate_stage_info?.status === 'Завален') {
            bool = false;
        }
        if (
            findByName('Военно-врачебная комиссия', allStages)?.candidate_stage_info?.status ===
            'Завален'
        ) {
            bool = false;
        }
        if (
            findByName('Беседа с психологом', allStages)?.candidate_stage_info?.status === 'Завален'
        ) {
            bool = false;
        }
        if (
            findByName('Результаты тестирования на знание законодательства РК', allStages)
                ?.candidate_stage_info?.status === 'Завален'
        ) {
            bool = false;
        }
        if (findByName('Беседа о религии', allStages)?.candidate_stage_info?.status === 'Завален') {
            bool = false;
        }
        if (
            findByName('Беседа с родителями', allStages)?.candidate_stage_info?.status === 'Завален'
        ) {
            bool = false;
        }
        if (
            findByName('Беседа с представителем УСБ', allStages)?.candidate_stage_info?.status ===
            'Завален'
        ) {
            bool = false;
        }
        if (
            findByName('Беседа с руководителем структурного подразделения', allStages)
                ?.candidate_stage_info?.status === 'Завален'
        ) {
            bool = false;
        }
        if (
            findByName('Беседа с руководством департамента кадров', allStages)?.candidate_stage_info
                ?.status === 'Завален'
        ) {
            bool = false;
        }
        if (
            findByName('Результаты полиграфологического исследования', allStages)
                ?.candidate_stage_info?.status === 'Завален'
        ) {
            bool = false;
        }
        if (
            findByName('Результаты физической подготовки', allStages)?.candidate_stage_info
                ?.status === 'Завален'
        ) {
            bool = false;
        }
        if (
            findByName('Заключение по спец. проверке', allStages)?.candidate_stage_info?.status ===
            'Завален'
        ) {
            bool = false;
        }
        if (
            findByName('Заключение о зачислении', allStages)?.candidate_stage_info?.status ===
            'Завален'
        ) {
            bool = false;
        }

        return bool;
    }

    const showmodalSubmitStudy = (bool) => {
        setopenSubmitStudy(bool);
    };

    const showModalCompleteStudy = (bool) => {
        setOpenCompleteStudy(bool);
    };

    function handleMenuClick(e) {
        // console.log('click', e);
    }

    function isInitiate() {
        let bool = true;
        if (
            findByName('Первичная беседа', allStages)?.candidate_stage_info?.status !==
            'Пройден успешно'
        ) {
            bool = false;
        } else {
            if (
                findByName('Первичная беседа', allStages).candidate_stage_info.status ===
                'Пройден успешно'
            ) {
                if (
                    findById(
                        findByName('Первичная беседа', allStages)?.questions[10].answer?.answer_str,
                        categories,
                    )?.name ===
                        'Инженерно-техническая, медицинская, административная и хозяйственная служба СГО РК' ||
                    findById(
                        findByName('Первичная беседа', allStages)?.questions[10].answer?.answer_str,
                        categories,
                    )?.name ===
                        'Инженерно-техническая, медицинская, административная и хозяйственная воинская служба СОО СГО РК'
                ) {
                    if (
                        findByName('Беседа о проф. пригодности', allStages)?.candidate_stage_info
                            ?.status !== 'Пройден успешно'
                    ) {
                        bool = false;
                    }
                }
            }
        }
        if (
            findByName('Запросы с внешних источников (др. гос органы)', allStages)
                ?.candidate_stage_info?.status !== 'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Рецензия на эссе', allStages)?.candidate_stage_info?.status !==
            'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Военно-врачебная комиссия', allStages)?.candidate_stage_info?.status !==
            'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Беседа с психологом', allStages)?.candidate_stage_info?.status !==
            'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Результаты тестирования на знание законодательства РК', allStages)
                ?.candidate_stage_info?.status !== 'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Беседа о религии', allStages)?.candidate_stage_info?.status !==
            'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Беседа с родителями', allStages)?.candidate_stage_info?.status !==
            'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Беседа с представителем УСБ', allStages)?.candidate_stage_info?.status !==
            'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Беседа с руководителем структурного подразделения', allStages)
                ?.candidate_stage_info?.status !== 'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Беседа с руководством департамента кадров', allStages)?.candidate_stage_info
                ?.status !== 'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Результаты полиграфологического исследования', allStages)
                ?.candidate_stage_info?.status !== 'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Результаты физической подготовки', allStages)?.candidate_stage_info
                ?.status !== 'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Заключение по спец. проверке', allStages)?.candidate_stage_info?.status !==
            'Пройден успешно'
        ) {
            bool = false;
        }
        if (
            findByName('Заключение о зачислении', allStages)?.candidate_stage_info?.status !==
            'Пройден успешно'
        ) {
            bool = false;
        }

        return bool;
    }

    const getButtonStatus = (item, arr, position) => {
        if (findById(id, get_all_candidates)) {
            if (
                item.candidate_stage_info.status === 'Пройден успешно' ||
                item.candidate_stage_info.status === 'Завален'
            ) {
                return false;
            } else {
                return true;
            }
        }
        if (selectedStageId !== null) {
            if (item.id === selectedStageId) {
                return false;
            } else {
                return true;
            }
        }
        if (
            item.name === 'Результаты физической подготовки' &&
            position !== INSTRUCTOR &&
            findByName('Результаты физической подготовки', arr)?.candidate_stage_info.status ===
                'В прогрессе'
        ) {
            return true;
        }
        if (
            item.name === 'Результаты полиграфологического исследования' &&
            position !== POLYGRAPH_EXAMINER &&
            findByName('Результаты полиграфологического исследования', arr)?.candidate_stage_info
                .status === 'В прогрессе'
        ) {
            return true;
        }
        if (position === PSYCHOLOGIST && item.name === 'Беседа с психологом') {
            return false;
        }
        if (
            position === POLYGRAPH_EXAMINER &&
            item.name === 'Результаты полиграфологического исследования'
        ) {
            return false;
        }
        if (position === INSTRUCTOR && item.name === 'Результаты физической подготовки') {
            return false;
        }

        if (
            item.name === 'Первичная беседа' ||
            item.name === 'Рецензия на эссе' ||
            item.name === 'Запросы с внешних источников (др. гос органы)' ||
            item.name === 'Дополнительная беседа'
        ) {
            if (
                position === POLYGRAPH_EXAMINER ||
                position === PSYCHOLOGIST ||
                position === INSTRUCTOR
            ) {
                return true;
            } else {
                return false;
            }
        }
        if (
            item.name === 'Военно-врачебная комиссия' &&
            findByName('Первичная беседа', arr)?.candidate_stage_info.status === 'Пройден успешно'
        ) {
            if (
                position === POLYGRAPH_EXAMINER ||
                position === PSYCHOLOGIST ||
                position === INSTRUCTOR
            ) {
                return true;
            } else {
                return false;
            }
        }
        if (
            item.name === 'Беседа с психологом' &&
            findByName('Военно-врачебная комиссия', arr)?.candidate_stage_info.status ===
                'Пройден успешно'
        ) {
            if (
                position === POLYGRAPH_EXAMINER ||
                position === PSYCHOLOGIST ||
                position === INSTRUCTOR
            ) {
                return true;
            } else {
                return false;
            }
        }
        if (
            item.name === 'Результаты тестирования на знание законодательства РК' &&
            findByName('Беседа с психологом', arr)?.candidate_stage_info.status ===
                'Пройден успешно'
        ) {
            if (
                position === POLYGRAPH_EXAMINER ||
                position === PSYCHOLOGIST ||
                position === INSTRUCTOR
            ) {
                return true;
            } else {
                return false;
            }
        }
        if (
            item.name === 'Беседа о религии' &&
            findByName('Результаты тестирования на знание законодательства РК', arr)
                ?.candidate_stage_info.status === 'Пройден успешно'
        ) {
            if (
                position === POLYGRAPH_EXAMINER ||
                position === PSYCHOLOGIST ||
                position === INSTRUCTOR
            ) {
                return true;
            } else {
                return false;
            }
        }
        if (
            item.name === 'Беседа с родителями' &&
            findByName('Беседа о религии', arr)?.candidate_stage_info.status === 'Пройден успешно'
        ) {
            if (
                position === POLYGRAPH_EXAMINER ||
                position === PSYCHOLOGIST ||
                position === INSTRUCTOR
            ) {
                return true;
            } else {
                return false;
            }
        }
        if (
            (item.name === 'Справка по результатам оперативного задания (не обязательно)' ||
                item.name === 'Беседа о проф. пригодности' ||
                item.name === 'Беседа с представителем УСБ' ||
                item.name === 'Беседа с руководителем структурного подразделения' ||
                item.name === 'Беседа с руководством департамента кадров' ||
                item.name === 'Результаты полиграфологического исследования' ||
                item.name === 'Результаты физической подготовки') &&
            findByName('Беседа с родителями', arr)?.candidate_stage_info.status ===
                'Пройден успешно'
        ) {
            if (
                position === POLYGRAPH_EXAMINER ||
                position === PSYCHOLOGIST ||
                position === INSTRUCTOR
            ) {
                return true;
            } else {
                return false;
            }
        }
        if (
            item.name === 'Заключение по спец. проверке' &&
            findByName('Беседа с представителем УСБ', arr)?.candidate_stage_info.status ===
                'Пройден успешно' &&
            findByName('Беседа с руководителем структурного подразделения', arr)
                ?.candidate_stage_info.status === 'Пройден успешно' &&
            findByName('Беседа с руководством департамента кадров', arr)?.candidate_stage_info
                .status === 'Пройден успешно' &&
            findByName('Результаты полиграфологического исследования', arr)?.candidate_stage_info
                .status === 'Пройден успешно' &&
            findByName('Результаты физической подготовки', arr)?.candidate_stage_info.status ===
                'Пройден успешно'
        ) {
            if (
                position === POLYGRAPH_EXAMINER ||
                position === PSYCHOLOGIST ||
                position === INSTRUCTOR
            ) {
                return true;
            } else {
                if (
                    findByName('Первичная беседа', arr).candidate_stage_info.status ===
                    'Пройден успешно'
                ) {
                    if (
                        findById(
                            findByName('Первичная беседа', arr).questions[10].answer?.answer_str,
                            categories,
                        )?.name ===
                            'Инженерно-техническая, медицинская, административная и хозяйственная служба СГО РК' ||
                        findById(
                            findByName('Первичная беседа', arr).questions[10].answer?.answer_str,
                            categories,
                        )?.name ===
                            'Инженерно-техническая, медицинская, административная и хозяйственная воинская служба СОО СГО РК'
                    ) {
                        if (
                            findByName('Беседа о проф. пригодности', arr)?.candidate_stage_info
                                .status === 'Пройден успешно'
                        ) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
        if (
            item.name === 'Заключение о зачислении' &&
            findByName('Заключение по спец. проверке', arr)?.candidate_stage_info.status ===
                'Пройден успешно'
        ) {
            if (
                position === POLYGRAPH_EXAMINER ||
                position === PSYCHOLOGIST ||
                position === INSTRUCTOR
            ) {
                return true;
            }
            return false;
        }
        return true;
    };

    function showFinalOrder() {
        const candidateUserId = selectedCandidate?.staff_unit.users[0].id;

        dispatch(resetSliceByOrder());
        navigate(
            `${APP_PREFIX_PATH}/management/letters/initiate?candidateUserId=${candidateUserId}&isCandidate=true`,
        );
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1" onClick={showModalCompleteStudy}>
                <IntlMessage id="candidates.discoverButton.finishDiscover.menu1" />
            </Menu.Item>
            {isInitiate() ? (
                <Menu.Item
                    onClick={() => {
                        showFinalOrder();
                    }}
                    key="2"
                >
                    <IntlMessage id="candidates.discoverButton.finishDiscover.menu2" />
                </Menu.Item>
            ) : (
                ''
            )}
        </Menu>
    );

    if (selectedCandidate === null) {
        return (
            <Spin spinning={isLoading} size="large" style={{ position: 'absolute', top: 120 }}>
                <PageHeader
                    title={'Кандидат не найден'}
                    className="discover-user-name"
                    backIcon={false}
                />
            </Spin>
        );
    }

    const isModal = (list) => {
        if (list.name === 'Рецензия на эссе' && selectedCandidate?.essay_id === null) {
            setOpen(true);
        } else if (list.name === 'Результаты физической подготовки') {
            if (
                user?.actual_staff_unit.position.name === INSTRUCTOR ||
                list.candidate_stage_info.status === 'Пройден успешно' ||
                selectedCandidate.attempt_number > 1 ||
                findById(id, get_all_candidates)
            ) {
                setSelectedModalStage(list);
                setOpenFinalScorePhysicTrain(true);
            } else {
                setSelectedModalStage(list);
                setOpenPhysicTrain(true);
            }
        } else if (list.name === 'Военно-врачебная комиссия') {
            setSelectedModalStage(list);
            setOpenMiltMed(true);
        } else if (list.name === 'Результаты полиграфологического исследования') {
            if (
                user?.actual_staff_unit.position.name === POLYGRAPH_EXAMINER ||
                list.candidate_stage_info.status === 'Пройден успешно' ||
                list.candidate_stage_info.status === 'Завален'
            ) {
                setSelectedModalStage(list);
                setOpenPolygRes(true);
            } else {
                setSelectedModalStage(list);
                setOpenPolygraphSend(true);
            }
        } else if (list.name === 'Результаты тестирования на знание законодательства РК') {
            setSelectedModalStage(list);
            setOpenKnowlLegis(true);
        } else {
            if (selectedStageId === null) {
                navigate(
                    `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}/stage/${list.id}`,
                );
            } else {
                navigate(
                    `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}/stage/${list.id}?stageId=${selectedStageId}`,
                );
            }
        }
    };

    return (
        <div>
            <Spin spinning={isLoading} size="large" style={{ position: 'absolute', top: 120 }}>
                <Row>
                    <Col xs={22}>
                        <PageHeader
                            title={
                                selectedCandidate?.staff_unit.users[0].first_name +
                                ' ' +
                                selectedCandidate?.staff_unit.users[0].last_name +
                                ' ' +
                                selectedCandidate?.staff_unit.users[0].father_name
                            }
                            className="discover-user-name"
                            backIcon={false}
                        />
                    </Col>
                    <Col xs={2}>
                        <Button
                            onClick={() => {
                                navigate(`${APP_PREFIX_PATH}/management/candidates/list`);
                            }}
                            style={{ margin: '20px' }}
                        >
                            <IntlMessage id={'initiate.back'} />
                        </Button>
                    </Col>
                </Row>
                <Card>
                    <Row>
                        {allStages.map((item, i) => {
                            if (allStages.length !== 0 && categories.length !== 0) {
                                if (
                                    item.name ===
                                    'Справка по результатам оперативного задания (не обязательно)'
                                ) {
                                    if (
                                        findByName('Первичная беседа', allStages)
                                            .candidate_stage_info.status === 'Пройден успешно'
                                    ) {
                                        if (
                                            findById(
                                                findByName('Первичная беседа', allStages)
                                                    .questions[10].answer?.answer_str,
                                                categories,
                                            )?.name === 'Оперативная служба СГО РК'
                                        ) {
                                            return (
                                                <Col
                                                    key={new Date() + i}
                                                    span={12}
                                                    style={{ marginBottom: '25px' }}
                                                >
                                                    <Row>
                                                        <Col xs={2}>
                                                            {(() => {
                                                                if (
                                                                    item.candidate_stage_info
                                                                        .status ===
                                                                    'Пройден успешно'
                                                                ) {
                                                                    return (
                                                                        <CheckCircleTwoTone
                                                                            style={{
                                                                                fontSize: '30px',
                                                                            }}
                                                                            twoToneColor="#366EF6"
                                                                        />
                                                                    );
                                                                } else if (
                                                                    item.candidate_stage_info
                                                                        .status === 'Завален'
                                                                ) {
                                                                    return (
                                                                        <CloseCircleTwoTone
                                                                            style={{
                                                                                fontSize: '30px',
                                                                            }}
                                                                            twoToneColor="#FF4D4F"
                                                                        />
                                                                    );
                                                                } else if (
                                                                    item.candidate_stage_info
                                                                        .status === 'В прогрессе'
                                                                ) {
                                                                    return (
                                                                        <ClockCircleTwoTone
                                                                            style={{
                                                                                fontSize: '30px',
                                                                            }}
                                                                            twoToneColor="#72849A"
                                                                        />
                                                                    );
                                                                } else if (
                                                                    item.candidate_stage_info
                                                                        .status === 'Не начат'
                                                                ) {
                                                                    return (
                                                                        <img
                                                                            src={image}
                                                                            alt={'image'}
                                                                            style={{
                                                                                width: '31.5px',
                                                                                height: '31.5px',
                                                                            }}
                                                                        />
                                                                    );
                                                                }
                                                            })()}
                                                        </Col>
                                                        <Col xs={15}>
                                                            <div className="discover-text">
                                                                <LocalizationText text={item} />
                                                                &nbsp;
                                                                {item.name ===
                                                                    'Дополнительная беседа' && (
                                                                    <div className={'text-muted'}>
                                                                        <IntlMessage
                                                                            id={'discover.stage'}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="discover-text-mute">
                                                                {item.candidate_stage_info
                                                                    .date_sign === null
                                                                    ? null
                                                                    : moment(
                                                                          item.candidate_stage_info
                                                                              .date_sign,
                                                                      ).format('DD.MM.YYYY')}
                                                            </div>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <Button
                                                                shape="round"
                                                                size={'small'}
                                                                disabled={getButtonStatus(
                                                                    item,
                                                                    allStages,
                                                                    user?.actual_staff_unit.position
                                                                        .name,
                                                                )}
                                                                onClick={() => isModal(item)}
                                                            >
                                                                <IntlMessage id="candidates.discoverButton.view" />
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            );
                                        } else {
                                            return;
                                        }
                                    } else {
                                        return;
                                    }
                                } else if (item.name === 'Беседа о проф. пригодности') {
                                    if (
                                        findByName('Первичная беседа', allStages)
                                            .candidate_stage_info.status === 'Пройден успешно'
                                    ) {
                                        if (
                                            findById(
                                                findByName('Первичная беседа', allStages)
                                                    .questions[10].answer?.answer_str,
                                                categories,
                                            )?.name ===
                                                'Инженерно-техническая, медицинская, административная и хозяйственная служба СГО РК' ||
                                            findById(
                                                findByName('Первичная беседа', allStages)
                                                    .questions[10].answer?.answer_str,
                                                categories,
                                            )?.name ===
                                                'Инженерно-техническая, медицинская, административная и хозяйственная воинская служба СОО СГО РК'
                                        ) {
                                            return (
                                                <Col
                                                    key={new Date() + i}
                                                    span={12}
                                                    style={{ marginBottom: '25px' }}
                                                >
                                                    <Row>
                                                        <Col xs={2}>
                                                            {(() => {
                                                                if (
                                                                    item.candidate_stage_info
                                                                        .status ===
                                                                    'Пройден успешно'
                                                                ) {
                                                                    return (
                                                                        <CheckCircleTwoTone
                                                                            style={{
                                                                                fontSize: '30px',
                                                                            }}
                                                                            twoToneColor="#366EF6"
                                                                        />
                                                                    );
                                                                } else if (
                                                                    item.candidate_stage_info
                                                                        .status === 'Завален'
                                                                ) {
                                                                    return (
                                                                        <CloseCircleTwoTone
                                                                            style={{
                                                                                fontSize: '30px',
                                                                            }}
                                                                            twoToneColor="#FF4D4F"
                                                                        />
                                                                    );
                                                                } else if (
                                                                    item.candidate_stage_info
                                                                        .status === 'В прогрессе'
                                                                ) {
                                                                    return (
                                                                        <ClockCircleTwoTone
                                                                            style={{
                                                                                fontSize: '30px',
                                                                            }}
                                                                            twoToneColor="#72849A"
                                                                        />
                                                                    );
                                                                } else if (
                                                                    item.candidate_stage_info
                                                                        .status === 'Не начат'
                                                                ) {
                                                                    return (
                                                                        <img
                                                                            src={image}
                                                                            alt={'image'}
                                                                            style={{
                                                                                width: '31.5px',
                                                                                height: '31.5px',
                                                                            }}
                                                                        />
                                                                    );
                                                                }
                                                            })()}
                                                        </Col>
                                                        <Col xs={15}>
                                                            <div className="discover-text">
                                                                <LocalizationText text={item} />
                                                                &nbsp;
                                                                {item.name ===
                                                                    'Дополнительная беседа' && (
                                                                    <div className={'text-muted'}>
                                                                        <IntlMessage
                                                                            id={'discover.stage'}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="discover-text-mute">
                                                                {item.candidate_stage_info
                                                                    .date_sign === null
                                                                    ? null
                                                                    : moment(
                                                                          item.candidate_stage_info
                                                                              .date_sign,
                                                                      ).format('DD.MM.YYYY')}
                                                            </div>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <Button
                                                                shape="round"
                                                                size={'small'}
                                                                disabled={getButtonStatus(
                                                                    item,
                                                                    allStages,
                                                                    user?.actual_staff_unit.position
                                                                        .name,
                                                                )}
                                                                onClick={() => isModal(item)}
                                                            >
                                                                <IntlMessage id="candidates.discoverButton.view" />
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            );
                                        } else {
                                            return;
                                        }
                                    } else {
                                        return;
                                    }
                                }
                            }

                            return (
                                <Col
                                    key={new Date() + i}
                                    span={12}
                                    style={{ marginBottom: '25px' }}
                                >
                                    <Row>
                                        <Col xs={2}>
                                            {(() => {
                                                if (
                                                    item.candidate_stage_info.status ===
                                                    'Пройден успешно'
                                                ) {
                                                    return (
                                                        <CheckCircleTwoTone
                                                            style={{
                                                                fontSize: '30px',
                                                            }}
                                                            twoToneColor="#366EF6"
                                                        />
                                                    );
                                                } else if (
                                                    item.candidate_stage_info.status === 'Завален'
                                                ) {
                                                    return (
                                                        <CloseCircleTwoTone
                                                            style={{
                                                                fontSize: '30px',
                                                            }}
                                                            twoToneColor="#FF4D4F"
                                                        />
                                                    );
                                                } else if (
                                                    item.candidate_stage_info.status ===
                                                    'В прогрессе'
                                                ) {
                                                    return (
                                                        <ClockCircleTwoTone
                                                            style={{
                                                                fontSize: '30px',
                                                            }}
                                                            twoToneColor="#72849A"
                                                        />
                                                    );
                                                } else if (
                                                    item.candidate_stage_info.status === 'Не начат'
                                                ) {
                                                    return (
                                                        <img
                                                            src={image}
                                                            alt={'image'}
                                                            style={{
                                                                width: '31.5px',
                                                                height: '31.5px',
                                                            }}
                                                        />
                                                    );
                                                }
                                            })()}
                                        </Col>
                                        <Col xs={15}>
                                            <div className="discover-text">
                                                <LocalizationText text={item} /> &nbsp;
                                                {item.name === 'Дополнительная беседа' && (
                                                    <h7 className={'text-muted'}>
                                                        <IntlMessage id={'discover.stage'} />
                                                    </h7>
                                                )}
                                            </div>
                                            <div className="discover-text-mute">
                                                {item.candidate_stage_info.date_sign === null
                                                    ? null
                                                    : moment(
                                                          item.candidate_stage_info.date_sign,
                                                      ).format('DD.MM.YYYY')}
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                            <Button
                                                shape="round"
                                                size={'small'}
                                                disabled={getButtonStatus(
                                                    item,
                                                    allStages,
                                                    user?.actual_staff_unit.position.name,
                                                )}
                                                onClick={() => isModal(item)}
                                            >
                                                <IntlMessage id="candidates.discoverButton.view" />
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            );
                        })}
                    </Row>
                    <Row gutter={8}>
                        <Col xs={19} style={{ textAlign: 'end' }}>
                            <Button
                                disabled={isDisabledGiveCandidateButton()}
                                onClick={showmodalSubmitStudy}
                            >
                                <IntlMessage id="candidates.discoverButton.sendToView" />
                            </Button>
                        </Col>
                        <Col xs={5}>
                            <Dropdown disabled={isDisabledEndBtns()} overlay={menu}>
                                <Button type="primary" danger>
                                    <IntlMessage id="candidates.discoverButton.finishDiscover" />
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        </Col>
                    </Row>
                </Card>

                <SubmitStudy modalCase={{ showmodalSubmitStudy }} openModal={openSubmitStudy} />
                <CompleteStudy
                    modalCase={{ showModalCompleteStudy }}
                    openModal={openCompleteStudy}
                    id={id}
                />
                <ModalChooseEssay modalCase={{ showModal }} openModal={open} />
                <ModalPhysicTrain
                    modalCase={{ showModalPhysicTrain }}
                    openModal={openPhysicTrain}
                    isPhysical={selectedCandidate}
                    stageInfoId={selectedModalStage?.candidate_stage_info.id}
                />
                <ModalMiltaryMedlExam
                    modalCase={{ showModalMiltaryMedExam }}
                    openModal={openMiltMed}
                    stage={selectedModalStage}
                    setStage={setSelectedModalStage}
                />
                <ModalResultPolyg
                    modalCase={{ showModalPolygRes }}
                    openModal={openPolygRes}
                    stage={selectedModalStage}
                    setStage={setSelectedModalStage}
                />
                <ModalKnowledgeLegislation
                    modalCase={{ showModalKnowlLegs }}
                    openModal={openKnowlLegis}
                    stage={selectedModalStage}
                    setStage={setSelectedModalStage}
                />
                <ModalFinalScorePhysicTraining
                    modalCase={{ showModalPhysicTrainForTrainer }}
                    openModal={openFinalScorePhysicTrain}
                    isPhysical={selectedCandidate}
                    stage={selectedModalStage}
                    setStage={setSelectedModalStage}
                />
                <ModalPolygraphSend
                    modalCase={{ showModalPolygraphSend }}
                    openModal={openPolygraphSend}
                    stageInfoId={selectedModalStage?.candidate_stage_info.id}
                />
            </Spin>
        </div>
    );
};

export default DiscoverStage;
