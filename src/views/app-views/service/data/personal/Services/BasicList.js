// prettier-ignore
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    FileAddOutlined,
    FileTextTwoTone,
    InfoCircleOutlined,
} from '@ant-design/icons';
// prettier-ignore
import {  Col, Row, Tag } from 'antd';
// prettier-ignore
import IntlMessage from 'components/util-components/IntlMessage';
// prettier-ignore
import moment from 'moment';
// prettier-ignore
import { useEffect, useState } from 'react';
// prettier-ignore
import { useDispatch, useSelector } from 'react-redux';
// prettier-ignore
import ModalController from '../common/ModalController';
// prettier-ignore
import ShowOnlyForRedactor from '../common/ShowOnlyForRedactor';
// prettier-ignore
import ModalBlackBeretHistory from './modals/BlackBeretHistory';
// prettier-ignore
import InvestigatedEmployee from './modals/InvestigatedEmployee';
// prettier-ignore
import ModalAddRecommended from './modals/ModalAddRecommended';
// prettier-ignore
import ModalEditRecommended from './modals/ModalEditRecommended';
// prettier-ignore
import RecommendedByEmployee from './modals/RecommendedByEmployee';
// prettier-ignore
import UsersService from 'services/myInfo/UsersService';
// prettier-ignore
import LocalizationText, {
    LocalText,
} from 'components/util-components/LocalizationText/LocalizationText';
// prettier-ignore
import ModalOathEdit from './modals/ModalOathEdit';
// prettier-ignore
import { getMilitaryUnits } from 'store/slices/myInfo/servicesSlice';
// prettier-ignore
import ModalSecretEdit from './modals/ModalSecretEdit';
// prettier-ignore
import ModalReserveEdit from './modals/ModalReserveEdit';
// prettier-ignore
import { PrivateServices } from 'API';
// prettier-ignore
import { useAppSelector } from 'hooks/useStore';
// prettier-ignore
import ModalCoolnessEdit from './modals/ModalCoolnessEdit';
// prettier-ignore
import ModalBeretEdit from './modals/ModalBeretEdit';
// prettier-ignore
import CoolnessService from 'services/myInfo/CoolnessService';
// prettier-ignore
import ModalRecommenderEdit from './modals/ModalRecommenderEdit';
import ModalResearcherEdit from "./modals/ModalResearcherEdit";
import CoolnessHistory from "./modals/CoolnessHistory";
import { fetchCoolnessForms, fetchCoolnessStatuses } from "store/slices/coolnessModalEditSlice";
import { PERMISSION } from "constants/permission";
// prettier-ignore

const defaultText = {
    name: 'Отсутствуют данные',
    nameKZ: 'Деректер жоқ',
};
// prettier-ignore

const defaultBeret = {
    name: 'Присвоен',
    nameKZ: 'Тағайындалды',
};
// prettier-ignore

const Tab = ({ status, statuses }) => {
    if (status === 'Подтвержден')
        return (
            <Tag
                icon={<CheckCircleOutlined />}
                color='#F6FFED'
                style={{
                    fontSize: '12px',
                    borderColor: '#B7EB8F',
                    color: '#52C41A',
                    borderRadius: '15px',
                }}
                className={'font-style'}
            >
                {LocalText.getName(statuses)}
            </Tag>
        );
    if (status === 'Присвоен')
        return (
            <Tag
                icon={<ExclamationCircleOutlined />}
                color='warning'
                style={{
                    borderRadius: '15px',
                }}
                className={'font-style'}
            >
                {LocalText.getName(statuses)}
            </Tag>
        );

    if (status === 'Лишен')
        return (
            <Tag
                icon={<CloseCircleOutlined />}
                color='#FFF1F0'
                style={{
                    fontSize: '12px',
                    borderColor: '#FFA39E',
                    color: '#F5222D',
                    borderRadius: '15px',
                }}
                className={'font-style'}
            >
                {LocalText.getName(statuses)}
            </Tag>
        );
    return null;
};

const BasicList = ({ info, type = "employee", setModalState }) => {
    const [oathIsOpen, setOathIsOpen] = useState(false);
    const [secretsOpen, setSecretOpen] = useState(false);
    const [reserveOpen, setReserveOpen] = useState(false);
    const [coolnessOpen, setCoolnessOpen] = useState(false);
    const [beretOpen, setBeretOpen] = useState(false);
    const [recommenderOpen, setRecommenderOpen] = useState(false);
    const [researcherOpen, serResearcherOpen] = useState(false);
    const [coolnessData, setCoolnessData] = useState([]);

    const [formsOptions, setFormsOptions] = useState([]);
    const [reservesOptions, setReservesOptions] = useState([]);
    const [coolnessForms, setCoolnessForms] = useState([]);
    const [recommend, setRecommend] = useState(null);
    const [research, setResearch] = useState(null);

    const edited = useSelector((state) => state.myInfo.edited.services);
    const local = useSelector((state) => state.myInfo.allTabs.services);

    const [isInvestigatedEmployee, setIsInvestigatedEmployee] = useState(false);
    const [isBlackBeretHistory, setIsBlackBeretHistory] = useState(false);
    const [isCoolnessHistory, setIsCoolnessHistory] = useState(false);

    const myProfile = useSelector((state) => state.profile.data);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const [supervisor, setSuperVisor] = useState("");
    const currentLocale = localStorage.getItem("lan");

    const dispatch = useDispatch();

    useEffect(() => {
        if (myProfile?.supervised_by) {
            fetchUser();
        }
    }, [myProfile?.supervised_by]);

    useEffect(() => {
        if (
            currentRecommendantAndResearcher?.user_by_id !== null &&
            currentRecommendantAndResearcher?.recommendant === null
        ) {
            PrivateServices.get("/api/v1/users/{id}/", {
                params: {
                    path: {
                        id: currentRecommendantAndResearcher.user_by_id,
                    },
                },
            }).then((responce) => {
                if (responce?.data) {
                    setRecommend(responce?.data);
                }
            });
        }
        if (
            currentRecommendantAndResearcher?.researcher_id !== null &&
            currentRecommendantAndResearcher?.researcher === null
        ) {
            PrivateServices.get("/api/v1/users/{id}/", {
                params: {
                    path: {
                        id: currentRecommendantAndResearcher.researcher_id,
                    },
                },
            }).then((responce) => {
                if (responce?.data) {
                    setResearch(responce?.data);
                }
            });
        }
    }, []);

    const fetchUser = async () => {
        const response = await UsersService.get_user_by_id(myProfile?.supervised_by);
        setSuperVisor(response);
    };

    useEffect(() => {
        dispatch(getMilitaryUnits());
        dispatch(fetchCoolnessStatuses());
        dispatch(fetchCoolnessForms());
        fetchForms();
        fetchCoolness();
    }, []);

    const fetchForms = async () => {
        const forms = await PrivateServices.get("/api/v1/privelege_emergencies/forms/");
        const formsKeys = Object.keys(forms.data);

        setFormsOptions(formsKeys.map((item) => ({ value: item, label: forms.data[item] })));

        const reserves = await PrivateServices.get("/api/v1/personnal_reserve/forms/");

        const reservesKeys = Object.keys(reserves.data);

        setReservesOptions(
            reservesKeys.map((item) => ({
                value: item,
                label: reserves.data[item],
                labelKZ: reserves.data[item] === "Зачислен" ? "Қабылданды" : "Резерв",
            })),
        );
    };

    const fetchCoolness = async () => {
        const dataForms = await CoolnessService.get_coolness_form();
        setCoolnessForms(dataForms);
    };

    const handleModalOpen = (type) => {
        if (modeRedactor && isHR) {
            if (type === "oath") {
                setOathIsOpen(true);
            }

            if (type === "secret") {
                setSecretOpen(true);
            }

            if (type === "reserve") {
                setReserveOpen(true);
            }

            if (type === "coolness") {
                setCoolnessOpen(true);
            }

            if (type === "beret") {
                setBeretOpen(true);
            }

            if (type === "recommender") {
                setRecommenderOpen(true);
            }

            if (type === "researcher") {
                serResearcherOpen(true);
            }
        } else {
            if (type === "coolness") {
                setIsCoolnessHistory(true);
            }

            if (type === "beret") {
                setIsBlackBeretHistory(true);
            }
        }
    };

    const coolness_remote = useSelector(
        (state) => state.services.serviceData.general_information.coolness,
    );
    const coolness_local = useSelector((state) => state.myInfo.allTabs.services.coolness);
    const coolness_edited = useSelector((state) => state.myInfo.edited.services.coolness);

    useEffect(() => {
        const edit = coolness_edited.filter((e) => !e.delete);
        const local = coolness_local.filter((e) => !e.delete);

        setCoolnessData([...edit, ...coolness_remote, ...local]);
    }, [coolness_edited, coolness_remote, coolness_local]);

    const getCurrentRecommendationAndResearcher = () => {
        if (Object.keys(edited.recommendation_and_researcher).length !== 0)
            return edited.recommendation_and_researcher;
        if (Object.keys(local.recommendation_and_researcher).length !== 0)
            return local.recommendation_and_researcher;
        if (info.recommender) return info.recommender;

        return null;
    };

    const getCurrentBeret = () => {
        if (edited.beret?.document_number) return edited.beret;
        if (local.beret?.document_number) return local.beret;
        if (info?.black_beret) return info.black_beret;

        return null;
    };

    const currentRecommendantAndResearcher = getCurrentRecommendationAndResearcher();
    const currentBeret = getCurrentBeret();

    const generateCoolness = () => {
        return coolnessData
            .filter((item) => !item.delete)
            .map((item, index) => {
                return (
                    <Col key={index} xs={24}>
                        <Row
                            style={index !== 0 ? { marginTop: 10 } : {}}
                            justify="space-between"
                            align="middle"
                        >
                            <Col xs={10} className={"font-style"}>
                                {LocalText.getName(item.type)}
                            </Col>
                            <Col xs={14}>
                                <Row justify="start">
                                    <Tab
                                        status={item.coolness_status.name}
                                        statuses={item.coolness_status}
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                );
            });
    };

    const currentPersonalReserve = edited.personnel_reserve.id
        ? edited.personnel_reserve
        : info.personnel_reserve;

    return (
        <>
            <InvestigatedEmployee
                supervisor={supervisor}
                isOpen={isInvestigatedEmployee}
                onClose={() => setIsInvestigatedEmployee(false)}
            />
            <ModalBlackBeretHistory
                isOpen={isBlackBeretHistory}
                onClose={() => setIsBlackBeretHistory(false)}
            />
            <CoolnessHistory
                isOpen={isCoolnessHistory}
                onClose={() => setIsCoolnessHistory(false)}
            />
            {/* <RecommendedByEmployee
                id={info.researcher?.id}
                isOpen={isRecommendedByEmployee}
                onClose={() => setIsRecommendedByEmployee(false)}
            /> */}

            <ModalOathEdit
                oath={edited.oath.military_unit_id ? edited.oath : info?.oath}
                isOpen={oathIsOpen}
                onClose={() => setOathIsOpen(false)}
            />
            <ModalSecretEdit
                secret={
                    edited?.privilege_emergency_secrets?.form
                        ? edited?.privilege_emergency_secrets
                        : info?.privilege_emergency_secrets
                }
                isOpen={secretsOpen}
                onClose={() => setSecretOpen(false)}
            />
            <ModalReserveEdit
                reserve={
                    edited?.personnel_reserve?.reserve
                        ? edited?.personnel_reserve
                        : info?.personnel_reserve
                }
                isOpen={reserveOpen}
                onClose={() => setReserveOpen(false)}
            />
            <ModalCoolnessEdit
                coolness={coolnessData}
                isOpen={coolnessOpen}
                onClose={() => setCoolnessOpen(false)}
            />
            <ModalBeretEdit
                isOpen={beretOpen}
                onClose={() => setBeretOpen(false)}
                info={currentBeret}
            />

            <ModalRecommenderEdit
                isOpen={recommenderOpen}
                onClose={() => setRecommenderOpen(false)}
                info={currentRecommendantAndResearcher}
            />
            <ModalResearcherEdit
                isOpen={researcherOpen}
                onClose={() => serResearcherOpen(false)}
                info={currentRecommendantAndResearcher}
            />

            <div>
                <Row onClick={() => handleModalOpen("oath")} style={{ height: 30 }}>
                    <Col lg={8} className={"font-style text-muted"}>
                        <IntlMessage id="personal.services.oath" />
                    </Col>
                    {info.oath || edited.oath.military_unit_id ? (
                        <>
                            {edited.oath.military_unit ? (
                                <Col lg={14} className={"font-style"}>
                                    {moment(edited.oath.date).format("DD.MM.YYYY")},{" "}
                                    {edited.oath.military_unit
                                        ? edited.oath.military_unit
                                        : currentLocale === "ru"
                                        ? edited.oath.military_name
                                        : edited.oath.military_nameKZ}
                                </Col>
                            ) : (
                                <Col lg={14} className={"font-style"}>
                                    {moment(info?.oath?.date).format("DD.MM.YYYY")},{" "}
                                    {info.oath.military_unit
                                        ? info.oath.military_unit
                                        : currentLocale === "ru"
                                        ? info.oath.military_name
                                        : info.oath.military_nameKZ || ""}
                                </Col>
                            )}
                        </>
                    ) : (
                        <LocalizationText text={defaultText} />
                    )}
                </Row>
                <Row onClick={() => handleModalOpen("secret")} style={{ height: 30 }}>
                    <Col lg={8} className={"font-style text-muted"}>
                        <IntlMessage id="personal.services.securityClearance" />
                    </Col>
                    {info?.privilege_emergency_secrets || edited.privilege_emergency_secrets ? (
                        <>
                            {edited.privilege_emergency_secrets?.form ? (
                                <Col lg={16} className={"font-style"}>
                                    {
                                        formsOptions.find(
                                            (item) =>
                                                item.value ===
                                                edited.privilege_emergency_secrets.form,
                                        )?.label
                                    }{" "}
                                    ({currentLocale === "ru" && <>с &nbsp;</>}
                                    {moment(edited.privilege_emergency_secrets.date_from).format(
                                        "DD.MM.YYYY",
                                    )}
                                    {currentLocale === "kk" && <>бастап</>}){" "}
                                    {currentLocale === "ru" && <>по &nbsp;</>}
                                    {moment(edited.privilege_emergency_secrets.date_to).format(
                                        "DD.MM.YYYY",
                                    )}{" "}
                                    {currentLocale === "kk" && <>дейін</>}
                                </Col>
                            ) : (
                                <Col lg={16} className={"font-style"}>
                                    {info.privilege_emergency_secrets.form} (
                                    {currentLocale === "ru" && <>с &nbsp;</>}
                                    {moment(info.privilege_emergency_secrets.date_from).format(
                                        "DD.MM.YYYY",
                                    )}{" "}
                                    {currentLocale === "kk" && <>бастап</>}){" "}
                                    {currentLocale === "ru" && <>по &nbsp;</>}
                                    {moment(info.privilege_emergency_secrets.date_to).format(
                                        "DD.MM.YYYY",
                                    )}{" "}
                                    {currentLocale === "kk" && <>дейін</>}
                                </Col>
                            )}
                        </>
                    ) : (
                        <LocalizationText text={defaultText} />
                    )}
                </Row>
                <Row onClick={() => handleModalOpen("reserve")} style={{ height: 30 }}>
                    <Col lg={8} className={"font-style text-muted"}>
                        <IntlMessage id="personal.services.cadreReserve" />
                    </Col>
                    {currentPersonalReserve && !currentPersonalReserve.delete ? (
                        <>
                            {edited.personnel_reserve?.reserve ? (
                                <Col lg={14} className={"font-style"}>
                                    {currentLocale === "kk"
                                        ? reservesOptions.find(
                                              (item) =>
                                                  item.value === edited.personnel_reserve?.reserve,
                                          ).labelKZ
                                        : reservesOptions.find(
                                              (item) =>
                                                  item.value === edited.personnel_reserve?.reserve,
                                          )?.label}
                                    {" №"}
                                    {edited.personnel_reserve?.document_number}{" "}
                                    {currentLocale === "ru" && <>от&nbsp;</>}
                                    {moment(edited.personnel_reserve?.reserve_date).format(
                                        "DD.MM.YYYY",
                                    )}{" "}
                                    {currentLocale === "kk" && <>бастап</>}
                                </Col>
                            ) : (
                                <Col lg={14} className={"font-style"}>
                                    {currentLocale === "kk"
                                        ? info.personnel_reserve?.reserve === "Зачислен"
                                            ? "Қабылданды"
                                            : "Резерв"
                                        : info.personnel_reserve?.reserve}
                                    {" №"}
                                    {info.personnel_reserve?.document_number}{" "}
                                    {currentLocale === "ru" && <>от&nbsp;</>}
                                    {moment(info.personnel_reserve?.reserve_date).format(
                                        "DD.MM.YYYY",
                                    )}
                                    {currentLocale === "kk" && <>&nbsp; бастап</>}
                                </Col>
                            )}

                            {/* {info.personnel_reserve===null && (info.personnel_reserve?.document_link === null ||
                            info.personnel_reserve?.document_link === undefined) ? null : (
                                <Col style={{ marginLeft: "auto" }}>
                                    <FileTextTwoTone
                                        style={{ fontSize: "20px" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalState({
                                                open: false,
                                                link: info.personnel_reserve?.document_link,
                                            });
                                        }}
                                    />
                                </Col>
                            )} */}
                        </>
                    ) : (
                        <LocalizationText text={defaultText} />
                    )}
                </Row>
                <Row
                    onClick={() => handleModalOpen("coolness")}
                    style={{ minHeight: 30, marginBottom: 10 }}
                >
                    <Col xs={8} className={"font-style text-muted"}>
                        <IntlMessage id="personal.services.classification" />
                    </Col>
                    <Col xs={16}>
                        {coolnessData && coolnessData.length === 0 ? (
                            <LocalizationText text={defaultText} />
                        ) : (
                            <Row>{generateCoolness()}</Row>
                        )}
                    </Col>
                </Row>
                <Row onClick={() => handleModalOpen("beret")} style={{ height: 30 }}>
                    <Col lg={8} className={"font-style text-muted"}>
                        <IntlMessage id="personal.services.blackBeret" />
                    </Col>
                    {currentBeret && type === "employee" && currentBeret.document_number ? (
                        <Col lg={10} className={"font-style"}>
                            {LocalText.getName(defaultBeret)} (№
                            {currentBeret.document_number || ""}{" "}
                            {currentLocale === "ru" && <>от &nbsp;</>}
                            {currentBeret.date_from ? (
                                <>
                                    {moment(currentBeret.date_from).format("DD.MM.YYYY")}
                                    {currentLocale === "kk" && <>&nbsp; бастап</>}
                                </>
                            ) : (
                                ""
                            )}
                            )
                        </Col>
                    ) : (
                        <LocalizationText text={defaultText} />
                    )}
                </Row>
                <Row onClick={() => handleModalOpen("researcher")} style={{ height: 30 }}>
                    <Col lg={8} className={"font-style text-muted"}>
                        <IntlMessage id="personal.services.studied" />
                    </Col>
                    {currentRecommendantAndResearcher?.researcher || research ? (
                        currentRecommendantAndResearcher.researcher || research
                    ) : (
                        <LocalizationText text={defaultText} />
                    )}
                </Row>
                <Row onClick={() => handleModalOpen("recommender")}>
                    <Col lg={8} className={"font-style text-muted"}>
                        <IntlMessage id="personal.services.recommended" />
                    </Col>
                    {currentRecommendantAndResearcher?.recommendant || recommend ? (
                        currentRecommendantAndResearcher.recommendant || recommend
                    ) : (
                        <LocalizationText text={defaultText} />
                    )}
                    {currentRecommendantAndResearcher?.document_link !== null && (
                        <Col style={{ marginLeft: "auto" }}>
                            <FileTextTwoTone
                                style={{ fontSize: "20px" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setModalState({
                                        open: false,
                                        link: currentRecommendantAndResearcher?.document_link,
                                    });
                                }}
                            />
                        </Col>
                    )}
                </Row>
                {/* <Row gutter={[18, 16]}>
                    <Col lg={12} className={'font-style'}>
                        {info.researcher?.name ?? 'Нет данных'} &nbsp;
                        {info.researcher ? (
                            <InfoCircleOutlined
                                style={{
                                    fontSize: '16px',
                                    color: '#366EF6',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    setIsRecommendedByEmployee(true);
                                }}
                            />
                        ) : null}
                    </Col>
                    <Col lg={2} style={{ marginLeft: 'auto' }}>
                        <Row>
                            {!info?.recommender &&
                                !recommendationEdited &&
                                !recommendationAdded && (
                                    <ShowOnlyForRedactor
                                        forRedactor={
                                            <ModalController>
                                                <ModalAddRecommended />
                                                <FileAddOutlined
                                                    style={{
                                                        marginLeft: 'auto',
                                                        fontSize: '20px',
                                                        color: '#366EF6',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            </ModalController>
                                        }
                                    />
                                )}
                            {info?.recommender && !recommendationAdded && !recommendationEdited && (
                                <ShowOnlyForRedactor
                                    forRedactor={
                                        <ModalController>
                                            <ModalEditRecommended
                                                recommendation={info?.recommender}
                                                source='get'
                                            />
                                            <EditOutlined
                                                style={{
                                                    fontSize: '20px',
                                                    color: '#366EF6',
                                                    marginLeft: 10,
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </ModalController>
                                    }
                                />
                            )}
                            {recommendationEdited && (
                                <ShowOnlyForRedactor
                                    forRedactor={
                                        <ModalController>
                                            <ModalEditRecommended
                                                recommendation={recommendationEdited}
                                                source='edited'
                                            />
                                            <EditOutlined
                                                style={{
                                                    fontSize: '20px',
                                                    color: '#366EF6',
                                                    marginLeft: 10,
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </ModalController>
                                    }
                                />
                            )}
                            {recommendationAdded && (
                                <ShowOnlyForRedactor
                                    forRedactor={
                                        <ModalController>
                                            <ModalEditRecommended
                                                recommendation={recommendationAdded}
                                                source='added'
                                            />
                                            <EditOutlined
                                                style={{
                                                    fontSize: '20px',
                                                    color: '#366EF6',
                                                    marginLeft: 10,
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </ModalController>
                                    }
                                />
                            )}
                        </Row>
                    </Col>
                </Row> */}
            </div>
        </>
    );
};

export default BasicList;
