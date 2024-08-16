import { SwapRightOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import moment from 'moment';

let RowWithDate = ({ firstString, start_date, end_date }) => {
    return (
        <p className={'font-style'} style={{ fontSize: '12px' }}>
            <Row gutter={16}>
                <span>
                    <span className="paddingLR8">{firstString}</span>

                    <span style={{ color: '#366EF6' }}>
                        {start_date} <SwapRightOutlined style={{ color: '#72849A66' }} /> {end_date}
                    </span>
                </span>
            </Row>
        </p>
    );
};

export default RowWithDate;
