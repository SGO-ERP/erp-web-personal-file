import { Cascader, Spin } from "antd";
import { useAppSelector } from "hooks/useStore";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hrDocOptionAll } from "../../../../../store/slices/candidates/candidateHrDocOptionMatreshkaSlice";
import { LoadingOutlined } from "@ant-design/icons";
import HrDocumentService from "../../../../../services/HrDocumentsService";
import { removeStaffUnitNodes } from "../../../../../utils/schedule/utils";

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);
const ListUsers = ({ setIds, ids, filtered }) => {
    const users = useAppSelector((state) => state.candidateHrDoc.data);
    const isLoading = useAppSelector((state) => state.candidateHrDoc.isLoading);

    const dispatch = useDispatch();

    const [choosedU, setChoosedU] = useState([]);

    const [cascaderData, setCascaderData] = useState([]);
    const [dropdownItems, setDropdownItems] = useState([]);

    useEffect(() => {
        dispatch(hrDocOptionAll());
    }, []);

    useEffect(() => {
        HrDocumentService.getDropdownItems({
            option: "staff_division",
            dataTaken: "matreshka",
            type: "write",
            mId: null,
        }).then((r) => setDropdownItems(r));
    }, []);

    const findUnitID = (arr, id) => {
        for (let el of arr) {
            if (el.value === id[id.length - 1]) {
                return el.unitId;
            }
        }
    };
    const chooseUserFunc = (e, arr) => {
        const names = [];
        arr.map((el) => {
            if (typeof el.label?.props?.children === "string") {
                names.push(el.label.props.children);
            } else if (el.label.props !== undefined) {
                names.push(el.label.props.children[0] + " " + el.label.props.children[2]);
            } else {
                names.push(el.label);
            }
        });

        const choosedObj = {
            name: names[names.length - 1],
            id: e[e.length - 1],
            unitId: findUnitID(arr, e),
        };

        setChoosedU(choosedObj.name);
        setIds(choosedObj.unitId);
    };

    useEffect(() => {
        const staffOptions = [];
        const arr = transformToCascader(
            dropdownItems,
            Array.isArray(filtered) ? removeStaffUnitNodes(filtered, users) : users,
        );
        arr.map((el) => el.map((e) => staffOptions.push(e)));
        setCascaderData(staffOptions);
    }, [dropdownItems, users]);

    const loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        try {
            let response = await HrDocumentService.getDropdownItems({
                option: "staff_division",
                dataTaken: "matreshka",
                mId: targetOption.value,
                type: "write",
                down: null,
            });

            targetOption.loading = false;

            let filteredResponse = response.filter((item) => item.staff_units !== null);

            filteredResponse = filteredResponse.map((item) => {
                const filteredUnits = item.staff_units.filter(
                    (unit) => unit.users && unit.users.length !== 0,
                );
                return { ...item, staff_units: filteredUnits };
            });

            let childrens = transformToCascader(
                filteredResponse,
                Array.isArray(filtered) ? removeStaffUnitNodes(filtered, users) : users,
            );
            // Flatten the array
            targetOption.children = [].concat(...childrens);

            // Assuming that cascaderData is an array of objects and targetOption exists within it
            setCascaderData((prevData) =>
                prevData.map((opt) => (opt.value === targetOption.value ? targetOption : opt)),
            );
        } catch (error) {
            // Handle error
            console.log(error);
        }
    };

    const transformToCascader = (data, ids) => {
        return data.reduce((acc, item) => {
            if (item.name === "Особая группа") {
                return acc;
            }

            let option = [];

            if (item.children !== null) {
                option.push({
                    value: item.id,
                    label: item.name,
                    isLeaf: false,
                    key: item.id,
                });
            } else {
                option.push({
                    value: item.id,
                    label: item.name,
                    disabled: true,
                    key: item.id,
                });
            }

            if (item.staff_units && item.staff_units.length > 0) {
                const unitsOptions = item.staff_units.reduce((accUnits, unit) => {
                    if (!ids.some((id) => id.unitId === unit.id)) {
                        accUnits.push({
                            value: unit.id,
                            label: (
                                <p style={{ color: "#1A3353" }}>
                                    {unit.users[0]?.first_name} {unit.users[0]?.last_name}
                                </p>
                            ),
                            unitId: unit.id,
                            positionId: unit.actual_position
                                ? unit.actual_position.id
                                : unit.position.id,
                            key: unit.id,
                        });
                    }
                    return accUnits;
                }, []);

                option = [...option, ...unitsOptions];
            }

            acc.push(option);
            return acc;
        }, []);
    };

    return (
        <Cascader
            style={{ width: "100%" }}
            options={cascaderData}
            onChange={chooseUserFunc}
            loadData={loadData}
            changeOnSelect
            value={choosedU}
            allowClear={false}
            loading={isLoading}
            loadingIcon={<Spin indicator={antIcon} />}
        />
    );
};

export default ListUsers;
