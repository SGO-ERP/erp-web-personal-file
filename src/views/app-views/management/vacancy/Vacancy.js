import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Tag } from "antd";
import { LocalText } from "../../../../components/util-components/LocalizationText/LocalizationText";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../../../hooks/useStore";
import { PERMISSION } from "constants/permission";

const Vacancy = ({
    card,
    setOpenHRModal,
    setOpenOfferModal,
    setSelectedVacancyForOffer,
    setSelectedVacancyForHR,
    successOffersIds,
}) => {
    const currentLocale = localStorage.getItem("lan");
    const profile = useSelector((state) => state.profile.data);
    const [isDisabledOffer, setIsDisabledOffer] = useState(false);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    const position = card.vacancy?.vacancy?.staff_unit?.actual_position
        ? card.vacancy?.vacancy?.staff_unit?.actual_position
        : card.vacancy?.vacancy?.staff_unit?.position;

    useEffect(() => {
        const isCandidateApplied = card.vacancy.vacancy.candidates.some(
            (candidate) => candidate.user_id === profile.id,
        );
        const isOffered = successOffersIds.includes(card?.vacancy?.vacancy?.id);
        const isMaxRank = position?.max_rank?.order < profile.rank.order;
        const isDisabledOffer = isCandidateApplied || isOffered || isMaxRank;
        setIsDisabledOffer(isDisabledOffer);
    }, [successOffersIds]);

    return (
        <Card>
            <Row gutter={16}>
                <Col span={10}>
                    <Row justify="space-between">
                        <Col
                            span={12}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "start",
                            }}
                        >
                            {/*{LocalText.getName(card?.vacancy?.vacancy?.staff_unit?.position).split(*/}
                            {/*    ' ',*/}
                            {/*).length > 5 ? (*/}
                            {/*    <b*/}
                            {/*        style={{*/}
                            {/*            wordWrap: 'break-word',*/}
                            {/*            maxWidth: '230px',*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        {LocalText.getName(card?.vacancy?.vacancy?.staff_unit?.position)}*/}
                            {/*    </b>*/}
                            {/*) : (*/}
                            <b>{LocalText.getName(position)}</b>
                            {/*)}*/}
                            <Row justify="space-between" align="middle">
                                <span>{position?.category_code}</span>
                                <span>
                                    <IntlMessage id={"vacancy.allowance"} />
                                    {": " + position?.form}
                                </span>
                            </Row>
                        </Col>
                        <Col
                            span={12}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "end",
                            }}
                        >
                            {card?.vacancy?.parents.map((division) => {
                                return (
                                    <span
                                        key={division.id}
                                        style={{
                                            color: "#366EF6",
                                            fontSize: 12,
                                        }}
                                    >
                                        {division.type &&
                                            LocalText.getName(division.type) +
                                                ": " +
                                                (division.staff_division_number ?? division.name)}
                                    </span>
                                );
                            })}
                        </Col>
                    </Row>
                    <div
                        style={{
                            height: "1px",
                            backgroundColor: "#E6EBF1",
                            margin: "12px 0",
                        }}
                    />
                    <Row>
                        <IntlMessage id={"vacancy.maxRank"} />
                        {":"}&nbsp;
                        <span style={{ color: "#366EF6" }}>
                            {LocalText.getName(position?.max_rank)}
                        </span>
                    </Row>
                    <div
                        style={{
                            height: "1px",
                            backgroundColor: "#E6EBF1",
                            margin: "12px 0",
                        }}
                    />
                    {isHR ? (
                        <Button
                            type="primary"
                            onClick={(event) => {
                                event.stopPropagation();
                                setOpenHRModal(true);
                                setSelectedVacancyForHR(card?.vacancy?.vacancy);
                            }}
                        >
                            <IntlMessage id={"vacancy.showCandidates"} />
                            &nbsp;({card?.vacancy?.vacancy.candidates.length})
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            onClick={(event) => {
                                event.stopPropagation();
                                setOpenOfferModal(true);
                                setSelectedVacancyForOffer({
                                    vacancy: card?.vacancy?.vacancy,
                                    ids: card.ids,
                                });
                            }}
                            disabled={isDisabledOffer}
                        >
                            <IntlMessage id={"vacancy.give.order"} />
                        </Button>
                    )}
                </Col>
                <Col span={14}>
                    <Row>
                        <b
                            style={{
                                marginBottom: "12px",
                            }}
                        >
                            <IntlMessage id={"vacancy.quality.requirements"} />
                        </b>
                    </Row>
                    <Row
                        style={{
                            alignItems: "flex-start",
                            gap: "8px",
                        }}
                    >
                        {card?.vacancy?.vacancy?.staff_unit.requirements?.map((requirement) => {
                            return requirement?.keys
                                ?.filter((key) =>
                                    currentLocale === "kk" ? key.lang === "kz" : key.lang === "ru",
                                )
                                .map((key) => {
                                    return key?.text?.map((tag, index) => (
                                        <Tag
                                            key={index}
                                            style={{
                                                borderRadius: "14px",
                                                fontSize: "12px",
                                                lineHeight: "16px",
                                                // maxWidth: '300px',
                                                padding: "3px 10px",
                                                whiteSpace: "normal",
                                            }}
                                        >
                                            {tag}
                                        </Tag>
                                    ));
                                });
                        })}
                    </Row>
                </Col>
            </Row>
        </Card>
    );
};

export default Vacancy;
