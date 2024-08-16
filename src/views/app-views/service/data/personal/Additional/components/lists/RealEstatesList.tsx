import React, { useState } from "react";
import moment from "moment";

import { Col, Row, Typography } from "antd";

import IntlMessage from "components/util-components/IntlMessage";
import CollapseErrorBoundary from "views/app-views/service/data/personal/common/CollapseErrorBoundary";

import { components } from "API/types";
import { useAppSelector } from "hooks/useStore";

import { ListModalProps } from "./types";

import { RealEstateEditModal } from "../modals-edit/RealEstateEditModal";
import { FileTextTwoTone } from "@ant-design/icons";
import LocalizationText from "../../../../../../../../components/util-components/LocalizationText/LocalizationText";

const { Text } = Typography;

type RealEstate = components["schemas"]["PropertiesRead"];

type RealEstatesProps = {
    realEstates: RealEstate[];
} & ListModalProps;

export const RealEstatesList = (props: RealEstatesProps) => {
    const { realEstates, source = "get", setModalState } = props;
    const currentLocale = localStorage.getItem("lan");

    const isEditorMode = useAppSelector((state) => state.myInfo.modeRedactor);

    const [currentRealEstate, setCurrentRealEstate] = useState<RealEstate>();
    const [isRealEstateEditModalOpen, setIsRealEstateEditModalOpen] = useState(false);

    const openRealEstateEditModal = (realEstate: RealEstate) => {
        if (!isEditorMode) return;

        setCurrentRealEstate(realEstate);
        setIsRealEstateEditModalOpen(true);
    };

    if (!realEstates) return null;

    return (
        <>
            {currentRealEstate && (
                <RealEstateEditModal
                    isOpen={isRealEstateEditModalOpen}
                    realEstate={currentRealEstate}
                    onClose={() => setIsRealEstateEditModalOpen(false)}
                    source={source}
                />
            )}

            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
                {realEstates.length > 0 &&
                    realEstates.map((realEstate, idx) => {
                        if (Object.hasOwnProperty.call(realEstate, "delete")) return null;

                        return (
                            <Row
                                className={"font-style" + (isEditorMode && " clickable-accordion")}
                                key={idx}
                                onClick={() => openRealEstateEditModal(realEstate)}
                                style={{
                                    ...(idx !== 0 ? { marginTop: 14 } : {}),
                                }}
                            >
                                <Col xs={22}>
                                    <Row className="font-style">
                                        {realEstate.type && <LocalizationText text={realEstate.type} />}
                                    </Row>
                                    <Row className="font-style">
                                        <Text style={{ color: "#366EF6" }}>
                                            {moment(realEstate.purchase_date).format("DD.MM.YYYY")}
                                        </Text>
                                        <Text className="ml-5">{realEstate.address}</Text>
                                    </Row>
                                </Col>
                                {realEstate?.document_link ? (
                                    <Col
                                        xs={2}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "end",
                                        }}
                                    >
                                        <FileTextTwoTone
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({
                                                    open: false,
                                                    link: realEstate.document_link,
                                                });
                                            }}
                                            style={{ fontSize: "20px" }}
                                        />
                                    </Col>
                                ) : null}
                            </Row>
                        );
                    })}
            </CollapseErrorBoundary>
        </>
    );
};
