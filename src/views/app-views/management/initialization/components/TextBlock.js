import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { getIp } from "store/slices/ipSlice";
import EditorComponent from "../../candidates/list/stage/EditorComponent";

import { Card, Col, Radio, Row } from "antd";

import "../styles/style.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import FileUploaderService from "services/myInfo/FileUploaderService";
import i18n from "lang";
import { setText, setTextLanguage } from "store/slices/initialization/initializationDocInfoSlice";
import { WarningOutlined } from "@ant-design/icons";
import IntlMessage from "components/util-components/IntlMessage";
import { formatDate } from "../utils/dateHelper";

const TextBlock = () => {
    const [textInArea, setTextInArea] = useState("");
    const [watermark, setWatermark] = useState("");

    const myProfile = useSelector((state) => state.profile.data);
    const { ipData } = useSelector((state) => state.ip);
    const { selectedDocument } = useSelector((state) => state.initializationDocuments);
    const { tagsInfo, tagsValue } = useSelector((state) => state.initializationDocInfo);
    const { selectedUser } = useSelector((state) => state.initializationUsers);

    const { kzError, ruError, textKz, textRu, textLanguage, twoLanguage } = useSelector(
        (state) => state.initializationDocInfo,
    );

    const currentLocale = i18n.language;

    const today = moment();
    const dispatch = useDispatch();
    const lang = textLanguage ? "kz" : "ru";

    useEffect(() => {
        dispatch(getIp());
    }, []);

    useEffect(() => {
        if (myProfile) {
            setWatermark(myProfile.email + " " + today.format("DD.MM.YYYY") + " " + ipData + " ");
        }
    }, [myProfile, ipData]);

    useEffect(() => {
        const keys = Object.keys(selectedDocument);

        if (keys.length === 0) return;

        const { pathKZ, path } = selectedDocument;

        if (pathKZ) {
            generateTexts(pathKZ, "kz");
        }

        if (path) {
            generateTexts(path, "ru");
        }
    }, [selectedDocument]);

    useEffect(() => {
        setTextInArea(textLanguage ? textKz : textRu);
    }, [textLanguage, selectedDocument, textKz, textRu]);

    useEffect(() => {
        let updatedEditorValue = textLanguage ? textKz : textRu;
        let newWord = [];
        const oldWord = [];

        if (tagsInfo && tagsInfo.length > 0) {
            tagsInfo.map((tag) => {
                oldWord.push(tag.key);

                // const staffUnitWord = collectItems.find(
                //     (item) => item.tagName === el.wordInOrder && item.field_name === "staff_unit",
                // );

                // const countingKey = collectItems.find((item) => item.isCounting);

                // if (countingKey && staffUnitWord) {
                //     //когда засчет выбран и присутствует данные по засчет и должность

                //     const currentCounting = collectProperties.find(
                //         (item) => item.key === countingKey.id,
                //     );

                //     !changeOnRus
                //         ? newWord.push(
                //               currentCounting.newWord + " (лауазымы есебінен " + el.newWordKZ + ")",
                //           )
                //         : newWord.push(
                //               currentCounting.newWord + " (за счет должности " + el.newWord + ")",
                //           );
                // } else {
                //     !changeOnRus ? newWord.push(el.newWordKZ) : newWord.push(el.newWord);
                // }

                if (tagsValue[tag.key]?.names) {
                    const names = tagsValue[tag.key].names;

                    if (names.name || names.nameKZ) {
                        newWord.push(
                            textLanguage ? names.nameKZ.toLowerCase() : names.name.toLowerCase(),
                        );
                    } else {
                        newWord.push(names[lang].toLowerCase());
                    }
                } else if (tagsValue[tag.key]?.[lang]) {
                    newWord.push(tagsValue[tag.key][lang].toLowerCase());
                } else if (tagsValue[tag.key]?.value) {
                    newWord.push(tagsValue[tag.key]?.value[lang] ?? tagsValue[tag.key]?.value);
                } else {
                    newWord.push(tag.key.toLowerCase());
                }
            });

            for (let i = 0; i < oldWord.length; i++) {
                let startIndex = 0;
                let searchIndex;

                if (newWord[i]._d) {
                    newWord[i] = formatDate(newWord[i], textLanguage);
                }

                if (updatedEditorValue)
                    while (
                        (searchIndex = updatedEditorValue.indexOf(oldWord[i], startIndex)) > -1
                    ) {
                        if (
                            /^[^<_0-9A-Za-zА-Яа-яӘәІіҢңҒғҮүҰұҚқҺһЁёҖҗҢңҪҫҮүҰұҺһҖҗҢңҪҫ]+$/.test(
                                updatedEditorValue[searchIndex - 1],
                            ) &&
                            /^[^>_\-0-9A-Za-zА-Яа-яӘәІіҢңҒғҮүҰұҚқҺһЁёҖҗҢңҪҫҮүҰұҺһҖҗҢңҪҫ]+$/.test(
                                updatedEditorValue[searchIndex + oldWord[i].length],
                            )
                        ) {
                            let nums = [1, 2, 3];
                            for (let num of nums) {
                                if (
                                    updatedEditorValue[searchIndex - num] === "." ||
                                    updatedEditorValue[searchIndex - num] === ">" ||
                                    tagsInfo[i].capital
                                ) {
                                    newWord[i] =
                                        newWord[i].charAt(0).toUpperCase() + newWord[i].slice(1);
                                }
                            }
                            updatedEditorValue =
                                updatedEditorValue.slice(0, searchIndex) +
                                newWord[i] +
                                updatedEditorValue.slice(searchIndex + oldWord[i].length);

                            startIndex = searchIndex + newWord[i].length;
                        } else {
                            startIndex = searchIndex + oldWord[i].length;
                        }
                    }
            }
        }
        setTextInArea(updatedEditorValue);
    }, [tagsInfo, tagsValue, textLanguage, selectedUser]);

    const generateTexts = async (url, lang) => {
        try {
            const updatedUrl = url.replace("192.168.0.61:8083", "193.106.99.68:2298");

            const file = await FileUploaderService.getFileByLink(updatedUrl);

            file.text().then((r) => {
                const replacedText = r.replace(/{{/g, " ").replace(/}}/g, " ");
                dispatch(setText({ value: replacedText, lang }));
            });
        } catch (error) {
            setTextInArea(currentLocale === "kk" ? kzError : ruError);
            throw error;
        }
    };

    const handleLanguage = (val) => {
        const { value } = val.target;

        dispatch(setTextLanguage(value === "kaz"));
    };

    return (
        <div className="textBlockMain document-a4">
            <Card>
                {twoLanguage ? (
                    <Row style={{ marginBottom: "3%" }}>
                        <Col xs={7}>
                            <Row style={{ marginTop: "3 %" }}>
                                <Col xs={4} style={{ display: "flex", alignItems: "center" }}>
                                    <WarningOutlined style={{ fontSize: 21, color: "#366EF6" }} />
                                </Col>
                                <Col className="text3" xs={20}>
                                    <IntlMessage id="initiate.languageWarning" />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={17} align="end">
                            <Radio.Group value={textLanguage ? "kaz" : "rus"}>
                                <Radio.Button value="rus" onClick={handleLanguage}>
                                    Русский
                                </Radio.Button>
                                <Radio.Button value="kaz" onClick={handleLanguage}>
                                    Казахский
                                </Radio.Button>
                            </Radio.Group>
                        </Col>
                    </Row>
                ) : null}
                <EditorComponent
                    value={textInArea}
                    setValue={setTextInArea}
                    waterMarkerText={watermark}
                    style={{ maxWidth: "100%" }}
                    disabled={true}
                />
            </Card>
        </div>
    );
};

export default TextBlock;
