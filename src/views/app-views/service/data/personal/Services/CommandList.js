import { FileTextTwoTone, SwapRightOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import moment from "moment";
import React, { useState } from "react";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import CollapseErrorBoundary from "../common/CollapseErrorBoundary";
import ModalSecondmentsEdit from "./modals/ModalSecondmentsEdit";
import { useSelector } from "react-redux";
import LocalizationText from "components/util-components/LocalizationText/LocalizationText";

const CommandList = ({ secondments, setModalState, source = "get" }) => {
    const [currentSecondments, setCurrentSecondments] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem("lan");

    const { departments } = useSelector((state) => state.secondments);

    const handleClick = (secondment) => {
        if (!modeRedactor) return;
        setCurrentSecondments(secondment);
        setShowEditModal(true);
    };

    const generateDivisionName = (id) => {
        if (!departments.data) return "";
        const currentItem = departments.data.find((item) => item.id === id || item.name === id);

        if (currentItem) return <LocalizationText text={currentItem} />;

        return "";
    };

    if (!secondments) return null;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentSecondments && (
                <ModalSecondmentsEdit
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                    secondment={currentSecondments}
                />
            )}
            {secondments.length > 0
                ? secondments.map((item, index) =>
                      item.delete ? null : (
                          <Row
                              key={index}
                              gutter={[18, 16]}
                              style={{ marginTop: "10px" }}
                              onClick={() => handleClick(item)}
                          >
                              <Col lg={8} style={{ color: "#366EF6" }} className={"font-style"}>
                                  {moment(item.date_from).format("DD.MM.YYYY")}{" "}
                                  {item.date_to ? (
                                      <span>
                                          <SwapRightOutlined style={{ color: "#72849A66" }} />
                                          {" " + moment(item.date_to).format("DD.MM.YYYY")}
                                      </span>
                                  ) : (
                                      <span>
                                          <SwapRightOutlined style={{ color: "#72849A66" }} />
                                          {currentLocale === "ru" ? <>н.в. &nbsp;</> : <>қ.у.</>}
                                      </span>
                                  )}
                              </Col>
                              <Col lg={14} className={"font-style"}>
                                  {generateDivisionName(
                                      item.staff_division_id ?? item.staff_division,
                                  )}
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
                  )
                : null}
        </CollapseErrorBoundary>
    );
};

export default CommandList;
