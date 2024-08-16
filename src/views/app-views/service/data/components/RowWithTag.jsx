import { Row, Tag } from 'antd';

let RowWithTag = ({ firstString, tag }) => {
    return (
        <Row gutter={16}>
            <span>
                <span className="paddingLR8" style={{ color: 'black' }}>
                    {firstString}
                </span>
                <span>
                    <Tag
                        color="#F0F5FF"
                        style={{
                            fontSize: '10px',
                            borderColor: '#ADC6FF',
                            color: '#2F54EB',
                            borderRadius: '15px',
                            lineHeight: '16px',
                        }}
                        className={'font-style'}
                    >
                        {tag}
                    </Tag>
                </span>
            </span>
        </Row>
    );
};

export default RowWithTag;
