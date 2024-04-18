import React, { useEffect, useState } from 'react';
import { useSlate } from 'slate-react';

import Button from '../common/Button.jsx';
import Icon from '../common/Icon.jsx';
import {
  toggleBlock,
  toggleMark,
  isMarkActive,
  addMarkData,
  isBlockActive,
  activeMark,
} from '../utils/SlateUtilityFunctions.js';
import useFormat from '../utils/customHooks/useFormat.js';
import extendedToolbarGroups from './extendedToolbarGroups.js';
import simpleToolbarGroups from './simpleToolbarGroups.js';
import './toolbar.css';

import TableSelector from '../Elements/Table/TableSelector';
import TableContextMenu from '../Elements/TableContextMenu/TableContextMenu';

import LinkButton from '../Elements/Link/LinkButton.jsx';
import Embed from '../Elements/Embed/Embed.jsx';

import Id from '../Elements/ID/Id.jsx';

const Toolbar = ({ extended }) => {
  const editor = useSlate();
  const isTable = useFormat(editor, 'table');

  // const [toolbarGroups, setToolbarGroups] = useState(extendedToolbarGroups);
  const [toolbarGroups, setToolbarGroups] = useState(
    extended ? extendedToolbarGroups : simpleToolbarGroups
  );

  useEffect(() => {
    // Filter out the groups which are not allowed to be inserted when a table is in focus.
    let filteredGroups = [...(extended ? extendedToolbarGroups : simpleToolbarGroups)];
    if (isTable) {
      filteredGroups = toolbarGroups.map((grp) =>
        grp.filter(
          (element) =>
            //groups that are not supported inside the table
            !['codeToText'].includes(element.type)
        )
      );
      filteredGroups = filteredGroups.filter((elem) => elem.length);
    }
    setToolbarGroups(filteredGroups);
  }, [isTable]);

  const BlockButton = ({ format }) => {
    return (
      <Button
        active={isBlockActive(editor, format)}
        format={format}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, format);
        }}
      >
        <Icon icon={format} />
      </Button>
    );
  };

  const MarkButton = ({ format }) => {
    return (
      <Button
        active={isMarkActive(editor, format)}
        format={format}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, format);
        }}
      >
        <Icon icon={format} />
      </Button>
    );
  };

  const Dropdown = ({ format, options }) => {
    return (
      <select
        value={activeMark(editor, format)}
        onChange={(e) => changeMarkData(e, format)}
      >
        {options.map((item, index) => (
          <option key={index} value={item.value}>
            {item.text}
          </option>
        ))}
      </select>
    );
  };

  const changeMarkData = (event, format) => {
    event.preventDefault();
    const value = event.target.value;
    addMarkData(editor, { format, value });
  };

  return (
    <div className='toolbar'>
      {toolbarGroups.map((group, index) => (
        <span key={index} className='toolbar-grp'>
          {group.map((element) => {
            switch (element.type) {
              case 'block':
                return <BlockButton key={element.id} {...element} />;
              case 'mark':
                return <MarkButton key={element.id} {...element} />;
              case 'dropdown':
                return <Dropdown key={element.id} {...element} />;
              case 'link':
                return (
                  <LinkButton
                    key={element.id}
                    active={isBlockActive(editor, 'link')}
                    editor={editor}
                  />
                );
              case 'embed':
                return <Embed key={element.id} format={element.format} editor={editor} />;

              case 'table':
                return <TableSelector key={element.id} editor={editor} />;
              case 'id':
                return <Id editor={editor} />;
              default:
                return null;
            }
          })}
        </span>
      ))}
      {/* <TableContextMenu editor={editor} /> */}
    </div>
  );
};

export default Toolbar;
