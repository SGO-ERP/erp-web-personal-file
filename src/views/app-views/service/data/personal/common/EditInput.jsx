import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'antd';
import { getFieldValue, setFieldValue } from '../../../../../../store/slices/myInfo/myInfoSlice';
import { useTranslation } from 'react-i18next';
import LocalizationText from 'components/util-components/LocalizationText/LocalizationText';

const defaultText = {
    name: 'Отсутствуют данные',
    nameKZ: 'Деректер жоқ',
};

const EditInput = (props) => {
    const { defaultValue, fieldName, fieldNameGet, id, ...restProps } = props;
    const dispatch = useDispatch();

    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const field = useSelector((state) => getFieldValue(state, `${fieldName}.value`));
    const { i18n } = useTranslation();
    const isKK = i18n.language === 'kk';

    const handleChange = (e) => {
        dispatch(setFieldValue({ fieldPath: `${fieldName}.value`, value: e.target.value }));
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

    if (!modeRedactor) {
        if (defaultValue.length === 0) {
            return <LocalizationText text={defaultText} />;
        }
        return defaultValue;
    }

    return <Input onChange={handleChange} value={field} {...restProps} />;
};

export default EditInput;
