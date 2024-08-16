import React, { useEffect, useState } from "react";
import moment from "moment";

import { FileTextTwoTone } from "@ant-design/icons";

import { Col, Row, Typography } from "antd";

import IntlMessage from "components/util-components/IntlMessage";
import CollapseErrorBoundary from "views/app-views/service/data/personal/common/CollapseErrorBoundary";

// import ModalEditServiceHousing from './modals/ModalEditServiceHousing';
import { components } from "API/types";
import { useAppSelector } from "hooks/useStore";

import { ListModalProps } from "./types";
import ModalEditServiceHousing from "../../modals/ModalEditServiceHousing";
import LocalizationText from "../../../../../../../../components/util-components/LocalizationText/LocalizationText";

const { Text } = Typography;

type ServiceHousing = components["schemas"]["ServiceHousingRead"];

type ServiceHousingsListProps = {
    serviceHousings: ServiceHousing[];
} & ListModalProps;

export const ServiceHousingsList = (props: ServiceHousingsListProps) => {
    const { serviceHousings, source, setModalState } = props;

    const isEditorMode = useAppSelector((state) => state.myInfo.modeRedactor);

    const [currentServiceHousing, setCurrentServiceHousing] = useState<ServiceHousing>();
    const [isServiceHousingEditModalOpen, setIsServiceHousingEditModalOpen] = useState(false);

    const handleClick = (serviceHousing: ServiceHousing) => {
        if (!isEditorMode) return;

        setCurrentServiceHousing(serviceHousing);
        setIsServiceHousingEditModalOpen(true);
    };

    if (!serviceHousings) return null;

    return (
        <>
            {currentServiceHousing && (
                <ModalEditServiceHousing
                    realty={currentServiceHousing}
                    isOpen={isServiceHousingEditModalOpen}
                    onClose={() => setIsServiceHousingEditModalOpen(false)}
                    source={source}
                />
            )}
            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
                {serviceHousings.map((serviceHousing, idx) => {
                    if (Object.hasOwnProperty.call(serviceHousing, "delete")) return null;
                    return (
                        <Row
                            key={idx}
                            className={"font-style" + (isEditorMode && " clickable-accordion")}
                            onClick={() => handleClick(serviceHousing)}
                            style={{
                                ...(idx !== 0 ? { marginTop: 14 } : {}),
                            }}
                        >
                            <Col className="font-style" xs={20}>
                                <Row gutter={[18, 1]}>
                                    <Col className="font-style" xs={24}>
                                        {serviceHousing?.type ? (
                                            <LocalizationText text={serviceHousing?.type} />
                                        ) : null}
                                    </Col>
                                    <Col className="font-style" xs={24}>
                                        <Text style={{ color: "#366EF6" }}>
                                            {moment(serviceHousing?.issue_date).format(
                                                "DD.MM.YYYY",
                                            )}
                                        </Text>
                                        <Text className="ml-5">{serviceHousing?.address}</Text>
                                    </Col>
                                </Row>
                            </Col>
                            {serviceHousing?.document_link && (
                                <Col
                                    className="font-style"
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
                                                link: serviceHousing.document_link ?? "",
                                            });
                                        }}
                                        style={{ fontSize: "20px" }}
                                    />
                                </Col>
                            )}
                        </Row>
                    );
                })}
            </CollapseErrorBoundary>
        </>
    );
};
