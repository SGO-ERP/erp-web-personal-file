import { Avatar, Col, Row, Tag } from "antd";
import TextComponent from "components/shared-components/NullableText";
import { format } from "date-fns";
import moment from "moment";
import { LocalText } from "../../../../../../components/util-components/LocalizationText/LocalizationText";
import React from "react";
import { concatBySpace } from "../../../../../../utils/format/format";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import AvatarFallback from "components/shared-components/AvatarFallback";

const HrStepHistory = ({ steps }) => {
    let keyNum = 0;

    return steps.map((step) =>
        step.assigned_to ? (
            <div className="infoBlock" style={{ marginBottom: 80 }} key={keyNum++}>
                <Row style={{ height: 72 }}>
                    <Col xs={6}>
                        <Row>
                            <Row>
                                <p
                                    className="textRank tm0"
                                    style={{ marginBottom: "10%", fontWeight: 500 }}
                                >
                                    {LocalText.getName(step.hr_document_step.staff_function.role)}
                                </p>
                            </Row>
                            {step.signed_at === null || step.signed_at === undefined ? (
                                <p className="textBlue">На подписании</p>
                            ) : (
                                <Row style={{ display: "flex", flexDirection: "column" }}>
                                    <p
                                        className="textRank tm0"
                                        style={{
                                            color: "rgba(26, 51, 83, 0.85)",
                                            marginBottom: "6%",
                                        }}
                                    >
                                        {format(new Date(step.signed_at), "dd.MM.yyyy")}
                                    </p>
                                    <p className="textBirth" style={{ textJustify: "auto" }}>
                                        {moment(new Date(step.signed_at)).format("HH:mm")}
                                    </p>

                                    <p className="textBlue">{moment(step.signed_at).fromNow()}</p>
                                </Row>
                            )}
                        </Row>
                    </Col>
                    <Col xs={11}>
                        <Row gutter={5}>
                            <Col xs={9}>
                                <Avatar
                                    size={72}
                                    src={step.assigned_to?.icon}
                                    alt="THISSHIT"
                                    icon={<AvatarFallback />}
                                    style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        objectPosition: "top",
                                    }}
                                />
                                {/* <img
                                    src={step.assigned_to?.icon}
                                    alt="avatar"
                                    style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        objectPosition: 'top',
                                    }}
                                /> */}
                                <img
                                    src={
                                        step.assigned_to?.is_military
                                            ? step.assigned_to?.rank?.military_url
                                            : step.assigned_to?.rank?.employee_url
                                    }
                                    alt={"Rank"}
                                    style={{
                                        width: 37,
                                        height: 37,
                                        position: "absolute",
                                        top: 50,
                                        left: 44,
                                    }}
                                />
                            </Col>
                            <Col xs={15}>
                                <p className="textInfo">
                                    {step.assigned_to.staff_unit?.actual_position
                                        ? LocalText.getName(
                                              step.assigned_to.staff_unit?.actual_position,
                                          )
                                        : LocalText.getName(step.assigned_to.staff_unit?.position)}
                                </p>
                                <p className="textName" style={{ fontWeight: 400 }}>
                                    {concatBySpace([
                                        step.assigned_to.last_name,
                                        step.assigned_to.first_name,
                                        step.assigned_to.father_name,
                                    ])}
                                </p>
                                <Tag
                                    style={{
                                        borderRadius: "14px",
                                        fontSize: "12px",
                                        lineHeight: "16px",
                                        margin: 0,
                                        fontWeight: 400,
                                    }}
                                    color={
                                        step.signed_at
                                            ? step.is_signed
                                                ? "success"
                                                : "error"
                                            : "processing"
                                    }
                                >
                                    <IntlMessage
                                        id={
                                            step.signed_at
                                                ? step.is_signed
                                                    ? "signed"
                                                    : "refused"
                                                : "underConsideration"
                                        }
                                    />
                                </Tag>
                            </Col>
                        </Row>
                    </Col>
                    {step.comment !== null && (
                        <Col xs={7}>
                            <Row>
                                <Col xs={24}>
                                    <p
                                        style={{ textAlign: "end", marginBottom: "4%" }}
                                        className="textName"
                                    >
                                        <IntlMessage id={"comment"} />
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={24}>
                                    <p
                                        style={{ textAlign: "end", wordWrap: "break-word" }}
                                        className="textBirth"
                                    >
                                        <i>
                                            <TextComponent
                                                text={step.comment}
                                                defaultMessage={""}
                                            />
                                        </i>
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    )}
                </Row>
            </div>
        ) : (
            <div className="infoBlock" style={{ marginBottom: 80 }} key={keyNum++}>
                <Row style={{ height: 72 }}>
                    <Col xs={6}>
                        <Row>
                            <Row>
                                <p className="textRank tm0" style={{ marginBottom: "10%" }}>
                                    <TextComponent
                                        text={step.hr_document_step?.staff_function.name}
                                    />
                                </p>
                            </Row>
                            <Row>
                                <p className="textBlue">{"На подписании"}</p>
                            </Row>
                        </Row>
                    </Col>
                    <Col xs={11}>
                        <Row gutter={5}>
                            <Col xs={9}>
                                <Avatar
                                    size={72}
                                    src={step.will_sign?.icon}
                                    alt="THISSHIT2"
                                    icon={<AvatarFallback />}
                                    style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        objectPosition: "top",
                                    }}
                                />
                                <img
                                    src={
                                        step.assigned_to?.is_military
                                            ? step.assigned_to?.rank?.military_url
                                            : step.assigned_to?.rank?.employee_url
                                    }
                                    alt={"Rank"}
                                    style={{
                                        width: 37,
                                        height: 37,
                                        position: "absolute",
                                        top: 50,
                                        left: 44,
                                    }}
                                />
                            </Col>
                            <Col xs={15}>
                                <p className="textInfo">{step.will_sign?.rank.name}</p>
                                <p className="textName">
                                    {step.will_sign?.first_name} {step.will_sign?.last_name}
                                </p>
                            </Col>
                        </Row>
                    </Col>
                    {step.comment !== null && (
                        <Col xs={7}>
                            <Row>
                                <Col xs={24}>
                                    <p
                                        style={{ textAlign: "end", marginBottom: "4%" }}
                                        className="textName"
                                    >
                                        <IntlMessage id={"comment"} />:
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={24}>
                                    <p style={{ textAlign: "end" }} className="textBirth">
                                        <i>{step.comment}</i>
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    )}
                </Row>
            </div>
        ),
    );
};

export default HrStepHistory;
