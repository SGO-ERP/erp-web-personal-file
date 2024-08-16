import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    changeButton,
    getPropertiesToSend,
    getStepsToSend,
} from "store/slices/newInitializationsSlices/initializationNewSlice";

const CheckingProperties = () => {
    const {
        documentTemplate,
        collectProperties,
        needRusLanguage,
        stepsArray,
        needDueDate,
        dueDate,
        comment,
        needComment,
        steps,
        needSteps,
        needCounting,
    } = useSelector((state) => state.initializationNew);

    const dispatch = useDispatch();

    useEffect(() => {
        if (collectProperties.length === 0) return;
        let keys;
        let keysWithDep;

        //проверка если стафф юнит
        if (documentTemplate && documentTemplate.properties) {
            keys = Object.keys(documentTemplate.properties);
            keysWithDep = keys.some(
                (key) => documentTemplate.properties[key]?.field_name === "staff_unit",
            )
                ? keys.length + 1
                : keys.length;
        }

        dispatch(changeButton(true));

        if (needCounting) {
            keysWithDep += 1;
        }

        //проверка все ли теги заполнены
        if (keysWithDep !== collectProperties.length) return;

        const sendProperties = collectProperties.reduce((acc, property) => {
            if (!property.ids) {
                return {
                    ...acc,
                    [property.wordInOrder]: {
                        name: property.newWord,
                        nameKZ: property.newWordKZ,
                        auto:
                            documentTemplate.properties[property.wordInOrder]?.data_taken === "auto"
                                ? true
                                : false,
                    },
                };
            } else {
                return {
                    ...acc,
                    [property.wordInOrder ? property.wordInOrder : "actual_position_id"]: {
                        name: property.newWord,
                        nameKZ: property.newWordKZ,
                        value: property.ids,
                        auto:
                            documentTemplate.properties[property.wordInOrder]?.data_taken === "auto"
                                ? true
                                : false,
                    },
                };
            }
        }, {});

        dispatch(getPropertiesToSend(sendProperties));
        dispatch(changeButton(true));

        //проверка нужен ли или есть ли крайний срок подрисания
        if (needDueDate && !dueDate) return;

        dispatch(changeButton(true));

        //проверка нужен ли и есть ли коментарий
        if (needComment && !comment) return;

        dispatch(changeButton(true));

        const keysStepsArray = Object.keys(stepsArray);
        const keysSteps = Object.keys(steps);

        const stepsCheck = keysStepsArray.reduce((acc, key) => {
            const matchingKey = keysSteps.find((keyIn) => key === keyIn);
            return matchingKey
                ? { ...acc, [key]: steps[matchingKey] }
                : { ...acc, [key]: stepsArray[key] };
        }, {});

        const containsNoArrays = Object.values(stepsCheck).every((value) => !Array.isArray(value));

        console.log(containsNoArrays, keysStepsArray.length, stepsCheck.length);

        //проверка нужен ли автоюзер и нужен ли он
        if (needSteps && !containsNoArrays && keysStepsArray.length !== stepsCheck.length) return;

        dispatch(getStepsToSend(stepsCheck));

        //проверка нет пустых тегов для 2х языков
        const isDisable = keys.some((key) =>
            collectProperties.some((property) => {
                if (property.isAuto) {
                    return false; // Skip the check if isAuto is true
                }

                return (
                    key === property.wordInOrder &&
                    ((needRusLanguage &&
                        (property.newWordKZ === " " ||
                            property.newWordKZ === "" ||
                            !property.newWordKZ ||
                            property.newWord === " " ||
                            property.newWord === "" ||
                            !property.newWord)) ||
                        (!needRusLanguage &&
                            (property.newWordKZ === " " ||
                                property.newWordKZ === "" ||
                                !property.newWordKZ)))
                );
            }),
        );

        dispatch(changeButton(isDisable));
    }, [collectProperties, dueDate, comment, steps, stepsArray, needCounting]);

    return null;
};

export default CheckingProperties;
