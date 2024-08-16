import {
    FileAddOutlined,
    FileMarkdownOutlined,
    FilePdfTwoTone,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { Col, Collapse, Row, Typography } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "store/slices/ProfileSlice";
import { getUserID } from "utils/helpers/common";
import { useAppSelector } from "../../../../../../hooks/useStore";
import {
    getNameChangedHistory,
    getPersonalInfo,
} from "../../../../../../store/slices/myInfo/personalInfoSlice";
import {
    getSportDegree,
    getSportTypes,
} from "../../../../../../store/slices/myInfo/sportTypeSlice";
import ModalForDoc from "../../modals/ModalForDoc";
import ModalNameEdit from "../Education/modals/ModalNameEdit";
import NoData from "../NoData";
import ModalController from "../common/ModalController";
import ShowAll from "../common/ShowAll";
import ShowOnlyForRedactor from "../common/ShowOnlyForRedactor";
import Spinner from "../common/Spinner";
import findAccordionByName from "../common/findAccordionByName";
import BiographicInfo from "./BiographicInfo/BiographicInfo";
import DrivingLicense from "./DrivingLicense/DrivingLicense";
import IdentificationCard from "./IdentificationCard/IdentificationCard";
import NameChangesHistory from "./NameChangesHistory/NameChangesHistory";
import Passport from "./Passport/Passport";
import { SportDegreeTable } from "./ShowAllPersonalDataTable";
import SportAchievement from "./SportAchievement/SportAchievement";
import SportDegree from "./SportDegree/SportDegree";
import ModalAddFinancialInfo from "./UserFinancialInfo/ModalAddFinancialInfo";
import UserFinancialInfo from "./UserFinancialInfo/UserFinancialInfo";
import ModalAddDriverLicense from "./modals/ModalAddDriverLicense";
import ModalAddIdentityCard from "./modals/ModalAddIdentityCard";
import ModalAddPassport from "./modals/ModalAddPassport";
import ModalAllAchievements from "./modals/ModalAllAchievements";
import ModalEditDriverLicense from "./modals/ModalEditDriverLicense";
import ModalEditIdentityCard from "./modals/ModalEditIdentityCard";
import ModalEditPassport from "./modals/ModalEditPassport";
import ModalSkillSports from "./modals/ModalSkillSports";
import { getUser } from "store/slices/users/usersSlice";
import { PERMISSION } from "constants/permission";

const { Panel } = Collapse;
const { Text } = Typography;

const Second = ({ id, activeAccordions, allOpen }) => {
    const [modalState, setModalState] = useState({
        open: false,
        link: "",
    });

    const personal_data_remote = useSelector((state) => state.personalInfo.personalInfoData);
    const nameChangedHistory = useSelector((state) => state.personalInfo.nameChangeHistory);
    const loading = useSelector((state) => state.personalInfo.loading);
    const dispatch = useDispatch();
    const personal_data_local = useSelector((state) => state.myInfo.allTabs.personal_data);
    const personal_data_edited = useSelector((state) => state.myInfo.edited.personal_data);

    const takesLength = (type) => {
        if (!personal_data_remote) return 0;
        if (!personal_data_remote[type.remote]) return 0;

        const remoteLength = personal_data_remote[type.remote].length;

        const deleteEditedLength = personal_data_edited[type.other].every((item) => item.delete)
            ? 0
            : personal_data_edited[type.other].length;

        const deleteLocalLength = personal_data_local[type.other].every((item) => item.delete)
            ? 0
            : personal_data_local[type.other].length;

        return remoteLength + deleteEditedLength + deleteLocalLength;
    };

    const user = useAppSelector((state) => state.users.user);
    const myProfile = useAppSelector((state) => state.profile.data);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    useEffect(() => {
        dispatch(getPersonalInfo(id));
        dispatch(getNameChangedHistory(id));
        dispatch(getSportDegree());
        dispatch(getSportTypes());
    }, []);

    // Instructor
    useEffect(() => {
        if (myProfile !== null) {
            dispatch(getUser(id));
        }

        const getUserById = async () => {
            dispatch(getProfile({ id: await getUserID() }));
        };
        if (myProfile === null) {
            getUserById();
        }
    }, [myProfile]);

    if (loading) {
        return <Spinner />;
    }
    if (!user || !user?.actual_staff_unit || Array.isArray(user)) {
        return null;
    }

    return (
        <div>
            <Row gutter={[18, 16]}>
                <Col xl={12}>
                    <Row gutter={[18, 16]}>
                        <Col xs={24}>
                            <Collapse
                                defaultActiveKey={["1"]}
                                expandIconPosition={"end"}
                                style={{ backgroundColor: "#FFFF" }}
                            >
                                <Panel
                                    header={
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.personalData.biographicInfo" />
                                        </Text>
                                    }
                                    key={findAccordionByName(
                                        allOpen,
                                        activeAccordions,
                                        "Биографические данные",
                                        "1",
                                    )}
                                >
                                    <BiographicInfo bio={personal_data_remote.biographic_info} />
                                </Panel>
                            </Collapse>
                        </Col>

                        <Col xs={24}>
                            <Collapse
                                defaultActiveKey={["1", "2", "3"]}
                                expandIconPosition={"end"}
                                style={{ backgroundColor: "#FFFF" }}
                            >
                                <Panel
                                    header={
                                        <Row gutter={16}>
                                            <Col>
                                                <Text style={{ fontWeight: 500 }}>
                                                    <IntlMessage id="personal.personalData.IDInformation" />
                                                </Text>
                                            </Col>
                                            {personal_data_remote?.identification_card !== null &&
                                            personal_data_remote?.identification_card
                                                ?.document_link !== null &&
                                            personal_data_remote?.identification_card?.id !==
                                                personal_data_edited
                                                    ?.identification_card_document_link?.id ? (
                                                <Col>
                                                    <FilePdfTwoTone
                                                        style={{ fontSize: "20px" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModalState({
                                                                open: false,
                                                                link: personal_data_remote
                                                                    .identification_card
                                                                    .document_link,
                                                            });
                                                        }}
                                                    />
                                                </Col>
                                            ) : Object.keys(
                                                  personal_data_local?.identification_card_document_link,
                                              ).length !== 0 &&
                                              personal_data_local?.identification_card_document_link
                                                  ?.document_link ? (
                                                <Col>
                                                    <FilePdfTwoTone
                                                        style={{ fontSize: "20px" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModalState({
                                                                open: false,
                                                                link: personal_data_local
                                                                    .identification_card_document_link
                                                                    .document_link,
                                                            });
                                                        }}
                                                    />
                                                </Col>
                                            ) : (
                                                Object.keys(
                                                    personal_data_edited?.identification_card_document_link,
                                                ).length !== 0 &&
                                                personal_data_edited
                                                    ?.identification_card_document_link
                                                    ?.document_link &&
                                                !personal_data_edited
                                                    ?.identification_card_document_link?.delete && (
                                                    <Col>
                                                        <FilePdfTwoTone
                                                            style={{ fontSize: "20px" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setModalState({
                                                                    open: false,
                                                                    link: personal_data_edited
                                                                        .identification_card_document_link
                                                                        .document_link,
                                                                });
                                                            }}
                                                        />
                                                    </Col>
                                                )
                                            )}
                                            <Col>
                                                {isHR &&
                                                    (personal_data_remote?.identification_card ===
                                                        null &&
                                                    Object.keys(
                                                        personal_data_local?.identification_card_document_link,
                                                    ).length === 0 &&
                                                    (Object.keys(
                                                        personal_data_edited?.identification_card_document_link,
                                                    ).length === 0 ||
                                                        personal_data_edited
                                                            ?.identification_card_document_link
                                                            ?.delete) ? (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalAddIdentityCard
                                                                            identitycard={
                                                                                personal_data_remote?.identification_card
                                                                            }
                                                                            source={"add"}
                                                                        />
                                                                        <FileAddOutlined
                                                                            style={{
                                                                                fontSize: "20px",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    ) : personal_data_remote?.identification_card
                                                          ?.document_link === null &&
                                                      Object.keys(
                                                          personal_data_local?.identification_card_document_link,
                                                      ).length === 0 &&
                                                      (Object.keys(
                                                          personal_data_edited?.identification_card_document_link,
                                                      ).length === 0 ||
                                                          personal_data_edited
                                                              ?.identification_card_document_link
                                                              ?.delete) ? (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalAddIdentityCard
                                                                            identitycard={
                                                                                personal_data_remote?.identification_card
                                                                            }
                                                                            source={"edit"}
                                                                        />
                                                                        <FileAddOutlined
                                                                            style={{
                                                                                fontSize: "20px",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    ) : personal_data_remote?.identification_card
                                                          ?.document_link !== null &&
                                                      personal_data_remote?.identification_card
                                                          ?.id ===
                                                          personal_data_edited
                                                              ?.identification_card_document_link
                                                              ?.id &&
                                                      Object.keys(
                                                          personal_data_local?.identification_card_document_link,
                                                      ).length === 0 ? (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalAddIdentityCard
                                                                            identitycard={
                                                                                personal_data_remote?.identification_card
                                                                            }
                                                                            source={"edit"}
                                                                        />
                                                                        <FileAddOutlined
                                                                            style={{
                                                                                fontSize: "20px",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    ) : personal_data_remote?.identification_card
                                                          ?.document_link !== null &&
                                                      Object.keys(
                                                          personal_data_local?.identification_card_document_link,
                                                      ).length === 0 &&
                                                      (Object.keys(
                                                          personal_data_edited?.identification_card_document_link,
                                                      ).length === 0 ||
                                                          personal_data_edited
                                                              ?.identification_card_document_link
                                                              ?.delete) ? (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalEditIdentityCard
                                                                            identityCardDocument={
                                                                                personal_data_remote?.identification_card
                                                                            }
                                                                            source={"get"}
                                                                        />
                                                                        <FileMarkdownOutlined
                                                                            style={{
                                                                                fontSize: "20px",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    ) : personal_data_remote?.identification_card
                                                          ?.document_link === null &&
                                                      Object.keys(
                                                          personal_data_local?.identification_card_document_link,
                                                      ).length !== 0 &&
                                                      (Object.keys(
                                                          personal_data_edited?.identification_card_document_link,
                                                      ).length === 0 ||
                                                          personal_data_edited
                                                              ?.identification_card_document_link
                                                              ?.delete) ? (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalEditIdentityCard
                                                                            identityCardDocument={
                                                                                personal_data_local?.identification_card_document_link
                                                                            }
                                                                            source={"added"}
                                                                        />
                                                                        <FileMarkdownOutlined
                                                                            style={{
                                                                                fontSize: "20px",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    ) : (
                                                        personal_data_remote?.identification_card
                                                            ?.document_link === null &&
                                                        Object.keys(
                                                            personal_data_local?.identification_card_document_link,
                                                        ).length === 0 &&
                                                        (Object.keys(
                                                            personal_data_edited?.identification_card_document_link,
                                                        ).length !== 0 ||
                                                            !personal_data_edited
                                                                ?.identification_card_document_link
                                                                ?.delete) && (
                                                            <ShowOnlyForRedactor
                                                                forRedactor={
                                                                    <Col>
                                                                        <ModalController>
                                                                            <ModalEditIdentityCard
                                                                                identityCardDocument={
                                                                                    personal_data_edited?.identification_card_document_link
                                                                                }
                                                                                source={"edited"}
                                                                            />
                                                                            <FileMarkdownOutlined
                                                                                style={{
                                                                                    fontSize:
                                                                                        "20px",
                                                                                }}
                                                                            />
                                                                        </ModalController>
                                                                    </Col>
                                                                }
                                                            />
                                                        )
                                                    ))}
                                            </Col>
                                        </Row>
                                    }
                                    key={findAccordionByName(
                                        allOpen,
                                        activeAccordions,
                                        "Данные по удостоверению личности",
                                        "2",
                                    )}
                                >
                                    <IdentificationCard
                                        data={personal_data_remote.identification_card}
                                        oldData={personal_data_local.identification_card}
                                    />
                                </Panel>
                                <Panel
                                    header={
                                        <span>
                                            <Row gutter={16}>
                                                <Col lg={9}>
                                                    <Text style={{ fontWeight: 500 }}>
                                                        <IntlMessage id="personal.personalData.drivingLicenseInformation" />
                                                    </Text>
                                                </Col>
                                                {personal_data_remote?.driving_license !== null &&
                                                personal_data_remote?.driving_license
                                                    ?.document_link !== null &&
                                                personal_data_remote?.driving_license?.id !==
                                                    personal_data_edited?.driving_license?.[0]
                                                        ?.id ? (
                                                    <Col>
                                                        <FilePdfTwoTone
                                                            style={{ fontSize: "20px" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setModalState({
                                                                    open: false,
                                                                    link: personal_data_remote
                                                                        .driving_license
                                                                        .document_link,
                                                                });
                                                            }}
                                                        />
                                                    </Col>
                                                ) : personal_data_local?.driving_license.length >
                                                      0 &&
                                                  personal_data_local?.driving_license
                                                      ?.document_link ? (
                                                    <Col>
                                                        <FilePdfTwoTone
                                                            style={{ fontSize: "20px" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setModalState({
                                                                    open: false,
                                                                    link: personal_data_local
                                                                        .driving_license[0]
                                                                        .document_link,
                                                                });
                                                            }}
                                                        />
                                                    </Col>
                                                ) : (
                                                    personal_data_edited?.driving_license.length >
                                                        0 &&
                                                    personal_data_edited?.driving_license?.[0]
                                                        .document_link &&
                                                    !personal_data_edited?.driving_license?.[0]
                                                        .delete && (
                                                        <Col>
                                                            <FilePdfTwoTone
                                                                style={{ fontSize: "20px" }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setModalState({
                                                                        open: false,
                                                                        link: personal_data_edited
                                                                            .driving_license[0]
                                                                            .document_link,
                                                                    });
                                                                }}
                                                            />
                                                        </Col>
                                                    )
                                                )}
                                                <Col>
                                                    {isHR &&
                                                        (personal_data_remote.driving_license ===
                                                            null &&
                                                        personal_data_local?.driving_license
                                                            .length === 0 &&
                                                        (personal_data_edited?.driving_license
                                                            .length > 0
                                                            ? personal_data_edited?.driving_license?.filter(
                                                                  (item) => !item.delete,
                                                              )?.length === 0
                                                            : personal_data_edited?.driving_license
                                                                  .length === 0 &&
                                                              personal_data_edited?.driving_license
                                                                  .length === 0) ? (
                                                            <ShowOnlyForRedactor
                                                                forRedactor={
                                                                    <Col>
                                                                        <ModalController>
                                                                            <ModalAddDriverLicense
                                                                                driverlicense={
                                                                                    personal_data_remote?.driving_license
                                                                                }
                                                                                source={"add"}
                                                                            />
                                                                            <FileAddOutlined
                                                                                style={{
                                                                                    fontSize:
                                                                                        "20px",
                                                                                }}
                                                                            />
                                                                        </ModalController>
                                                                    </Col>
                                                                }
                                                            />
                                                        ) : personal_data_remote?.driving_license
                                                              ?.document_link === null &&
                                                          personal_data_local?.driving_license
                                                              .length === 0 &&
                                                          (personal_data_edited?.driving_license
                                                              .length > 0
                                                              ? personal_data_edited?.driving_license?.filter(
                                                                    (item) => !item.delete,
                                                                )?.length === 0
                                                              : personal_data_edited
                                                                    ?.driving_license.length ===
                                                                    0 &&
                                                                personal_data_edited
                                                                    ?.driving_license.length ===
                                                                    0) ? (
                                                            <ShowOnlyForRedactor
                                                                forRedactor={
                                                                    <Col>
                                                                        <ModalController>
                                                                            <ModalAddDriverLicense
                                                                                driverlicense={
                                                                                    personal_data_remote?.driving_license
                                                                                }
                                                                                source={"edit"}
                                                                            />
                                                                            <FileAddOutlined
                                                                                style={{
                                                                                    fontSize:
                                                                                        "20px",
                                                                                }}
                                                                            />
                                                                        </ModalController>
                                                                    </Col>
                                                                }
                                                            />
                                                        ) : personal_data_remote?.driving_license
                                                              ?.document_link !== null &&
                                                          personal_data_local?.driving_license
                                                              .length === 0 &&
                                                          (personal_data_edited?.driving_license
                                                              .length > 0
                                                              ? personal_data_edited?.driving_license?.filter(
                                                                    (item) => !item.delete,
                                                                )?.length === 0
                                                              : personal_data_edited
                                                                    ?.driving_license.length ===
                                                                    0 &&
                                                                personal_data_edited
                                                                    ?.driving_license.length ===
                                                                    0) ? (
                                                            <ShowOnlyForRedactor
                                                                forRedactor={
                                                                    <Col>
                                                                        <ModalController>
                                                                            <ModalEditDriverLicense
                                                                                DriverLicenseDocument={
                                                                                    personal_data_remote?.driving_license
                                                                                }
                                                                                source={"get"}
                                                                            />
                                                                            <FileMarkdownOutlined
                                                                                style={{
                                                                                    fontSize:
                                                                                        "20px",
                                                                                }}
                                                                            />
                                                                        </ModalController>
                                                                    </Col>
                                                                }
                                                            />
                                                        ) : personal_data_remote?.driving_license
                                                              ?.document_link === null &&
                                                          personal_data_local?.driving_license
                                                              .length > 0 &&
                                                          (personal_data_edited?.driving_license
                                                              .length > 0
                                                              ? personal_data_edited?.driving_license?.filter(
                                                                    (item) => !item.delete,
                                                                )?.length === 0
                                                              : personal_data_edited
                                                                    ?.driving_license.length ===
                                                                    0 &&
                                                                personal_data_edited
                                                                    ?.driving_license.length ===
                                                                    0) ? (
                                                            <ShowOnlyForRedactor
                                                                forRedactor={
                                                                    <Col>
                                                                        <ModalController>
                                                                            <ModalEditDriverLicense
                                                                                DriverLicenseDocument={
                                                                                    personal_data_local?.driving_license
                                                                                }
                                                                                source={"added"}
                                                                            />
                                                                            <FileMarkdownOutlined
                                                                                style={{
                                                                                    fontSize:
                                                                                        "20px",
                                                                                }}
                                                                            />
                                                                        </ModalController>
                                                                    </Col>
                                                                }
                                                            />
                                                        ) : (
                                                            personal_data_remote?.driving_license
                                                                ?.document_link === null &&
                                                            personal_data_local?.driving_license
                                                                .length === 0 &&
                                                            (personal_data_edited?.driving_license
                                                                .length > 0
                                                                ? personal_data_edited?.driving_license?.filter(
                                                                      (item) => !item.delete,
                                                                  )?.length !== 0
                                                                : personal_data_edited
                                                                      ?.driving_license.length ===
                                                                      0 &&
                                                                  personal_data_edited
                                                                      ?.driving_license.length !==
                                                                      0) && (
                                                                <ShowOnlyForRedactor
                                                                    forRedactor={
                                                                        <Col>
                                                                            <ModalController>
                                                                                <ModalEditDriverLicense
                                                                                    DriverLicenseDocument={
                                                                                        personal_data_edited?.driving_license
                                                                                    }
                                                                                    source={
                                                                                        "edited"
                                                                                    }
                                                                                />
                                                                                <FileMarkdownOutlined
                                                                                    style={{
                                                                                        fontSize:
                                                                                            "20px",
                                                                                    }}
                                                                                />
                                                                            </ModalController>
                                                                        </Col>
                                                                    }
                                                                />
                                                            )
                                                        ))}
                                                </Col>
                                            </Row>
                                        </span>
                                    }
                                    key={findAccordionByName(
                                        allOpen,
                                        activeAccordions,
                                        "Данные по водительским правам",
                                        "3",
                                    )}
                                >
                                    <DrivingLicense
                                        license={personal_data_remote.driving_license}
                                        oldLicense={personal_data_local.driving_license_info}
                                        editLicense={personal_data_edited.driving_license_info}
                                    />
                                </Panel>
                                <Panel
                                    header={
                                        <Row gutter={16}>
                                            <Col>
                                                <Text style={{ fontWeight: 500 }}>
                                                    <IntlMessage id="personal.personalData.passportDetails" />
                                                </Text>
                                            </Col>
                                            {personal_data_remote?.passport !== null &&
                                            personal_data_remote?.passport?.document_link !==
                                                null &&
                                            personal_data_remote?.passport?.id !==
                                                personal_data_edited?.passport_document_link?.id ? (
                                                <Col>
                                                    <FilePdfTwoTone
                                                        style={{ fontSize: "20px" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModalState({
                                                                open: false,
                                                                link: personal_data_remote.passport
                                                                    .document_link,
                                                            });
                                                        }}
                                                    />
                                                </Col>
                                            ) : Object.keys(
                                                  personal_data_local?.passport_document_link,
                                              ).length !== 0 &&
                                              personal_data_local?.passport_document_link
                                                  ?.document_link ? (
                                                <Col>
                                                    <FilePdfTwoTone
                                                        style={{ fontSize: "20px" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModalState({
                                                                open: false,
                                                                link: personal_data_local
                                                                    .passport_document_link
                                                                    .document_link,
                                                            });
                                                        }}
                                                    />
                                                </Col>
                                            ) : (
                                                Object.keys(
                                                    personal_data_edited?.passport_document_link,
                                                ).length !== 0 &&
                                                personal_data_edited?.passport_document_link
                                                    ?.document_link &&
                                                !personal_data_edited?.passport_document_link
                                                    ?.delete && (
                                                    <Col>
                                                        <FilePdfTwoTone
                                                            style={{ fontSize: "20px" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setModalState({
                                                                    open: false,
                                                                    link: personal_data_edited
                                                                        .passport_document_link
                                                                        .document_link,
                                                                });
                                                            }}
                                                        />
                                                    </Col>
                                                )
                                            )}
                                            <Col>
                                                {isHR &&
                                                    (personal_data_remote?.passport === null &&
                                                    Object.keys(
                                                        personal_data_local?.passport_document_link,
                                                    ).length === 0 &&
                                                    (Object.keys(
                                                        personal_data_edited?.passport_document_link,
                                                    ).length === 0 ||
                                                        personal_data_edited?.passport_document_link
                                                            .delete) ? (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalAddPassport
                                                                            passport={
                                                                                personal_data_remote?.passport_document_link
                                                                            }
                                                                            source={"add"}
                                                                        />
                                                                        <FileAddOutlined
                                                                            style={{
                                                                                fontSize: "20px",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    ) : personal_data_remote?.passport
                                                          ?.document_link === null &&
                                                      Object.keys(
                                                          personal_data_local?.passport_document_link,
                                                      ).length === 0 &&
                                                      (Object.keys(
                                                          personal_data_edited?.passport_document_link,
                                                      ).length === 0 ||
                                                          personal_data_edited
                                                              ?.passport_document_link.delete) ? (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalAddPassport
                                                                            passport={
                                                                                personal_data_remote?.passport_document_link
                                                                            }
                                                                            source={"edit"}
                                                                        />
                                                                        <FileAddOutlined
                                                                            style={{
                                                                                fontSize: "20px",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    ) : personal_data_remote?.passport
                                                          ?.document_link !== null &&
                                                      Object.keys(
                                                          personal_data_local?.passport_document_link,
                                                      ).length === 0 &&
                                                      (Object.keys(
                                                          personal_data_edited?.passport_document_link,
                                                      ).length === 0 ||
                                                          personal_data_edited
                                                              ?.passport_document_link.delete) ? (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalEditPassport
                                                                            passportDocument={
                                                                                personal_data_remote?.passport
                                                                            }
                                                                            source={"get"}
                                                                        />
                                                                        <FileMarkdownOutlined
                                                                            style={{
                                                                                fontSize: "20px",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    ) : personal_data_remote?.passport
                                                          ?.document_link === null &&
                                                      Object.keys(
                                                          personal_data_local?.passport_document_link,
                                                      ).length !== 0 &&
                                                      (Object.keys(
                                                          personal_data_edited?.passport_document_link,
                                                      ).length === 0 ||
                                                          personal_data_edited
                                                              ?.passport_document_link.delete) ? (
                                                        <ShowOnlyForRedactor
                                                            forRedactor={
                                                                <Col>
                                                                    <ModalController>
                                                                        <ModalEditPassport
                                                                            passportDocument={
                                                                                personal_data_local?.passport_document_link
                                                                            }
                                                                            source={"added"}
                                                                        />
                                                                        <FileMarkdownOutlined
                                                                            style={{
                                                                                fontSize: "20px",
                                                                            }}
                                                                        />
                                                                    </ModalController>
                                                                </Col>
                                                            }
                                                        />
                                                    ) : (
                                                        personal_data_remote?.passport
                                                            ?.document_link === null &&
                                                        Object.keys(
                                                            personal_data_local?.passport_document_link,
                                                        ).length === 0 &&
                                                        (Object.keys(
                                                            personal_data_edited?.passport_document_link,
                                                        ).length !== 0 ||
                                                            !personal_data_edited
                                                                ?.passport_document_link
                                                                .delete) && (
                                                            <ShowOnlyForRedactor
                                                                forRedactor={
                                                                    <Col>
                                                                        <ModalController>
                                                                            <ModalEditPassport
                                                                                passportDocument={
                                                                                    personal_data_edited?.passport_document_link
                                                                                }
                                                                                source={"edited"}
                                                                            />
                                                                            <FileMarkdownOutlined
                                                                                style={{
                                                                                    fontSize:
                                                                                        "20px",
                                                                                }}
                                                                            />
                                                                        </ModalController>
                                                                    </Col>
                                                                }
                                                            />
                                                        )
                                                    ))}
                                            </Col>
                                        </Row>
                                    }
                                    key={findAccordionByName(
                                        allOpen,
                                        activeAccordions,
                                        "Данные по паспорту",
                                        "1",
                                    )}
                                >
                                    <Passport
                                        passport={personal_data_remote.passport}
                                        oldPassport={personal_data_local.passport}
                                    />
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                </Col>
                <Col xl={12}>
                    <Row gutter={[18, 16]}>
                        <Col xs={24}>
                            <Collapse
                                defaultActiveKey={["5"]}
                                expandIconPosition={"end"}
                                style={{ backgroundColor: "#FFFF" }}
                            >
                                <Panel
                                    header={
                                        <Row gutter={16}>
                                            <Col>
                                                <Text style={{ fontWeight: 500 }}>
                                                    <IntlMessage id="personal.personalData.accountInformation" />
                                                </Text>
                                            </Col>
                                            {isHR &&
                                                personal_data_remote.user_financial_infos
                                                    ?.length === 0 &&
                                                (personal_data_local.financial_info.iban === "" ||
                                                    personal_data_local.financial_info
                                                        .housing_payments_iban === "") &&
                                                (personal_data_edited.financial_info.iban === "" ||
                                                    personal_data_edited.financial_info
                                                        .housing_payments_iban === "") && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <Col>
                                                                <ModalController>
                                                                    <ModalAddFinancialInfo />
                                                                    <PlusCircleOutlined
                                                                        style={{
                                                                            fontSize: "13px",
                                                                            color: "#366EF6",
                                                                        }}
                                                                    />
                                                                </ModalController>
                                                            </Col>
                                                        }
                                                    />
                                                )}
                                        </Row>
                                    }
                                    key={findAccordionByName(
                                        allOpen,
                                        activeAccordions,
                                        "Информация о счетах",
                                        5,
                                    )}
                                >
                                    {personal_data_remote.user_financial_infos?.length > 0 ||
                                    personal_data_local.financial_info.iban !== "" ||
                                    personal_data_local.financial_info.housing_payments_iban !==
                                        "" ||
                                    personal_data_edited.financial_info.iban !== "" ||
                                    personal_data_edited.financial_info.housing_payments_iban !==
                                        "" ? (
                                        <div>
                                            {personal_data_remote.user_financial_infos?.length >
                                                0 && (
                                                <UserFinancialInfo
                                                    financial={
                                                        personal_data_remote.user_financial_infos &&
                                                        personal_data_remote.user_financial_infos[0]
                                                    }
                                                    source="get"
                                                />
                                            )}
                                            {(personal_data_local.financial_info.iban !== "" ||
                                                personal_data_local.financial_info
                                                    .housing_payments_iban !== "") && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <UserFinancialInfo
                                                            financial={
                                                                personal_data_local.financial_info
                                                            }
                                                            source="added"
                                                        />
                                                    }
                                                />
                                            )}
                                            {(personal_data_edited.financial_info.iban !== "" ||
                                                personal_data_edited.financial_info
                                                    .housing_payments_iban !== "") && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <UserFinancialInfo
                                                            financial={
                                                                personal_data_edited.financial_info
                                                            }
                                                            source="edited"
                                                        />
                                                    }
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <NoData />
                                    )}
                                </Panel>
                            </Collapse>
                        </Col>

                        <Col xs={24}>
                            <Collapse
                                defaultActiveKey={["6", "7"]}
                                expandIconPosition={"end"}
                                style={{ backgroundColor: "#FFFF" }}
                            >
                                <Panel
                                    header={
                                        <Row gutter={16}>
                                            <Col>
                                                <Text style={{ fontWeight: 500 }}>
                                                    <IntlMessage id="personal.personalData.sportsSkills" />
                                                </Text>
                                            </Col>

                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <Col>
                                                            <ModalController>
                                                                <ModalSkillSports />
                                                                <PlusCircleOutlined
                                                                    style={{
                                                                        fontSize: "13px",
                                                                        color: "#366EF6",
                                                                    }}
                                                                />
                                                            </ModalController>
                                                        </Col>
                                                    }
                                                />
                                            )}
                                        </Row>
                                    }
                                    key={findAccordionByName(
                                        allOpen,
                                        activeAccordions,
                                        "Навыки владения спортом",
                                        "6",
                                    )}
                                    extra={
                                        personal_data_remote?.sport_degrees?.length ? (
                                            <ShowAll intlId={"personal.personalData.sportsSkills"}>
                                                <SportDegreeTable
                                                    data={personal_data_remote?.sport_degrees}
                                                />
                                            </ShowAll>
                                        ) : null
                                    }
                                    className={"panel-with-hide"}
                                >
                                    {takesLength({
                                        remote: "sport_degrees",
                                        other: "sport_degrees",
                                    }) > 0 ? (
                                        <>
                                            <SportDegree
                                                degrees={personal_data_remote.sport_degrees}
                                                setModalState={setModalState}
                                            />
                                            <ShowOnlyForRedactor
                                                forRedactor={
                                                    <div style={{ marginTop: 15 }}>
                                                        <SportDegree
                                                            degrees={
                                                                personal_data_local.sport_degrees
                                                            }
                                                            source="added"
                                                            setModalState={setModalState}
                                                        />
                                                        <SportDegree
                                                            degrees={
                                                                personal_data_edited.sport_degrees
                                                            }
                                                            source="edited"
                                                            setModalState={setModalState}
                                                        />
                                                    </div>
                                                }
                                            />
                                        </>
                                    ) : (
                                        <NoData />
                                    )}
                                </Panel>
                                <Panel
                                    header={
                                        <Row gutter={16}>
                                            <Col>
                                                <Text style={{ fontWeight: 500 }}>
                                                    <IntlMessage id="personal.personalData.AchievementsInSports" />
                                                </Text>
                                            </Col>

                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <Col>
                                                            <ModalController>
                                                                <ModalAllAchievements />
                                                                <PlusCircleOutlined
                                                                    style={{
                                                                        fontSize: "13px",
                                                                        color: "#366EF6",
                                                                    }}
                                                                />
                                                            </ModalController>
                                                        </Col>
                                                    }
                                                />
                                            )}
                                        </Row>
                                    }
                                    key={findAccordionByName(
                                        allOpen,
                                        activeAccordions,
                                        "Достижения в спорте",
                                        7,
                                    )}
                                    extra={
                                        personal_data_remote?.sport_achievements?.length ? (
                                            <ShowAll
                                                intlId={
                                                    "personal.personalData.AchievementsInSports"
                                                }
                                            >
                                                <SportDegreeTable
                                                    data={personal_data_remote?.sport_achievements}
                                                />
                                            </ShowAll>
                                        ) : null
                                    }
                                    className={"panel-with-hide"}
                                >
                                    {takesLength({
                                        remote: "sport_achievements",
                                        other: "sport_achievements",
                                    }) > 0 ? (
                                        <>
                                            <SportAchievement
                                                setModalState={setModalState}
                                                achievements={
                                                    personal_data_remote.sport_achievements
                                                }
                                            />
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <div style={{ marginTop: 15 }}>
                                                            <SportAchievement
                                                                achievements={
                                                                    personal_data_local.sport_achievements
                                                                }
                                                                source="added"
                                                                setModalState={setModalState}
                                                            />
                                                            <SportAchievement
                                                                achievements={
                                                                    personal_data_edited.sport_achievements
                                                                }
                                                                source="edited"
                                                                setModalState={setModalState}
                                                            />
                                                        </div>
                                                    }
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <NoData />
                                    )}
                                </Panel>
                            </Collapse>
                        </Col>
                        <Col xs={24}>
                            <Collapse
                                defaultActiveKey={["8"]}
                                expandIconPosition={"end"}
                                style={{ backgroundColor: "#FFFF" }}
                            >
                                <Panel
                                    header={
                                        <Row gutter={16}>
                                            <Col>
                                                <Text style={{ fontWeight: 500 }}>
                                                    <IntlMessage id="personal.personalData.nameChangesHistory" />
                                                </Text>
                                            </Col>

                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <Col>
                                                            <ModalController>
                                                                <ModalNameEdit />
                                                                <PlusCircleOutlined
                                                                    style={{
                                                                        fontSize: "13px",
                                                                        color: "#366EF6",
                                                                    }}
                                                                />
                                                            </ModalController>
                                                        </Col>
                                                    }
                                                />
                                            )}
                                        </Row>
                                    }
                                    key={findAccordionByName(
                                        allOpen,
                                        activeAccordions,
                                        "Изменения ФИО",
                                        8,
                                    )}
                                >
                                    <Row gutter={[18, 16]}>
                                        {nameChangedHistory?.length +
                                            personal_data_local.name_change?.length +
                                            personal_data_edited.name_change?.filter(
                                                (item) => !item.delete,
                                            ).length >
                                        0 ? (
                                            <>
                                                <NameChangesHistory
                                                    // TEMP: key={name.id}
                                                    initialsHistory={nameChangedHistory}
                                                    source="get"
                                                />
                                                {isHR && (
                                                    <ShowOnlyForRedactor
                                                        forRedactor={
                                                            <div style={{ marginTop: 15 }}>
                                                                <NameChangesHistory
                                                                    initialsHistory={
                                                                        personal_data_local.name_change
                                                                    }
                                                                    source="added"
                                                                />
                                                                <NameChangesHistory
                                                                    initialsHistory={
                                                                        personal_data_edited.name_change
                                                                    }
                                                                    source="edited"
                                                                />
                                                            </div>
                                                        }
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <NoData />
                                        )}
                                    </Row>
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <ModalForDoc setModalState={setModalState} modalState={modalState} />
        </div>
    );
};

export default Second;
