import { Col, Row } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import EditInput from "../../common/EditInput";
import React from "react";
import CollapseErrorBoundary from "../../common/CollapseErrorBoundary";
import NoData from "../../NoData";

const AnthropometricInfo = ({ anthropometricData }) => {
    if (!anthropometricData || anthropometricData?.length === 0) {
        return <NoData />;
    }

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <Row gutter={[18, 16]}>
                <Col
                    xs={12}
                    style={{ color: "#72849A" }}
                    className={"font-style text-muted editable-row"}
                >
                    <IntlMessage id="personal.anthropometryCard.headCircumference" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    <EditInput
                        defaultValue={anthropometricData?.head_circumference || ""}
                        fieldName="allTabs.medical_card.anthropometric.head_circumference"
                        fieldNameGet="initialTabs.medical_card.anthropometric.head_circumference"
                    />
                </Col>
                <Col
                    xs={12}
                    style={{ color: "#72849A" }}
                    className={"font-style text-muted editable-row"}
                >
                    <IntlMessage id="personal.anthropometryCard.shoeSize" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    <EditInput
                        defaultValue={anthropometricData?.shoe_size || ""}
                        fieldName="allTabs.medical_card.anthropometric.shoe_size"
                        fieldNameGet="initialTabs.medical_card.anthropometric.shoe_size"
                    />
                </Col>
                <Col
                    xs={12}
                    style={{ color: "#72849A" }}
                    className={"font-style text-muted editable-row"}
                >
                    <IntlMessage id="personal.anthropometryCard.neckCircumference" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    <EditInput
                        defaultValue={anthropometricData?.neck_circumference || ""}
                        fieldName="allTabs.medical_card.anthropometric.neck_circumference"
                        fieldNameGet="initialTabs.medical_card.anthropometric.neck_circumference"
                    />
                </Col>
                <Col
                    xs={12}
                    style={{ color: "#72849A" }}
                    className={"font-style text-muted editable-row"}
                >
                    <IntlMessage id="personal.anthropometryCard.uniformSize" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    <EditInput
                        defaultValue={anthropometricData?.shape_size || ""}
                        fieldName="allTabs.medical_card.anthropometric.shape_size"
                        fieldNameGet="initialTabs.medical_card.anthropometric.shape_size"
                    />
                </Col>
                <Col
                    xs={12}
                    style={{ color: "#72849A" }}
                    className={"font-style text-muted editable-row"}
                >
                    <IntlMessage id="personal.anthropometryCard.chestVolume" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    <EditInput
                        defaultValue={anthropometricData?.bust_size || ""}
                        fieldName="allTabs.medical_card.anthropometric.bust_size"
                        fieldNameGet="initialTabs.medical_card.anthropometric.bust_size"
                    />
                </Col>
            </Row>
        </CollapseErrorBoundary>
    );
};

export default AnthropometricInfo;
