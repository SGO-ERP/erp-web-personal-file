import { Cascader } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import React, { useEffect, useState } from "react";
import HrDocumentService from "services/HrDocumentsService";

const MatreshkaOnlyParent = (params) => {
    const { getValue, setValue, getFullName, isEdit } = params;
    const [options, setOptions] = useState([]);
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        createFirstStep();
    }, []);

    const createFirstStep = async () => {
        try {
            const response = await HrDocumentService.getMatreshka();
            const filteredResponse = response.filter(
                (division) => division.name !== "Особая группа",
            );
            const formattedResponse = formattedOptions(filteredResponse);

            setOptions(formattedResponse);
        } catch (error) {
            console.log("MatreshkaOnlyParent first step error: ", error);
            throw error;
        }
    };

    const formattedOptions = (data) => {
        return data.map((division) => {
            const { name, nameKZ, id, children } = division;

            return {
                value: id,
                label: LocalText.getName(division),
                isLeaf: children ? false : true,
                key: id,
                fullName: { name, nameKZ },
            };
        });
    };

    const loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        if (targetOption.length === 1) return;

        try {
            let response = await HrDocumentService.getMatreshkaId(targetOption.value);

            targetOption.loading = false;

            const newData = await formattedOptions(response.children);

            targetOption.children = [].concat(...newData);

            setOptions((prevData) =>
                prevData.map((opt) => (opt.value === targetOption.value ? targetOption : opt)),
            );
        } catch (error) {
            console.log(error);
        }
    };

    console.log(getFullName);

    return (
        <Cascader
            options={options}
            style={{ width: "100%" }}
            placeholder={<IntlMessage id={"placeholderId"} />}
            loadData={loadData}
            changeOnSelect
            onChange={(e) => {
                setValue(e);
                setIsChange(true);
            }}
            value={!isChange && isEdit ? getFullName?.name ?? [] : getValue}
        />
    );
};

export default MatreshkaOnlyParent;
