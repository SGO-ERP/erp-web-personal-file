import { Cascader } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import React, { useEffect, useState } from "react";
import HrDocumentService from "services/HrDocumentsService";

const Matreshka = ({
    placeholderId,
    setValue,
    data,
    filter = [],
    role = null,
    disable = false,
    edit = null,
}) => {
    const [options, setOptions] = useState([]);
    const [labelValue, setLabelValue] = useState("");

    useEffect(() => {
        if (!data) return;

        const filteredOptions = transformOptions(data, filter, []);

        setOptions(filteredOptions);

        if (!edit.key) return;

        setValue({ ids: edit.positionId, fullName: edit.position });
        setLabelValue(edit.position);
    }, [data, filter, role, edit]);

    const handleCascader = (value, massive) => {
        if (value) {
            const label = massive.map((e) => e.label).join(" / ");

            setLabelValue(label);
            setValue({ ids: value, fullName: label });
        } else {
            setLabelValue("");
            setValue({});
        }
    };

    const transformOptions = (data, ids, users, isChildren) => {
        if (!data) return [];
        const filteredData = data.filter((item) => item.name !== "Особая группа");

        const userList = users
            ? users
                  .filter((unit) => !ids.some((id) => id.unitId === unit.id))
                  .filter((unit) => unit.users && unit.users.length > 0)
                  .map((unit) => {
                      if (unit.users.length > 0)
                          return {
                              value: unit.id,
                              label:
                                  (unit.actual_position?.name
                                      ? unit.actual_position?.name
                                      : unit.position?.name) +
                                  " (" +
                                  unit.users[0]?.first_name[0] +
                                  ". " +
                                  unit.users[0]?.last_name +
                                  ")",
                              unitId: unit.id,
                              positionId: unit.actual_position_id
                                  ? unit.actual_position_id
                                  : unit.position.id,
                              key: unit.id,
                          };
                  })
            : [];

        const departments = filteredData.map((item, index) => {
            if (isChildren && users.length === 0) {
                return {
                    value: item.id,
                    label: item.name,
                    isLeaf: true,
                    key: item.id,
                };
            }

            return {
                value: item.id,
                label: item.name,
                isLeaf: false,
                key: item.id,
            };
        });

        return [...departments, ...userList];
    };

    const loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        if (targetOption.length === 1) return;

        try {
            let response = await HrDocumentService.getMatreshkaId(targetOption.value);

            targetOption.loading = false;

            const filteredResponse = response.children
                ? response.children
                      .filter((item) => item.staff_units !== null)
                      .map((item) => ({
                          ...item,
                          staff_units: item.staff_units.filter(
                              (unit) => unit.users && unit.users.length > 0,
                          ),
                      }))
                : [];

            const childrenOptions = transformOptions(
                filteredResponse,
                filter,
                response.staff_units,
                response.children,
            );
            const users = filter.filter((item) => item.key === -1 && item.unitId);
            const fullUsers = transformOptions(
                filteredResponse,
                users,
                response.staff_units,
                response.children,
            );

            targetOption.children = [].concat(
                ...(role && role.name === "Уведомляемый" ? fullUsers : childrenOptions),
            );

            setOptions((prevData) =>
                prevData.map((opt) => (opt.value === targetOption.value ? targetOption : opt)),
            );
        } catch (error) {
            console.log(error);
        }
    };

    const isDisabled = disable && !role;

    return (
        <Cascader
            options={options}
            style={{ width: "100%" }}
            placeholder={<IntlMessage id={placeholderId} />}
            onChange={handleCascader}
            loadData={loadData}
            value={labelValue}
            disabled={isDisabled}
        />
    );
};

export default Matreshka;
