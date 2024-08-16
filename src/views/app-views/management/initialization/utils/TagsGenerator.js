import React from "react";
import MatreshkaFullData from "../../additionalComponents/MatreshkaFullData";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { Col, DatePicker, Input, Row, Select } from "antd";
import {
    setTagsOptions,
    setValueTags,
} from "store/slices/initialization/initializationDocInfoSlice";
import { useDispatch, useSelector } from "react-redux";

const TagsGenerator = ({ tagsInfo, tagsValue, which }) => {
    const dispatch = useDispatch();
    const textLanguage = useSelector((state) => state.initializationDocInfo.textLanguage);
    const lang = textLanguage ? "kz" : "ru";

    if (!tagsInfo || tagsInfo.length === 0) return null;

    const filteredTags =
        which === "tags"
            ? tagsInfo.filter(
                  (tag) => tag.field_name !== "staff_unit" && tag.field_name !== "staff_division",
              )
            : tagsInfo.filter(
                  (tag) => tag.field_name === "staff_unit" || tag.field_name === "staff_division",
              );

    const generateTagType = (tag, tagsValue, which) => {
        const options =
            tag.options &&
            tag.options.map((item) => ({
                value: item.id,
                label: LocalText.getName(item.position),
                info: item,
            }));
        switch (tag.type) {
            case "date":
                return (
                    <DatePicker
                        style={{ width: "98%" }}
                        onChange={(e) => handleOnChange(e, tag.key, "date")}
                        value={tagsValue[tag.key]?.value}
                    />
                );
            case "string":
                return (
                    <Input
                        style={{ width: "98%" }}
                        onChange={(e) => handleOnChange(e.target.value, tag.key, "input")}
                        value={tagsValue[tag.key]?.[lang]}
                    />
                );
            case "number":
                return (
                    <Input
                        style={{ width: "98%" }}
                        onChange={(e) => handleOnChange(e.target.value, tag.key, "number")}
                        value={tagsValue[tag.key]?.value}
                        type="number"
                    />
                );
            case "dropdown":
                return (
                    <Select
                        style={
                            which === "users"
                                ? { width: "98%", marginBottom: 10 }
                                : { width: "98%" }
                        }
                        onChange={(e, object) =>
                            handleOnChange({ value: e, object: object.info }, tag.key, "dropdown")
                        }
                        options={options}
                        value={tagsValue[tag.key]?.value}
                    />
                );
            case "matreshka":
                return (
                    <MatreshkaFullData
                        setValue={(e) => handleOnChange(e, tag.key, "matreshka")}
                        data={tag.options}
                        getValue={tagsValue[tag.key]?.value?.ids}
                    />
                );
            default:
                return null;
        }
    };

    const handleOnChange = (value, tag, type) => {
        if (tag === "new_department_name") {
            dispatch(setTagsOptions({ key: "Новая должность", value: value.staff_units }));
        }
        if (type === "date" || type === "number") {
            const newTagsValue = { ...tagsValue, [tag]: { value } };
            dispatch(setValueTags(newTagsValue));
        }

        if (type === "input") {
            const newTagsValue = { ...tagsValue, [tag]: { ...tagsValue[tag], [lang]: value } };
            dispatch(setValueTags(newTagsValue));
        }

        if (type === "matreshka") {
            const newTagsValue = {
                ...tagsValue,
                [tag]: { value: value.ids, names: value.fullName },
            };
            dispatch(setValueTags(newTagsValue));
        }

        if (type === "dropdown") {
            const newTagsValue = {
                ...tagsValue,
                [tag]: {
                    value: value.value,
                    names: value.object.position ? value.object.position : value.object,
                },
            };
            dispatch(setValueTags(newTagsValue));
        }
    };

    return filteredTags
        .filter((tag) => tag.type !== "auto")
        .map((tag, index) => (
            <Row align="middle" style={{ height: 50 }} key={index}>
                <Col xs={7}>{tag.titleRU ?? tag.titleKZ}</Col>
                <Col xs={17}>{generateTagType(tag, tagsValue, which, textLanguage)}</Col>
            </Row>
        ));
};

export default TagsGenerator;
