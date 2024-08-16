import React from 'react';
import {Button, Modal, Row} from 'antd';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import TextArea from 'antd/es/input/TextArea';

const ModalShowReasonPenalty = ({isOpen, onClose, penalty}) => {
    const currentLocale = localStorage.getItem('lan');

    return (
        <Modal
            title={<IntlMessage id={'title.show.modal.reason.penalty'} />}
            onCancel={onClose}
            open={isOpen}
            footer={
                <Row justify='end'>
                    <Button type='primary' onClick={onClose}>
                        Ok
                    </Button>
                </Row>
            }>
            <TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
              value={currentLocale==='kk' ? penalty?.reasonKZ : penalty?.reason}
            />
            <p className="fam_invisible_text">
                {currentLocale === 'kk' ? penalty?.reasonKZ : penalty?.reason}
            </p>
        </Modal>
    );
};

export default ModalShowReasonPenalty;
