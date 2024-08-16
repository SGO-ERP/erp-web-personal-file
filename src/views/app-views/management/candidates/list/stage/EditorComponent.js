import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeWatermarker } from 'store/slices/watermarkerSlice';
import './editor.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Delta from 'quill-delta';
import Quill from 'quill';

let Font = Quill.import('formats/font'); // import Quill's Font module

// add fonts to whitelist
Font.whitelist = ['times-new-roman', 'sans-serif', 'serif', 'monospace', 'cursive'];

// now re-register it to overwrite the original
Quill.register(Font, true);

const Size = Quill.import('attributors/style/size');
Size.whitelist = ['3.9px', '14px', '16px', '18px', '20px'];
Quill.register(Size, true);

const EditorComponent = ({
    value,
    setValue,
    setRealText,
    waterMarkerText,
    disabled = false,
    setSelectedWord,
}) => {
    let dispatch = useDispatch();
    const quillRef = React.useRef(null);

    const handleChange = (content, delta, source, editor) => {
        const formattedContent = content.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

        setTimeout(() => {
            setValue(formattedContent);
            if (setRealText !== null && setRealText !== undefined) {
                setRealText(editor.getText());
            }
        }, 0);
    };

    useEffect(() => {
        const modules = {
            toolbar: [],
        };
        if (waterMarkerText !== undefined) {
            dispatch(changeWatermarker(waterMarkerText));
        }

        if (disabled === true) {
            setModules(modules);
        }
        if (disabled === false) {
            modules.toolbar.push(
                ['bold', 'italic', 'underline'], // toggled buttons
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
                [{ 'align': [] }],
                [{ 'font': ['sans-serif', 'serif', 'monospace', 'times-new-roman'] }], // add this line
                [{ 'size': ['3.9px', '12px', 'small', false, 'large', 'huge'] }],
            );
            setModules(modules);
        }

        if (quillRef.current) {
            quillRef.current.getEditor().keyboard.addBinding(
                { key: 'Tab' }, // Capture Tab key
                function (range, context) {
                    this.quill.updateContents(
                        new Delta()
                            .retain(range.index) // Retain all the content before the tab
                            .delete(1) // Delete the tab
                            .insert('\u00a0\u00a0\u00a0\u00a0'), // Insert 4 non-breaking spaces
                    );
                    this.quill.setSelection(range.index + 8); // Set cursor position after the inserted text
                },
            );
        }
    }, [waterMarkerText]);

    function handleOnChangeSelection(range, source, editor) {
        if (setSelectedWord !== null && setSelectedWord !== undefined) {
            if (range !== null) {
                setSelectedWord(editor.getText(range.index, range.length));
            }
        }
    }

    const watermarkText = useSelector((state) => state.watermarker.text);

    const [modules, setModules] = useState({});

    return (
        <div className="document-a4">
            <div className="watermark-wrapper">
                <div className="watermark-grid" data-text={watermarkText} />
                <ReactQuill
                    ref={quillRef}
                    readOnly={disabled}
                    onChangeSelection={handleOnChangeSelection}
                    theme={disabled ? null : 'snow'}
                    value={value}
                    onChange={handleChange}
                    modules={modules}
                />
            </div>
        </div>
    );
};

export default EditorComponent;
