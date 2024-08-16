import { Card } from "antd";
import { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import EditorComponent from "../candidates/list/stage/EditorComponent";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import FileUploaderService from "services/myInfo/FileUploaderService";
import "./styles/IndexStyle.css";
import { changeText } from "store/slices/newInitializationsSlices/initializationNewSlice";
import { getIp } from "../../../../store/slices/ipSlice";

const TextBlock = () => {
    const [textKZ, setTextKZ] = useState("");
    const [textRU, setTextRU] = useState("");
    const [textInArea, setTextInArea] = useState("");
    const [watermark, setWatermark] = useState("");

    const myProfile = useSelector((state) => state.profile.data);
    const ip = useSelector((state) => state.ip.ipData);
    const today = moment();

    const {
        textApiKZ,
        textApiRU,
        changeOnRus,
        textes,
        orderLanguage,
        collectProperties,
        collectItems,
    } = useSelector((state) => state.initializationNew);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getIp());
    }, []);

    useEffect(() => {
        if (myProfile !== null && myProfile) {
            setWatermark(myProfile.email + " " + today.format("DD.MM.YYYY") + " " + ip + " ");
        }
    }, [myProfile, ip]);

    useEffect(() => {
        if (!textApiKZ) return;

        drawText();
    }, [textApiKZ]);

    const drawText = async () => {
        const file = await FileUploaderService.getFileByLink(textApiKZ);

        file.text().then((r) => {
            const replacedText = r.replace(/{{/g, " ").replace(/}}/g, " ");
            setTextKZ(replacedText);
            dispatch(changeText({ text: replacedText, lang: "kz" }));
            setTextInArea(replacedText);
        });

        if (textApiRU) {
            const file = await FileUploaderService.getFileByLink(textApiRU);

            file.text().then((r) => {
                const replacedText = r.replace(/{{/g, " ").replace(/}}/g, " ");
                setTextRU(replacedText);
                dispatch(changeText({ text: replacedText, lang: "ru" }));
            });
        }
    };

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

        return `${day} ${orderLanguage ? months[month] : monthKz[month]} ${year}`;
    }

    function isDate(dateStr) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateStr)) {
            return false;
        }
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
    }

    useEffect(() => {
        let oldWord = [];
        let newWord = [];

        let updatedEditorValue = !changeOnRus ? textes.kz : textes.ru;

        if (collectProperties && collectProperties.length > 0) {
            collectProperties.map((el) => {
                oldWord.push(el?.wordInOrder);

                const staffUnitWord = collectItems.find(
                    (item) => item.tagName === el.wordInOrder && item.field_name === "staff_unit",
                );

                const countingKey = collectItems.find((item) => item.isCounting);

                if (countingKey && staffUnitWord) {
                    //когда засчет выбран и присутствует данные по засчет и должность

                    const currentCounting = collectProperties.find(
                        (item) => item.key === countingKey.id,
                    );

                    !changeOnRus
                        ? newWord.push(
                              currentCounting.newWord + " (лауазымы есебінен " + el.newWordKZ + ")",
                          )
                        : newWord.push(
                              currentCounting.newWord + " (за счет должности " + el.newWord + ")",
                          );
                } else {
                    !changeOnRus ? newWord.push(el.newWordKZ) : newWord.push(el.newWord);
                }
            });

            for (let i = 0; i < oldWord.length; i++) {
                let startIndex = 0;
                let searchIndex;

                if (isDate(newWord[i])) {
                    newWord[i] = formatDate(newWord[i]);
                }

                if (typeof newWord[i] === "number") {
                    newWord[i] = newWord[i].toString();
                }

                if (!newWord[i]) {
                    newWord[i] = " ";
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
                                    collectProperties[i].capital
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
    }, [collectProperties, changeOnRus, textApiKZ]);

    return (
        <div className="textBlockMain document-a4">
            <Card>
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
