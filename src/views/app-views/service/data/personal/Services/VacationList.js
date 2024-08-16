import { FileTextTwoTone, SwapRightOutlined } from "@ant-design/icons";
import { Col, Row, Spin } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import CollapseErrorBoundary from "../common/CollapseErrorBoundary";
import NoData from "../NoData";
import ModalHolidaysEdit from "./modals/ModalHolidaysEdit";
import { useSelector } from "react-redux";
import { PrivateServices } from "API";
import LocalizationText from "components/util-components/LocalizationText/LocalizationText";

const VacationList = ({ vacations, setModalState, source = "get" }) => {
    const [statuses, setStatuses] = useState([]);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [currentVacation, setCurrentVacation] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem('lan');

    useEffect(() => {
        fetchHoliday();
    }, []);

    const fetchHoliday = async () => {
        const holidays = await PrivateServices.get("/api/v1/status_types");

        setStatuses(holidays.data.objects);
    };

    useEffect(() => {
        const updatedStatus = vacations.map((item, index) => {
            const matchingStatus = statuses.find(
                (i) => i.id === item.status || i.name === item.status || i.nameKZ === item.status,
            );

            return {
                name: matchingStatus ? matchingStatus.name : item.status,
                nameKZ: matchingStatus ? matchingStatus.nameKZ : item.status,
            };
        });

        setCurrentStatus(updatedStatus);
    }, [vacations, statuses]);

    const handleClick = (secondment) => {
        if (!modeRedactor) return;
        setCurrentVacation(secondment);
        setShowEditModal(true);
    };

    if (!vacations) return <NoData />;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentVacation && !currentVacation.document_link && (
                <ModalHolidaysEdit
                    holiday={currentVacation}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                />
            )}
            {vacations
                .filter((item) => !Object.hasOwnProperty.call(item, "delete"))
                .map((vacation, index) =>
                    vacation.delete ? null : (
                        <div key={vacation.id || index}>
                            <Row gutter={[18, 16]}>
                                <Col xs={22} md={22} xl={22} lg={22}>
                                    <Row gutter={16}>
                                        <Col
                                            lg={20}
                                            className={"font-style"}
                                            onClick={() => handleClick(vacation)}
                                        >
                                            {currentStatus && currentStatus[index] ? (
                                                <LocalizationText text={currentStatus[index]} />
                                            ) : (
                                                <Spin spinning={true} />
                                            )}{" "}
                                            №{vacation.document_number || ""}
                                            {currentLocale==='ru' && <>&nbsp;от&nbsp;</>}
                                            {moment(
                                                vacation.created_at
                                                    ? vacation.created_at
                                                    : vacation.date_from,
                                            ).format("DD.MM.YYYY")}
                                            {currentLocale==='kk' && <>&nbsp; бастап</>}
                                            <Row gutter={16}>
                                                <Col xl={24}>
                                                    <p
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#366EF6",
                                                        }}
                                                        className={"font-style"}
                                                    >
                                                        {moment(vacation.date_from).format(
                                                            "DD.MM.YYYY",
                                                        )}{" "}
                                                        {vacation.date_to ? (
                                                            <span>
                                                                <SwapRightOutlined
                                                                    style={{ color: "#72849A66" }}
                                                                />{" "}
                                                                {moment(vacation.date_to).format(
                                                                    "DD.MM.YYYY",
                                                                )}
                                                            </span>
                                                        ) : null}
                                                    </p>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>

                                {vacation.document_link === null ||
                                vacation.document_link === undefined ? null : (
                                    <Col xs={2} md={2} xl={2} lg={2}>
                                        <FileTextTwoTone
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({
                                                    open: false,
                                                    link: vacation.document_link,
                                                });
                                            }}
                                            style={{ fontSize: "20px" }}
                                        />
                                    </Col>
                                )}
                            </Row>
                        </div>
                    ),
                )}
        </CollapseErrorBoundary>
    );
};

export default VacationList;
