import { DeleteTwoTone } from "@ant-design/icons";
import { Button, Col, Collapse, Row, Typography } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LocalizationText from "../../../../../../../components/util-components/LocalizationText/LocalizationText";
import { useAppSelector } from "../../../../../../../hooks/useStore";
import { deleteByPath } from "../../../../../../../store/slices/myInfo/familyProfileSlice";
import {
    deleteByPathMyInfo,
    setFieldValue,
} from "../../../../../../../store/slices/myInfo/myInfoSlice";
import CollapseErrorBoundary from "../../common/CollapseErrorBoundary";
import findAccordionByName from "../../common/findAccordionByName";
import NoData from "../../NoData";
import ModalAddFamilyMemberEdit from "../modal/ModalAddFamilyMemberEdit";
import ModalOffenceAbroadLocal from "../modal/ModalOffenceAbroadLocal";
import ModalOffenceAbroadRemote from "../modal/ModalOffenceAbroadRemote";
import Info from "./Info";
import { PERMISSION } from "constants/permission";

const { Panel } = Collapse;
const { Text } = Typography;

const FamilyList = ({ showModal, familyList, allOpen, activeAccordions, source = "get" }) => {
    const [currentFamilyMember, setCurrentFamilyMember] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openAllOffensesAbroad, setOpenAllOffensesAbroad] = useState(false);
    const [data, setData] = useState(null);

    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const deletedFamilyMembers = useSelector((state) => state.myInfo.allTabs.family.deletedMembers);

    const dispatch = useDispatch();
    const profile = useSelector((state) => state.profile.data);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    const handleClick = (item) => {
        if (!modeRedactor) return;

        setCurrentFamilyMember(item);
        setShowEditModal(true);
    };

    const deleteFamilyMember = (id) => {
        if (id !== undefined) {
            try {
                dispatch(
                    setFieldValue({
                        fieldPath: "allTabs.family.deletedMembers",
                        value: [...deletedFamilyMembers, id],
                    }),
                );
                dispatch(
                    deleteByPath({
                        path: "familyProfile.family", //+
                        id: id, // +
                    }),
                );
                dispatch(
                    deleteByPathMyInfo({
                        path: "allTabs.family.members",
                        id: id,
                    }),
                );
                dispatch(
                    deleteByPathMyInfo({
                        path: "edited.family.members",
                        id: id,
                    }),
                );
            } catch (e) {
                console.log(e);
            }
        }
    };

    if (!familyList) return <NoData />;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <Row gutter={[16, 16]}>
                {currentFamilyMember && (
                    <ModalAddFamilyMemberEdit
                        familyMemberObject={currentFamilyMember}
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        source={source}
                    />
                )}
                {familyList.length > 0
                    ? familyList.map((item, i) => {
                          return (
                              <Col md={12} lg={12} xl={12} key={i}>
                                  <Collapse
                                      defaultActiveKey={"1"}
                                      expandIconPosition={"end"}
                                      style={{ backgroundColor: "#FFFF" }}
                                  >
                                      <Panel
                                          header={
                                              <>
                                                  <Text style={{ fontWeight: 500 }}>
                                                      <LocalizationText text={item?.relation} />
                                                  </Text>
                                                  {modeRedactor && isHR && (
                                                      <DeleteTwoTone
                                                          onClick={(event) => {
                                                              event.stopPropagation();
                                                              deleteFamilyMember(item.id);
                                                          }}
                                                          style={{ marginLeft: "10px" }}
                                                          twoToneColor="red"
                                                      />
                                                  )}
                                              </>
                                          }
                                          key={findAccordionByName(
                                              allOpen,
                                              activeAccordions,
                                              "Family",
                                              "1",
                                          )}
                                          style={{ color: "#1A3353" }}
                                          extra={
                                              <Button
                                                  size={"small"}
                                                  shape="round"
                                                  onClick={(event) => {
                                                      event.stopPropagation();
                                                      if (!item) {
                                                          return;
                                                      }
                                                      setData(item);
                                                      setOpenAllOffensesAbroad(true);
                                                  }}
                                              >
                                                  <IntlMessage id="family.additional.info" />
                                              </Button>
                                          }
                                      >
                                          <div onClick={() => handleClick(item)}>
                                              <Info info={item} />
                                          </div>
                                      </Panel>
                                  </Collapse>
                              </Col>
                          );
                      })
                    : !modeRedactor && <NoData />}
                {isHR && modeRedactor ? (
                    <ModalOffenceAbroadLocal
                        isOpen={openAllOffensesAbroad}
                        onClose={() => {
                            setOpenAllOffensesAbroad(false);
                        }}
                        data={data}
                    />
                ) : (
                    <ModalOffenceAbroadRemote
                        isOpen={openAllOffensesAbroad}
                        onClose={() => {
                            setOpenAllOffensesAbroad(false);
                        }}
                        data={data}
                    />
                )}
            </Row>
        </CollapseErrorBoundary>
    );
};

export default FamilyList;
