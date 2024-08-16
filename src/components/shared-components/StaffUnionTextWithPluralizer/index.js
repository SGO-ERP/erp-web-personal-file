import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { kz, rus } from './constants/numbers.js';
import { kk, ru } from './constants/parentNumbers.js';

const StaffUnionTextWithPluralizer = ({ text }) => {
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    const parts = text && text.split(' ');
    const ordinalNum = parseInt(parts && parts[1]);
    let nameOfPos = parts?.[0] ?? '';

    const [number, setNumber] = useState(0);
    function splitNumber() {
        const hundreds = Math.floor(number / 100);
        const tens = Math.floor((number % 100) / 10);
        const ones = number % 10;

        return {
            hundreds,
            tens,
            ones,
        };
    }

    useEffect(() => {
        setNumber(ordinalNum);
    }, []);

    function getWord(lan) {
        let { hundreds, tens, ones } = splitNumber(number);
        hundreds *= 100;
        tens *= 10;
        if (hundreds !== 0) {
            if (ones === 0 && tens === 0)
                return lan === 'kz'
                    ? hundreds === 100
                        ? getParentNumber(100, lan)
                        : getNumber(hundreds / 100, lan) + getParentNumber(100, lan)
                    : getParentNumber(hundreds, lan);
            else {
                if (lan === 'ru' && tens === 10) {
                    return getNumber(hundreds, lan) + ' ' + getParentNumber(tens + ones, lan);
                }
                return (
                    (lan === 'kz'
                        ? hundreds === 100
                            ? getNumber(100, lan)
                            : getNumber(hundreds / 100, lan) + getNumber(100, lan)
                        : getNumber(hundreds, lan)) +
                    ' ' +
                    (ones === 0
                        ? getParentNumber(tens, lan)
                        : getNumber(tens, lan) + ' ' + getParentNumber(ones, lan))
                );
            }
        }
        if (hundreds === 0 && tens !== 0) {
            if (lan === 'ru' && (tens === 10 || (tens + ones) % 10 === 0)) {
                return getParentNumber(tens + ones, lan);
            }
            if (lan === 'kz' && (tens + ones) % 10 === 0) {
                return getParentNumber(tens, lan);
            } else {
                return getNumber(tens, lan) + ' ' + getParentNumber(ones, lan);
            }
        } else {
            return getParentNumber(ones, lan);
        }
    }

    const getNumber = (num, lan) => {
        return lan === 'ru' ? rus[num] || '' : kz[num] || '';
    };

    const getParentNumber = (num, lan) => {
        return lan === 'ru' ? ru[num] || '' : kk[num] || '';
    };

    const forKz = getWord('kz');
    let capitalizedPos = forKz.charAt(0).toUpperCase() + forKz.slice(1);

    if (currentLocale === 'ru') {
        if (nameOfPos === 'Департамент') {
            nameOfPos = getWord('ru') + ' департамента';
        } else if (nameOfPos === 'Управление') {
            nameOfPos = ordinalNum + ' управление';
        }
    }

    if (currentLocale === 'kk') {
        if (nameOfPos === 'Департамент') {
            nameOfPos = capitalizedPos + ' департамент';
        } else if (nameOfPos === 'Управление') {
            nameOfPos = ordinalNum + ' управление';
        }
    }

    return (
        <div>
            <p>{nameOfPos} </p>
        </div>
    );
};
export default StaffUnionTextWithPluralizer;
