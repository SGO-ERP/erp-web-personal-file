import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeIsHiddenTag } from 'store/slices/newConstructorSlices/constructorNewSlice';

export default function useRightClickMenu() {
    const [showMenu, setShowMenu] = useState(false);
    const [x, setX] = useState(null);
    const [y, setY] = useState(null);
    const targetRef = useRef(null);
    const dispatch = useDispatch();

    const handleContextMenu = (e) => {
        if (targetRef.current && targetRef.current.contains(e.target)) {
            if (window.getSelection().toString() === '') {
                return;
            }
            e.preventDefault();
            setX(e.offsetX);
            setY(e.layerY - 20);
            setShowMenu(true);
            dispatch(changeIsHiddenTag(false));
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

    return { x, y, showMenu, targetRef };
}
