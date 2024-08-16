import React, { useEffect, useState } from "react";
import { Cascader, Checkbox, Col, DatePicker, Input, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import {
    addItem,
    changeNamesProperties,
    changesDropdownProperties,
    deleteItem,
    deleteProperties,
    pushProperties,
    removeItem,
    setItemValue,
} from "store/slices/newInitializationsSlices/initializationNewSlice";
import "./styles/IndexStyle.css";
import { useSearchParams } from "react-router-dom";
import StaffDivisionService from "services/StaffDivisionService";
import ServiceStaffUnits from "services/ServiceStaffUnits";
import HrDocumentService from "services/HrDocumentsService";
import UserStaffDivision from "services/getUserStaffDivisionService";
import { truncate } from "utils/helpers/common";
import { PrivateServices } from "API";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";

const TagsBlock = () => {
    const [itemsIsVisible, setItemsIsVisible] = useState(false);
    const [inputValue, setInputValue] = useState([]);
    const [divisionId, setDivisionIds] = useState([]);
    const [hasRunItems, setHasRunItems] = useState(false);
    const [hasRunProperty, setHasRunProperty] = useState(false);
    const [counting, setCounting] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const {
        collectItems,
        collectProperties,
        orderLanguage,
        selectUser,
        itemsValue,
        documentTemplate,
    } = useSelector((state) => state.initializationNew);

    const divisionID = searchParams.get("vacancyDivision");
    const positionID = searchParams.get("vacancyPosition");
    const editId = searchParams.get("editId");

    const dispatch = useDispatch();

    useEffect(() => {
        if (!divisionID && !positionID) return;

        StaffDivisionService.staff_division_ids(divisionID).then((r) => {
            setDivisionIds(r);
        });
    }, [divisionID, positionID, collectItems]);

    useEffect(() => {
        setInputValue("");
    }, [documentTemplate.id]);

    const [optionsDivision, setOptionsDivision] = useState([]);

    //заполняет поля соответсвии вакансии и кандидатуры
    useEffect(() => {
        if (divisionID) {
            getVacancyDivision();
        } else {
            HrDocumentService.getMatreshka()
                .then((response) => {
                    const initialOptions = response.map((item) => ({
                        value: item.id,
                        label: orderLanguage ? item.nameKZ : item.name,
                        isLeaf: false,
                    }));

                    setOptionsDivision(initialOptions);
                })
                .catch((error) => {
                    // Handle error
                });
        }
    }, []);

    //сохраняет стафф юниты в соответсвию черновика
    useEffect(() => {
        if (!editId && hasRunProperty) return;

        const fetchData = async () => {
            let currentStaffDivision = {};
            for (const property of collectProperties) {
                for (const item of collectItems) {
                    if (item.tagName === property.wordInOrder) {
                        setInputValue((prev) => {
                            return {
                                ...prev,
                                [item.id]: {
                                    ...prev[item.id],
                                    nameKZ: property.newWordKZ,
                                    name: property.newWord,
                                },
                            };
                        });

                        if (item.field_name === "staff_division") {
                            currentStaffDivision = await UserStaffDivision.get_user_staff_division(
                                property.ids,
                            );
                        }
                    }

                    if (item.field_name === "staff_unit") {
                        if (Object.keys(currentStaffDivision)?.length > 0) {
                            dispatch(
                                changesDropdownProperties({
                                    tagName: item.tagName,
                                    options: currentStaffDivision.staff_units
                                        .filter((item) => item.users?.length === 0)
                                        .map((item) => {
                                            const option = {
                                                id: item.id,
                                                name: item.actual_position
                                                    ? item.actual_position.name
                                                    : item.position.name,
                                                nameKZ: item.actual_position
                                                    ? item.actual_position.nameKZ
                                                    : item.position.nameKZ,
                                            };

                                            return option;
                                        }),
                                }),
                            );
                        }
                    }
                }
            }

            setHasRunProperty(true);
        };

        fetchData();
    }, [collectProperties]);

    //заполняет поля в соответсвии вакансии и кандидатуры
    const getVacancyDivision = async () => {
        const names = await StaffDivisionService.staff_division_name(divisionID).catch((error) =>
            console.log(error),
        );

        const ids = await StaffDivisionService.staff_division_ids(divisionID).catch((error) =>
            console.log(error),
        );

        const nameArray = names.name.split(" / ");
        const nameArrayKZ = names.nameKZ.split(" / ");

        const final = await createNestedObject(nameArray, nameArrayKZ, ids);

        setOptionsDivision([final]);
    };

    //заполняет опшены соответсвии вакансии и кандидатуры
    async function createNestedObject(nameArray, nameArrayKZ, ids) {
        async function recursiveCreateNestedObject(index) {
            if (index >= nameArray?.length) {
                return null;
            }

            const currentObject = {
                label: orderLanguage ? nameArrayKZ[index] : nameArray[index],
                value: ids[index],
            };

            const child = await recursiveCreateNestedObject(index + 1);
            if (child) {
                currentObject.children = [child];
            }

            return currentObject;
        }

        return await recursiveCreateNestedObject(0);
    }

    //заполняет теги соответсвии вакансии и кандидатуры
    useEffect(() => {
        if (collectItems?.length === 0 || hasRunItems) return;

        const fetchAndSetData = async () => {
            for (let item of collectItems) {
                if (item.field_name === "staff_division" && divisionID) {
                    const names = await StaffDivisionService.staff_division_name(divisionID).catch(
                        (error) => console.log(error),
                    );

                    let transformedText = names.name.replace(/\//g, "").trim().toLowerCase();

                    let transformedTextKZ = names.nameKZ.replace(/\//g, "").trim().toLowerCase();

                    dispatch(
                        pushProperties({
                            wordInOrder: item.tagName,
                            newWord: transformedText,
                            newWordKZ: transformedTextKZ,
                            ids: divisionID,
                        }),
                    );

                    dispatch(
                        setItemValue({
                            id: item.id,
                            name: divisionId,
                            nameKZ: divisionId,
                        }),
                    );
                } else if (item.field_name === "staff_unit" && positionID) {
                    const names = await ServiceStaffUnits.staff_units_id(positionID).catch(
                        (error) => console.log(error),
                    );

                    dispatch(
                        pushProperties({
                            wordInOrder: item.tagName,
                            newWord: names.position.name.toLowerCase(),
                            newWordKZ: names.position.nameKZ.toLowerCase(),
                            ids: positionID,
                        }),
                    );
                    dispatch(setItemValue({ id: item.id, name: positionID, nameKZ: positionID }));
                }
            }
        };

        fetchAndSetData();

        setHasRunItems(true);
    }, [collectItems]);

    //блокировка выборки позиции
    const isDisable = (item) => {
        if (item.field_name === "staff_unit" && positionID) return true;
        if (item.field_name === "staff_division" && divisionID) return true;
        return false;
    };

    // показывает блок если юзер выбран
    useEffect(() => {
        if (Object.keys(selectUser)?.length === 0 && selectUser.constructor === Object) return;

        setItemsIsVisible(true);
    }, [selectUser]);

    //сборка опшенов каскадеров
    const generateOptions = (items, el) => {
        if (!items || !el) return "";

        if (["staff_division", "secondments"].includes(el.field_name)) {
            const filterCondition = "Особая группа";
            const filteredItems = items.filter((item) => item.name !== filterCondition);
            return generateStaffDivision(filteredItems, el);
        }

        if (!items?.length) return "";

        return items
            .filter((item) => item?.nameKZ || item?.position || item.type)
            .map((item) => {
                if (!item) return;
                if (item.actual_position) {
                    return {
                        value: item.id,
                        label: truncate(
                            orderLanguage ? item.actual_position.nameKZ : item.actual_position.name,
                            40,
                        ),
                    };
                } else if (item.position) {
                    return {
                        value: item.id,
                        label: truncate(
                            orderLanguage ? item.position.nameKZ : item.position.name,
                            40,
                        ),
                    };
                } else if (item.type) {
                    return {
                        value: item.id,
                        label: truncate(orderLanguage ? item.type.nameKZ : item.type.name, 40),
                    };
                } else {
                    return {
                        value: item.id,
                        label: truncate(orderLanguage ? item.nameKZ : item.name, 40),
                    };
                }
            });
    };

    const generateStaffDivision = (arr, el) => {
        const items =
            el.field_name === "staff_division"
                ? arr.filter(
                      (item) =>
                          item.children?.length > 0 ||
                          item.staff_units?.some((unit) => unit.users?.length === 0),
                  )
                : arr;

        return items.map((item) => {
            const label = !orderLanguage
                ? item?.name ?? item?.type?.name
                : item?.nameKZ ?? item?.type?.nameKZ;

            const option = { value: item.id, label };

            if (item.children?.length > 0) {
                option.children = generateStaffDivision(item.children, el);
            }

            return option;
        });
    };

    //присвоение дате месяца
    function formatDate(dateStr) {
        const months = [
            "января",
            "февраля",
            "марта",
            "апреля",
            "мая",
            "июня",
            "июля",
            "августа",
            "сентября",
            "октября",
            "ноября",
            "декабря",
        ];

        const monthKz = [
            "қаңтар",
            "ақпан",
            "наурыз",
            "сәуір",
            "мамыр",
            "маусым",
            "шілде",
            "тамыз",
            "қыркүйек",
            "қазан",
            "қараша",
            "желтоқсан",
        ];

        const date = new Date(dateStr);

        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        return {
            name: `${day} ${months[month]} ${year}`,
            nameKZ: `${day} ${monthKz[month]} ${year}`,
        };
    }

    //сохранение значение даты
    const handleDate = (value, e) => {
        const selectedDate = value ? value.format("YYYY-MM-DD") : null;
        let checkFalse = 0;
        let properties = collectProperties;
        const datesName = formatDate(selectedDate);

        dispatch(setItemValue({ id: e.id, name: selectedDate, nameKZ: selectedDate }));

        if (properties?.length == 0) {
            dispatch(
                pushProperties({
                    wordInOrder: e.tagName,
                    newWord: datesName.name,
                    newWordKZ: datesName.nameKZ,
                    ids: selectedDate,
                }),
            );
        } else {
            for (let item of properties) {
                if (item.wordInOrder === e.tagName) {
                    dispatch(
                        changeNamesProperties({
                            tagName: e.wordInOrder,
                            transformedText: datesName.name,
                            transformedTextKZ: datesName.nameKZ,
                            ids: selectedDate,
                        }),
                    );
                } else {
                    checkFalse++;
                }
            }
        }

        if (properties?.length === checkFalse) {
            dispatch(
                pushProperties({
                    wordInOrder: e.tagName,
                    newWord: datesName.name,
                    newWordKZ: datesName.nameKZ,
                    ids: selectedDate,
                }),
            );
        }
    };

    // сохранение значение инпутов
    const handleInput = debounce((e, name, value) => {
        let properties = collectProperties;
        let items = collectItems;
        let checkFalse = 0;
        let inputNewText = e.target.value;

        const { id } = e.target;
        const index = items.findIndex((item) => item.inputValKZ == name);

        if (properties?.length == 0) {
            if (value.type !== "number") {
                dispatch(
                    pushProperties({
                        wordInOrder: items[index].tagName,
                        newWord: !orderLanguage ? inputNewText : " ",
                        newWordKZ: !orderLanguage ? " " : inputNewText,
                    }),
                );
                dispatch(
                    setItemValue({
                        id,
                        name: !orderLanguage ? inputNewText : " ",
                        nameKZ: !orderLanguage ? " " : inputNewText,
                    }),
                );
            } else {
                dispatch(
                    pushProperties({
                        wordInOrder: items[index].tagName,
                        newWord: inputNewText,
                        newWordKZ: inputNewText,
                    }),
                );
                dispatch(setItemValue({ id, name: inputNewText, nameKZ: inputNewText }));
            }
        } else {
            for (let item of properties) {
                if (item.wordInOrder === items[index].tagName) {
                    if (value.type == "number") {
                        dispatch(
                            changeNamesProperties({
                                wordInOrder: item.wordInOrder,
                                transformedText: inputNewText,
                                transformedTextKZ: inputNewText,
                            }),
                        );

                        dispatch(setItemValue({ id, name: inputNewText, nameKZ: inputNewText }));
                    } else {
                        dispatch(
                            setItemValue({
                                id,
                                name: !orderLanguage ? inputNewText : " ",
                                nameKZ: !orderLanguage ? " " : inputNewText,
                            }),
                        );
                        if (orderLanguage) {
                            dispatch(
                                changeNamesProperties({
                                    wordInOrder: item.wordInOrder,
                                    transformedTextKZ: inputNewText,
                                }),
                            );
                        } else {
                            dispatch(
                                changeNamesProperties({
                                    wordInOrder: item.wordInOrder,
                                    transformedText: inputNewText,
                                }),
                            );
                        }
                    }
                } else {
                    checkFalse++;
                }
            }
        }

        if (properties?.length !== 0 && properties?.length === checkFalse) {
            if (value.type !== "number") {
                dispatch(
                    pushProperties({
                        wordInOrder: items[index].tagName,
                        newWord: !orderLanguage ? inputNewText : " ",
                        newWordKZ: !orderLanguage ? " " : inputNewText,
                    }),
                );
                dispatch(
                    setItemValue({
                        id,
                        name: !orderLanguage ? inputNewText : " ",
                        nameKZ: !orderLanguage ? " " : inputNewText,
                    }),
                );
            } else {
                dispatch(
                    setItemValue({
                        id,
                        name: inputNewText,
                        nameKZ: inputNewText,
                    }),
                );
                dispatch(
                    pushProperties({
                        wordInOrder: items[index].tagName,
                        newWord: inputNewText,
                        newWordKZ: inputNewText,
                    }),
                );
            }
        }
    }, 300);

    // сохранение значения каскадеров
    const onClickCascader = async (e, id, elem) => {
        let properties = collectProperties;
        let items = JSON.parse(JSON.stringify(collectItems));
        let positionOptions;
        let checkFalse = 0;
        let names;
        let transformedText;
        let transformedTextKZ;

        dispatch(setItemValue({ id, name: e, nameKZ: e }));

        if (elem.field_name == "staff_division") {
            names = await StaffDivisionService.staff_division_name(e[e?.length - 1]);
            transformedText = names.name;
            transformedTextKZ = names.nameKZ;

            dispatch(setItemValue({ id: id + 1, name: "", nameKZ: "" }));
            dispatch(deleteProperties(id + 1));

            for (let item of items) {
                if (item.field_name == "staff_division") {
                    positionOptions = await HrDocumentService.getMatreshkaId(e[e?.length - 1]);
                } else if (item.field_name === "staff_unit" && positionOptions) {
                    dispatch(
                        changesDropdownProperties({
                            tagName: item.tagName,
                            options: positionOptions.staff_units
                                .filter((item) => item.users?.length === 0)
                                .map((item) => {
                                    const option = {
                                        id: item.id,
                                        name: item.actual_position
                                            ? item.actual_position.name
                                            : item.position.name,
                                        nameKZ: item.actual_position
                                            ? item.actual_position.nameKZ
                                            : item.position.nameKZ,
                                    };

                                    return option;
                                }),
                        }),
                    );
                }
            }
        } else {
            elem.dropdownItems.map((el) => {
                if (el.id === e[e?.length - 1]) {
                    if (el.type) {
                        transformedText = el.type.name;
                        transformedTextKZ = el.type.nameKZ;
                    } else {
                        transformedText = el.name;
                        transformedTextKZ = el.nameKZ;
                    }
                }
            });
        }

        if (properties?.length == 0) {
            dispatch(
                pushProperties({
                    wordInOrder: elem.tagName,
                    newWord: transformedText,
                    newWordKZ: transformedTextKZ,
                    ids: e[e?.length - 1],
                    key: id,
                }),
            );
        } else {
            for (let item of properties) {
                if (item.wordInOrder === elem.tagName) {
                    dispatch(
                        changeNamesProperties({
                            tagName: item.wordInOrder,
                            transformedText,
                            transformedTextKZ,
                            ids: e[e?.length - 1],
                            key: id,
                        }),
                    );
                } else {
                    checkFalse++;
                }
            }
        }

        if (properties?.length === checkFalse) {
            dispatch(
                pushProperties({
                    wordInOrder: elem.tagName,
                    newWord: transformedText,
                    newWordKZ: transformedTextKZ,
                    ids: e[e?.length - 1],
                    key: id,
                }),
            );
        }

        for (let item of items) {
            if (item.inputVal == elem.inputVal || item.inputVal == elem.inputValKZ) {
                item.check = false;
            }
        }
    };

    // запросы каскадеров
    const loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions?.length - 1];
        targetOption.loading = true;

        try {
            const response = await HrDocumentService.getMatreshkaId(targetOption.value);

            targetOption.loading = false;

            targetOption.children = response.children.map((item) => ({
                value: item.id,
                label: orderLanguage ? item.nameKZ : item.name,
                isLeaf: item.children ? false : true,
            }));

            setOptionsDivision([...optionsDivision]); // Trigger re-render by updating the options state
        } catch (error) {
            console.log(error);
        }
    };

    const addCounting = async (e) => {
        setCounting(e.target.checked);

        if (e.target.checked) {
            const response = await PrivateServices.get("/api/v1/positions/all");

            const body = {
                check: true,
                dropdownItems: response.data.objects,
                id: collectItems?.length,
                inputVal: "Засчет должности",
                inputValKZ: "Қызмет атауы",
                type: "dropdown",
                isCounting: true,
            };

            dispatch(addItem(body));
        } else {
            dispatch(deleteItem(collectItems?.length - 1));
            dispatch(removeItem(collectItems?.length - 1));
        }
    };

    return (
        <div className="tagsBlockMain">
            {itemsIsVisible ? (
                <>
                    {collectItems.map((el) => {
                        if (el.check) {
                            if (el.type !== "auto") {
                                return (
                                    <Row
                                        justify="space-between"
                                        align="middle"
                                        style={{ marginTop: "2%" }}
                                        key={el.id}
                                    >
                                        <Col className="text2" xs={7} style={{ paddingRight: 10 }}>
                                            {orderLanguage ? el.inputValKZ : el.inputVal}
                                        </Col>
                                        {orderLanguage ? (
                                            <Col xs={17}>
                                                {(() => {
                                                    if (el.type === "dropdown") {
                                                        if (el.field_name === "staff_division") {
                                                            return (
                                                                <Cascader
                                                                    options={optionsDivision}
                                                                    loadData={loadData}
                                                                    key={el.id}
                                                                    allowClear={false}
                                                                    placeholder={el.inputValKZ}
                                                                    style={{ width: "98%" }}
                                                                    onChange={(val) =>
                                                                        onClickCascader(
                                                                            val,
                                                                            el.id,
                                                                            el,
                                                                        )
                                                                    }
                                                                    changeOnSelect
                                                                    value={
                                                                        itemsValue[el.id]?.nameKZ
                                                                    }
                                                                    disabled={isDisable(el)}
                                                                />
                                                            );
                                                        }

                                                        return (
                                                            <Cascader
                                                                options={generateOptions(
                                                                    el.dropdownItems,
                                                                    el,
                                                                )}
                                                                key={el.id}
                                                                allowClear={false}
                                                                placeholder={el.inputValKZ}
                                                                style={{ width: "98%" }}
                                                                onChange={(val) =>
                                                                    onClickCascader(val, el.id, el)
                                                                }
                                                                changeOnSelect
                                                                value={itemsValue[el.id]?.nameKZ}
                                                                disabled={isDisable(el)}
                                                            />
                                                        );
                                                    }
                                                    if (el.type === "date") {
                                                        return (
                                                            <DatePicker
                                                                style={{ width: "98%" }}
                                                                onChange={(value) =>
                                                                    handleDate(value, el, el.id)
                                                                }
                                                                defaultValue={
                                                                    itemsValue[el.id]?.nameKZ
                                                                }
                                                                disabled={false}
                                                                allowClear={false}
                                                            />
                                                        );
                                                    }
                                                    if (el.type === "number") {
                                                        return (
                                                            <Input
                                                                style={{ width: "98%", height: 40 }}
                                                                placeholder={el.inputValKZ}
                                                                id={el.id}
                                                                onChange={(val) =>
                                                                    handleInput(
                                                                        val,
                                                                        el.inputValKZ,
                                                                        el,
                                                                    )
                                                                }
                                                                defaultValue={
                                                                    itemsValue[el.id]?.nameKZ
                                                                }
                                                            />
                                                        );
                                                    }
                                                    if (el.type === "string") {
                                                        return (
                                                            <Input
                                                                style={{
                                                                    width: "98%",
                                                                    minHeight: 40,
                                                                }}
                                                                placeholder={el.inputValKZ}
                                                                autoSize={{
                                                                    minRows: 1,
                                                                    maxRows: 10,
                                                                }}
                                                                id={el.id}
                                                                onChange={(val) => {
                                                                    handleInput(
                                                                        val,
                                                                        el.inputValKZ,
                                                                        el,
                                                                    );
                                                                    setInputValue((prev) => {
                                                                        return {
                                                                            ...prev,
                                                                            [el.id]: {
                                                                                ...prev[el.id],
                                                                                nameKZ: val.target
                                                                                    .value,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                                value={inputValue[el.id]?.nameKZ}
                                                            />
                                                        );
                                                    }
                                                })()}
                                            </Col>
                                        ) : (
                                            <Col xs={17}>
                                                {(() => {
                                                    if (el.type === "dropdown") {
                                                        if (el.field_name === "staff_division") {
                                                            return (
                                                                <Cascader
                                                                    options={optionsDivision}
                                                                    loadData={loadData}
                                                                    key={el.id}
                                                                    allowClear={false}
                                                                    placeholder={el.inputVal}
                                                                    style={{ width: "98%" }}
                                                                    onChange={(val) =>
                                                                        onClickCascader(
                                                                            val,
                                                                            el.id,
                                                                            el,
                                                                        )
                                                                    }
                                                                    changeOnSelect
                                                                    value={itemsValue[el.id]?.name}
                                                                    disabled={isDisable(el)}
                                                                />
                                                            );
                                                        }

                                                        return (
                                                            <Cascader
                                                                options={generateOptions(
                                                                    el.dropdownItems,
                                                                    el,
                                                                )}
                                                                key={el.id}
                                                                allowClear={false}
                                                                placeholder={el.inputVal}
                                                                style={{ width: "98%" }}
                                                                onChange={(val) =>
                                                                    onClickCascader(val, el.id, el)
                                                                }
                                                                changeOnSelect
                                                                value={itemsValue[el.id]?.name}
                                                            />
                                                        );
                                                    }
                                                    if (el.type === "date") {
                                                        return (
                                                            <DatePicker
                                                                style={{ width: "98%" }}
                                                                onChange={(value) =>
                                                                    handleDate(value, el, el.id)
                                                                }
                                                                defaultValue={
                                                                    itemsValue[el.id]?.name
                                                                }
                                                                disabled={false}
                                                                allowClear={false}
                                                            />
                                                        );
                                                    }
                                                    if (el.type === "number") {
                                                        return (
                                                            <Input
                                                                style={{ width: "98%", height: 40 }}
                                                                placeholder={el.inputVal}
                                                                id={el.id}
                                                                onChange={(val) =>
                                                                    handleInput(
                                                                        val,
                                                                        el.inputValKZ,
                                                                        el,
                                                                    )
                                                                }
                                                                defaultValue={
                                                                    itemsValue[el.id]?.name
                                                                }
                                                            />
                                                        );
                                                    }
                                                    if (el.type === "string") {
                                                        return (
                                                            <Input
                                                                style={{
                                                                    width: "98%",
                                                                    minHeight: 40,
                                                                }}
                                                                placeholder={el.inputVal}
                                                                autoSize={{
                                                                    minRows: 1,
                                                                    maxRows: 10,
                                                                }}
                                                                id={el.id}
                                                                onChange={(val) => {
                                                                    handleInput(
                                                                        val,
                                                                        el.inputValKZ,
                                                                        el,
                                                                    );
                                                                    setInputValue((prev) => {
                                                                        return {
                                                                            ...prev,
                                                                            [el.id]: {
                                                                                ...prev[el.id],
                                                                                name: val.target
                                                                                    .value,
                                                                            },
                                                                        };
                                                                    });
                                                                }}
                                                                value={
                                                                    inputValue[el.id]?.name || ""
                                                                }
                                                            />
                                                        );
                                                    }
                                                })()}
                                            </Col>
                                        )}
                                    </Row>
                                );
                            }
                        } else {
                            return [];
                        }
                    })}
                    {collectItems?.length > 0 &&
                    documentTemplate.actions.args[0].position_change ? (
                        <Row style={{ height: 50 }} align="middle">
                            <Col xs={7}>
                                {LocalText.getName({
                                    name: "За счет должности",
                                    nameKZ: "Лауазымы есебінен",
                                })}
                            </Col>
                            <Col>
                                <Checkbox onChange={addCounting} />
                            </Col>
                        </Row>
                    ) : null}
                </>
            ) : null}
        </div>
    );
};

export default TagsBlock;
