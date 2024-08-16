import { useState, useEffect, useRef } from 'react';

export default function useRightClickMenuAnotherLanguage() {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    const targetRefRU = useRef(null);

    const handleContextMenu = (e) => {
        if (targetRefRU.current && targetRefRU.current.contains(e.target)) {
            if (window.getSelection().toString() === '') {
                return;
            }
            e.preventDefault();
            setX(e.offsetX);
            setY(e.layerY - 20);
            setShowMenu(true);
        }
    };

    const handleClick = () => {
        showMenu && setShowMenu(false);
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);
        document.addEventListener('contextmenu', handleContextMenu);
        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    });

    return { x, y, showMenu, targetRefRU };
}
