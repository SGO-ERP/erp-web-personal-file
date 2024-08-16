import { Col, Row } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import moment from "moment";
import CollapseErrorBoundary from "../../common/CollapseErrorBoundary";
import EditInput from "../../common/EditInput";
import EditDateInput from "../../common/EditDateInput";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import EditSelect from "../../common/EditSelect";

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

const Passport = ({ passport, oldPassport }) => {
    const [dateTo, setDateTo] = useState("");
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);

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
            oldPassport.date_of_issue.value.trim() !== ""
                ? oldPassport.date_of_issue.value
                : passport?.date_of_issue
                ? passport?.date_of_issue
                : "";

        if (!currentDate) return;

        let [day, month, year] = currentDate.split(".");
        let newDate = new Date(Number(year) + 10, month - 1, day - 1);
        let newDateString = `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}`;

        setDateTo(newDateString);
    }, [passport, oldPassport]);

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <Row gutter={[18, 16]}>
                <Col xs={12} md={12} lg={12} xl={12} className={"font-style text-muted"}>
                    <IntlMessage id="personal.passport.documentNum" />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={"font-style"}>
                    <EditInput
                        defaultValue={passport?.document_number ?? ""}
                        fieldName="allTabs.personal_data.passport.document_number"
                        fieldNameGet="initialTabs.personal_data.passport.document_number"
                    />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={"font-style text-muted"}>
                    <IntlMessage id="personal.passport.dateOfissue" />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={"font-style"}>
                    {renderDateInput(
                        "allTabs.personal_data.passport.date_of_issue",
                        "initialTabs.personal_data.passport.date_of_issue",
                        passport?.date_of_issue,
                    )}
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={"font-style text-muted"}>
                    <IntlMessage id="personal.passport.validity" />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={"font-style"}>
                    {renderDateInput(
                        "allTabs.personal_data.passport.date_to",
                        "initialTabs.personal_data.passport.date_to",
                        dateTo,
                        true,
                    )}
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={"font-style text-muted"}>
                    <IntlMessage id="personal.passport.issuedBy" />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={"font-style"}>
                    {!modeRedactor && !passport?.issued_by ? (
                        LocalText.getName(defaultText)
                    ) : (
                        <EditSelect
                            options={issuedByOptions}
                            defaultValue={passport?.issued_by ?? ""}
                            fieldName="allTabs.personal_data.passport.issued_by"
                            fieldNameGet="initialTabs.personal_data.passport.issued_by"
                        />
                    )}
                </Col>
            </Row>
        </CollapseErrorBoundary>
    );
};

export default Passport;
