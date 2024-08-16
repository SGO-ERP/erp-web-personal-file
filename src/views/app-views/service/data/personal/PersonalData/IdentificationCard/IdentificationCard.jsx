import { Col, Row } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import moment from "moment/moment";
import CollapseErrorBoundary from "../../common/CollapseErrorBoundary";
import EditInput from "../../common/EditInput";
import EditDateInput from "../../common/EditDateInput";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useSelector } from "react-redux";
import EditSelect from "../../common/EditSelect";
import { useEffect, useState } from "react";
import NoSee from "../../NoSee";

const defaultText = {
    name: "Отсутствуют данные",
    nameKZ: "Деректер жоқ",
};

const issuedByOptions = [
    {
        value: "Министерство внутренних дел РК",
        label: LocalText.getName({
            name: "Министерство внутренних дел РК",
            nameKZ: "ҚР iшкі істер министрлігі",
        }),
    },
    {
        value: "Министерство иностранных дел РК",
        label: LocalText.getName({
            name: "Министерство иностранных дел РК",
            nameKZ: "ҚР Сыртқы істер министрлігі",
        }),
    },
    {
        value: "Министерство юстиции РК",
        label: LocalText.getName({
            name: "Министерство юстиции РК",
            nameKZ: "ҚР Әділет министрлігі",
        }),
    },
];

const IdentificationCard = ({ data, oldData }) => {
    const [dateTo, setDateTo] = useState("");
    const { modeRedactor } = useSelector((state) => state.myInfo);
    const { identification_card } = useSelector((state) => state.personalInfo.personalInfoData);

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
            oldData.date_of_issue.value.trim() !== ""
                ? oldData.date_of_issue.value
                : data?.date_of_issue
                ? data?.date_of_issue
                : "";

        if (!currentDate) return;

        let [day, month, year] = currentDate.split(".");
        const date = moment(`${year}-${month}-${day}`);
        const newDate = date.add(10, "years").subtract(1, "day");
        const newDateString = newDate.format("YYYY-MM-DD");

        setDateTo(newDateString);
    }, [data, oldData]);

    if (identification_card === "Permission Denied") {
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
                        defaultValue={data?.document_number || ""}
                        fieldName="allTabs.personal_data.identification_card.document_number"
                        fieldNameGet="initialTabs.personal_data.identification_card.document_number"
                        id={data?.id}
                    />
                </Col>
                <Col xs={12} className={"font-style text-muted"}>
                    <IntlMessage id="personal.passport.dateOfissue" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    {renderDateInput(
                        "allTabs.personal_data.identification_card.date_of_issue",
                        "initialTabs.personal_data.identification_card.date_of_issue",
                        data?.date_of_issue,
                    )}
                </Col>
                <Col xs={12} className={"font-style text-muted"}>
                    <IntlMessage id="personal.passport.validity" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    {renderDateInput(
                        "allTabs.personal_data.identification_card.date_to",
                        "initialTabs.personal_data.identification_card.date_to",
                        dateTo,
                        true,
                    )}
                </Col>
                <Col xs={12} className={"font-style text-muted"}>
                    <IntlMessage id="personal.passport.issuedBy" />
                </Col>
                <Col xs={12} className={"font-style"}>
                    {!modeRedactor && !data?.issued_by ? (
                        LocalText.getName(defaultText)
                    ) : (
                        <EditSelect
                            options={issuedByOptions}
                            defaultValue={data?.issued_by || ""}
                            fieldName="allTabs.personal_data.identification_card.issued_by"
                            fieldNameGet="initialTabs.personal_data.identification_card.issued_by"
                        />
                    )}
                </Col>
            </Row>
        </CollapseErrorBoundary>
    );
};

export default IdentificationCard;
