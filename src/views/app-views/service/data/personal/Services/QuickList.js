import { DownOutlined, FileTextTwoTone, UpOutlined } from "@ant-design/icons";
import { Row, Timeline } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LocalizationText from "../../../../../../components/util-components/LocalizationText/LocalizationText";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import CollapseErrorBoundary from "../common/CollapseErrorBoundary";
import ModalEmergencyEdit from "./modals/ModalEmergencyEdit";

const QuickList = ({ quickList, setModalState }) => {
    const [source, setSource] = useState("get");
    const [currentContract, setCurrentContract] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem("lan");
    const [showList, setShowList] = useState(true);

    const sortedList = quickList
        .sort((a, b) => new Date(a.date_from) - new Date(b.date_from))
        .reverse();
    const limitedList = showList ? sortedList.slice(0, 3) : sortedList;

    useEffect(() => {
        setShowList(modeRedactor ? false : true);
    }, [modeRedactor]);

    const generatePendingDot = () => {
        if (modeRedactor || quickList.length <= 3) return <></>;

        return showList ? (
            <DownOutlined
                onClick={() => setShowList(!showList)}
                style={{ color: "grey", fontSize: "16px" }}
            />
        ) : (
            <UpOutlined
                onClick={() => setShowList(!showList)}
                style={{ color: "grey", fontSize: "16px" }}
            />
        );
    };

    const handleClick = (contract) => {
        if (!modeRedactor) return;
        setCurrentContract(contract);
        setSource(quickList.source ? quickList.source : "get");
        setShowEditModal(true);
    };

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentContract && !currentContract.document_link && (
                <ModalEmergencyEdit
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                    contract={currentContract}
                />
            )}
            <Timeline mode="left" pending={true} pendingDot={generatePendingDot()}>
                {limitedList.length > 0
                    ? limitedList.map((item, index) =>
                          item.delete ? null : (
                              <Timeline.Item
                                  // TEMP: key={item.id}
                                  key={index}
                                  dot={
                                      item.document_link !== null &&
                                      item.document_link !== undefined && (
                                          <FileTextTwoTone
                                              style={{ fontSize: "16px" }}
                                              onClick={() => {
                                                  setModalState({
                                                      open: false,
                                                      link: item.document_link,
                                                  });
                                              }}
                                          />
                                      )
                                  }
                                  label={
                                      <div>
                                          <p className="timeline">
                                              {moment(item.date_from).format("DD.MM.YYYY")}
                                              {!item.date_to
                                                  ? ""
                                                  : " - " +
                                                    moment(item.date_to).format("DD.MM.YYYY")}
                                          </p>
                                          <p className="timeline-mute">x{item.coefficient || ""}</p>
                                      </div>
                                  }
                                  className={
                                      "font-style" +
                                      (modeRedactor && " clickable-accordion") +
                                      (source !== "get" &&
                                          index === 0 &&
                                          " education-timeline-to-top")
                                  }
                                  onClick={() => handleClick(item)}
                              >
                                  <Row>
                                      <p className="timeline">
                                          <LocalizationText
                                              text={
                                                  item.actual_position?.name &&
                                                  item.actual_position?.nameKZ
                                                      ? item.actual_position
                                                      : item.position ?? ""
                                              }
                                          />
                                          {item.percentage > 0 && <> - {item.percentage}%</>}
                                      </p>
                                  </Row>
                                  <Row justify="start">
                                      <p className="timeline">
                                          <LocalizationText
                                              text={item.staffDivision ?? item.staff_division}
                                          />
                                      </p>
                                  </Row>
                                  {item.contractor_signer_name && (
                                      <span>
                                          (Пр.{" "}
                                          <LocalizationText
                                              text={item.contractor_signer_name || ""}
                                          />
                                          {" №"}
                                          {item.document_number || ""}
                                          {item.date_credited && item.date_credited !== null && (
                                              <>
                                                  &nbsp;
                                                  {currentLocale === "ru" && <>&nbsp;от&nbsp;</>}
                                                  {moment(item.date_credited).format("DD.MM.YYYY")}
                                                  {currentLocale === "kk" && <>&nbsp; бастап</>}
                                              </>
                                          )}
                                      </span>
                                  )}
                              </Timeline.Item>
                          ),
                      )
                    : null}
            </Timeline>
        </CollapseErrorBoundary>
    );
};

export default QuickList;
