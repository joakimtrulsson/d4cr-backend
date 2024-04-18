import React from 'react';

const Table = ({ attributes, children, element }) => {
  return (
    <table
      style={{
        width: '1000px',
        wordBreak: 'break-word',
      }}
    >
      <tbody className='table__body' {...attributes}>
        {children}
      </tbody>
    </table>
  );
};

export default Table;
