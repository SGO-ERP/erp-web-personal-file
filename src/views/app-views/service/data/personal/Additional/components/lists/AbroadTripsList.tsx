import React, { useState } from "react";
import moment from "moment";

import { FileTextTwoTone, SwapRightOutlined } from "@ant-design/icons";

import { Col, Row, Typography } from "antd";

import IntlMessage from "components/util-components/IntlMessage";
import CollapseErrorBoundary from "views/app-views/service/data/personal/common/CollapseErrorBoundary";

import { components } from "API/types";
import { useAppSelector } from "hooks/useStore";

import { ListModalProps } from "./types";

import AirplaneImg from "../../../../abroad/airplane.png";
import CarImg from "../../../../abroad/car.png";
import TrainImg from "../../../../abroad/train.png";
import AbroadTripEditModal from "../modals-edit/AbroadTripEditModal";
import LocalizationText from "../../../../../../../../components/util-components/LocalizationText/LocalizationText";

const { Text } = Typography;

type AbroadTrip = components["schemas"]["AbroadTravelRead"];

type AbroadTripsListProps = {
    abroadTrips: AbroadTrip[];
} & ListModalProps;

export const AbroadTripsList = (props: AbroadTripsListProps) => {
    const { abroadTrips, source, setModalState } = props;

    const [currentAbroadTrip, setCurrentAbroadTrip] = useState<AbroadTrip>();
    const [isAbroadTripEditModalOpen, setIsAbroadTripEditModalOpen] = useState<boolean>(false);

    const isEditor = useAppSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem("lan");

    const handleClick = (abroadTrip: AbroadTrip) => {
        if (!isEditor) return;

        setCurrentAbroadTrip(abroadTrip);
        setIsAbroadTripEditModalOpen(true);
    };

    return (
        <>
            {currentAbroadTrip && (
                <AbroadTripEditModal
                    isOpen={isAbroadTripEditModalOpen}
                    currentAbroadTrip={currentAbroadTrip}
                    onClose={() => setIsAbroadTripEditModalOpen(false)}
                    source={source}
                />
            )}

            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
                {abroadTrips.length > 0 &&
                    abroadTrips.map((abroadTrip, idx) => {
                        if (Object.hasOwnProperty.call(abroadTrip, "delete")) return null;
                        const vehicleType = abroadTrip?.vehicle_type?.name?.toLowerCase();
                        const vehicleImg = {
                            "самолет": AirplaneImg,
                            "машина": CarImg,
                            "поезд": TrainImg,
                        }[vehicleType];

                        return (
                            <Row
                                key={idx}
                                className={"font-style" + (isEditor && " clickable-accordion")}
                                onClick={() => handleClick(abroadTrip)}
                                style={{
                                    ...(idx !== 0 ? { marginTop: 14 } : {}),
                                }}
                            >
                                <Col
                                    style={{
                                        width: "calc(100% - 38px)",
                                    }}
                                >
                                    <Row gutter={[18, 1]}>
                                        {vehicleType && (
                                            <img
                                                src={vehicleImg}
                                                alt={vehicleType}
                                                style={{ height: "16px" }}
                                            />
                                        )}
                                        <Text className="ml-2">
                                            {(
                                                <LocalizationText
                                                    text={abroadTrip?.destination_country ?? ""}
                                                />
                                            ) ?? ""}
                                        </Text>
                                        <Col
                                            className="font-style"
                                            style={{ fontSize: "12px" }}
                                            xs={24}
                                        >
                                            <Text style={{ color: "#366EF6" }}>
                                                {moment(abroadTrip.date_from).format("DD.MM.YYYY")}
                                                <SwapRightOutlined
                                                    className="mx-1"
                                                    style={{ color: "#72849A66" }}
                                                />
                                                {moment(abroadTrip.date_to).format("DD.MM.YYYY")}
                                            </Text>
                                            <Text className="ml-5">
                                                {currentLocale === "kk"
                                                    ? abroadTrip.reasonKZ
                                                    : abroadTrip.reason}
                                            </Text>
                                        </Col>
                                    </Row>
                                </Col>
                                {abroadTrip.document_link && (
                                    <Col
                                        className="font-style"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "end",
                                            width: "38px",
                                        }}
                                    >
                                        <FileTextTwoTone
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({
                                                    open: false,
                                                    link: abroadTrip.document_link ?? "",
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
