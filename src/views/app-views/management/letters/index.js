import { Space } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHrDocumentSNotSigned } from 'store/slices/lettersOrdersSlice/lettersOrdersSlice';
import { FirstCardPysma } from './cards/FirstCardPysma';
import { SecondCardPysma } from './cards/SecondCardPysma';
import { ThirdCard } from './cards/ThirdCard';
import { useLocation } from 'react-router-dom';
import {
    notShowHideSecondCard,
    notShowHideThirdCard,
} from '../../../../store/slices/tableControllerSlice/tableControllerSlice';
import './styles.css';

const Index = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const showHideSecondCard = useSelector((state) => state.tableController.showHideSecondCard);
    const showHideThirdCard = useSelector((state) => state.tableController.showHideThirdCard);

    useEffect(() => {
        dispatch(getHrDocumentSNotSigned({ page: 1, limit: 5 }));
    }, []);

    useEffect(() => {
        if (showHideSecondCard) {
            dispatch(notShowHideSecondCard(false));
        }
    }, [dispatch, location]);

    useEffect(() => {
        if (showHideThirdCard) {
            dispatch(notShowHideThirdCard(false));
        }
    }, [dispatch, location]);

    return (
        <div className="letters-container">
            {showHideSecondCard ? (
                <Space
                    direction="horizontal"
                    size="middle"
                    style={{ display: 'flex', alignItems: 'stretch' }}
                >
                    <FirstCardPysma />
                    <SecondCardPysma />
                </Space>
            ) : showHideThirdCard ? (
                <Space
                    direction="horizontal"
                    size="middle"
                    style={{ display: 'flex', alignItems: 'stretch' }}
                >
                    <FirstCardPysma />
                    <ThirdCard />
                </Space>
            ) : (
                <FirstCardPysma />
            )}
        </div>
    );
};

export default Index;
