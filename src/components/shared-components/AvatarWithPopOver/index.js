import { Tooltip } from 'antd';
import AvatarStatus from '../AvatarStatus';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import UserMyDataService from 'services/userMyData/userMyDataService';
import { useEffect, useState } from 'react';

const PopOverRankConstant = ({ user }) => {
    const [history, setHistory] = useState({});

    useEffect(() => {
        if (!user) return;
        UserMyDataService.get_personal_histories(user.id).then((r) => setHistory(r[0]));
    }, [user]);

    function findNumbersInText(text) {
        const numbers = text.match(/\d+/g);
        if (numbers) {
            return numbers.map((num) => {
                let years = Number(num);
                let lastDigit = years % 10;
                let lastTwoDigits = years % 100;

                if (lastDigit === 1 && lastTwoDigits !== 11) {
                    return years + ' год';
                } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
                    return years + ' года';
                } else {
                    return years + ' лет';
                }
            });
        } else {
            return [];
        }
    }

    const number =
        history?.contract?.name !== undefined
            ? findNumbersInText(history.contract?.name)
            : undefined;

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginRight: number ? '-80px' : '-20px',
            }}
        >
            <AvatarStatus size={120} src={user?.icon} />
            {number ? (
                <Tooltip placement="top">
                    <p
                        title={LocalText.getName(user?.rank)}
                        src={
                            user.is_military === true
                                ? user?.rank?.military_url
                                : user.is_military === false
                                ? user?.rank?.employee_url
                                : null
                        }
                        alt={'Rank'}
                        style={{
                            border: '2px solid #366EF6',
                            borderRadius: 500,
                            minWidth: 50,
                            height: 50,
                            position: 'relative',
                            top: 75,
                            left: -150,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                        }}
                    >
                        {number}
                    </p>
                </Tooltip>
            ) : null}
            <Tooltip placement="top">
                <img
                    title={LocalText.getName(user?.rank)}
                    src={
                        user?.is_military === true
                            ? user?.rank?.military_url
                            : user?.is_military === false
                            ? user?.rank?.employee_url
                            : null
                    }
                    alt={'Rank'}
                    style={{
                        width: 50,
                        height: 50,
                        position: 'relative',
                        top: 75,
                        left: history?.contract !== null ? -90 : -50,
                    }}
                />{' '}
            </Tooltip>
        </div>
    );
};
export default PopOverRankConstant;
