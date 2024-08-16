import React from 'react';
import {Button, Modal, Row} from 'antd';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import TextArea from 'antd/es/input/TextArea';

const ModalShowReasonAwards = ({isOpen, onClose, awards}) => {
    const currentLocale = localStorage.getItem('lan');

    return (
        <Modal
            title={<IntlMessage id={'title.show.modal.reason.awards'} />}
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
                value={currentLocale==='kk' ? awards?.reasonKZ : awards?.reason}
            />
            <p className="fam_invisible_text">
                {currentLocale === 'kk' ? awards?.reasonKZ : awards?.reason}
            </p>
        </Modal>
    );
};

export default ModalShowReasonAwards;
