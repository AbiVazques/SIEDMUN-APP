import React, { useRef, useEffect } from 'react';

const HtmlEditor = ({ html, setHtml }) => {
    const editorRef = useRef(null);
    const currentTableRef = useRef(null);
    const fileInputRef = useRef(null);
    let savedRange = null;

    const handleInput = () => {
        setHtml(editorRef.current.innerHTML);
    };

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== html) {
            editorRef.current.innerHTML = html;
        }
    }, [html]);

    useEffect(() => {
        const editor = editorRef.current;

        const handleClick = (e) => {
            if (e.target.tagName === 'TD' || e.target.tagName === 'TH') {
                e.target.classList.toggle('selected');
                const table = e.target.closest('table');
                if (table) {
                    currentTableRef.current = table;
                }
            }
        };

        editor.addEventListener('click', handleClick);
        return () => {
            editor.removeEventListener('click', handleClick);
        };
    }, []);


    const format = (command, value = null) => {
        document.execCommand(command, false, value);
        handleInput();
    };

    const handleImageButtonClick = () => {
        fileInputRef.current.click();
    };

    const insertImageFromFile = (event) => {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = () => {
            const wrapper = document.createElement('div');
            wrapper.contentEditable = false;
            wrapper.style.display = 'inline-block';
            wrapper.style.position = 'relative';
            wrapper.style.maxWidth = '100%';
            wrapper.style.margin = '8px 0';

            const img = document.createElement('img');
            img.src = reader.result;
            img.alt = file.name;
            img.style.display = 'inline-block';
            img.style.width = 'auto';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.tabIndex = 0;

            const handle = document.createElement('div');
            handle.style.position = 'absolute';
            handle.style.right = '0';
            handle.style.bottom = '0';
            handle.style.width = '12px';
            handle.style.height = '12px';
            handle.style.background = '#6C0739';
            handle.style.cursor = 'se-resize';
            handle.style.borderRadius = '2px';

            wrapper.appendChild(img);
            wrapper.appendChild(handle);

            // Resize logic
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startWidth = wrapper.offsetWidth;

                const onMouseMove = (moveEvent) => {
                    const diff = moveEvent.clientX - startX;
                    wrapper.style.width = `${startWidth + diff}px`;
                };

                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    handleInput(); // update HTML
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            // Insert at caret
            const selection = document.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(wrapper);

                const rangeAfter = document.createRange();
                rangeAfter.setStartAfter(wrapper);
                rangeAfter.setEndAfter(wrapper);
                selection.removeAllRanges();
                selection.addRange(rangeAfter);
            } else {
                editorRef.current.appendChild(wrapper);
            }

            handleInput();
        };


        reader.readAsDataURL(file);

        // Reset input value to allow re-upload of the same file
        event.target.value = '';
    };

    const insertTable = (rows, cols) => {
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        for (let r = 0; r < rows; r++) {
            const row = document.createElement('tr');
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('td');
                cell.innerHTML = '&nbsp;';
                cell.contentEditable = true;
                cell.style.border = '1px solid #ccc';
                cell.style.padding = '5px';
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }

        table.appendChild(tbody);

        const selection = document.getSelection();
        if (!selection || !selection.rangeCount) {
            editorRef.current.appendChild(table); // fallback
        } else {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(table);
        }

        // Move the caret after the table
        const rangeAfter = document.createRange();
        rangeAfter.setStartAfter(table);
        rangeAfter.setEndAfter(table);
        selection.removeAllRanges();
        selection.addRange(rangeAfter);

        handleInput();
    };


    const insertRow = () => {
        const table = currentTableRef.current;
        if (table) {
            const newRow = table.insertRow();
            const cells = table.rows[0].cells.length;

            for (let i = 0; i < cells; i++) {
                const cell = newRow.insertCell(i);
                cell.innerHTML = '&nbsp;';
                cell.contentEditable = true;
                cell.style.border = '1px solid #ccc';
                cell.style.padding = '5px';
            }
        }
        handleInput();
    };

    const insertColumn = () => {
        const table = currentTableRef.current;
        if (table) {
            if (table) {
                for (let row of table.rows) {
                    const newCell = row.insertCell(row.cells.length);
                    newCell.innerHTML = '&nbsp;';
                    newCell.contentEditable = true;
                    newCell.style.border = '1px solid #ccc';
                    newCell.style.padding = '5px';
                }
            }
            handleInput();
        };
    }

    const deleteRow = () => {
        const table = currentTableRef.current;
        if (table && table.rows.length > 1) {
            table.deleteRow(table.rows.length - 1);
        }
        handleInput();
    };

    const deleteColumn = () => {
        const table = currentTableRef.current;
        if (table && table.rows.length > 0) {
            for (let row of table.rows) {
                row.deleteCell(row.cells.length - 1);
            }
        }
        handleInput();
    };

    const makeTableHeader = () => {
        const table = currentTableRef.current;
        if (table) {
            const firstRow = table.rows[0];
            for (let i = 0; i < firstRow.cells.length; i++) {
                const cell = firstRow.cells[i];
                const th = document.createElement('th');
                th.innerHTML = cell.innerHTML;
                th.contentEditable = true;
                th.style.border = '1px solid #ccc';
                th.style.padding = '5px';
                th.style.backgroundColor = '#f0f0f0'; // light gray background
                th.classList.add('table-header');
                cell.replaceWith(th);
            }
        }
        handleInput();
    };

    const mergeCellsHorizontal = () => {
        const table = currentTableRef.current;
        if (table) {
            const selectedCells = Array.from(table.getElementsByClassName('selected'));
            if (selectedCells.length > 1) {
                const firstCell = selectedCells[0];
                const row = firstCell.parentNode;
                const startIndex = Array.from(row.children).indexOf(firstCell);
                const endIndex = Array.from(row.children).indexOf(selectedCells[selectedCells.length - 1]);

                for (let i = startIndex + 1; i <= endIndex; i++) {
                    row.deleteCell(startIndex + 1);
                }

                firstCell.colSpan = selectedCells.length;
                selectedCells.forEach(cell => cell.classList.remove('selected'));
                handleInput();
            }
        }
    };

    const mergeCellsVertical = () => {
        const table = currentTableRef.current;
        if (table) {
            const selectedCells = Array.from(table.getElementsByClassName('selected'));
            if (selectedCells.length > 1) {
                const firstCell = selectedCells[0];
                const colIndex = Array.from(firstCell.parentNode.children).indexOf(firstCell);

                for (let i = 1; i < selectedCells.length; i++) {
                    const cell = selectedCells[i];
                    cell.parentNode.removeChild(cell);
                }

                firstCell.rowSpan = selectedCells.length;
                selectedCells.forEach(cell => cell.classList.remove('selected'));
                handleInput();
            }
        }
    };

    const handleTableAction = (e) => {
        const action = e.target.value;

        switch (action) {
            case 'insertTable':
                insertTable(3, 3);
                break;
            case 'insertRow':
                insertRow();
                break;
            case 'insertColumn':
                insertColumn();
                break;
            case 'deleteRow':
                deleteRow();
                break;
            case 'deleteColumn':
                deleteColumn();
                break;
            case 'makeHeader':
                makeTableHeader();
                break;
            case 'mergeHorizontal':
                mergeCellsHorizontal();
                break;
            case 'mergeVertical':
                mergeCellsVertical();
                break;
            default:
                break;
        }

        // Reset the select
        e.target.value = '';
    };


    return (
        <div>
            <div className="toolbar-container">
                <button className="toolbar-button" onClick={() => format('bold')}><b>B</b></button>
                <button className="toolbar-button" onClick={() => format('italic')}><i>I</i></button>
                <button className="toolbar-button" onClick={() => format('underline')}><u>U</u></button>
                <button className="toolbar-button" onClick={() => format('formatBlock', 'H2')}>H2</button>
                <button className="toolbar-button" onClick={() => format('formatBlock', 'H3')}>H3</button>
                <button className="toolbar-button" onClick={() => format('formatBlock', 'H4')}>H4</button>
                <button className="toolbar-button" onClick={() => format('formatBlock', 'P')}>P</button>

                <select className="toolbar-select" defaultValue="" onChange={handleTableAction}>
                    <option value="" disabled>Tabla</option>
                    <option value="insertTable">Insertat Tabla</option>
                    <option value="insertRow">Insertar Fila</option>
                    <option value="insertColumn">Insertar Columna</option>
                    <option value="deleteRow">Eliminar Fila</option>
                    <option value="deleteColumn">Eliminar Columna</option>
                    <option value="makeHeader">Resaltar Encabezado</option>
                    <option value="mergeHorizontal">Unir Celdas (Horizontal)</option>
                    <option value="mergeVertical">Unir Celdas (Vertical)</option>
                </select>

                <button className="toolbar-button" onClick={handleImageButtonClick}>🖼️ Image</button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={insertImageFromFile}
                    style={{ display: 'none' }}
                />
            </div>
            <style>
                {`
                    img:focus {
                        outline: 2px dashed #6C0739;
                    }
                    .toolbar-button,
                    .toolbar-select {
                        background-color: #6C0739;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        margin-right: 6px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    }

                    .toolbar-button:hover,
                    .toolbar-select:hover {
                        background-color: #5a062f;
                    }

                    .toolbar-select {
                        appearance: none;
                        padding-right: 30px;
                        position: relative;
                    }

                    .toolbar-container {
                        margin-bottom: 10px;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 6px;
                    }
                `}
            </style>

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
            <style>
                {`
                .selected {
                    background-color: #cce5ff;
                }

                td.selected,
                th.selected {
                    background-color: #cce5ff !important;
                }`}
            </style>
        </div >
    );
};

export default HtmlEditor;