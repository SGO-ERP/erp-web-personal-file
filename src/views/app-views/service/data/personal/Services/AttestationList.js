import { FileTextTwoTone, SwapRightOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import moment from "moment/moment";
import React, { useState } from "react";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import CollapseErrorBoundary from "../common/CollapseErrorBoundary";
import { useSelector } from "react-redux";
import ModalAttestationEdit from "./modals/ModalAttestationEdit";
const AttestationList = ({ attestations, setModalState, source = "get" }) => {
    const [currentAttestation, setCurrentAttestation] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const currentLocale = localStorage.getItem("lan");

    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);

    const handleClick = (attestation) => {
        if (!modeRedactor) return;
        setCurrentAttestation(attestation);
        setShowEditModal(true);
    };

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentAttestation && !currentAttestation.document_link && (
                <ModalAttestationEdit
                    attestation={currentAttestation}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                />
            )}
            {attestations.length > 0
                ? attestations.map((attestation, index) =>
                      attestation.delete ? null : (
                          <Row gutter={[18, 16]} style={{ marginTop: "10px" }} key={index}>
                              <Col
                                  xs={6}
                                  style={{ color: "#366EF6" }}
                                  className={"font-style"}
                                  onClick={() => handleClick(attestation)}
                              >
                                  {moment(attestation.date_from).format("DD.MM.YYYY")}{" "}
                                  {attestation.date_to ? (
                                      <span>
                                          <SwapRightOutlined style={{ color: "#72849A66" }} />{" "}
                                          {moment(attestation.date_to).format("DD.MM.YYYY")}
                                      </span>
                                  ) : null}
                              </Col>
                              <Col
                                  xs={18}
                                  className={"font-style"}
                                  onClick={() => handleClick(attestation)}
                                  style={{ paddingLeft: 0 }}
                              >
                                  {currentLocale === "kk"
                                      ? attestation?.attestation_statusKZ
                                      : attestation?.attestation_status}
                                  &nbsp;
                                  {attestation?.document_number && (
                                      <span className={"text-muted"}>
                                          №{attestation?.document_number}
                                          {attestation?.date_credited && (
                                              <>
                                                  &nbsp;
                                                  {moment(attestation.date_credited).format(
                                                      "DD.MM.YYYY",
                                                  )}
                                              </>
                                          )}
                                      </span>
                                  )}
                              </Col>

                              {attestation.document_link === null ||
                              attestation.document_link === undefined ? null : (
                                  <Col lg={2}>
                                      <FileTextTwoTone
                                          style={{ fontSize: "20px" }}
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              setModalState({
                                                  open: false,
                                                  link: attestation.document_link,
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

export default AttestationList;
