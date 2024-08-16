import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "antd";
import { getFieldValue, setFieldValue } from "../../../../../../store/slices/myInfo/myInfoSlice";
import moment from "moment/moment";
import { disabledDate } from "utils/helpers/futureDateHelper";

const EditDateInput = (props) => {
    const { defaultValue, fieldName, fieldNameGet, id, isDateTo, ...restProps } = props;
    const dispatch = useDispatch();

    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const field = useSelector((state) => getFieldValue(state, `${fieldName}.value`));

    const handleChange = (_, dateString) => {
        dispatch(setFieldValue({ fieldPath: `${fieldName}.value`, value: dateString }));
    };

    useEffect(() => {
        // set field value to default value
        dispatch(
            setFieldValue({
                fieldPath: `${fieldName}.value`,
                value: defaultValue,
            }),
        );
        // set field value to copy of default value
        dispatch(
            setFieldValue({
                fieldPath: `${fieldNameGet}.value`,
                value: defaultValue,
            }),
        );
        // set id of fields
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
        <DatePicker
            onChange={handleChange}
            value={field ? moment(field, "DD.MM.YYYY") : field}
            style={{ width: "100%" }}
            format="DD.MM.YYYY"
            disabledDate={isDateTo ? null : disabledDate}
            {...restProps}
        />
    );
};

export default EditDateInput;
