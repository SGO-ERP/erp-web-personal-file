import React, { useEffect, useState } from "react";

import "../styles/style.css";
import { useDispatch, useSelector } from "react-redux";
import {
    setTags,
    setTagsOptions,
    setValueTags,
} from "store/slices/initialization/initializationDocInfoSlice";
import HrDocumentService from "services/HrDocumentsService";
import TagsGenerator, { generateTags } from "../utils/TagsGenerator";
import { Row, Spin } from "antd";

const TagsBlock = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { selectedDocument } = useSelector((state) => state.initializationDocuments);
    const { tagsInfo, tagsValue } = useSelector((state) => state.initializationDocInfo);

    useEffect(() => {
        setLoading(true);
        const { properties } = selectedDocument;
        if (!properties) return;

        generateItems(properties);
    }, [selectedDocument]);

    const generateItems = async (properties) => {
        const capitalItems = ["first_name", "last_name", "father_name"];
        const items = await Promise.all(
            Object.keys(properties).map(async (key) => {
                const item = {
                    type: properties[key].data_type || properties[key].data_taken,
                    field_name: properties[key].field_name,
                    tagKZ: properties[key].to_tags.prevWordKZ,
                    titleKZ: properties[key].alias_nameKZ,
                    titleRU: properties[key].alias_name,
                    options: [],
                    key,
                    capital: capitalItems.includes(key),
                    cases: properties[key].to_tags.cases ?? null,
                };

                if (properties[key].field_name === "staff_unit") {
                    const departmentOptions = await getDepartments();
                    return [
                        {
                            ...item,
                            type: "matreshka",
                            tagKZ: "new_department_name",
                            tagRU: "new_department_name",
                            titleKZ: "Жаңа бөлім",
                            titleRU: "Новый департамент",
                            options: departmentOptions,
                            key: "new_department_name",
                            field_name: "staff_division",
                            capital: false,
                        },
                        item,
                    ];
                } else if (properties[key].data_taken !== "auto") {
                    return item;
                }
            }),
        );

        const flattenedItems = items.flat().filter((item) => item);

        dispatch(setTags(flattenedItems));

        setLoading(false);
    };

    const getDepartments = async () => {
        return await HrDocumentService.getMatreshkaFromDep();
    };

    if (loading && selectedDocument.id)
        return (
            <Row justify="center" style={{ marginTop: 20 }}>
                <Spin />
            </Row>
        );

    return (
        <div style={{ marginTop: 10 }}>
            <TagsGenerator tagsInfo={tagsInfo} tagsValue={tagsValue} which="tags" />
        </div>
    );
};

export default TagsBlock;
