import { Button, Col, Row } from 'antd';
import IntlMessage from '../../../components/util-components/IntlMessage';
import internal from './image/internal.svg';

const InternalServerError = () => {
    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div>
            <Row gutter={[20, 20]} style={{ marginTop: '10px' }}>
                <Col xs={24}>
                    <img
                        src={internal}
                        alt={'Internal server error'}
                        style={{ display: 'block', margin: '0 auto' }}
                    />
                </Col>
                <Col xs={24} style={{ textAlign: 'center', lineHeight: '24px', size: '16px' }}>
                    <h5>
                        <IntlMessage id={'error.warning.internal'} />
                    </h5>
                </Col>
                <Col xs={24}>
                    <Button
                        type="primary"
                        style={{ display: 'block', margin: '0 auto' }}
                        onClick={handleReload}
                    >
                        <IntlMessage id={'error.warning.button.reload'} />
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default InternalServerError;
