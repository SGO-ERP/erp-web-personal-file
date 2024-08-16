import { Col, Row } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import moment from "moment";
import CollapseErrorBoundary from "../../common/CollapseErrorBoundary";
import EditInput from "../../common/EditInput";
import EditDateInput from "../../common/EditDateInput";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useSelector } from "react-redux";
import EditMultipleSelect from "../../common/EditMultipleSelect";
import { useEffect, useState } from "react";
import NoSee from "../../NoSee";

const defaultText = {
    name: "Отсутствуют данные",
    nameKZ: "Деректер жоқ",
};

const categoryOptions = [
    {
        value: "A1",
        label: "A1",
    },
    {
        value: "A",
        label: "A",
    },
    {
        value: "B1",
        label: "B1",
    },
    {
        value: "B",
        label: "B",
    },
    {
        value: "BE",
        label: "BE",
    },
    {
        value: "C1",
        label: "C1",
    },
    {
        value: "C1E",
        label: "C1E",
    },
    {
        value: "C",
        label: "C",
    },
    {
        value: "CE",
        label: "CE",
    },
    {
        value: "D1",
        label: "D1",
    },
    {
        value: "D1E",
        label: "D1E",
    },
    {
        value: "D",
        label: "D",
    },
    {
        value: "DE",
        label: "DE",
    },
    {
        value: "Tm",
        label: "Tm",
    },
    {
        value: "Tb",
        label: "Tb",
    },
];

const DrivingLicense = ({ license, oldLicense, editLicense }) => {
    const [dateTo, setDateTo] = useState("");
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const { driving_license } = useSelector((state) => state.personalInfo.personalInfoData);

    const renderDateInput = (filedName, fieldNameGet, value, isDateTo) => {
        return modeRedactor ? (
            <EditDateInput
                defaultValue={value ? moment(value).format("DD.MM.YYYY") : ""}
                fieldName={filedName}
                fieldNameGet={fieldNameGet}
                isDateTo={isDateTo}
                disabled={isDateTo}
            />
        ) : value ? (
            <EditDateInput
                defaultValue={value ? moment(value).format("DD.MM.YYYY") : ""}
                fieldName={filedName}
                fieldNameGet={fieldNameGet}
            />
        ) : (
            LocalText.getName(defaultText)
        );
    };

    useEffect(() => {
        const currentDate =
            oldLicense.date_of_issue.value.trim() !== ""
                ? oldLicense.date_of_issue.value
                : license?.date_of_issue
                ? license?.date_of_issue
                : "";

        if (!currentDate) return;

        let [day, month, year] = currentDate.split(".");
        let newDate = new Date(Number(year) + 10, month - 1, day - 1);
        let newDateString = `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}`;

        setDateTo(newDateString);
    }, [license, oldLicense]);

    if (driving_license === "Permission Denied") {
        return <NoSee />;
    }

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <Row gutter={[18, 16]}>
                <Col xs={12} className={"font-style text-muted"}>
                    <IntlMessage id="personal.passport.documentNum" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    <EditInput
                        defaultValue={license?.document_number || ""}
                        fieldName="allTabs.personal_data.driving_license_info.document_number"
                        fieldNameGet="initialTabs.personal_data.driving_license_info.document_number"
                        id={license?.id}
                    />
                </Col>
                <Col xs={12} className={"font-style text-muted"}>
                    <IntlMessage id="personal.drivingLicense.category" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    {!license?.category && !modeRedactor ? (
                        LocalText.getName(defaultText)
                    ) : (
                        <EditMultipleSelect
                            options={categoryOptions}
                            defaultValue={license?.category}
                            fieldName="allTabs.personal_data.driving_license_info.category"
                            fieldNameGet="initialTabs.personal_data.driving_license_info.category"
                        />
                    )}
                </Col>
                <Col xs={12} className={"font-style text-muted"}>
                    <IntlMessage id="personal.passport.dateOfissue" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    {renderDateInput(
                        "allTabs.personal_data.driving_license_info.date_of_issue",
                        "initialTabs.personal_data.driving_license_info.date_of_issue",
                        license?.date_of_issue,
                    )}
                </Col>
                <Col xs={12} className={"font-style text-muted"}>
                    <IntlMessage id="personal.passport.validity" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    {renderDateInput(
                        "allTabs.personal_data.driving_license_info.date_to",
                        "initialTabs.personal_data.driving_license_info.date_to",
                        dateTo,
                        true,
                    )}
                </Col>
            </Row>
        </CollapseErrorBoundary>
    );
};

export default DrivingLicense;
