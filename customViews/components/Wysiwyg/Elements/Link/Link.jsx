import React from 'react';
import { useFocused, useSelected, useSlateStatic } from 'slate-react';
import { MinusCircleIcon } from '@keystone-ui/icons';

import { removeLink } from '../../utils/link.js';

import './styles.css';

const Link = ({ attributes, element, children }) => {
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div className='link'>
      <a href={element.href} {...attributes} {...element.attr} target={element.target}>
        {children}
      </a>
      {selected && focused && (
        <div className='link-popup' contentEditable={false}>
          <a href={element.href} target={element.target}>
            {element.href}
          </a>
          <MinusCircleIcon onClick={() => removeLink(editor)} size='small' color='red' />
        </div>
      )}
    </div>
  );
};

export default Link;
