import { Button, Col, Row } from 'antd';
import { useNavigate } from 'react-router';
import IntlMessage from '../../../components/util-components/IntlMessage';
import { APP_PREFIX_PATH } from '../../../configs/AppConfig';
import image from './image/image.svg';
const Error = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`${APP_PREFIX_PATH}/duty/data/me`);
    };

    return (
        <div>
            <Row gutter={[20, 20]} style={{ marginTop: '10px' }}>
                <Col xs={24}>
                    <img src={image} alt={404} style={{ display: 'block', margin: '0 auto' }} />
                </Col>
                <Col xs={24} style={{ textAlign: 'center', lineHeight: '24px', size: '16px' }}>
                    <h5>
                        <IntlMessage id={'error.warning.inProgress'} />
                    </h5>
                </Col>
                <Col xs={24}>
                    <Button
                        type="primary"
                        style={{ display: 'block', margin: '0 auto' }}
                        onClick={handleNavigate}
                    >
                        <IntlMessage id={'error.warning.back'} />
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default Error;
