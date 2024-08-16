import { Button } from 'antd';
import ModalShowAll from '../PersonalData/modals/ModalShowAll';
import ModalController from './ModalController';
import IntlMessage from 'components/util-components/IntlMessage';

const ShowAll = ({ intlId, width = 703, children }) => {
    return (
        <ModalController>
            <ModalShowAll intlId={intlId} width={width}>
                {children}
            </ModalShowAll>

            <Button shape="round" size={'small'}>
                <IntlMessage id="personal.personalData.viewAll" />
            </Button>
        </ModalController>
    );
};

export default ShowAll;
