import { Col, Row, Tag } from "antd";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import moment from "moment";
import CollapseErrorBoundary from "../common/CollapseErrorBoundary";
import NoData from "../NoData";
import ModalEditServiceCertificate from "./modals/ModalEditServiceCertificate";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../../../../../hooks/useStore";
import { PERMISSION } from "constants/permission";

const Tab = ({ status }) => {
    if (status === "Получен" || status === "Алынды")
        return (
            <Tag
                icon={<CheckCircleOutlined />}
                color="#F6FFED"
                style={{
                    fontSize: "12px",
                    borderColor: "#B7EB8F",
                    color: "#52C41A",
                    borderRadius: "15px",
                }}
                className={"font-style"}
            >
                {status}
            </Tag>
        );
    if (status === "Не получен" || status === "Алынған жоқ")
        return (
            <Tag
                icon={<SyncOutlined />}
                color="#3E79F71A "
                style={{
                    fontSize: "12px",
                    borderColor: "#91D5FF",
                    color: "#366EF6",
                    borderRadius: "15px",
                }}
                className={"font-style"}
            >
                {status}
            </Tag>
        );

    if (status === "Утерян" || status === "Жоғалған")
        return (
            <Tag
                icon={<CloseCircleOutlined />}
                color="#FFF1F0"
                style={{
                    fontSize: "12px",
                    borderColor: "#FFA39E",
                    color: "#F5222D",
                    borderRadius: "15px",
                }}
                className={"font-style"}
            >
                {status}
            </Tag>
        );
    return null;
};

const ServiceId = ({ serviceId, source }) => {
    const [open, setOpen] = useState(false);
    const service_id_info = useSelector((state) => state.myInfo.edited.services.service_id_info);
    const isEdited =
        service_id_info.number ||
        service_id_info.token_status ||
        service_id_info.id_status ||
        service_id_info.date_to ||
        service_id_info.token_number;
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem("lan");

    if (!serviceId) return <NoData />;

    if (Object.keys(serviceId).length === 0) return <NoData />;

    const handleContainerClick = () => {
        if (!(modeRedactor && isHR)) return;
        setOpen(true);
    };

    const statuses = (status_of) => {
        let a = "";
        if (currentLocale === "ru") {
            if (status_of === "RECEIVED") {
                a = "Получен";
            } else if (status_of === "LOST") {
                a = "Утерян";
            } else if (status_of === "NOT_RECEIVED") {
                a = "Не получен";
            }
        } else if (currentLocale === "kk") {
            if (status_of === "RECEIVED") {
                a = "Алынды";
            } else if (status_of === "LOST") {
                a = "Жоғалған";
            } else if (status_of === "NOT_RECEIVED") {
                a = "Алынған жоқ";
            }
        }
        return a;
    };

    const statusesString = (status_of) => {
        let a = status_of;
        if (currentLocale === "kk") {
            if (status_of === "Получен") {
                a = "Алынды";
            } else if (status_of === "Утерян") {
                a = "Жоғалған";
            } else if (status_of === "Не получен") {
                a = "Алынған жоқ";
            }
        }
        return a;
    };

    const currentObject = isEdited ? service_id_info : serviceId;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <ModalEditServiceCertificate
                isOpen={open}
                onClose={() => setOpen(false)}
                serviceID={currentObject}
                source={source}
            />
            <Row
                gutter={[16, 16]}
                onClick={handleContainerClick}
                className={modeRedactor && "clickable-accordion"}
            >
                {currentObject.token_number && currentObject.token_number.trim() !== "" ? (
                    <>
                        <Col xs={10} className={"text-muted font-style"}>
                            <IntlMessage id="personal.services.tokenNumber" />
                        </Col>
                        <Col xs={4} className={"font-style"}>
                            {currentObject.token_number ?? ""}
                        </Col>
                        <Col xs={10}>
                            {currentObject.token_status === "RECEIVED" ||
                            currentObject.token_status === "LOST" ||
                            currentObject.token_status === "NOT_RECEIVED" ? (
                                <Tab status={statuses(currentObject.token_status) ?? ""} />
                            ) : (
                                <Tab status={statusesString(currentObject.token_status) ?? ""} />
                            )}
                        </Col>
                    </>
                ) : null}
                <Col xs={10} className={"text-muted font-style"}>
                    {" "}
                    <Row>
                        <IntlMessage id="personal.services.employmentCertificateNumber" />
                    </Row>
                    <Row>
                        <p
                            style={{
                                fontSize: "12px",
                                color: "#366EF6",
                            }}
                            className={"font-style"}
                        >
                            {moment(currentObject.date_to ?? "").format("DD.MM.YYYY")}
                        </p>
                    </Row>
                </Col>
                <Col xs={4}>{currentObject.number ?? ""}</Col>
                <Col xs={10}>
                    {currentObject.id_status === "RECEIVED" ||
                    currentObject.id_status === "LOST" ||
                    currentObject.id_status === "NOT_RECEIVED" ? (
                        <Tab status={statuses(currentObject.id_status) || ""} />
                    ) : (
                        <Tab status={statusesString(currentObject.id_status) || ""} />
                    )}
                </Col>
            </Row>
        </CollapseErrorBoundary>
    );
};

export default ServiceId;
