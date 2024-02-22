import React, { useEffect, useRef, useState } from 'react';
import usePopup from '../../utils/customHooks/usePopup';
import { Transforms } from 'slate';
import { TableUtil } from '../../utils/table.js';

import { LayoutIcon, ColumnsIcon } from '@keystone-ui/icons';

import { FieldDescription, FieldLegend, TextInput } from '@keystone-ui/fields';
import { Button } from '@keystone-ui/button';

import './TableSelector.css';

const TableSelector = ({ editor }) => {
  const tableOptionsRef = useRef();
  const [selection, setSelection] = useState();
  const [showOptions, setShowOptions] = usePopup(tableOptionsRef);
  const [tableData, setTableData] = useState({
    row: 1,
    column: 2,
  });

  const [tableInput, setTableInput] = useState(
    Array.from({ length: 6 }, () =>
      Array.from({ length: 6 }, (v, i) => ({
        bg: 'lightGray',
        column: i,
      }))
    )
  );

  useEffect(() => {
    const newTable = Array.from({ length: 1 }, (obj, row) =>
      Array.from({ length: 3 }, (v, col) => ({
        bg:
          row + 1 <= tableData.row && col + 1 <= tableData.column
            ? 'orange'
            : 'lightgray',
        column: col,
      }))
    );
    setTableInput(newTable);
  }, [tableData]);

  useEffect(() => {
    if (!showOptions) {
      setTableData({
        row: 0,
        column: 0,
      });
    }
  }, [showOptions]);

  const table = new TableUtil(editor);

  const handleButtonClick = () => {
    setSelection(editor.selection);
    setShowOptions((prev) => !prev);
  };
  const handleInsert = () => {
    selection && Transforms.select(editor, selection);
    setTableData({ row: -1, column: -1 });
    table.insertTable(tableData.row, tableData.column);
    setShowOptions(false);
  };
  return (
    <div ref={tableOptionsRef} className='popup-wrapper'>
      <Button
        style={{
          width: '32px',
          height: '32px',
          border: showOptions ? '1px solid lightgray' : '',
          borderBottom: 'none',
        }}
        title='table'
        onClick={handleButtonClick}
      >
        <LayoutIcon icon='table' />
      </Button>

      {showOptions && (
        <div className='popup' style={{ borderRadius: '7px' }}>
          {
            <span style={{ fontSize: '0.85em' }}>
              <FieldLegend>Add layout</FieldLegend>
            </span>
          }
          <div className='table-input'>
            <ColumnsIcon
              color='#6b7280'
              size='largish'
              onMouseOver={() => setTableData({ row: 1, column: 2 })}
              onClick={() => handleInsert()}
            />

            <div
              style={{ display: 'flex', alignItems: 'center' }}
              onMouseOver={() => setTableData({ row: 1, column: 3 })}
              onClick={() => handleInsert()}
            >
              <svg
                fill='#6b7280'
                width='29px'
                height='29px'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M5,22 C3.34314575,22 2,20.6568542 2,19 L2,5 C2,3.34314575 3.34314575,2 5,2 L19,2 C20.6568542,2 22,3.34314575 22,5 L22,19 C22,20.6568542 20.6568542,22 19,22 L5,22 Z M8,4 L5,4 C4.44771525,4 4,4.44771525 4,5 L4,19 C4,19.5522847 4.44771525,20 5,20 L8,20 L8,4 Z M14,4 L10,4 L10,20 L14,20 L14,4 Z M19,4 L16,4 L16,20 L19,20 C19.5522847,20 20,19.5522847 20,19 L20,5 C20,4.44771525 19.5522847,4 19,4 Z'
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSelector;
