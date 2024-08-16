import { Cascader } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import React, { useEffect, useState } from "react";

const MatreshkaFullData = ({ placeholderId, setValue, data, getValue }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (!data) return;

        const transformedOptions = transformOptions(data);

        setOptions(transformedOptions);
    }, [data]);

    const handleCascader = (value, massive) => {
        if (value) {
            const label = massive.map((e) => e.label).join(" / ");
            const labelKZ = massive.map((e) => e.labelKZ).join(" / ");

            setValue({
                ids: value,
                fullName: { ru: label, kz: labelKZ },
                staff_units: massive[massive.length - 1].staff_units,
            });
        } else {
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
                labelKZ: item.nameKZ,
                isLeaf: item.children ? false : true,
                key: item.id,
                staff_units: item.staff_units ?? [],
                children: transformOptions(item.children),
            };
        });
    };

    return (
        <Cascader
            options={options}
            style={{ width: "98%", marginBottom: 4 }}
            placeholder={placeholderId && <IntlMessage id={placeholderId} />}
            onChange={handleCascader}
            value={getValue}
            changeOnSelect
        />
    );
};

export default MatreshkaFullData;
