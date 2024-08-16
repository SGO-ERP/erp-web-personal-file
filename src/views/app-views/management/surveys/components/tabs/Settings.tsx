import React from "react";

import {
    Button,
    Card,
    Cascader,
    Checkbox,
    Col,
    Form,
    notification,
    Row,
    Select,
    Tag,
    Typography,
} from "antd";

import { useDispatch, useSelector } from "react-redux";
import {
    addCheckboxPoll,
    addSettingsDivision,
    addSettingsSelected,
    addSettingsService,
    addSettingsSurveyTo,
    clearSettings,
    deleteSettingsSelected,
    setCompFormForId,
} from "store/slices/surveys/surveysSlice";
import HrDocumentService from "services/HrDocumentsService";
import StaffDivisionService from "services/StaffDivisionService";
import { useForm } from "antd/es/form/Form";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import ServiceStaffUnits from "services/ServiceStaffUnits";
import { useParams } from "react-router-dom";
import IntlMessage from "components/util-components/IntlMessage";

const { Fragment, useEffect, useState } = React;
const { Group } = Checkbox;
const { Item } = Form;
const { Option } = Select;
const { Text, Title } = Typography;

interface Item {
    id: number;
    name: string;
    children: Item[] | null;
    staff_units: StaffUnit[];
}

interface StaffUnit {
    id: number;
    position: {
        id: number;
        name: string;
    };
    actual_position: {
        id: number;
        name: string;
    };
    users: {
        first_name: string;
        last_name: string;
    }[];
}

interface CascaderOption {
    value: number;
    label: string | JSX.Element;
    isLeaf?: boolean;
    disabled?: boolean;
    unitId?: number;
    positionId?: number;
}

const Settings = () => {
    const [dropdownItems, setDropdownItems] = useState([]);
    const [initialOptions, setInitialOptions] = useState<any>([]);
    const [cascaderName, setCascaderName] = useState<any>({ name: "", nameKZ: "" });
    const [targetUserCascaderName, setTargetUserCascaderName] = useState<any>({
        name: "",
        nameKZ: "",
    });
    const { surveyInfo } = useSelector((state: any) => state.surveys);
    const dispatch = useDispatch();
    const [jurisdictionForm] = useForm();
    const { id } = useParams();
    const isBlanc = id === "false";

    const typeIsUser = surveyInfo.settingsInfo.name === "Определенный участник";

    const currentLocale = localStorage.getItem("lan");

    useEffect(() => {
        HrDocumentService.getDropdownItems({
            option: "staff_division",
            dataTaken: "matreshka",
            mId: null,
            type: "write",
            down: null,
        })
            .then((response) => {
                setDropdownItems(response);
            })
            .catch((error) => {
                // Handle error
            });
    }, []);

    useEffect(() => {
        generateOptions();
    }, [surveyInfo.settingsInfo.name, dropdownItems, currentLocale]);

    const transformToCascader = (data: Item[], ids: { unitId: number }[]): CascaderOption[] => {
        return data.reduce<CascaderOption[]>((acc, item) => {
            let option: CascaderOption[] = [];

            if (item.children !== null) {
                option.push({
                    value: item.id,
                    label: item.name,
                    isLeaf: false,
                });
            } else {
                option.push({
                    value: item.id,
                    label: item.name,
                    disabled: true,
                });
            }

            if (item.staff_units && item.staff_units.length > 0) {
                const unitsOptions = item.staff_units.reduce<CascaderOption[]>((accUnits, unit) => {
                    const position = unit.actual_position ? unit.actual_position : unit.position;
                    if (!ids.some((id) => id.unitId === unit.id)) {
                        accUnits.push({
                            value: unit.id,
                            label: (
                                <p style={{ color: "#1A3353" }}>
                                    {position.name}{" "}
                                    <span style={{ color: " #72849A" }}>
                                        ({unit.users[0]?.first_name[0]}. {unit.users[0]?.last_name})
                                    </span>
                                </p>
                            ),
                            unitId: unit.id,
                            positionId: position.id,
                        });
                    }

                    return accUnits;
                }, []);

                option = [...option, ...unitsOptions];
            }

            acc.push(...option);
            return acc;
        }, []);
    };

    const generateOptions = () => {
        const language = currentLocale == "kk" ? "nameKZ" : "name";
        if (
            surveyInfo.settingsInfo.name !== "Определенный участник" &&
            surveyInfo.settingsInfo.name.trim() !== ""
        ) {
            const newOptions = dropdownItems.map((item: any) => ({
                value: item.id,
                label: item[language],
                isLeaf: false,
            }));

            setInitialOptions(newOptions);
        } else {
            const option = transformToCascader(dropdownItems, [{ unitId: 1 }]);
            setInitialOptions(option);
        }
    };

    const getSurveysTo = (val: string) => {
        dispatch(addSettingsSurveyTo(val));
    };

    const loadData = async (selectedOptions: any) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        const language = currentLocale == "kk" ? "nameKZ" : "name";

        try {
            const response = await HrDocumentService.getDropdownItems({
                option: "staff_division",
                dataTaken: "matreshka",
                mId: targetOption.value,
                type: "write",
                down: null,
            });

            targetOption.loading = false;

            //MESSAGE TO BATYR AND ZHANARYS: ТУТ В УСЛОВИЕ УБРАЛА id, не знаю зачем оннужен если в ссылке все равно нет id
            if (surveyInfo.settingsInfo.name !== "Определенный участник") {
                // Assuming 'response' is an array of objects with 'staff_units' property
                targetOption.children = response
                    .filter((item: any) => item.staff_units !== null)
                    .map((item: any) => {
                        return {
                            value: item.id,
                            label: item[language],
                            isLeaf: item.children === null,
                        };
                    });

                // Assuming 'setInitialOptions' is a setter function to update the initialOptions state
                // Trigger re-render by updating the options state with the new children
                setInitialOptions([...initialOptions]);
            } else {
                let filteredResponse = response.filter((item: any) => item.staff_units !== null);

                filteredResponse = filteredResponse.map((item: any) => {
                    // Filter out staff_units with empty 'users' array
                    const filteredUnits = item.staff_units.filter(
                        (unit: any) => unit.users && unit.users.length !== 0,
                    );
                    return { ...item, staff_units: filteredUnits };
                });

                const childrens = transformToCascader(filteredResponse, [{ unitId: 1 }]);
                // Flatten the array of arrays into a single array
                targetOption.children = ([] as CascaderOption[]).concat(...childrens);

                // Assuming that cascaderData is an array of objects and targetOption exists within it
                // Replace the targetOption with the updated one
                setInitialOptions((prevData: any) =>
                    prevData.map((opt: any) =>
                        opt.value === targetOption.value ? targetOption : opt,
                    ),
                );
            }
        } catch (error) {
            // Handle error
            console.log(error);
        }
    };

    const loadDataForTargetUser = async (selectedOptions: any) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        const language = currentLocale === "kk" ? "nameKZ" : "name";

        try {
            const response = await HrDocumentService.getDropdownItems({
                option: "staff_division",
                dataTaken: "matreshka",
                mId: targetOption.value,
                type: "write",
                down: null,
            });

            targetOption.loading = false;

            let filteredResponse = response.filter((item: any) => item.staff_units !== null);

            filteredResponse = filteredResponse.map((item: any) => {
                // Filter out staff_units with empty 'users' array
                const filteredUnits = item.staff_units.filter(
                    (unit: any) => unit.users && unit.users.length !== 0,
                );
                return { ...item, staff_units: filteredUnits };
            });

            const childrens = transformToCascader(filteredResponse, [{ unitId: 1 }]);
            // Flatten the array of arrays into a single array
            targetOption.children = ([] as CascaderOption[]).concat(...childrens);

            // Assuming that cascaderData is an array of objects and targetOption exists within it
            // Replace the targetOption with the updated one
            setInitialOptions((prevData: any) =>
                prevData.map((opt: any) => (opt.value === targetOption.value ? targetOption : opt)),
            );
        } catch (error) {
            // Handle error
            console.log(error);
        }
    };

    const addPollSettings = (type: CheckboxChangeEvent, which: string) => {
        dispatch(addCheckboxPoll({ type: which, bool: type.target.checked }));
    };

    const chooseDivision = async (division: any) => {
        const staffUnit = await ServiceStaffUnits.staff_units_id(division[division.length - 1]);

        if (staffUnit) {
            const position = staffUnit.actual_position
                ? staffUnit.actual_position
                : staffUnit.position;

            if (division.length > 1) {
                const name = await StaffDivisionService.staff_division_name(
                    division[division.length - 2],
                );

                setCascaderName({
                    name:
                        name.name +
                        " / " +
                        staffUnit.staff_division.name +
                        " / " +
                        position.name +
                        ` (${staffUnit.users[0].first_name[0]}. ${staffUnit.users[0].last_name})`,
                    nameKZ:
                        name.nameKZ +
                        " / " +
                        staffUnit.staff_division.nameKZ +
                        " / " +
                        position.nameKZ +
                        ` (${staffUnit.users[0].first_name[0]}. ${staffUnit.users[0].last_name})`,
                });
            } else {
                setCascaderName({
                    name:
                        staffUnit.staff_division.name +
                        " / " +
                        position.name +
                        ` (${staffUnit.users[0].first_name[0]}. ${staffUnit.users[0].last_name})`,
                    nameKZ:
                        staffUnit.staff_division.nameKZ +
                        " / " +
                        position.nameKZ +
                        ` (${staffUnit.users[0].first_name[0]}. ${staffUnit.users[0].last_name})`,
                });
            }
        } else {
            const name = await StaffDivisionService.staff_division_name(
                division[division.length - 1],
            );
            setCascaderName(name);
        }
        dispatch(addSettingsDivision(division));
    };

    const handleCascaderChangeForTargetUser = async (division: any) => {
        const staffUnit = await ServiceStaffUnits.staff_units_id(division[division.length - 1]);

        if (staffUnit) {
            const position = staffUnit.actual_position
                ? staffUnit.actual_position
                : staffUnit.position;

            if (division.length > 1) {
                const name = await StaffDivisionService.staff_division_name(
                    division[division.length - 2],
                );

                setTargetUserCascaderName({
                    name:
                        name.name +
                        " / " +
                        staffUnit.staff_division.name +
                        " / " +
                        position.name +
                        ` (${staffUnit.users[0].first_name[0]}. ${staffUnit.users[0].last_name})`,
                    nameKZ:
                        name.nameKZ +
                        " / " +
                        staffUnit.staff_division.nameKZ +
                        " / " +
                        position.nameKZ +
                        ` (${staffUnit.users[0].first_name[0]}. ${staffUnit.users[0].last_name})`,
                });
                dispatch(setCompFormForId(staffUnit.users[0].id));
            } else {
                console.log("Не отработало");
                setTargetUserCascaderName({
                    name:
                        staffUnit.staff_division.name +
                        " / " +
                        position.name +
                        ` (${staffUnit.users[0].first_name[0]}. ${staffUnit.users[0].last_name})`,
                    nameKZ:
                        staffUnit.staff_division.nameKZ +
                        " / " +
                        position.nameKZ +
                        ` (${staffUnit.users[0].first_name[0]}. ${staffUnit.users[0].last_name})`,
                });
            }
        } else {
            const name = await StaffDivisionService.staff_division_name(
                division[division.length - 1],
            );
            if (!name) {
                notification.error({ message: "Пользователь не найден" });
                return;
            }
            console.log("HERE 11", name);

            setTargetUserCascaderName(name);
        }
    };

    const getService = (service: any) => {
        dispatch(addSettingsService(service));
    };

    const handleClose = (id: number) => {
        dispatch(deleteSettingsSelected(id));
    };

    const addSelectPosition = async (val: any) => {
        const id =
            surveyInfo.settingsInfo.selected[surveyInfo.settingsInfo.selected.length - 1]?.id !==
            undefined
                ? surveyInfo.settingsInfo.selected[surveyInfo.settingsInfo.selected.length - 1]
                      ?.id + 1
                : 0;
        const names = await StaffDivisionService.staff_division_name(
            val.divisionID[val.divisionID.length - 1],
        ).catch((error) => console.log(error));

        const staffUnit = await ServiceStaffUnits.staff_units_id(
            val.divisionID[val.divisionID.length - 1],
        );

        const position = staffUnit.actual_position ? staffUnit.actual_position : staffUnit.position;

        const name = names
            ? `${names.name} (${val.official})`
            : `СГО РК / ${position.name} (${staffUnit.users[0].first_name[0]}. ${staffUnit.users[0].last_name})`;

        dispatch(
            addSettingsSelected({
                name: name,
                id: id,
                divisionID: val.divisionID,
                type: val.name,
                official: val.official,
                userID: staffUnit?.users[0]?.id || "",
            }),
        );
        setCascaderName({ name: "", nameKZ: "" });
        dispatch(clearSettings());
    };

    return (
        <Fragment>
            <Card
                style={{
                    marginTop: "24px",
                }}
                className="survey-settings"
            >
                <Title
                    level={4}
                    style={{
                        marginBottom: "20px",
                    }}
                >
                    <IntlMessage id="surveys.toolbar.button.create.poll" />
                </Title>
                <Item name="settings-general">
                    <Group>
                        <Checkbox
                            value="is_anonymous"
                            onChange={(val: CheckboxChangeEvent) => addPollSettings(val, "anonym")}
                        >
                            <IntlMessage id="surveys.toolbar.button.create.anonym" />
                        </Checkbox>
                        <br />
                        <Checkbox
                            value="reporting"
                            onChange={(val: CheckboxChangeEvent) => addPollSettings(val, "report")}
                        >
                            <IntlMessage id="surveys.toolbar.button.create.report" />
                        </Checkbox>
                        <br />
                        <Checkbox
                            value="is_kz_translate_required"
                            onChange={(val: CheckboxChangeEvent) => addPollSettings(val, "double")}
                        >
                            <IntlMessage id="surveys.toolbar.button.create.needRus" />
                        </Checkbox>
                    </Group>
                </Item>
            </Card>
            <Card>
                <Title
                    level={4}
                    style={{
                        marginBottom: "20px",
                    }}
                >
                    <IntlMessage id="surveys.table.header.column.jurisdiction" />
                </Title>
                <Form form={jurisdictionForm} layout="vertical">
                    <Item
                        name="jurisdiction_type"
                        label="Опрос проводится для"
                        rules={[{ required: true }]}
                    >
                        <Select
                            placeholder="Выберите из списка"
                            onChange={getSurveysTo}
                            value={
                                surveyInfo.settingsInfo.name === ""
                                    ? null
                                    : surveyInfo.settingsInfo.name
                            }
                        >
                            <Option value={"Штатное подразделение"}>
                                <IntlMessage id="surveys.toolbar.button.create.staffDivision" />
                            </Option>
                            <Option value={"Определенный участник"}>
                                <IntlMessage id="order.add.user.current" />
                            </Option>
                        </Select>
                    </Item>
                    {surveyInfo.settingsInfo.name !== "" ? (
                        <Item
                            name="staff_division"
                            label={surveyInfo.settingsInfo.name}
                            rules={[{ required: true }]}
                        >
                            <Row justify="space-between">
                                <Col xs={!typeIsUser ? 24 : 19}>
                                    <Cascader
                                        style={{ width: "100%" }}
                                        options={initialOptions}
                                        loadData={loadData}
                                        value={
                                            currentLocale === "kk"
                                                ? cascaderName.nameKZ
                                                : cascaderName.name
                                        }
                                        onChange={chooseDivision}
                                        changeOnSelect
                                        placeholder="Подразделения"
                                    />
                                </Col>
                                {!typeIsUser ? null : (
                                    <Col xs={4}>
                                        <Button
                                            style={{ width: "100%" }}
                                            type="primary"
                                            onClick={() => {
                                                addSelectPosition(surveyInfo.settingsInfo);
                                                jurisdictionForm.resetFields();
                                            }}
                                            disabled={
                                                isBlanc
                                                    ? surveyInfo.settingsInfo.selected.length > 0
                                                    : false
                                            }
                                        >
                                            <IntlMessage id="surveys.toolbar.button.create.addDivision" />
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                        </Item>
                    ) : null}
                    {surveyInfo.settingsInfo.divisionID.length > 0 && !typeIsUser ? (
                        <Item
                            name="official_position"
                            label="Cлужебное полодение"
                            rules={[{ required: true }]}
                        >
                            <Row justify="space-between">
                                <Col xs={19}>
                                    <Select
                                        placeholder="Выберите из списка"
                                        onChange={getService}
                                        value={surveyInfo.settingsInfo.service}
                                    >
                                        <Option value={"Все"}>
                                            <IntlMessage id="surveys.toolbar.button.create.all" />
                                        </Option>
                                        <Option value={"Только личный состав"}>
                                            <IntlMessage id="surveys.toolbar.button.create.personal" />
                                        </Option>
                                        <Option value={"Только руководящий состав"}>
                                            <IntlMessage id="surveys.toolbar.button.create.managment" />
                                        </Option>
                                    </Select>
                                </Col>
                                <Col xs={4}>
                                    <Button
                                        style={{ width: "100%" }}
                                        type="primary"
                                        onClick={() => {
                                            addSelectPosition(surveyInfo.settingsInfo);
                                            jurisdictionForm.resetFields();
                                        }}
                                    >
                                        <IntlMessage id="surveys.toolbar.button.create.addDivision" />
                                    </Button>
                                </Col>
                            </Row>
                        </Item>
                    ) : null}

                    {surveyInfo.settingsInfo.selected.length > 0 ? (
                        <Row>
                            <Col
                                xs={24}
                                style={{
                                    border: "1px solid lightgrey",
                                    borderRadius: 10,
                                    height: 50,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: 10,
                                }}
                            >
                                {surveyInfo.settingsInfo.selected.map((item: any) => (
                                    <Tag
                                        color="processing"
                                        style={{
                                            borderRadius: 10,
                                        }}
                                        onClose={() => handleClose(item.id)}
                                        key={item.id}
                                        closable={true}
                                    >
                                        {item.name}
                                    </Tag>
                                ))}
                            </Col>
                        </Row>
                    ) : null}
                </Form>
            </Card>
            {isBlanc && (
                <Card>
                    <Title
                        level={4}
                        style={{
                            marginBottom: "20px",
                        }}
                    >
                        Оцениваемый сотрудник
                    </Title>
                    <Cascader
                        style={{ width: "100%" }}
                        options={initialOptions}
                        loadData={loadDataForTargetUser}
                        value={
                            currentLocale === "kk"
                                ? targetUserCascaderName.nameKZ
                                : targetUserCascaderName.name
                        }
                        onChange={handleCascaderChangeForTargetUser}
                        changeOnSelect
                        placeholder="Подразделения"
                    />
                </Card>
            )}
        </Fragment>
    );
};

export default Settings;
