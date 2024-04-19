import React from 'react';
import { CustomRenderer } from './CustomRenderer/CustomRenderer';

export default function WyiswygPreview({ content }) {
  return (
    <div style={{ width: '800px' }}>
      <CustomRenderer document={content.preamble} />
    </div>
  );
}
