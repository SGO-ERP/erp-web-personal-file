import { Cascader } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import React, { useEffect, useState } from "react";
import HrDocumentService from "services/HrDocumentsService";

const MatreshkaNoName = ({ placeholderId, setValue, data }) => {
    const [options, setOptions] = useState([]);
    const [labelValue, setLabelValue] = useState("");

    useEffect(() => {
        if (!data) return;

        const transformedOptions = transformOptions(data);

        setOptions(transformedOptions);
    }, [data]);

    const handleCascader = (value, massive) => {
        if (value) {
            const label = massive.map((e) => e.label).join(" / ");

            setLabelValue(label);
            setValue({
                ids: value,
                fullName: label,
                staff_units: massive[massive.length - 1].staff_units,
            });
        } else {
            setLabelValue("");
            setValue({});
        }
    };

    const transformOptions = (data) => {
        if (!data) return [];
        const filteredData = data.filter((item) => item.name !== "Особая группа");

        return filteredData.map((item) => {
            return {
                value: item.id,
                label: item.name,
                isLeaf: item.children ? false : true,
                key: item.id,
                staff_units: item.staff_units ?? [],
            };
        });
    };

    const loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        if (targetOption.length === 1) return;

        try {
            let response = await HrDocumentService.getMatreshkaFromDepId(targetOption.value);

            targetOption.loading = false;

            const newData = await transformOptions(response.children);

            targetOption.children = [].concat(...newData);

            setOptions((prevData) =>
                prevData.map((opt) => (opt.value === targetOption.value ? targetOption : opt)),
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Cascader
            options={options}
            style={{ width: "98%" }}
            placeholder={<IntlMessage id={placeholderId} />}
            onChange={handleCascader}
            loadData={loadData}
            value={labelValue}
            changeOnSelect
        />
    );
};

export default MatreshkaNoName;
