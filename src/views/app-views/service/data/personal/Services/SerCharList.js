import { FileTextTwoTone } from "@ant-design/icons";
import { Col, Row } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModalCharacteristicEdit from "./modals/ModalCharacteristicEdit";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import CollapseErrorBoundary from "../common/CollapseErrorBoundary";
import i18n from "lang";

const characteristicFrom = { ru: "Характеристика от ", kk: "мінездемелері" };

const SerCharList = ({ setModalState, characteristics, source = "get" }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentCharacteristic, setCurrentCharacteristic] = useState(null);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const characteristic = useSelector((state) => state.services.characteristic);
    const lang = i18n.language;

    const handleClick = (characteristic) => {
        if (!modeRedactor) return;
        setCurrentCharacteristic(characteristic);
        setShowEditModal(true);
    };

    if (!characteristics) return null;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <div>
                {currentCharacteristic && (
                    <ModalCharacteristicEdit
                        source={source}
                        onClose={() => setShowEditModal(false)}
                        isOpen={showEditModal}
                        characteristics={currentCharacteristic}
                    />
                )}
                {characteristics.length > 0 &&
                    characteristics.map((item, index) =>
                        item.delete ? null : (
                            <Row
                                // TEMP: key={item.id}
                                key={index}
                                gutter={[18, 16]}
                                style={{ marginTop: "10px" }}
                            >
                                <Col lg={4} style={{ color: "#366EF6" }} className={"font-style"}>
                                    {moment(item.date_from).format("DD.MM.YYYY")}
                                </Col>
                                <Col
                                    lg={18}
                                    className={"font-style"}
                                    onClick={() => handleClick(item)}
                                >
                                    {lang === "ru"
                                        ? characteristicFrom[lang] + item?.characteristic_initiator
                                        : item?.characteristic_initiator +
                                          " " +
                                          characteristicFrom[lang]}
                                </Col>

                                {item.document_link === null ||
                                item.document_link === undefined ? null : (
                                    <Col lg={2}>
                                        <FileTextTwoTone
                                            style={{ fontSize: "20px" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({
                                                    open: false,
                                                    link: item.document_link,
                                                });
                                            }}
                                        />
                                    </Col>
                                )}
                            </Row>
                        ),
                    )}
            </div>
        </CollapseErrorBoundary>
    );
};

export default SerCharList;
