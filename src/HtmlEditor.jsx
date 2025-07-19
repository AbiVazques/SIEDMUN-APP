import React, { useRef, useEffect } from 'react';

const HtmlEditor = ({ html, setHtml }) => {
    const editorRef = useRef(null);

    const handleInput = () => {
        setHtml(editorRef.current.innerHTML);
    };

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== html) {
            editorRef.current.innerHTML = html;
        }
    }, [html]);

    const format = (command, value = null) => {
        document.execCommand(command, false, value);
        handleInput();
    };

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={() => format('bold')}><b>B</b></button>
                <button onClick={() => format('italic')}><i>I</i></button>
                <button onClick={() => format('underline')}><u>U</u></button>
                <button onClick={() => format('formatBlock', 'H2')}>H2</button>
                <button onClick={() => format('formatBlock', 'H3')}>H3</button>
                <button onClick={() => format('formatBlock', 'H4')}>H4</button>
                <button onClick={() => format('formatBlock', 'P')}>P</button>
            </div>

            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                style={{
                    width: '100%',
                    minHeight: '200px',
                    border: '1px solid gray',
                    padding: '10px',
                    overflowY: 'auto',
                }}
            />
        </div>
    );
};

export default HtmlEditor;