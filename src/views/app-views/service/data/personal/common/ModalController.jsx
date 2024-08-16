import React, { useState } from 'react';

const ModalController = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [openForLicense, setOpenForLicense] = useState(false);

    const handleOpen = (e) => {
        if (e) e.stopPropagation();
        setOpen(true);
        setOpenForLicense(false);
    };

    const handleClose = (e) => {
        if (e) e.stopPropagation();
        setOpen(false);
        setOpenForLicense(false);
    };

    const childrenWithProps = React.Children.map(children, (child, index) => {
        if (index === 0) {
            return React.cloneElement(child, {
                isOpen: open,
                setOpen: setOpen,
                onClose: handleClose,
            });
        } else if (index === 1) {
            return React.cloneElement(child, {
                onClick: handleOpen,
            });
        }
        return child;
    });

    return <>{childrenWithProps}</>;
};

export default ModalController;
