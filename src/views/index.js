import { ConfigProvider } from 'antd';
import { resources } from 'lang';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Routes from 'routes';
import useBodyClass from 'utils/hooks/useBodyClass';

export const Views = () => {
    const { locale, direction } = useSelector((state) => state.theme);
    const currentAppLocale = resources[locale];
    useBodyClass(`dir-${direction}`);
    useEffect(() => {
        if (window === undefined) {
            return;
        }
        const root = window.document.documentElement;
        root.setAttribute('dir', direction);
    }, [direction]);
    return (
        <ConfigProvider direction={direction} locale={currentAppLocale.antd}>
            <Routes />
        </ConfigProvider>
    );
};

export default Views;
