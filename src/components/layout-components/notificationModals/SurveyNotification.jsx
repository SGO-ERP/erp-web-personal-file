import { PrivateServices } from 'API';
import { Modal, Row, Table } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const SurveyNotification = ({ props }) => {
    const columns = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            width: '300px',
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
            width: '200px',
        },
        {
            title: 'Крайний срок',
            dataIndex: 'date',
            key: 'date',
            width: '200px',
            render: (date) => {
                return moment(date).format('DD MMMM YYYY');
            },
        },
        {
            title: 'Действие',
            dataIndex: 'action',
            key: 'action',
            width: '200px',
            render: (_, value) => (
                <Link
                    style={{ color: '#366EF6' }}
                    to={
                        value.type === 'Опрос'
                            ? `/duty/my-surveys-and-tests/${id}`
                            : `/duty/my-competence-forms/${id}`
                    }
                    onClick={setIsOpen(false)}
                >
                    <IntlMessage id="surveys.start" />
                </Link>
            ),
        },
    ];

    const [survey, setSurvey] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const { id } = props;

    useEffect(() => {
        if (id && props.type === 'survey') {
            setIsOpen(props.isOpen);
            fetchSurvey();
        }
    }, [id]);

    const fetchSurvey = () => {
        PrivateServices.get(`/api/v1/surveys/${id}/`).then((e) =>
            setSurvey([{ type: e.data.type, date: e.data.end_date, name: e.data.name }]),
        );
    };

    return (
        <Modal open={isOpen} footer={null} width={1000} closable={false}>
            <Row justify="start">
                <h2>
                    <IntlMessage id="surveys.toolbar.radio.group.surveys" />
                </h2>
            </Row>
            <Row justify="center">
                <Table
                    columns={columns}
                    dataSource={survey}
                    pagination={false}
                    loading={Object.keys(survey).length === 0}
                    style={{ width: 1000 }}
                />
            </Row>
        </Modal>
    );
};

export default SurveyNotification;
