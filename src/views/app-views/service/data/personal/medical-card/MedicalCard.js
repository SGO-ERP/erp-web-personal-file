import { FileTextTwoTone, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Collapse, Row, Spin, Tag, Typography } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLiberations, getMedicalInfo } from "store/slices/myInfo/medicalInfoSlice";
import RowWithDate from "../../components/RowWithDate";
import ModalForDoc from "../../modals/ModalForDoc";
import ModalController from "../common/ModalController";
import ShowOnlyForRedactor from "../common/ShowOnlyForRedactor";
import findAccordionByName from "../common/findAccordionByName";
import AnthropometricInfo from "./anthropometric-data/anthropometric-data";
import GeneralInfo from "./general-info/general-info";
import ModalAddDispensaryReg from "./modals/ModalAddDispensaryReg";
import ModalAddDispensaryRegEdit from "./modals/ModalAddDispensaryRegEdit";
import ModalAddReleaseDetail from "./modals/ModalAddReleaseDetail";
import ModalAddReleaseDetailEdit from "./modals/ModalAddReleaseDetailEdit";
import ModalSickList from "./modals/ModalSickList";
import ModalSickListEdit from "./modals/ModalSickListEdit";
import CollapseErrorBoundary from "../common/CollapseErrorBoundary";
import NoData from "../NoData";
import { useAppSelector } from "../../../../../../hooks/useStore";
import { PrivateServices } from "../../../../../../API";
import ModalShowDispensaryReg from "./modals/ModalShowDispensaryReg";
import ModalShowReleaseDetail from "./modals/ModalShowReleaseDetail";
import ModalShowSickList from "./modals/ModalShowSickList";
import LocalizationText from "../../../../../../components/util-components/LocalizationText/LocalizationText";
import ShowAll from "../common/ShowAll";
import {
    DispensaryTable,
    HospitalTable,
    LiberationsTable,
} from "../PersonalData/ShowAllPersonalDataTable";
import { PERMISSION } from "constants/permission";
import NoSee from "../NoSee";

const { Panel } = Collapse;
const { Text } = Typography;
const MedicalCard = ({ id, activeAccordions, allOpen, type = "employee" }) => {
    const [modalState, setModalState] = useState({
        open: false,
        link: "",
    });

    const dispatch = useDispatch();

    let user = useSelector((state) => state.users.user);

    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const medicalDataRemote = useSelector((state) => state.medicalInfo.medicalInfo);
    const medicalDataLocal = useSelector((state) => state.myInfo.allTabs.medical_card);
    const editedData = useSelector((state) => state.myInfo.edited.medical_card);

    const loading = useSelector((state) => state.medicalInfo.loading);
    const error = useSelector((state) => state.medicalInfo.error);

    const [hiddenTabs, setHiddenTabs] = useState([]);
    const myProfile = useSelector((state) => state.profile.data);
    const [leader, setLeader] = useState({});
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    const [openShowDisReg, setOpenShowDisReg] = useState(false);
    const [openShowSickList, setOpenShowSickList] = useState(false);
    const [openShowRelDet, setOpenShowRelDet] = useState(false);

    useEffect(() => {
        const fetchLeader = async () => {
            try {
                const response = await PrivateServices.get("/api/v1/users/staff-unit/{id}", {
                    params: {
                        path: {
                            id: user?.staff_unit?.staff_division?.leader_id,
                        },
                    },
                });
                setLeader(response);
            } catch (err) {
                console.log(err);
            }
        };
        if (user?.staff_unit?.staff_division?.leader_id) {
            fetchLeader();
        }
    }, [user?.staff_unit?.staff_division?.leader_id]);

    const toggleHiddenTabs = (tab) => {
        setHiddenTabs((prevHiddenTabs) => {
            if (prevHiddenTabs.includes(tab)) {
                return prevHiddenTabs.filter((item) => item !== tab);
            } else {
                return [...prevHiddenTabs, tab];
            }
        });
    };

    const genExtra = (name) => (
        <Button
            shape="round"
            size={"small"}
            onClick={(event) => {
                toggleHiddenTabs(name);
                if (name === "Диспасерный учёт") {
                    setOpenShowDisReg(true);
                } else if (name === "Освобождения") {
                    setOpenShowRelDet(true);
                } else if (name === "Больничные листы") {
                    setOpenShowSickList(true);
                }
                // If you don't want click extra trigger collapse, you can prevent this:
                event.stopPropagation();
            }}
        >
            <IntlMessage id="personal.medicalCard.viewAll" />
        </Button>
    );

    useEffect(() => {
        dispatch(getMedicalInfo(id));
        dispatch(getLiberations());
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    const DispensaryList = ({ setModalState, dispensaryL, source = "get" }) => {
        const [currentDispensary, setCurrentDispensary] = useState(null);
        const [showEditModal, setShowEditModal] = useState(false);
        const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
        const currentLocale = localStorage.getItem("lan");

        const handleClick = (dispensary) => {
            if (!modeRedactor) return;
            setCurrentDispensary(dispensary);
            setShowEditModal(true);
        };

        if (!dispensaryL) return null;

        return (
            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
                {currentDispensary && (
                    <ModalAddDispensaryRegEdit
                        dispensaryObject={currentDispensary}
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        source={source}
                    />
                )}
                {dispensaryL.length > 0 &&
                    dispensaryL.map((item, i) => {
                        if (item.delete) {
                            return null; // Пропустить отображение элемента с 'delete'
                        }
                        return (
                            <div
                                // TEMP: key={item.id}
                                key={i}
                            >
                                <React.Fragment key={i}>
                                    <Row
                                        gutter={[18, 16]}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Col xs={20} onClick={() => handleClick(item)}>
                                            <Row gutter={16}>
                                                <Col lg={20} className={"font-style"}>
                                                    <span style={{ color: "#1A3353" }}>
                                                        <LocalizationText text={item} />
                                                    </span>
                                                    <RowWithDate
                                                        firstString={
                                                            (currentLocale === "kk"
                                                                ? item.initiatorKZ
                                                                : item.initiator) || ""
                                                        }
                                                        start_date={moment(item.start_date).format(
                                                            "DD.MM.YYYY",
                                                        )}
                                                        end_date={
                                                            item.end_date === null ? (
                                                                <>н.в.</>
                                                            ) : (
                                                                moment(item.end_date).format(
                                                                    "DD.MM.YYYY",
                                                                )
                                                            )
                                                        }
                                                    ></RowWithDate>
                                                </Col>
                                            </Row>
                                        </Col>
                                        {item.document_link === null ||
                                        item.document_link === undefined ? null : (
                                            <Col
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "end",
                                                }}
                                                xs={4}
                                            >
                                                <FileTextTwoTone
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setModalState({
                                                            open: false,
                                                            link: item.document_link,
                                                        });
                                                    }}
                                                    style={{ fontSize: "20px" }}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                </React.Fragment>
                            </div>
                        );
                    })}
            </CollapseErrorBoundary>
        );
    };

    const SickList = ({ setModalState, sickList, source = "get" }) => {
        const [currentSick, setCurrentSick] = useState(null);
        const [showEditModal, setShowEditModal] = useState(false);
        const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
        const currentLocale = localStorage.getItem("lan");

        const handleClick = (sick) => {
            if (!modeRedactor) return;
            setCurrentSick(sick);
            setShowEditModal(true);
        };

        if (!sickList) return null;

        return (
            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
                {currentSick && (
                    <ModalSickListEdit
                        sickObject={currentSick}
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        source={source}
                    />
                )}

                {sickList.length > 0 &&
                    sickList.map((item, i) => {
                        if (item.delete) {
                            return null;
                        }
                        return (
                            <React.Fragment key={i}>
                                <Row
                                    gutter={[18, 16]}
                                    style={{ display: "flex", justifyContent: "space-between" }}
                                >
                                    <Col xs={20} onClick={() => handleClick(item)}>
                                        <Row gutter={16}>
                                            <Col className={"font-style"}>
                                                {(currentLocale === "kk"
                                                    ? item.reasonKZ
                                                    : item.reason) || ""}
                                                {item.code !== null && ` (${item.code || ""})`}
                                                <RowWithDate
                                                    firstString={
                                                        currentLocale === "kk"
                                                            ? item.placeKZ
                                                            : item.place
                                                    }
                                                    start_date={moment(item.start_date).format(
                                                        "DD.MM.YYYY",
                                                    )}
                                                    end_date={moment(item.end_date).format(
                                                        "DD.MM.YYYY",
                                                    )}
                                                ></RowWithDate>
                                            </Col>
                                        </Row>
                                    </Col>
                                    {item.document_link === null ||
                                    item.document_link === undefined ? null : (
                                        <Col
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "end",
                                            }}
                                            xs={4}
                                        >
                                            <FileTextTwoTone
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalState({
                                                        open: false,
                                                        link: item.document_link,
                                                    });
                                                }}
                                                style={{ fontSize: "20px" }}
                                            />
                                        </Col>
                                    )}
                                </Row>
                            </React.Fragment>
                        );
                    })}
            </CollapseErrorBoundary>
        );
    };

    const ReleaseList = ({ setModalState, releaseList, source = "get" }) => {
        const [currentRelease, setCurrentRelease] = useState(null);
        const [showEditModal, setShowEditModal] = useState(false);
        const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
        const currentLocale = localStorage.getItem("lan");

        const handleClick = (release) => {
            if (!modeRedactor) return;
            setCurrentRelease(release);
            setShowEditModal(true);
        };

        if (!releaseList) return null;

        return (
            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
                {currentRelease !== null && (
                    <ModalAddReleaseDetailEdit
                        releaseObject={currentRelease}
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        source={source}
                    />
                )}
                {releaseList.length > 0 &&
                    releaseList.map((item, i) => {
                        if (item.delete) {
                            return null;
                        }
                        return (
                            <div
                                // TEMP: key={item.id}
                                key={i}
                            >
                                <React.Fragment key={i}>
                                    <Row
                                        gutter={[18, 16]}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Col xs={20} onClick={() => handleClick(item)}>
                                            <Row gutter={16}>
                                                <span>
                                                    <span
                                                        className="paddingLR8"
                                                        style={{ color: "black" }}
                                                    >
                                                        {currentLocale === "kk"
                                                            ? item.reasonKZ
                                                            : item.reason}
                                                    </span>
                                                    <span>
                                                        {item.liberation_ids.map((liberation) => (
                                                            <>
                                                                <Tag
                                                                    color="#F0F5FF"
                                                                    style={{
                                                                        fontSize: "10px",
                                                                        borderColor: "#ADC6FF",
                                                                        color: "#2F54EB",
                                                                        borderRadius: "15px",
                                                                        lineHeight: "16px",
                                                                        marginRight: "10px",
                                                                    }}
                                                                    className={"font-style"}
                                                                >
                                                                    {
                                                                        <LocalizationText
                                                                            text={liberation}
                                                                        />
                                                                    }
                                                                </Tag>
                                                            </>
                                                        ))}
                                                    </span>
                                                </span>
                                            </Row>
                                            <RowWithDate
                                                firstString={
                                                    (currentLocale === "kk"
                                                        ? item.initiatorKZ
                                                        : item.initiator) || ""
                                                }
                                                start_date={moment(item.start_date).format(
                                                    "DD.MM.YYYY",
                                                )}
                                                end_date={moment(item.end_date).format(
                                                    "DD.MM.YYYY",
                                                )}
                                            ></RowWithDate>
                                        </Col>
                                        {item.document_link === null ||
                                        item.document_link === undefined ? null : (
                                            <Col
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "end",
                                                }}
                                                xs={4}
                                            >
                                                <FileTextTwoTone
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setModalState({
                                                            open: false,
                                                            link: item.document_link,
                                                        });
                                                    }}
                                                    style={{ fontSize: "20px" }}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                </React.Fragment>
                            </div>
                        );
                    })}
            </CollapseErrorBoundary>
        );
    };

    return (
        <div>
            {loading ? (
                <div
                    style={{
                        minHeight: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    <Col xl={12}>
                        <Row gutter={[18, 16]}>
                            <Col xs={24} md={24} lg={24} xl={24}>
                                <Collapse
                                    defaultActiveKey={["1"]}
                                    expandIconPosition={"end"}
                                    style={{ backgroundColor: "#FFFF" }}
                                >
                                    <Panel
                                        header={
                                            <Text style={{ fontWeight: 500 }}>
                                                <IntlMessage id="personal.medicalCard.generalInfo" />
                                            </Text>
                                        }
                                        key={findAccordionByName(
                                            allOpen,
                                            activeAccordions,
                                            "Общие сведения",
                                            "1",
                                        )}
                                        style={{ color: "#1A3353" }}
                                    >
                                        <GeneralInfo
                                            generalData={
                                                medicalDataRemote?.general_user_info &&
                                                medicalDataRemote?.general_user_info[0]
                                            }
                                        />
                                    </Panel>
                                </Collapse>
                            </Col>

                            {type === "employee" && (
                                <Col xs={24} lg={24} xl={24}>
                                    <Collapse
                                        defaultActiveKey={["2"]}
                                        expandIconPosition={"end"}
                                        style={{ backgroundColor: "#FFFF" }}
                                    >
                                        <Panel
                                            header={
                                                <Text style={{ fontWeight: 500 }}>
                                                    <IntlMessage id="personal.medicalCard.anthropometry" />
                                                </Text>
                                            }
                                            key={findAccordionByName(
                                                allOpen,
                                                activeAccordions,
                                                "Антропометрические данные",
                                                "2",
                                            )}
                                            style={{ color: "#1A3353" }}
                                        >
                                            <AnthropometricInfo
                                                anthropometricData={
                                                    medicalDataRemote.anthropometric_datas &&
                                                    medicalDataRemote.anthropometric_datas[0]
                                                }
                                            />
                                        </Panel>
                                    </Collapse>
                                </Col>
                            )}
                        </Row>
                    </Col>

                    {type === "candidate" && (
                        <Col xl={12}>
                            <Row gutter={[18, 16]}>
                                <Col xs={24} lg={24} xl={24}>
                                    <Collapse
                                        defaultActiveKey={["2"]}
                                        expandIconPosition={"end"}
                                        style={{ backgroundColor: "#FFFF" }}
                                    >
                                        <Panel
                                            header={
                                                <Text style={{ fontWeight: 500 }}>
                                                    <IntlMessage id="personal.medicalCard.anthropometry" />
                                                </Text>
                                            }
                                            key={findAccordionByName(
                                                allOpen,
                                                activeAccordions,
                                                "Антропометрические данные",
                                                "2",
                                            )}
                                            style={{ color: "#1A3353" }}
                                        >
                                            <AnthropometricInfo
                                                anthropometricData={
                                                    medicalDataRemote.anthropometric_datas &&
                                                    medicalDataRemote.anthropometric_datas[0]
                                                }
                                            />
                                        </Panel>
                                    </Collapse>
                                </Col>
                            </Row>
                        </Col>
                    )}

                    <Col xl={12}>
                        {type === "employee" && (
                            <Row gutter={[18, 16]}>
                                <Col xs={24} md={24} lg={24} xl={24}>
                                    <Collapse
                                        defaultActiveKey={["3"]}
                                        expandIconPosition={"end"}
                                        style={{ backgroundColor: "#FFFF" }}
                                    >
                                        <Panel
                                            header={
                                                <Row gutter={16}>
                                                    <Col>
                                                        <Text style={{ fontWeight: 500 }}>
                                                            <IntlMessage id="personal.medicalCard.sickLeave" />
                                                        </Text>
                                                    </Col>
                                                    {isHR && (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalSickList />
                                                                        <PlusCircleOutlined
                                                                            style={{
                                                                                fontSize: "13px",
                                                                                color: "#366EF6",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    )}
                                                </Row>
                                            }
                                            key={findAccordionByName(
                                                allOpen,
                                                activeAccordions,
                                                "Больничные листы",
                                                "3",
                                            )}
                                            extra={
                                                medicalDataRemote?.hospital_datas?.length &&
                                                !modeRedactor ? (
                                                    <ShowAll
                                                        intlId={"personal.medicalCard.sickLeave"}
                                                    >
                                                        <HospitalTable
                                                            data={medicalDataRemote?.hospital_datas}
                                                        />
                                                    </ShowAll>
                                                ) : null
                                            }
                                            className={"panel-with-hide"}
                                            style={{
                                                color: "#1A3353",
                                            }}
                                        >
                                            {medicalDataRemote?.hospital_datas ===
                                            "Permission Denied" ? (
                                                <NoSee />
                                            ) : medicalDataRemote?.hospital_datas?.length +
                                                  medicalDataLocal?.sick_list?.length +
                                                  editedData?.sick_list?.filter(
                                                      (item) =>
                                                          !Object.hasOwnProperty.call(
                                                              item,
                                                              "delete",
                                                          ),
                                                  ).length ||
                                              medicalDataLocal?.sick_list?.length +
                                                  editedData?.sick_list?.filter(
                                                      (item) =>
                                                          !Object.hasOwnProperty.call(
                                                              item,
                                                              "delete",
                                                          ),
                                                  ).length >
                                                  0 ? (
                                                <>
                                                    <SickList
                                                        sickList={medicalDataRemote.hospital_datas}
                                                        setModalState={setModalState}
                                                    />
                                                    {isHR && (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <div>
                                                                    <SickList
                                                                        sickList={
                                                                            medicalDataLocal.sick_list
                                                                        }
                                                                        source="added"
                                                                        setModalState={
                                                                            setModalState
                                                                        }
                                                                    />
                                                                    <SickList
                                                                        sickList={
                                                                            editedData.sick_list
                                                                        }
                                                                        source={"edited"}
                                                                        setModalState={
                                                                            setModalState
                                                                        }
                                                                    />
                                                                </div>
                                                            }
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <NoData />
                                            )}
                                        </Panel>
                                    </Collapse>
                                </Col>

                                <Col xs={24} md={24} lg={24} xl={24}>
                                    <Collapse
                                        defaultActiveKey={["4"]}
                                        expandIconPosition={"end"}
                                        style={{ backgroundColor: "#FFFF" }}
                                    >
                                        <Panel
                                            header={
                                                <Row gutter={16}>
                                                    <Col>
                                                        <Text style={{ fontWeight: 500 }}>
                                                            <IntlMessage id="personal.medicalCard.releases" />
                                                        </Text>
                                                    </Col>
                                                    {isHR && (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalAddReleaseDetail />
                                                                        <PlusCircleOutlined
                                                                            style={{
                                                                                fontSize: "13px",
                                                                                color: "#366EF6",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    )}
                                                </Row>
                                            }
                                            key={findAccordionByName(
                                                allOpen,
                                                activeAccordions,
                                                "Освобождения",
                                                "4",
                                            )}
                                            extra={
                                                medicalDataRemote?.user_liberations?.length &&
                                                !modeRedactor ? (
                                                    <ShowAll
                                                        intlId={"personal.medicalCard.releases"}
                                                    >
                                                        <LiberationsTable
                                                            data={
                                                                medicalDataRemote?.user_liberations
                                                            }
                                                        />
                                                    </ShowAll>
                                                ) : null
                                            }
                                            className={"panel-with-hide"}
                                            style={{
                                                color: "#1A3353",
                                            }}
                                        >
                                            {medicalDataRemote?.user_liberations ===
                                            "Permission Denied" ? (
                                                <NoSee />
                                            ) : medicalDataRemote?.user_liberations?.length +
                                                  medicalDataLocal?.release_detail?.length +
                                                  editedData?.release_detail?.filter(
                                                      (item) =>
                                                          !Object.hasOwnProperty.call(
                                                              item,
                                                              "delete",
                                                          ),
                                                  ).length ||
                                              medicalDataLocal?.release_detail?.length +
                                                  editedData?.release_detail?.filter(
                                                      (item) =>
                                                          !Object.hasOwnProperty.call(
                                                              item,
                                                              "delete",
                                                          ),
                                                  ).length >
                                                  0 ? (
                                                <>
                                                    <ReleaseList
                                                        releaseList={
                                                            medicalDataRemote.user_liberations
                                                        }
                                                        setModalState={setModalState}
                                                    />
                                                    {isHR && (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <div>
                                                                    <ReleaseList
                                                                        releaseList={
                                                                            medicalDataLocal.release_detail
                                                                        }
                                                                        source="added"
                                                                        setModalState={
                                                                            setModalState
                                                                        }
                                                                    />
                                                                    <ReleaseList
                                                                        releaseList={
                                                                            editedData.release_detail
                                                                        }
                                                                        source={"edited"}
                                                                        setModalState={
                                                                            setModalState
                                                                        }
                                                                    />
                                                                </div>
                                                            }
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <NoData />
                                            )}
                                        </Panel>
                                    </Collapse>
                                </Col>

                                <Col xs={24} md={24} lg={24} xl={24}>
                                    <Collapse
                                        defaultActiveKey={["5"]}
                                        expandIconPosition={"end"}
                                        style={{ backgroundColor: "#FFFF" }}
                                    >
                                        <Panel
                                            header={
                                                <Row gutter={16}>
                                                    <Col>
                                                        <Text style={{ fontWeight: 500 }}>
                                                            <IntlMessage id="personal.medicalCard.medicalMonitoring" />
                                                        </Text>
                                                    </Col>
                                                    {isHR && (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalAddDispensaryReg />
                                                                        <PlusCircleOutlined
                                                                            style={{
                                                                                fontSize: "13px",
                                                                                color: "#366EF6",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    )}
                                                </Row>
                                            }
                                            key={findAccordionByName(
                                                allOpen,
                                                activeAccordions,
                                                "Диспасерный учёт",
                                                "5",
                                            )}
                                            extra={
                                                medicalDataRemote?.dispensary_registrations
                                                    ?.length && !modeRedactor ? (
                                                    <ShowAll
                                                        intlId={
                                                            "personal.medicalCard.medicalMonitoring"
                                                        }
                                                    >
                                                        <DispensaryTable
                                                            data={
                                                                medicalDataRemote?.dispensary_registrations
                                                            }
                                                        />
                                                    </ShowAll>
                                                ) : null
                                            }
                                            className={"panel-with-hide"}
                                            style={{
                                                color: "#1A3353",
                                            }}
                                        >
                                            {medicalDataRemote?.dispensary_registrations ===
                                            "Permission Denied" ? (
                                                <NoSee />
                                            ) : (medicalDataRemote?.dispensary_registrations !==
                                                  null &&
                                                  medicalDataRemote?.dispensary_registrations
                                                      ?.length +
                                                      medicalDataLocal?.dispensary_reg?.length +
                                                      editedData?.dispensary_reg?.filter(
                                                          (item) =>
                                                              !Object.hasOwnProperty.call(
                                                                  item,
                                                                  "delete",
                                                              ),
                                                      ).length >
                                                      0) ||
                                              (medicalDataRemote?.dispensary_registrations ===
                                                  null &&
                                                  medicalDataLocal?.dispensary_reg?.length +
                                                      editedData?.dispensary_reg?.filter(
                                                          (item) =>
                                                              !Object.hasOwnProperty.call(
                                                                  item,
                                                                  "delete",
                                                              ),
                                                      ).length >
                                                      0) ||
                                              medicalDataLocal?.dispensary_reg?.length +
                                                  editedData?.dispensary_reg?.filter(
                                                      (item) =>
                                                          !Object.hasOwnProperty.call(
                                                              item,
                                                              "delete",
                                                          ),
                                                  ).length >
                                                  0 ? (
                                                <>
                                                    <DispensaryList
                                                        dispensaryL={
                                                            medicalDataRemote.dispensary_registrations
                                                        }
                                                        setModalState={setModalState}
                                                    />
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <div>
                                                                <DispensaryList
                                                                    dispensaryL={
                                                                        medicalDataLocal.dispensary_reg
                                                                    }
                                                                    source="added"
                                                                    setModalState={setModalState}
                                                                />
                                                                <DispensaryList
                                                                    dispensaryL={
                                                                        editedData.dispensary_reg
                                                                    }
                                                                    source="edited"
                                                                    setModalState={setModalState}
                                                                />
                                                            </div>
                                                        }
                                                    />
                                                </>
                                            ) : (
                                                <NoData />
                                            )}
                                        </Panel>
                                    </Collapse>
                                </Col>
                            </Row>
                        )}

                        <ModalForDoc setModalState={setModalState} modalState={modalState} />
                        <ModalShowDispensaryReg
                            isOpen={openShowDisReg}
                            onClose={() => setOpenShowDisReg(false)}
                            setModalState={setModalState}
                        />
                        <ModalShowReleaseDetail
                            isOpen={openShowRelDet}
                            onClose={() => setOpenShowRelDet(false)}
                            setModalState={setModalState}
                        />
                        <ModalShowSickList
                            isOpen={openShowSickList}
                            onClose={() => setOpenShowSickList(false)}
                            setModalState={setModalState}
                        />
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default MedicalCard;
