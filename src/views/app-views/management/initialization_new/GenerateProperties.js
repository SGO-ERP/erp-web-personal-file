import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InflectWordService from "services/inflectWord/InflectWordService";
import {
    getItems,
    getProperties,
} from "store/slices/newInitializationsSlices/initializationNewSlice";
import UserService from "services/UserService";
import HrDocumentService from "services/HrDocumentsService";
import { useSearchParams } from "react-router-dom";
import ServiceStaffUnits from "services/ServiceStaffUnits";

const GenerateProperties = () => {
    const dispatch = useDispatch();
    const properties = useSelector((state) => state.initializationNew.documentTemplate.properties);
    const selectUser = useSelector((state) => state.initializationNew.selectUser);

    const [searchParams, setSearchParams] = useSearchParams();

    const positionID = searchParams.get("vacancyPosition");
    const isCandidate = searchParams.get("isCandidate");

    useEffect(() => {
        if (selectUser && Object.keys(selectUser).length === 0 && selectUser.constructor === Object)
            return;

        generateValue();
    }, [selectUser]);

    useEffect(() => {
        if (!properties) return;
        if (!selectUser.id) return;

        generateTags();
    }, [properties, selectUser]);

    //замена казахских букв на русккие
    function translateToRussian(text) {
        if (text) {
            let kzText = text.toUpperCase();
            const translationMap = {
                "Қ": "К",
                "Ә": "Э",
                "Ң": "Н",
                "Ғ": "Г",
                "Ұ": "У",
                "Ү": "У",
                "Җ": "Ж",
                "Ө": "О",
                "Һ": "Н",
                "І": "И",
            };

            let result = "";

            for (let i = 0; i < kzText.length; i++) {
                const kzChar = kzText[i];

                if (kzChar in translationMap) {
                    result += translationMap[kzChar];
                } else {
                    result += kzChar;
                }
            }

            return result.toLowerCase();
        }
    }

    //добавление падежей
    const handleNameFields = async (key, name, properties, cases) => {
        let withoutKZ = translateToRussian(name.name);
        let newName = "";
        let newNameKZ = "";

        if (name.name && cases) {
            if (cases !== 7) {
                newName = await InflectWordService.inflect(withoutKZ, cases, "ru");
            } else {
                newName = withoutKZ;
            }
            newNameKZ = await InflectWordService.inflect(name.nameKZ, cases, "kz");
        }

        if (
            ["name", "surname", "father_name"].includes(properties[key].field_name) &&
            newName !== undefined &&
            name.name
        ) {
            newName = `${name.name.charAt(0).toUpperCase()}${name.name.slice(1)}${newName.slice(
                withoutKZ.length,
            )}`;
            newNameKZ = `${newNameKZ.charAt(0).toUpperCase()}${newNameKZ.slice(1)}`;
        }

        return {
            wordInOrder: key,
            newWord: newName ? newName.toLowerCase() : name.name?.toLowerCase() || " ",
            newWordKZ: newNameKZ ? newNameKZ.toLowerCase() : name.nameKZ?.toLowerCase() || " ",
            capital: true,
            isAuto: properties[key].data_taken === "auto",
            isString: properties[key].type === "string",
        };
    };

    //Сбор автотегов
    const generateValue = async () => {
        if (!properties) return;
        const keys = Object.keys(properties);
        const takeAutoTags = (
            await Promise.all(
                keys.map(async (key) => {
                    if (properties[key].data_taken === "auto") {
                        let name;

                        try {
                            name = await UserService.auto_user_info(
                                selectUser.id,
                                properties[key].field_name,
                            );
                        } catch (error) {
                            console.error("An error occurred:", error);
                        }

                        if (!name || (name.name === null && name.nameKZ === null)) {
                            name = [{ name: " ", nameKZ: " " }];
                        } else if (name.nameKZ === null && name.name !== null) {
                            name = [{ name: name.name, nameKZ: " " }];
                        } else if (name.nameKZ !== null && name.name === null) {
                            name = [{ name: " ", nameKZ: name.nameKZ }];
                        }

                        let newValName = "";
                        let newNameKZ = "";
                        if (Array.isArray(name)) {
                            const names = name.map((item) => item.name);
                            newValName = names.join(", ");
                            const namesKZ = name.map((item) => item.nameKZ);
                            newNameKZ = namesKZ.join(", ");
                        }

                        const cases = properties[key].to_tags?.cases;

                        if (
                            properties[key].field_name == "family_member" ||
                            ["name", "surname", "father_name"].includes(properties[key].field_name)
                        ) {
                            return await handleNameFields(key, name, properties, cases);
                        } else if (name) {
                            return {
                                wordInOrder: key,
                                newWord: newValName
                                    ? newValName.toLowerCase()
                                    : name.name.toLowerCase(),
                                newWordKZ: newNameKZ
                                    ? newNameKZ.toLowerCase()
                                    : name.nameKZ.toLowerCase(),
                                capital: false,
                                isAuto: properties[key].data_taken === "auto",
                                isString: properties[key].type === "string",
                            };
                        }
                    }
                }),
            )
        ).filter((item) => item !== undefined);
        if (takeAutoTags.length > 0) {
            dispatch(getProperties(takeAutoTags));
        }
    };

    // Вспомогательная функция для создания элементов массива
    const createArrItem = async (key, property, count, dropdownItems) => {
        return {
            inputVal: property?.alias_name,
            inputValKZ: property.alias_nameKZ,
            tagName: key,
            id: count,
            type: property.data_type || property.data_taken,
            field_name: property.field_name,
            dropdownItems: dropdownItems,
            check: true,
        };
    };

    // Вспомогательная функция для получения выпадающих элементов
    const fetchDropdownItems = async (property) => {
        let id;
        if (property.field_name === "secondments" || property.field_name === "staff_division") {
            id = null;
        } else {
            id = selectUser.id;
        }

        return await getDropdownItems({
            option: property.field_name,
            dataTaken: property.data_taken,
            mId: id,
            type: property.type,
            down: property.alias_name === "Звание для понижения" ? property.alias_name : null,
        });
    };

    //сбор тегов для интерфеса
    const generateTags = async () => {
        const itemsToDraw = [];
        let count = 0;

        for (const key in properties) {
            let dropdownItems;
            const property = properties[key];

            if (property.data_taken === "auto") continue;

            if (property.data_taken === "dropdown") {
                if (property.field_name === "staff_unit") {
                    dropdownItems = await HrDocumentService.getMatreshka();

                    itemsToDraw.push(
                        await createArrItem(
                            "new_department_name",
                            {
                                ...property,
                                alias_name: "Новый департамент",
                                alias_nameKZ: "Жаңа бөлім",
                                field_name: "staff_division",
                            },
                            count,
                            dropdownItems,
                        ),
                    );
                    count++;

                    if (!positionID) {
                        itemsToDraw.push(await createArrItem(key, property, count, []));
                    } else {
                        dropdownItems = await ServiceStaffUnits.staff_units_id(positionID).catch(
                            (error) => console.log(error),
                        );

                        itemsToDraw.push(
                            await createArrItem(key, property, count, [dropdownItems]),
                        );
                    }
                    count++;
                } else {
                    dropdownItems = await fetchDropdownItems({
                        field_name: property.field_name,
                        data_taken: property.data_taken,
                        type: property.type,
                        alias_name: property.alias_name,
                    });

                    itemsToDraw.push(await createArrItem(key, property, count, dropdownItems));
                    count++;
                }
            } else if (property.data_taken !== "manual") {
                dropdownItems = await fetchDropdownItems(property);
                itemsToDraw.push(await createArrItem(key, property, count, dropdownItems));
                count++;
            } else {
                itemsToDraw.push(await createArrItem(key, property, count, dropdownItems));
                count++;
            }
        }

        dispatch(getItems(itemsToDraw));
    };

    //сбор инфы для каскадеров
    async function getDropdownItems(field_name) {
        const dropdownItems = await HrDocumentService.getDropdownItems(field_name);

        if (field_name.option == "rank") {
            if (isCandidate) {
                return dropdownItems;
            }
            const filteredRanks = await dropdownItems
                .filter((rank) => rank.id !== selectUser.rank.id)
                .sort((a, b) => a.rank_order - b.rank_order);
            if (selectUser.rank) {
                let orderedRanks = filteredRanks;
                if (selectUser.rank.rank_order !== 1) {
                    orderedRanks = filteredRanks
                        .filter((rank) => rank.rank_order > selectUser.rank.rank_order)
                        .slice(0, 2);

                    if (field_name.down !== null) {
                        orderedRanks = filteredRanks.filter(
                            (rank) => rank.rank_order < selectUser.rank.rank_order,
                        );

                        orderedRanks = orderedRanks
                            .sort((a, b) => b.rank_order - a.rank_order)
                            .slice(0, 1);

                        return orderedRanks;
                    }

                    return orderedRanks;
                }
                return orderedRanks.slice(0, 2);
            } else {
                let prevRank = filteredRanks.find(
                    (rank) => rank.rank_order === selectUser.rank.rank_order,
                );

                return [prevRank];
            }
        } else {
            return dropdownItems;
        }
    }

    return null;
};

export default GenerateProperties;
