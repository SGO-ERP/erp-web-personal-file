import { FileTextTwoTone, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Collapse, Radio, Row, Typography } from "antd";
import Flex from "components/shared-components/Flex";
import IntlMessage from "components/util-components/IntlMessage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllAvailable,
    getArmyEquipments,
    getBadgeTypes,
    getClothingEquipments,
    getMilitaryUnits,
    getOtherEquipments,
    getRanks,
    getService,
    getStaffDivisions,
    getUsers,
} from "store/slices/myInfo/servicesSlice";
import ModalForDoc from "../../modals/ModalForDoc";
import "../../style.css";
import ModalController from "../common/ModalController";
import ShowOnlyForRedactor from "../common/ShowOnlyForRedactor";
import Spinner from "../common/Spinner";
import findAccordionByName from "../common/findAccordionByName";
import AttestationList from "./AttestationList";
import AwardsList from "./AwardsList";
import BasicList from "./BasicList";
import CommandList from "./CommandList";
import ContractsList from "./ContractsList";
import JobExperienceList from "./JobExperienceList";
import PenaltyList from "./PenaltyList";
import ProgressList from "./ProgressList";
import PropFirstList from "./PropFirstList";
import PropSecondList from "./PropSecondList";
import PropThirdList from "./PropThirdList";
import QuickList from "./QuickList";
import RolesList from "./RolesList";
import SerCharList from "./SerCharList";
import ServiceId from "./ServiceId";
import VacationList from "./VacationList";
import ModalAddCharacteristic from "./modals/ModalAddCharacteristic";
import ModalAddProperty from "./modals/ModalAddProperty";
import ModalAddPropertyAnother from "./modals/ModalAddProporetyAnother";
import ModalAddPropertyClosing from "./modals/ModalAddProporetyClothing";
import ModalAddRank from "./modals/ModalAddRank";
import ModalAddServiceCertificate from "./modals/ModalAddServiceCertificate";
import ModalAddWorkExperience from "./modals/ModalAddWorkExperience";
import ModalSeeProperty from "./modals/ModalSeeProperty";
import NoData from "../NoData";
import { useAppSelector } from "hooks/useStore";
import ModalAdd from "./modals/ModalAddContract";
import ModalEmergencyAdd from "./modals/ModalEmergencyAdd";
import ModalSecondmentsAdd from "./modals/ModalSecondmentsAdd";
import ModalAwardsAdd from "./modals/ModalAwardsAdd";
import ModalPenaltyAdd from "./modals/ModalPenaltyAdd";
import ModalHolidaysAdd from "./modals/ModalHolidaysAdd";
import ModalAttestationAdd from "./modals/ModalAttestationAdd";
import ShowAll from "../common/ShowAll";
import {
    ArmyEquipmentTable,
    AttestationsTable,
    AwardsTable,
    CharacteristicsTable,
    ClothesTable,
    HolidaysTable,
    HospitalTable,
    OtherEquipmentTable,
    PenaltiesTable,
} from "../PersonalData/ShowAllPersonalDataTable";
import SecondmentTable from "./ShowAllService/SecondmentTable";
import { getAwards } from "store/slices/servicesAwardsSlice";
import { getDepartments } from "store/slices/myInfo/services/secondmentsSlice";
import { PERMISSION } from "constants/permission";
import NoSee from "../NoSee";

const { Panel } = Collapse;
const { Text } = Typography;

export default function Services({ searchList, activeAccordions, allOpen, id, type = "employee" }) {
    const dispatch = useDispatch();
    const services_remote = useSelector((state) => state.services.serviceData);
    const services_local = useSelector((state) => state.myInfo.allTabs.services);
    const services_edited = useSelector((state) => state.myInfo.edited.services);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const loading = useSelector((state) => state.services.loading);
    const error = useSelector((state) => state.services.error);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    const army_equipments = services_remote?.equipments?.filter(
        (item) => item.type_of_equipment === "army_equipment",
    );
    const clothing_equipments = services_remote?.equipments?.filter(
        (item) => item.type_of_equipment === "clothing_equipment",
    );
    const other_equipments = services_remote?.equipments?.filter(
        (item) => item.type_of_equipment === "other_equipment",
    );

    const hasRemoteCredentials = services_remote?.service_id_info != null;
    const noRemoteCredentials = services_remote?.service_id_info == null;
    const hasLocalCredentials = Object.keys(services_local?.service_id_info)?.length !== 0;
    const noLocalCredentials = Object.keys(services_local?.service_id_info)?.length === 0;

    const isAddNewRemoteCredentials = hasRemoteCredentials && hasLocalCredentials;
    const isUpdateRemoteCredentials = noRemoteCredentials && noLocalCredentials;

    const isEmptyCredentials = isAddNewRemoteCredentials || isUpdateRemoteCredentials;

    const takesLength = (type) => {
        if (!services_remote[type.remote]) return 0;

        const remoteLength = services_remote[type.remote].length;

        const deleteEditedLength = services_edited[type.other].every((item) => item.delete)
            ? 0
            : services_edited[type.other].length;

        const deleteLocalLength = services_local[type.other].every((item) => item.delete)
            ? 0
            : services_local[type.other].length;

        return remoteLength + deleteEditedLength + deleteLocalLength;
    };

    const [selected, setSelected] = useState("armaments");
    const [hiddenTabs, setHiddenTabs] = useState([]);

    const toggleHiddenTabs = (tab) => {
        setHiddenTabs((prevHiddenTabs) => {
            if (prevHiddenTabs.includes(tab)) {
                return prevHiddenTabs.filter((item) => item !== tab);
            } else {
                return [...prevHiddenTabs, tab];
            }
        });
    };

    const isHidden = (tab) => {
        if (modeRedactor) return true;
        return hiddenTabs.includes(tab);
    };

    function handleChange(event) {
        setSelected(event.target.value);
    }

    useEffect(() => {
        dispatch(getService(id));
        dispatch(getClothingEquipments());
        dispatch(getArmyEquipments());
        dispatch(getOtherEquipments());
        dispatch(getAllAvailable(id));
        dispatch(getMilitaryUnits());
        dispatch(getRanks());
        dispatch(getStaffDivisions());
        dispatch(getUsers());
        dispatch(getBadgeTypes());
        dispatch(getAwards());

        // Secondments
        dispatch(getDepartments());
    }, []);

    const [modalState, setModalState] = useState({
        open: false,
        link: "",
    });

    const [isModalOpenProperty, setIsModalOpenProperty] = useState();

    const showModalProperty = (bool) => {
        setIsModalOpenProperty(bool);
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const genExtra = (name) => (
        <Button
            shape="round"
            size={"small"}
            onClick={(event) => {
                toggleHiddenTabs(name);
                // If you don't want click extra trigger collapse, you can prevent this:
                event.stopPropagation();
            }}
        >
            <IntlMessage id="personal.additional.viewAll" />
        </Button>
    );

    const genExtraProperty = () => (
        <Button
            shape="round"
            size={"small"}
            onClick={(event) => {
                setIsModalOpenProperty(true);
                event.stopPropagation();
            }}
        >
            <IntlMessage id="personal.additional.viewAll" />
        </Button>
    );

    const sum = () => {
        const currentLocale = localStorage.getItem("lan");
        let sumOfYears = 0;
        let sumOfMonths = 0;
        let sumOfDays = 0;

        for (let i = 0; i < services_remote.emergency_contracts?.length; i++) {
            const { days, months, years } =
                services_remote.emergency_contracts[i].length_of_service;
            sumOfYears += years;
            sumOfMonths += months;
            sumOfDays += days;

            if (sumOfDays >= 365) {
                const extraYears = Math.floor(sumOfDays / 365);
                sumOfYears += extraYears;
                sumOfDays %= 365;
            }

            if (sumOfMonths >= 12) {
                const extraYears = Math.floor(sumOfMonths / 12);
                sumOfYears += extraYears;
                sumOfMonths %= 12;
            }

            if (sumOfMonths >= 1 && sumOfDays >= 30) {
                const extraMonths = Math.floor(sumOfDays / 30);
                sumOfMonths += extraMonths;
                sumOfDays %= 30;
            }
        }
        return currentLocale === "kk" ? (
            <>
                <IntlMessage id="personal.services.lengthOfService" />: {sumOfYears} ж.{" "}
                {sumOfMonths} а. {sumOfDays} к.
            </>
        ) : (
            <>
                <IntlMessage id="personal.services.lengthOfService" />: {sumOfYears} л.{" "}
                {sumOfMonths} м. {sumOfDays} д.
            </>
        );
    };

    const sumExperience = () => {
        const currentLocale = localStorage.getItem("lan");
        let sumOfYears = 0;
        let sumOfMonths = 0;
        let sumOfDays = 0;
        const filter = services_remote.experience?.filter(
            (item) => item.length_of_service !== null,
        );

        for (let i = 0; i < filter.length; i++) {
            const { days, months, years } = filter[i].length_of_service;
            sumOfYears += years;
            sumOfMonths += months;
            sumOfDays += days;

            if (sumOfDays >= 365) {
                const extraYears = Math.floor(sumOfDays / 365);
                sumOfYears += extraYears;
                sumOfDays %= 365;
            }

            if (sumOfMonths >= 12) {
                const extraYears = Math.floor(sumOfMonths / 12);
                sumOfYears += extraYears;
                sumOfMonths %= 12;
            }

            if (sumOfMonths >= 1 && sumOfDays >= 30) {
                const extraMonths = Math.floor(sumOfDays / 30);
                sumOfMonths += extraMonths;
                sumOfDays %= 30;
            }
        }
        return currentLocale === "kk" ? (
            <>
                {(sumOfYears !== 0 || sumOfMonths !== 0 || sumOfDays !== 0) && (
                    <>
                        {" "}
                        <IntlMessage id="experience.work.letters" />: {sumOfYears} ж. {sumOfMonths}{" "}
                        а. {sumOfDays} к.
                    </>
                )}
            </>
        ) : (
            <>
                {(sumOfYears !== 0 || sumOfMonths !== 0 || sumOfDays !== 0) && (
                    <>
                        {" "}
                        <IntlMessage id="experience.work.letters" />: {sumOfYears} л. {sumOfMonths}{" "}
                        м. {sumOfDays} д.
                    </>
                )}
            </>
        );
    };

    // const sumYears = () => {
    //     if (
    //         !services_remote.emergency_contracts ||
    //         services_remote.emergency_contracts.length === 0
    //     ) {
    //         return 0;
    //     }
    //     let years = 0;
    //     services_remote.emergency_contracts.map(
    //         (sumYear) => (years = sumYear.length_of_service.years + years),
    //     );
    //     return years;
    // };

    // const sumMonth = () => {
    //     if (
    //         !services_remote.emergency_contracts ||
    //         services_remote.emergency_contracts.length === 0
    //     ) {
    //         return 0;
    //     }
    //     let month = 0;
    //     services_remote.emergency_contracts.map(
    //         (sumMonth) => (month = sumMonth.length_of_service.months + month),
    //     );
    //     return month;
    // };
    // const sumDay = () => {
    //     if (
    //         !services_remote.emergency_contracts ||
    //         services_remote.emergency_contracts.length === 0
    //     ) {
    //         return 0;
    //     }
    //     let day = 0;
    //     services_remote.emergency_contracts.map(
    //         (sumDay) => (day = sumDay.length_of_service.days + day),
    //     );
    //     return day;
    // };

    const takeFullMassive = (type) => {
        if (!services_remote || !services_remote[type.remote]) return [];

        return [
            ...services_remote[type.remote],
            ...services_local[type.other],
            ...services_edited[type.other],
        ];
    };

    const generateCollapse = (data) => {
        const { key, type } = data;

        const types = {
            ranks: {
                title: "personal.services.ranks",
                modalAdd: <ModalAddRank />,
                keyName: "Звания",
                remote: "ranks",
                other: "ranks",
            },
            contracts: {
                title: "personal.services.contracts",
                modalAdd: <ModalAdd />,
                keyName: "Контракты",
                remote: "contracts",
                other: "contracts",
            },
            experience: {
                title: "personal.services.workExperience",
                modalAdd: <ModalAddWorkExperience />,
                keyName: "Опыт работы",
                remote: "experience",
                other: "workExperience",
            },
            emergency_contracts: {
                title: "personal.services.contractService",
                modalAdd: <ModalEmergencyAdd />,
                keyName: "Срочная, служба по контракту",
                remote: "emergency_contracts",
                other: "emergency_contracts",
            },
        };

        const arrayLength = takesLength({
            remote: types[type].remote,
            other: types[type].other,
        });

        const fullMassive = takeFullMassive({
            remote: types[type].remote,
            other: types[type].other,
        });

        const isEmpty = arrayLength > 0;

        const components = {
            ranks: <RolesList ranks={fullMassive} setModalState={setModalState} />,
            contracts: <ContractsList contractsList={fullMassive} setModalState={setModalState} />,
            experience: <JobExperienceList jobsList={fullMassive} setModalState={setModalState} />,
            emergency_contracts: (
                <QuickList quickList={fullMassive} setModalState={setModalState} />
            ),
        };

        return (
            <Collapse
                defaultActiveKey={[key]}
                expandIconPosition={"end"}
                style={{ backgroundColor: "#FFFF" }}
            >
                <Panel
                    header={
                        <>
                            <Row
                                gutter={16}
                                style={{ justifyContent: "space-between", alignItems: "center" }}
                            >
                                <div style={{ display: "flex" }}>
                                    <Col>
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id={`${types[type].title}`} />
                                        </Text>
                                    </Col>
                                    {isHR && (
                                        <ShowOnlyForRedactor
                                            forRedactor={
                                                <Col>
                                                    <ModalController>
                                                        {types[type].modalAdd}
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
                                </div>
                                {(types[type].keyName === "Опыт работы" ||
                                    types[type].keyName === "Срочная, служба по контракту") && (
                                    <Col className="timeline-mute">
                                        {types[type].keyName === "Опыт работы"
                                            ? sumExperience()
                                            : sum()}
                                    </Col>
                                )}
                            </Row>
                        </>
                    }
                    key={findAccordionByName(allOpen, activeAccordions, types[type].keyName, key)}
                >
                    {takesLength({
                        remote: types[type].remote,
                        other: types[type].other,
                    }) > 0 && isEmpty > 0 ? (
                        components[type]
                    ) : (
                        <NoData />
                    )}
                </Panel>
            </Collapse>
        );
    };

    if (!services_remote) return null;

    return (
        <div>
            <Row gutter={[18, 16]}>
                <Col xl={12}>
                    <Row gutter={[18, 16]}>
                        <Col xs={24}>
                            <Collapse
                                defaultActiveKey={["1"]}
                                expandIconPosition={"end"}
                                style={{ backgroundColor: "#FFFF" }}
                            >
                                <Panel
                                    header={
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.services.generalInfo" />
                                        </Text>
                                    }
                                    key={findAccordionByName(
                                        allOpen,
                                        activeAccordions,
                                        "Общие сведения",
                                        "1",
                                    )}
                                >
                                    <BasicList
                                        info={services_remote.general_information}
                                        type={type}
                                        setModalState={setModalState}
                                    />
                                </Panel>
                            </Collapse>
                        </Col>

                        <Col xs={24}>{generateCollapse({ key: "2", type: "ranks" })}</Col>

                        {type === "employee" && (
                            <Col xs={24}>{generateCollapse({ key: "11", type: "contracts" })}</Col>
                        )}

                        {type === "employee" && (
                            <Col xs={24}>
                                {generateCollapse({ key: "2", type: "emergency_contracts" })}
                            </Col>
                        )}

                        <Col xs={24}>{generateCollapse({ key: "2", type: "experience" })}</Col>

                        {type === "employee" && (
                            <Col xs={24}>
                                <Collapse
                                    defaultActiveKey={["14"]}
                                    expandIconPosition={"end"}
                                    style={{ backgroundColor: "#FFFF" }}
                                >
                                    <Panel
                                        header={
                                            <Row gutter={16}>
                                                <Col>
                                                    <Text style={{ fontWeight: 500 }}>
                                                        <IntlMessage id="personal.services.secondment" />
                                                    </Text>
                                                </Col>
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <Col>
                                                                <ModalController>
                                                                    <ModalSecondmentsAdd />
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
                                        extra={
                                            services_remote?.secondments?.length &&
                                            !modeRedactor ? (
                                                <ShowAll intlId={"personal.medicalCard.sickLeave"}>
                                                    <SecondmentTable
                                                        data={services_remote?.secondments}
                                                    />
                                                </ShowAll>
                                            ) : null
                                        }
                                        key={findAccordionByName(
                                            allOpen,
                                            activeAccordions,
                                            "Прикомандирование и откомандирование",
                                            "14",
                                        )}
                                    >
                                        {takesLength({
                                            remote: "secondments",
                                            other: "secondments",
                                        }) > 0 ? (
                                            <>
                                                <CommandList
                                                    secondments={services_remote.secondments}
                                                    setModalState={setModalState}
                                                />
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <>
                                                                <CommandList
                                                                    secondments={
                                                                        services_local.secondments
                                                                    }
                                                                    source="added"
                                                                    setModalState={setModalState}
                                                                />
                                                                <CommandList
                                                                    secondments={
                                                                        services_edited.secondments
                                                                    }
                                                                    source="edited"
                                                                    setModalState={setModalState}
                                                                />
                                                            </>
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
                        )}
                    </Row>
                </Col>

                <Col xl={12}>
                    <Row gutter={[18, 16]}>
                        {type === "employee" && (
                            <Col xs={24}>
                                <Collapse
                                    defaultActiveKey={["3"]}
                                    expandIconPosition={"end"}
                                    style={{ backgroundColor: "#FFFF" }}
                                >
                                    <Panel
                                        header={
                                            <Text style={{ fontWeight: 500 }}>
                                                <IntlMessage id="personal.services.attendance" />
                                            </Text>
                                        }
                                        key={findAccordionByName(
                                            allOpen,
                                            activeAccordions,
                                            "Посещаемость занятий по боевой-специальной подготовке",
                                            "3",
                                        )}
                                    >
                                        <ProgressList attendance={services_remote.attendance} />
                                    </Panel>
                                </Collapse>
                            </Col>
                        )}
                        <Col xs={24}>
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
                                                    <IntlMessage id="personal.services.awards" />
                                                </Text>
                                            </Col>
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <Col>
                                                            <ModalController>
                                                                <ModalAwardsAdd />
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
                                        "Награды и поощрения",
                                        "4",
                                    )}
                                    extra={
                                        services_remote?.badges?.length && !modeRedactor ? (
                                            <ShowAll intlId={"personal.services.awards"}>
                                                <AwardsTable data={services_remote.badges} />
                                            </ShowAll>
                                        ) : null
                                    }
                                    className={"font-style panel-with-hide"}
                                    style={{
                                        color: "#1A3353",
                                    }}
                                >
                                    {takesLength({ remote: "badges", other: "awards" }) > 0 ? (
                                        <>
                                            <AwardsList
                                                setModalState={setModalState}
                                                awards={services_remote.badges}
                                                search={searchList}
                                                source="get"
                                            />
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <div style={{ marginTop: 15 }}>
                                                            <AwardsList
                                                                awards={services_local.awards}
                                                                source="added"
                                                                setModalState={setModalState}
                                                            />
                                                            <AwardsList
                                                                awards={services_edited.awards}
                                                                source="edited"
                                                                setModalState={setModalState}
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
                        {type === "employee" && (
                            <Col xs={24}>
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
                                                        <IntlMessage id="personal.services.penalties" />
                                                    </Text>
                                                </Col>
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <Col>
                                                                <ModalController>
                                                                    <ModalPenaltyAdd />
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
                                            "Взыскания",
                                            "5",
                                        )}
                                        extra={
                                            services_remote?.penalties?.length && !modeRedactor ? (
                                                <ShowAll intlId={"personal.services.penalties"}>
                                                    <PenaltiesTable
                                                        data={services_remote.penalties}
                                                    />
                                                </ShowAll>
                                            ) : null
                                        }
                                    >
                                        {takesLength({ remote: "penalties", other: "penalties" }) >
                                        0 ? (
                                            <>
                                                <PenaltyList
                                                    penalty={services_remote.penalties}
                                                    setModalState={setModalState}
                                                />
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <div style={{ marginTop: 15 }}>
                                                                <PenaltyList
                                                                    penalty={
                                                                        services_local.penalties
                                                                    }
                                                                    source="added"
                                                                    setModalState={setModalState}
                                                                />
                                                                <PenaltyList
                                                                    penalty={
                                                                        services_edited.penalties
                                                                    }
                                                                    source="edited"
                                                                    setModalState={setModalState}
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
                        )}
                        {type === "employee" && (
                            <Col xs={24}>
                                <Collapse
                                    defaultActiveKey={["6"]}
                                    expandIconPosition={"end"}
                                    style={{ backgroundColor: "#FFFF" }}
                                >
                                    <Panel
                                        header={
                                            <Row gutter={16}>
                                                <Col>
                                                    <Text style={{ fontWeight: 500 }}>
                                                        <IntlMessage id="personal.services.certifications" />
                                                    </Text>
                                                </Col>
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <Col>
                                                                <ModalController>
                                                                    <ModalAttestationAdd />
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
                                            "Аттестации",
                                            "6",
                                        )}
                                        extra={
                                            services_remote?.attestations?.length &&
                                            !modeRedactor ? (
                                                <ShowAll
                                                    intlId={"personal.services.certifications"}
                                                >
                                                    <AttestationsTable
                                                        data={services_remote.attestations}
                                                    />
                                                </ShowAll>
                                            ) : null
                                        }
                                    >
                                        {services_remote.attestations === "Permission Denied" ? (
                                            <NoSee />
                                        ) : takesLength({
                                              remote: "attestations",
                                              other: "attestations",
                                          }) > 0 ? (
                                            <>
                                                <AttestationList
                                                    attestations={services_remote.attestations}
                                                    setModalState={setModalState}
                                                />
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <div style={{ marginTop: 15 }}>
                                                                <AttestationList
                                                                    attestations={
                                                                        services_local.attestations
                                                                    }
                                                                    source="added"
                                                                    setModalState={setModalState}
                                                                />
                                                                <AttestationList
                                                                    attestations={
                                                                        services_edited.attestations
                                                                    }
                                                                    source="edited"
                                                                    setModalState={setModalState}
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
                        )}
                        {type === "employee" && (
                            <Col xs={24}>
                                <Collapse
                                    defaultActiveKey={["7"]}
                                    expandIconPosition={"end"}
                                    style={{ backgroundColor: "#FFFF" }}
                                >
                                    <Panel
                                        header={
                                            <Row gutter={16}>
                                                <Col>
                                                    <Text style={{ fontWeight: 500 }}>
                                                        <IntlMessage id="personal.services.characteristic" />
                                                    </Text>
                                                </Col>
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <Col>
                                                                <ModalController>
                                                                    <ModalAddCharacteristic />
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
                                            "Служебные характеристики",
                                            "7",
                                        )}
                                        extra={
                                            services_remote?.characteristics?.length &&
                                            !modeRedactor ? (
                                                <ShowAll
                                                    intlId={"personal.services.characteristic"}
                                                >
                                                    <CharacteristicsTable
                                                        data={services_remote.characteristics}
                                                    />
                                                </ShowAll>
                                            ) : null
                                        }
                                    >
                                        {services_remote.characteristics === "Permission Denied" ? (
                                            <NoSee />
                                        ) : takesLength({
                                              remote: "characteristics",
                                              other: "characteristics",
                                          }) > 0 ? (
                                            <>
                                                <SerCharList
                                                    characteristics={
                                                        services_remote.characteristics
                                                    }
                                                    setModalState={setModalState}
                                                    search={searchList}
                                                />
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <div style={{ marginTop: 15 }}>
                                                                <SerCharList
                                                                    characteristics={
                                                                        services_local.characteristics
                                                                    }
                                                                    source="added"
                                                                    setModalState={setModalState}
                                                                />
                                                                <SerCharList
                                                                    characteristics={
                                                                        services_edited.characteristics
                                                                    }
                                                                    source="edited"
                                                                    setModalState={setModalState}
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
                        )}

                        {type === "employee" && (
                            <Col xs={24}>
                                <Collapse
                                    defaultActiveKey={["8"]}
                                    expandIconPosition={"end"}
                                    style={{ backgroundColor: "#FFFF" }}
                                >
                                    <Panel
                                        header={
                                            <Row gutter={16}>
                                                <Col>
                                                    <Text style={{ fontWeight: 500 }}>
                                                        <IntlMessage id="personal.services.leaveAndFeedback" />
                                                    </Text>
                                                </Col>
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <Col>
                                                                <ModalController>
                                                                    <ModalHolidaysAdd />
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
                                            "Отпуска и отзывы",
                                            "8",
                                        )}
                                        extra={
                                            services_remote?.holidays?.length ? (
                                                <ShowAll
                                                    intlId={"personal.services.leaveAndFeedback"}
                                                >
                                                    <HolidaysTable
                                                        data={services_remote.holidays}
                                                    />
                                                </ShowAll>
                                            ) : null
                                        }
                                    >
                                        {takesLength({
                                            remote: "holidays",
                                            other: "holidays",
                                        }) > 0 ? (
                                            <>
                                                <VacationList
                                                    vacations={services_remote.holidays}
                                                    setModalState={setModalState}
                                                />
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <>
                                                                <VacationList
                                                                    vacations={
                                                                        services_local.holidays
                                                                    }
                                                                    source="added"
                                                                    setModalState={setModalState}
                                                                />
                                                                <VacationList
                                                                    vacations={
                                                                        services_edited.holidays
                                                                    }
                                                                    source="edited"
                                                                    setModalState={setModalState}
                                                                />
                                                            </>
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
                        )}
                        {type === "employee" && (
                            <Col xs={24}>
                                <Collapse
                                    defaultActiveKey={["9"]}
                                    expandIconPosition={"end"}
                                    style={{ backgroundColor: "#FFFF" }}
                                >
                                    <Panel
                                        header={
                                            <Row gutter={16}>
                                                <Col>
                                                    <Text style={{ fontWeight: 500 }}>
                                                        <IntlMessage id="personal.services.credentials" />
                                                    </Text>
                                                </Col>
                                                {isHR && isEmptyCredentials && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <Col>
                                                                <ModalController>
                                                                    <ModalAddServiceCertificate />
                                                                    <PlusCircleOutlined
                                                                        style={{
                                                                            fontSize: "13px",
                                                                            color: "#366EF6",
                                                                        }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setModalState({
                                                                                open: false,
                                                                                link: services_remote
                                                                                    .general_information
                                                                                    .personnel_reserve
                                                                                    .document_link,
                                                                            });
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
                                            "Данные служебного удостоверения",
                                            "9",
                                        )}
                                    >
                                        {!isHR && services_remote.service_id_info !== null ? (
                                            <ServiceId
                                                serviceId={services_remote.service_id_info}
                                                source={"not_edit"}
                                            />
                                        ) : (
                                            isHR &&
                                            (services_remote.service_id_info === null &&
                                            services_local.service_id_info !== null ? (
                                                <ServiceId
                                                    serviceId={services_local.service_id_info}
                                                    source={"local"}
                                                />
                                            ) : (
                                                <ServiceId
                                                    serviceId={services_remote.service_id_info}
                                                    source={"remote"}
                                                />
                                            ))
                                        )}
                                    </Panel>
                                </Collapse>
                            </Col>
                        )}
                        {type === "employee" && (
                            <Col xs={24}>
                                <Collapse
                                    defaultActiveKey={["10"]}
                                    expandIconPosition={"end"}
                                    style={{ backgroundColor: "#FFFF" }}
                                >
                                    <Panel
                                        header={
                                            <Row gutter={16}>
                                                <Col>
                                                    <Text style={{ fontWeight: 500 }}>
                                                        <IntlMessage id="personal.services.property" />
                                                    </Text>
                                                </Col>
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <Col>
                                                                <ModalController>
                                                                    {selected === "armaments" ? (
                                                                        <ModalAddProperty />
                                                                    ) : selected === "duffel" ? (
                                                                        <ModalAddPropertyClosing />
                                                                    ) : selected === "other" ? (
                                                                        <ModalAddPropertyAnother />
                                                                    ) : null}
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
                                            "Имущество",
                                            "10",
                                        )}
                                        extra={
                                            services_remote?.equipments?.length && !modeRedactor ? (
                                                <>
                                                    {selected === "duffel" ? (
                                                        <ShowAll
                                                            intlId={"personal.services.equipment"}
                                                        >
                                                            <ClothesTable
                                                                data={services_remote.equipments}
                                                            />
                                                        </ShowAll>
                                                    ) : selected === "armaments" ? (
                                                        <ShowAll
                                                            intlId={"personal.services.weapons"}
                                                        >
                                                            <ArmyEquipmentTable
                                                                data={services_remote.equipments}
                                                            />
                                                        </ShowAll>
                                                    ) : (
                                                        <ShowAll
                                                            intlId={"personal.services.other"}
                                                            width={500}
                                                        >
                                                            <OtherEquipmentTable
                                                                data={services_remote.equipments}
                                                            />
                                                        </ShowAll>
                                                    )}
                                                </>
                                            ) : null
                                        }
                                    >
                                        <Flex
                                            alignItems="center"
                                            justifyContent="center"
                                            mobileFlex={false}
                                        >
                                            <Radio.Group
                                                defaultValue={selected}
                                                style={{ marginBottom: "15px" }}
                                            >
                                                <Radio.Button
                                                    value="armaments"
                                                    onChange={handleChange}
                                                    className={"font-style"}
                                                >
                                                    <IntlMessage id="personal.services.weapons" />
                                                </Radio.Button>
                                                <Radio.Button
                                                    value="duffel"
                                                    onChange={handleChange}
                                                    className={"font-style"}
                                                >
                                                    <IntlMessage id="personal.services.equipment" />
                                                </Radio.Button>
                                                <Radio.Button
                                                    value="other"
                                                    onChange={handleChange}
                                                    className={"font-style"}
                                                >
                                                    <IntlMessage id="personal.services.other" />
                                                </Radio.Button>
                                            </Radio.Group>
                                        </Flex>
                                        {selected === "armaments" && (
                                            <>
                                                {army_equipments.length +
                                                    services_local.weapons.length +
                                                    services_edited.weapons.length >
                                                0 ? (
                                                    <>
                                                        <PropFirstList
                                                            equipments={army_equipments}
                                                            setModalState={setModalState}
                                                        />
                                                        {isHR && (
                                                            <ShowOnlyForRedactor
                                                                forRedactor={
                                                                    <>
                                                                        <PropFirstList
                                                                            equipments={
                                                                                services_local.weapons
                                                                            }
                                                                            source="added"
                                                                            setModalState={
                                                                                setModalState
                                                                            }
                                                                        />
                                                                        <PropFirstList
                                                                            equipments={
                                                                                services_edited.weapons
                                                                            }
                                                                            source="edited"
                                                                            setModalState={
                                                                                setModalState
                                                                            }
                                                                        />
                                                                    </>
                                                                }
                                                            />
                                                        )}
                                                    </>
                                                ) : (
                                                    <NoData />
                                                )}
                                            </>
                                        )}
                                        {selected === "duffel" && (
                                            <>
                                                {clothing_equipments.length +
                                                    services_local.clothes.length +
                                                    services_edited.clothes.length >
                                                0 ? (
                                                    <>
                                                        <PropSecondList
                                                            equipments={clothing_equipments}
                                                            setModalState={setModalState}
                                                            percent={
                                                                services_remote.equipments[
                                                                    services_remote.equipments
                                                                        .length - 1
                                                                ]
                                                            }
                                                        />
                                                        {isHR && (
                                                            <ShowOnlyForRedactor
                                                                forRedactor={
                                                                    <>
                                                                        <PropSecondList
                                                                            equipments={
                                                                                services_local.clothes
                                                                            }
                                                                            source="added"
                                                                            setModalState={
                                                                                setModalState
                                                                            }
                                                                            percent={
                                                                                services_remote
                                                                                    .equipments[
                                                                                    services_remote
                                                                                        .equipments
                                                                                        .length - 1
                                                                                ]
                                                                            }
                                                                        />
                                                                        <PropSecondList
                                                                            equipments={
                                                                                services_edited.clothes
                                                                            }
                                                                            source="edited"
                                                                            setModalState={
                                                                                setModalState
                                                                            }
                                                                            percent={
                                                                                services_remote
                                                                                    .equipments[
                                                                                    services_remote
                                                                                        .equipments
                                                                                        .length - 1
                                                                                ]
                                                                            }
                                                                        />
                                                                    </>
                                                                }
                                                            />
                                                        )}
                                                    </>
                                                ) : (
                                                    <NoData />
                                                )}
                                            </>
                                        )}
                                        {selected === "other" && (
                                            <>
                                                {other_equipments.length +
                                                    services_local.others.length +
                                                    services_edited.others.length >
                                                0 ? (
                                                    <>
                                                        <PropThirdList
                                                            equipments={other_equipments}
                                                            setModalState={setModalState}
                                                        />
                                                        {isHR && (
                                                            <ShowOnlyForRedactor
                                                                forRedactor={
                                                                    <>
                                                                        <PropThirdList
                                                                            equipments={
                                                                                services_local.others
                                                                            }
                                                                            source="added"
                                                                            setModalState={
                                                                                setModalState
                                                                            }
                                                                        />
                                                                        <PropThirdList
                                                                            equipments={
                                                                                services_edited.others
                                                                            }
                                                                            source="edited"
                                                                            setModalState={
                                                                                setModalState
                                                                            }
                                                                        />
                                                                    </>
                                                                }
                                                            />
                                                        )}
                                                    </>
                                                ) : (
                                                    <NoData />
                                                )}
                                            </>
                                        )}
                                    </Panel>
                                </Collapse>
                            </Col>
                        )}
                        {type === "candidate" && (
                            <Col xs={24}>
                                <Collapse
                                    defaultActiveKey={["2"]}
                                    expandIconPosition={"end"}
                                    style={{ backgroundColor: "#FFFF" }}
                                >
                                    <Panel
                                        header={
                                            <span>
                                                {type === "employee" && (
                                                    <Row>
                                                        <Col xs={24} lg={12}>
                                                            <p className={"font-style text-muted"}>
                                                                <Text style={{ fontWeight: 500 }}>
                                                                    <IntlMessage id="personal.services.contractService" />
                                                                </Text>
                                                            </p>
                                                        </Col>
                                                        {services_remote?.general_information
                                                            ?.personnel_reserve?.document_link ===
                                                            null ||
                                                        services_remote?.general_information
                                                            ?.personnel_reserve?.document_link ===
                                                            undefined ? null : (
                                                            <Col xs={2} lg={1}>
                                                                <FileTextTwoTone
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setModalState({
                                                                            open: false,
                                                                            link: services_remote
                                                                                .general_information
                                                                                .personnel_reserve
                                                                                .document_link,
                                                                        });
                                                                    }}
                                                                    style={{ fontSize: "16px" }}
                                                                />
                                                            </Col>
                                                        )}
                                                        {services_remote?.general_information
                                                            ?.personnel_reserve?.document_link ===
                                                            null ||
                                                        services_remote?.general_information
                                                            ?.personnel_reserve?.document_link ===
                                                            undefined ? null : (
                                                            <Col xs={4} lg={5}>
                                                                <FileTextTwoTone
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setModalState({
                                                                            open: false,
                                                                            link: services_remote
                                                                                .general_information
                                                                                .personnel_reserve
                                                                                .document_link,
                                                                        });
                                                                    }}
                                                                    style={{ fontSize: "16px" }}
                                                                />
                                                            </Col>
                                                        )}
                                                        <Col xs={18} lg={6}>
                                                            <p
                                                                className="timeline-mute"
                                                                style={{ marginTop: "7px" }}
                                                            >
                                                                <IntlMessage id="personal.services.lengthOfService" />
                                                                : л. м. д.
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                )}
                                                {type === "candidate" && (
                                                    <>
                                                        <Row gutter={16}>
                                                            <Col>
                                                                <Text style={{ fontWeight: 500 }}>
                                                                    <IntlMessage id="personal.services.contractService" />
                                                                </Text>
                                                            </Col>
                                                            {isHR && (
                                                                <ShowOnlyForRedactor
                                                                    forRedactor={
                                                                        <Col>
                                                                            <ModalController>
                                                                                <ModalEmergencyAdd />
                                                                                <PlusCircleOutlined
                                                                                    style={{
                                                                                        fontSize:
                                                                                            "13px",
                                                                                        color: "#366EF6",
                                                                                    }}
                                                                                />
                                                                            </ModalController>
                                                                        </Col>
                                                                    }
                                                                />
                                                            )}
                                                        </Row>
                                                        <p
                                                            className="timeline-mute"
                                                            style={{ marginTop: "7px" }}
                                                        >
                                                            <IntlMessage id="personal.services.lengthOfService" />
                                                            : л. м. д.
                                                        </p>
                                                    </>
                                                )}
                                            </span>
                                        }
                                        key={findAccordionByName(
                                            allOpen,
                                            activeAccordions,
                                            "Срочная, служба по контракту",
                                            "2",
                                        )}
                                    >
                                        {takesLength({
                                            remote: "emergency_contracts",
                                            other: "emergency_contracts",
                                        }) > 0 ? (
                                            <>
                                                <QuickList
                                                    quickList={services_remote.emergency_contracts}
                                                    setModalState={setModalState}
                                                />
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <>
                                                                <QuickList
                                                                    quickList={
                                                                        services_local.emergency_contracts
                                                                    }
                                                                    source="added"
                                                                    setModalState={setModalState}
                                                                />
                                                                <QuickList
                                                                    quickList={
                                                                        services_edited.emergency_contracts
                                                                    }
                                                                    source="edited"
                                                                    setModalState={setModalState}
                                                                />
                                                            </>
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
                        )}
                    </Row>
                </Col>
            </Row>
            {/* CHANGE MODAL FOR FILE*/}
            <ModalForDoc setModalState={setModalState} modalState={modalState} />
            <ModalSeeProperty
                modalCase={{ showModalProperty }}
                openModal={isModalOpenProperty}
                dataSource={services_remote}
                setModalState={setModalState}
            />
        </div>
    );
}
