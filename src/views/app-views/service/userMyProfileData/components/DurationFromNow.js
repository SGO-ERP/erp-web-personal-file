import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/kk';

const LocalizedCountdown = ({ targetDate }) => {
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;
    const now = moment();
    const target = moment(targetDate);

    moment.locale(currentLocale);

    const years = target.diff(now, 'years');
    const months = target.subtract(years, 'years').diff(now, 'months');
    const days = target.subtract(months, 'months').diff(now, 'days');

    let formattedDuration;

    if (currentLocale === 'kk') {
        if (years === 0 && months === 0) {
            formattedDuration = '';
        } else if (years === 0) {
            formattedDuration = months + ' ай ' + days + ' күн';
        } else if (months === 0) {
            formattedDuration = years + ' жыл ' + days + ' күн';
        } else if (years < 0) {
            formattedDuration = -years + ' жыл ' + -months + ' ай ' + -days + ' күн бұрын';
        } else {
            formattedDuration = years + ' жыл ' + months + ' ай ' + days + ' күн кейін';
        }
    } else if (currentLocale === 'ru') {
        if (years === 0 && months === 0) {
            formattedDuration = '';
        } else if (years === 0) {
            formattedDuration = months + ' месяцев ' + days + ' дней';
        } else if (months === 0) {
            formattedDuration = years + ' года ' + days + ' дней';
        } else if (years < 0) {
            formattedDuration = -years + ' года ' + -months + ' месяцев ' + -days + ' дней назад';
        } else {
            formattedDuration = years + ' года ' + months + ' месяцев ' + days + ' дней через';
        }
    }

    return <div style={{ color: '#72849A' }}>{formattedDuration}</div>;
};

export default LocalizedCountdown;
