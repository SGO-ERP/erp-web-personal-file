import { FileTextTwoTone } from "@ant-design/icons";
import { Col, notification, Row } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import ModalAwardsEdit from "./modals/ModalAwardsEdit";
import CollapseErrorBoundary from "../common/CollapseErrorBoundary";
import { useAppSelector } from "../../../../../../hooks/useStore";
import ModalShowReasonAwards from "./modals/ModalShowReasonAwards";
import LocalizationText from "../../../../../../components/util-components/LocalizationText/LocalizationText";

const AwardsList = ({ setModalState, awards, source = "get" }) => {
    const [currentAward, setCurrentAward] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openShow, setOpenShow] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem("lan");

    const handleClick = (award) => {
        setCurrentAward(award);

        if (!modeRedactor) {
            setOpenShow(true);
        } else if (modeRedactor) {
            setShowEditModal(true);
        }
    };
    if (!awards) return null;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <div>
                {currentAward && (
                    <ModalAwardsEdit
                        award={currentAward}
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        source={source}
                        awards={awards}
                    />
                )}
                {currentAward && currentAward?.reason && (
                    <ModalShowReasonAwards
                        awards={currentAward}
                        isOpen={openShow}
                        onClose={() => setOpenShow(false)}
                    />
                )}
                {awards.length > 0
                    ? awards.map((award, index) =>
                          award.delete ? null : (
                              <Row
                                  // TEMP: key={award.id}
                                  onClick={() => handleClick(award)}
                                  key={index}
                                  gutter={[18, 16]}
                              >
                                  <Col
                                      xs={2}
                                      md={2}
                                      xl={2}
                                      lg={2}
                                      style={{
                                          alignItems: "center",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItem: "center",
                                      }}
                                  >
                                      <img
                                          src={award.url || ""}
                                          alt=""
                                          style={
                                              award?.name.toLowerCase() === "черный берет"
                                                  ? { width: 46, height: 46 }
                                                  : { width: 25, height: 46 }
                                          }
                                      />
                                  </Col>
                                  <Col xs={20} md={20} xl={20} lg={20}>
                                      <Row gutter={16}>
                                          <Col xs={10} md={10} lg={24} className={"font-style"}>
                                              {<LocalizationText text={award} /> || ""}
                                          </Col>
                                      </Row>
                                      <p style={{ fontSize: "12px" }} className={"font-style"}>
                                          {<IntlMessage id={"schedule.order_signed_by"} />} №
                                          {award.document_number || ""}
                                          {currentLocale === "ru" && <>&nbsp;от&nbsp;</>}
                                          {moment(award.date_from).format("DD.MM.YYYY")}
                                          {currentLocale === "kk" && <>&nbsp;бастап</>}
                                      </p>
                                  </Col>

                                  {award.document_link === null ||
                                  award.document_link === undefined ? null : (
                                      <Col xs={2} md={2} xl={2} lg={2}>
                                          <FileTextTwoTone
                                              style={{ fontSize: "20px" }}
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setModalState({
                                                      open: false,
                                                      link: award.document_link,
                                                  });
                                              }}
                                          />
                                      </Col>
                                  )}
                              </Row>
                          ),
                      )
                    : null}
            </div>
        </CollapseErrorBoundary>
    );
};

export default AwardsList;
