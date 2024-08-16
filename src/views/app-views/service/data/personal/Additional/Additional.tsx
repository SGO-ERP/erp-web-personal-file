import React, { useEffect, useState } from "react";

import { PlusCircleOutlined } from "@ant-design/icons";

import { Button, ButtonProps, Col, Collapse, Row, Typography } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import {
    getAdditional,
    getPolygraph,
    getPsychologicalCheck,
} from "../../../../../../store/slices/myInfo/additionalSlice";
import ModalForDoc from "../../modals/ModalForDoc";
import ModalRealty from "../../modals/ModalRealty";
import ModelTransport from "../../modals/ModelTransport";
import ModalController from "../common/ModalController";
import ShowOnlyForRedactor from "../common/ShowOnlyForRedactor";
import Spinner from "../common/Spinner";
import findAccordionByName from "../common/findAccordionByName";
import ModalAddPsycho from "./modals/ModalAddPsycho";
import ModalAddResultsPolyg from "./modals/ModalAddResultsPolyg";
import ModalTransport from "./modals/ModalTransport";
import NoData from "../NoData";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/useStore";
import ModalAddViolation from "./modals/ModalAddViolation";
import ModalAddAbroadTravel from "./modals/ModalAddAbroadTravel";
import ModalAddSpecialCheck from "./modals/ModalAddSpecialCheck";
import { RealEstateAddModal } from "./components/modals-add/RealEstateAddModal";
import ModalAddServiceHousing from "./modals/ModalAddServiceHousing";
import { components } from "API/types";
import { OffensesList } from "./components/lists/OffensesList";
import { OffensesModal } from "./components/modals-details/OffensesModal";
import { RealEstatesList } from "./components/lists/RealEstatesList";
import { TransportsList } from "./components/lists/TransportsList";
import { ServiceHousingsList } from "./components/lists/ServiceHousingsList";
import { AbroadTripsList } from "./components/lists/AbroadTripsList";
import { SpecialInspectionsList } from "./components/lists/SpecialInspectionsList";
import { PsychoCharsList } from "./components/lists/PsychoCharsList";
import { PolygraphResultsList } from "./components/lists/PolygraphResultsList";
import { AbroadTripsDetailsModal } from "./components/modals-details/AbroadTripsModal";
import { PolygraphResultsModal } from "./components/modals-details/PolygraphResultsModal";
import { PsychoCharsModal } from "./components/modals-details/PsychoCharsModal";
import { SpecialInspectionsModal } from "./components/modals-details/SpecialInspectionsModal";
import { ServiceHousingsModal } from "./components/modals-details/ServiceHousingsModal";
import ShowAll from "../common/ShowAll";
import {
    AbroadTravelsTable,
    PolygraphResultsTable,
    PsychologicalChecksTable,
    ServiceHousingTable,
    SpecialCheckTable,
    ViolationsTable,
} from "../PersonalData/ShowAllPersonalDataTable";
import { PERMISSION } from "constants/permission";
import NoSee from "../NoSee";

const { Panel } = Collapse;
const { Text } = Typography;

type AdditionalProps = {
    searchList: string;
    id: string;
    activeAccordions: string[];
    allOpen: boolean;
    type: "employee" | "candidate";
};

type AdditionalData = components["schemas"]["AdditionalProfileRead"];

const Additional = (props: AdditionalProps) => {
    const { id, activeAccordions, allOpen, type = "employee" } = props;

    const dispatch = useAppDispatch();

    const additionalDataRemote = useAppSelector(
        (state) => state.additional.additional.data,
    ) as AdditionalData;
    const additionalDataLocal = useAppSelector((state) => state.myInfo.allTabs.additional);
    const editedData = useAppSelector((state) => state.myInfo.edited.additional);
    const modeRedactor = useAppSelector((state) => state.myInfo.modeRedactor);

    const error = useAppSelector((state) => state.additional.additional.error);
    const loading = useAppSelector((state) => state.additional.additional.loading);

    const isEditorMode = useAppSelector((state) => state.myInfo.modeRedactor);

    const myPermissions = useAppSelector((state) => state.profile.permissions);

    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const canEditPolygraphResults = myPermissions?.includes(PERMISSION.POLIGRAPH_EDITOR);
    const canEditPsychoChar = myPermissions?.includes(PERMISSION.PSYCH_CHARACTERISTIC_EDITOR);

    const [modalState, setModalState] = useState({
        open: false,
        link: "",
    });

    const [isOffensesModalOpen, setIsOffensesModalOpen] = useState(false);
    const [isRealEstateModalOpen, setIsRealEstateModalOpen] = useState(false);
    const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
    const [isServiceHousingModalOpen, setIsServiceHousingModalOpen] = useState(false);
    const [isAbroadTripsModalOpen, setAbroadTripsModalOpen] = useState(false);
    const [isSpecialInspectionModalOpen, setIsSpecialInspectionModalOpen] = useState(false);
    const [isPsychoCharModalOpen, setIsPsychoCharModalOpen] = useState(false);
    const [isPolygraphResultsModalOpen, setIsPolygraphResultsModalOpen] = useState(false);

    const closeOffensesModal = () => setIsOffensesModalOpen(false);
    const closeRealEstateModal = () => setIsRealEstateModalOpen(false);
    const closeTransportModal = () => setIsTransportModalOpen(false);
    const closeServiceHousingModal = () => setIsServiceHousingModalOpen(false);
    const closeAbroadTripsModal = () => setAbroadTripsModalOpen(false);
    const closeSpecialInspectionModal = () => setIsSpecialInspectionModalOpen(false);
    const closePsychoCharModal = () => setIsPsychoCharModalOpen(false);
    const closePolygraphResultsModal = () => setIsPolygraphResultsModalOpen(false);

    const openOffensesModal = () => setIsOffensesModalOpen(true);
    const openRealEstateModal = () => setIsRealEstateModalOpen(true);
    const openTransportModal = () => setIsTransportModalOpen(true);
    const openServiceHousingModal = () => setIsServiceHousingModalOpen(true);
    const openAbroadTripsModal = () => setAbroadTripsModalOpen(true);
    const openSpecialInspectionModal = () => setIsSpecialInspectionModalOpen(true);
    const openPsychoCharModal = () => setIsPsychoCharModalOpen(true);
    const openPolygraphResultsModal = () => setIsPolygraphResultsModalOpen(true);

    const offensesExtra = () => {
        return (
            <AccordionExtraButton
                onClick={(evt) => {
                    evt.stopPropagation();

                    openOffensesModal();
                }}
            >
                <IntlMessage id="personal.additional.viewAll" />
            </AccordionExtraButton>
        );
    };

    const realEstateExtra = () => {
        return (
            <AccordionExtraButton
                onClick={(evt) => {
                    evt.stopPropagation();

                    openRealEstateModal();
                }}
            >
                <IntlMessage id="personal.additional.viewAll" />
            </AccordionExtraButton>
        );
    };

    const transportExtra = () => {
        return (
            <AccordionExtraButton
                onClick={(evt) => {
                    evt.stopPropagation();

                    openTransportModal();
                }}
            >
                <IntlMessage id="personal.additional.viewAll" />
            </AccordionExtraButton>
        );
    };

    const serviceHousingExtra = () => {
        return (
            <AccordionExtraButton
                onClick={(evt) => {
                    evt.stopPropagation();

                    openServiceHousingModal();
                }}
            >
                <IntlMessage id="personal.additional.viewAll" />
            </AccordionExtraButton>
        );
    };

    const tripsAbroadExtra = () => {
        return (
            <AccordionExtraButton
                onClick={(evt) => {
                    evt.stopPropagation();

                    openAbroadTripsModal();
                }}
            >
                <IntlMessage id="personal.additional.viewAll" />
            </AccordionExtraButton>
        );
    };

    const specialInspectionExtra = () => {
        return (
            <AccordionExtraButton
                onClick={(evt) => {
                    evt.stopPropagation();

                    openSpecialInspectionModal();
                }}
            >
                <IntlMessage id="personal.additional.viewAll" />
            </AccordionExtraButton>
        );
    };

    const psychoCharExtra = () => {
        return (
            <AccordionExtraButton
                onClick={(evt) => {
                    evt.stopPropagation();

                    openPsychoCharModal();
                }}
            >
                <IntlMessage id="personal.additional.viewAll" />
            </AccordionExtraButton>
        );
    };

    const polygraphResultsExtra = () => {
        return (
            <AccordionExtraButton
                onClick={(evt) => {
                    evt.stopPropagation();

                    openPolygraphResultsModal();
                }}
            >
                <IntlMessage id="personal.additional.viewAll" />
            </AccordionExtraButton>
        );
    };

    useEffect(() => {
        dispatch(getAdditional(id));
        dispatch(getPolygraph());
        dispatch(getPsychologicalCheck());
    }, [dispatch, id]);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Row gutter={[16, 16]}>
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
                                        <Row gutter={16}>
                                            <Col className="font-style">
                                                <Text style={{ fontWeight: 500 }}>
                                                    <IntlMessage id="personal.additional.offenses" />
                                                </Text>
                                            </Col>
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <Col>
                                                            <ModalController>
                                                                <ModalAddViolation />
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
                                        "Правонарушения",
                                        "1",
                                    )}
                                    style={{ color: "#1A3353" }}
                                    extra={
                                        additionalDataRemote?.violations?.length &&
                                        !modeRedactor ? (
                                            <ShowAll
                                                intlId={"personal.additional.offenses"}
                                                width={800}
                                            >
                                                <ViolationsTable
                                                    data={additionalDataRemote?.violations}
                                                />
                                            </ShowAll>
                                        ) : null
                                    }
                                >
                                    {additionalDataRemote.violations !== undefined &&
                                    additionalDataRemote?.violations?.length +
                                        additionalDataLocal?.violations?.length +
                                        editedData?.violations?.filter((item: any) => !item.delete)
                                            ?.length >
                                        0 ? (
                                        !isEditorMode ? (
                                            <OffensesList
                                                offenses={
                                                    [...additionalDataRemote.violations].sort(
                                                        (a, b) => {
                                                            const dateA = new Date(
                                                                a.date,
                                                            ).getTime();
                                                            const dateB = new Date(
                                                                b.date,
                                                            ).getTime();

                                                            return dateB - dateA;
                                                        },
                                                    )
                                                    // .slice(0, 3)
                                                }
                                                setModalState={setModalState}
                                            />
                                        ) : (
                                            <>
                                                <OffensesList
                                                    offenses={additionalDataLocal.violations}
                                                    source="added"
                                                    setModalState={setModalState}
                                                />
                                                <OffensesList
                                                    offenses={editedData.violations}
                                                    source="edited"
                                                    setModalState={setModalState}
                                                />
                                                <OffensesList
                                                    offenses={[
                                                        ...additionalDataRemote.violations,
                                                    ].sort((a, b) => {
                                                        const dateA = new Date(a.date).getTime();
                                                        const dateB = new Date(b.date).getTime();

                                                        return dateB - dateA;
                                                    })}
                                                    setModalState={setModalState}
                                                />
                                            </>
                                        )
                                    ) : (
                                        <NoData />
                                    )}
                                </Panel>
                            </Collapse>
                        </Col>

                        <Col xs={24}>
                            <Collapse
                                defaultActiveKey={["2"]}
                                expandIconPosition={"end"}
                                style={{ backgroundColor: "#FFFF" }}
                            >
                                <Panel
                                    header={
                                        <Row gutter={16}>
                                            <Col>
                                                <Text style={{ fontWeight: 500 }}>
                                                    <IntlMessage id="personal.additional.property" />
                                                </Text>
                                            </Col>
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <Col>
                                                            <ModalController>
                                                                <RealEstateAddModal />
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
                                        "Наличие недвижимости",
                                        "2",
                                    )}
                                    style={{ color: "#1A3353" }}
                                    extra={!isEditorMode && realEstateExtra()}
                                    className="font-style"
                                >
                                    {additionalDataRemote.properties !== undefined &&
                                    additionalDataRemote.properties?.length +
                                        additionalDataLocal.properties?.length +
                                        editedData.properties.filter((item) => !item.delete)
                                            ?.length >
                                        0 ? (
                                        !isEditorMode ? (
                                            <RealEstatesList
                                                realEstates={
                                                    [...additionalDataRemote.properties].sort(
                                                        (a, b) => {
                                                            const dateA = new Date(
                                                                a.purchase_date,
                                                            ).getTime();
                                                            const dateB = new Date(
                                                                b.purchase_date,
                                                            ).getTime();

                                                            return dateB - dateA;
                                                        },
                                                    )
                                                    // .slice(0, 3)
                                                }
                                                setModalState={setModalState}
                                            />
                                        ) : (
                                            <>
                                                <RealEstatesList
                                                    realEstates={additionalDataLocal.properties}
                                                    source="added"
                                                    setModalState={setModalState}
                                                />
                                                <RealEstatesList
                                                    realEstates={editedData.properties}
                                                    source="edited"
                                                    setModalState={setModalState}
                                                />
                                                <RealEstatesList
                                                    realEstates={[
                                                        ...additionalDataRemote.properties,
                                                    ].sort((a, b) => {
                                                        const dateA = new Date(
                                                            a.purchase_date,
                                                        ).getTime();
                                                        const dateB = new Date(
                                                            b.purchase_date,
                                                        ).getTime();

                                                        return dateB - dateA;
                                                    })}
                                                    setModalState={setModalState}
                                                />
                                            </>
                                        )
                                    ) : (
                                        <NoData />
                                    )}
                                </Panel>
                            </Collapse>
                        </Col>

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
                                                    <IntlMessage id="personal.additional.vehicles" />
                                                </Text>
                                            </Col>
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <Col>
                                                            <ModalController>
                                                                <ModalTransport />
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
                                        "Наличие транспорта",
                                        "8",
                                    )}
                                    extra={!isEditorMode && transportExtra()}
                                    className={"panel-with-hide"}
                                >
                                    {additionalDataRemote.user_vehicles !== undefined &&
                                    additionalDataRemote.user_vehicles?.length +
                                        additionalDataLocal.transport?.length +
                                        editedData.transport.filter((item) => !item.delete)
                                            ?.length >
                                        0 ? (
                                        !isEditorMode ? (
                                            <TransportsList
                                                transports={
                                                    [...additionalDataRemote.user_vehicles].sort(
                                                        (a, b) => {
                                                            const dateA = new Date(
                                                                a.date_from,
                                                            ).getTime();
                                                            const dateB = new Date(
                                                                b.date_from,
                                                            ).getTime();

                                                            return dateB - dateA;
                                                        },
                                                    )
                                                    // .slice(0, 3)
                                                }
                                                setModalState={setModalState}
                                            />
                                        ) : (
                                            <>
                                                <TransportsList
                                                    transports={additionalDataLocal.transport}
                                                    source="added"
                                                    setModalState={setModalState}
                                                />
                                                <TransportsList
                                                    transports={editedData.transport}
                                                    source="edited"
                                                    setModalState={setModalState}
                                                />
                                                <TransportsList
                                                    transports={[
                                                        ...additionalDataRemote.user_vehicles,
                                                    ].sort((a, b) => {
                                                        const dateA = new Date(
                                                            a.date_from,
                                                        ).getTime();
                                                        const dateB = new Date(
                                                            b.date_from,
                                                        ).getTime();

                                                        return dateB - dateA;
                                                    })}
                                                    setModalState={setModalState}
                                                />
                                            </>
                                        )
                                    ) : (
                                        <NoData />
                                    )}
                                </Panel>
                            </Collapse>
                        </Col>

                        {type === "employee" && (
                            <Col xs={24}>
                                <Collapse
                                    defaultActiveKey={["3"]}
                                    expandIconPosition={"end"}
                                    style={{ backgroundColor: "#FFFF" }}
                                >
                                    <Panel
                                        header={
                                            <Row gutter={16}>
                                                <Col className="font-style">
                                                    <Text style={{ fontWeight: 500 }}>
                                                        <IntlMessage id="personal.additional.serviceHousing" />
                                                    </Text>
                                                </Col>
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <Col>
                                                                <ModalController>
                                                                    <ModalAddServiceHousing />
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
                                            "Служебное жилье",
                                            "3",
                                        )}
                                        extra={
                                            additionalDataRemote?.service_housing?.length &&
                                            !isEditorMode ? (
                                                <ShowAll
                                                    intlId={"personal.additional.serviceHousing"}
                                                    width={560}
                                                >
                                                    <ServiceHousingTable
                                                        data={additionalDataRemote?.service_housing}
                                                    />
                                                </ShowAll>
                                            ) : null
                                        }
                                        style={{ color: "#1A3353" }}
                                    >
                                        {additionalDataRemote.service_housing !== undefined &&
                                        additionalDataRemote.service_housing?.length +
                                            additionalDataLocal.service_housing?.length +
                                            editedData.service_housing.filter(
                                                (item) => !item.delete,
                                            )?.length >
                                            0 ? (
                                            <>
                                                <ServiceHousingsList
                                                    setModalState={setModalState}
                                                    serviceHousings={
                                                        additionalDataRemote.service_housing
                                                    }
                                                    source="get"
                                                />
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <div style={{ marginTop: 15 }}>
                                                                <ServiceHousingsList
                                                                    serviceHousings={
                                                                        additionalDataLocal.service_housing
                                                                    }
                                                                    source="added"
                                                                    setModalState={setModalState}
                                                                />
                                                                <ServiceHousingsList
                                                                    serviceHousings={
                                                                        editedData.service_housing
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
                    </Row>
                </Col>

                <Col xl={12}>
                    <Row gutter={[18, 16]}>
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
                                                    <IntlMessage id="personal.additional.overseasTravel" />
                                                </Text>
                                            </Col>
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <Col>
                                                            <ModalController>
                                                                <ModalAddAbroadTravel />
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
                                        "Выезды за границу",
                                        "4",
                                    )}
                                    style={{ color: "#1A3353" }}
                                    extra={
                                        additionalDataRemote?.abroad_travels?.length &&
                                        !isEditorMode ? (
                                            <ShowAll intlId={"personal.additional.overseasTravel"}>
                                                <AbroadTravelsTable
                                                    data={additionalDataRemote?.abroad_travels}
                                                />
                                            </ShowAll>
                                        ) : null
                                    }
                                    className="font-style"
                                >
                                    {additionalDataRemote.abroad_travels !== undefined &&
                                    additionalDataRemote?.abroad_travels?.length +
                                        additionalDataLocal?.abroad_travels?.length +
                                        editedData?.abroad_travels?.filter((item) => !item.delete)
                                            ?.length >
                                        0 ? (
                                        <>
                                            <AbroadTripsList
                                                setModalState={setModalState}
                                                abroadTrips={additionalDataRemote.abroad_travels}
                                                source="get"
                                            />
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <div style={{ marginTop: 15 }}>
                                                            <AbroadTripsList
                                                                abroadTrips={
                                                                    additionalDataLocal.abroad_travels
                                                                }
                                                                source="added"
                                                                setModalState={setModalState}
                                                            />
                                                            <AbroadTripsList
                                                                abroadTrips={
                                                                    editedData.abroad_travels
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
                                                    <IntlMessage id="personal.additional.specialCheck" />
                                                </Text>
                                            </Col>
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <Col>
                                                            <ModalController>
                                                                <ModalAddSpecialCheck />
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
                                        "Спецпроверка",
                                        "5",
                                    )}
                                    style={{ color: "#1A3353" }}
                                    extra={
                                        additionalDataRemote?.special_checks?.length &&
                                        !isEditorMode ? (
                                            <ShowAll
                                                intlId={"personal.additional.specialCheck"}
                                                width={550}
                                            >
                                                <SpecialCheckTable
                                                    data={additionalDataRemote?.special_checks}
                                                />
                                            </ShowAll>
                                        ) : null
                                    }
                                    className="font-style"
                                >
                                    {additionalDataRemote.special_checks === "Permission Denied" ? (
                                        <NoSee />
                                    ) : additionalDataRemote.special_checks !== undefined &&
                                      additionalDataRemote?.special_checks?.length +
                                          additionalDataLocal?.special_checks?.length +
                                          editedData?.special_checks?.filter((item) => !item.delete)
                                              ?.length >
                                          0 ? (
                                        <>
                                            <SpecialInspectionsList
                                                setModalState={setModalState}
                                                specialInspections={
                                                    additionalDataRemote.special_checks
                                                }
                                                source="get"
                                            />
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <div style={{ marginTop: 15 }}>
                                                            <SpecialInspectionsList
                                                                specialInspections={
                                                                    additionalDataLocal.special_checks
                                                                }
                                                                source="added"
                                                                setModalState={setModalState}
                                                            />
                                                            <SpecialInspectionsList
                                                                specialInspections={
                                                                    editedData.special_checks
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
                                                    <IntlMessage id="personal.additional.psychological" />
                                                </Text>
                                            </Col>
                                            {canEditPsychoChar && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <Col>
                                                            <ModalController>
                                                                <ModalAddPsycho />
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
                                        "Психологическая характеристика",
                                        "6",
                                    )}
                                    extra={
                                        additionalDataRemote?.psychological_checks?.length &&
                                        !isEditorMode ? (
                                            <ShowAll
                                                intlId={"personal.additional.psychological"}
                                                width={550}
                                            >
                                                <PsychologicalChecksTable
                                                    data={
                                                        additionalDataRemote?.psychological_checks
                                                    }
                                                />
                                            </ShowAll>
                                        ) : null
                                    }
                                    className="font-style panel-with-hide"
                                    style={{
                                        color: "#1A3353",
                                    }}
                                >
                                    {additionalDataRemote.psychological_checks ===
                                    "Permission Denied" ? (
                                        <NoSee />
                                    ) : additionalDataRemote.psychological_checks !== undefined &&
                                      additionalDataRemote.psychological_checks?.length +
                                          additionalDataLocal.psychological_checks?.length +
                                          editedData.psychological_checks.filter(
                                              (item) => !item.delete,
                                          )?.length >
                                          0 ? (
                                        <>
                                            <PsychoCharsList
                                                setModalState={setModalState}
                                                psychoChars={
                                                    additionalDataRemote.psychological_checks
                                                }
                                                source="get"
                                            />
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <div style={{ marginTop: 15 }}>
                                                            <PsychoCharsList
                                                                psychoChars={
                                                                    additionalDataLocal.psychological_checks
                                                                }
                                                                source="added"
                                                                setModalState={setModalState}
                                                            />
                                                            <PsychoCharsList
                                                                psychoChars={
                                                                    editedData.psychological_checks
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
                                                    <IntlMessage id="personal.additional.polygraphResults" />
                                                </Text>
                                            </Col>
                                            {canEditPolygraphResults && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <Col>
                                                            <ModalController>
                                                                <ModalAddResultsPolyg />
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
                                        "Результаты полиграфаф",
                                        "7",
                                    )}
                                    extra={
                                        additionalDataRemote?.polygraph_checks?.length &&
                                        !isEditorMode ? (
                                            <ShowAll
                                                intlId={"personal.additional.polygraphResults"}
                                                width={550}
                                            >
                                                <PolygraphResultsTable
                                                    data={additionalDataRemote?.polygraph_checks}
                                                />
                                            </ShowAll>
                                        ) : null
                                    }
                                    className={"font-style panel-with-hide"}
                                    style={{
                                        color: "#1A3353",
                                    }}
                                >
                                    {additionalDataRemote.polygraph_checks ===
                                    "Permission Denied" ? (
                                        <NoSee />
                                    ) : additionalDataRemote.polygraph_checks !== undefined &&
                                      additionalDataRemote?.polygraph_checks?.length +
                                          additionalDataLocal?.polygraph_checks?.length +
                                          editedData?.polygraph_checks?.filter(
                                              (item) => !item.delete,
                                          )?.length >
                                          0 ? (
                                        <>
                                            <PolygraphResultsList
                                                setModalState={setModalState}
                                                polygraphResults={
                                                    additionalDataRemote.polygraph_checks
                                                }
                                                source="get"
                                            />
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <div style={{ marginTop: 15 }}>
                                                            <PolygraphResultsList
                                                                polygraphResults={
                                                                    additionalDataLocal.polygraph_checks
                                                                }
                                                                source="added"
                                                                setModalState={setModalState}
                                                            />
                                                            <PolygraphResultsList
                                                                polygraphResults={
                                                                    editedData.polygraph_checks
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
                    </Row>
                </Col>
            </Row>

            <AbroadTripsDetailsModal
                abroadTrips={[
                    ...(additionalDataRemote.abroad_travels || []),
                    ...additionalDataLocal.abroad_travels,
                    ...editedData.abroad_travels,
                ]}
                isOpen={isAbroadTripsModalOpen}
                onClose={closeAbroadTripsModal}
            />

            <PolygraphResultsModal
                polygraphResults={[
                    ...(additionalDataRemote.polygraph_checks || []),
                    ...additionalDataLocal.polygraph_checks,
                    ...editedData.polygraph_checks,
                ]}
                isOpen={isPolygraphResultsModalOpen}
                onClose={closePolygraphResultsModal}
            />

            <PsychoCharsModal
                PsychoChars={[
                    ...(additionalDataRemote.psychological_checks || []),
                    ...additionalDataLocal.psychological_checks,
                    ...editedData.psychological_checks,
                ]}
                isOpen={isPsychoCharModalOpen}
                onClose={closePsychoCharModal}
            />

            <SpecialInspectionsModal
                isOpen={isSpecialInspectionModalOpen}
                onClose={closeSpecialInspectionModal}
                specialInspections={[
                    ...(additionalDataRemote.special_checks || []),
                    ...additionalDataLocal.special_checks,
                    ...editedData.special_checks,
                ]}
            />

            <ServiceHousingsModal
                isOpen={isServiceHousingModalOpen}
                onClose={closeServiceHousingModal}
                serviceHousings={[
                    ...(additionalDataRemote.service_housing || []),
                    ...additionalDataLocal.service_housing,
                    ...editedData.service_housing,
                ]}
            />

            <ModelTransport
                openModal={isTransportModalOpen}
                modalCase={{ openTransportModal }}
                data={additionalDataRemote.user_vehicles}
                onClose={closeTransportModal}
            />
            <ModalRealty
                openModal={isRealEstateModalOpen}
                modalCase={{ openRealEstateModal }}
                data={additionalDataRemote.properties}
                onClose={closeRealEstateModal}
            />
            {/* <ModalOffenceAbroad
                isOpen={false}
                onClose={() => {
                    console.log();
                }}
            /> */}
            {/* <ModalOfUserAbroad
                isOpen={true}
                onClose={() => {
                    setOpenAllAbroad(false);
                }}
            /> */}
            <OffensesModal
                isOpen={isOffensesModalOpen}
                offenses={[
                    ...(additionalDataRemote.violations ?? []),
                    ...additionalDataLocal.violations,
                    ...editedData.violations,
                ].sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();

                    return dateB - dateA;
                })}
                onClose={closeOffensesModal}
            />
            <ModalForDoc setModalState={setModalState} modalState={modalState} />
        </div>
    );
};

const AccordionExtraButton = (props: ButtonProps) => {
    return (
        <Button shape="round" size="small" {...props}>
            <IntlMessage id="personal.additional.viewAll" />
        </Button>
    );
};

export default Additional;
