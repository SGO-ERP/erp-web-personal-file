import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import { getFieldValue, setFieldValue } from "store/slices/myInfo/myInfoSlice";

const EditSelect = (props) => {
    const { defaultValue, fieldName, fieldNameGet, id, options, ...restProps } = props;
    const dispatch = useDispatch();

    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const field = useSelector((state) => getFieldValue(state, `${fieldName}.value`));

    const handleChange = (e) => {
        dispatch(setFieldValue({ fieldPath: `${fieldName}.value`, value: e }));
    };

    useEffect(() => {
        dispatch(
            setFieldValue({
                fieldPath: `${fieldName}.value`,
                value: defaultValue,
            }),
        );
        dispatch(
            setFieldValue({
                fieldPath: `${fieldNameGet}.value`,
                value: defaultValue,
            }),
        );
        if (id) {
            dispatch(
                setFieldValue({
                    fieldPath: `${fieldNameGet}.id`,
                    value: id,
                }),
            );
            dispatch(
                setFieldValue({
                    fieldPath: `${fieldName}.id`,
                    value: id,
                }),
            );
        }
    }, [defaultValue]);

    if (!modeRedactor) return defaultValue;

    return (
        <Select
            showSearch
            options={options}
            onChange={handleChange}
            value={field}
            style={{ width: "100%" }}
            {...restProps}
        />
    );
};

export default EditSelect;
