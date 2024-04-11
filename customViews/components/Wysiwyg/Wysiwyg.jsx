/* eslint-disable no-case-declarations */
import React, { useCallback, useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, Editable, withReact } from 'slate-react';

import Toolbar from './Toolbar/Toolbar.jsx';
import { getMarked, getBlock } from './utils/SlateUtilityFunctions.js';
import withLinks from './plugins/withLinks.js';
import withEmbeds from './plugins/withEmbeds.js';
import withEquation from './plugins/withEquation.js';
import withTables from './plugins/withTable.js';
import { convertKeystoneToSlate } from './utils/convertKeystoneToSlate.js';

import './editor.css';

const Element = (props) => {
  return getBlock(props);
};

const Leaf = ({ attributes, children, leaf }) => {
  children = getMarked(leaf, children);
  return <span {...attributes}>{children}</span>;
};

const Wysiwyg = ({ onSetPreamble, editData, extended, height }) => {
  const editor = useMemo(
    () =>
      withEquation(
        withHistory(withEmbeds(withTables(withLinks(withReact(createEditor())))))
      ),
    []
  );

  const [value, setValue] = useState(
    editData
      ? convertKeystoneToSlate(editData)
      : [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ]
  );

  const handleEditorChange = (newValue) => {
    console.log('newValue', newValue);
    const modifiedValue = newValue.map((element) => {
      const modifiedElement = Object.assign({}, element);

      switch (modifiedElement.type) {
        case 'headingTwo':
          modifiedElement.type = 'heading';
          modifiedElement.level = 2;
          break;
        case 'headingThree':
          modifiedElement.type = 'heading';
          modifiedElement.level = 3;
          break;
        case 'headingFour':
          modifiedElement.type = 'heading';
          modifiedElement.level = 4;
          break;
        case 'orderedList':
          modifiedElement.type = 'ordered-list';
          break;
        case 'unorderedList':
          modifiedElement.type = 'unordered-list';
          break;
        case 'alignCenter':
          const childCenter = { ...modifiedElement.children[0], textAlign: 'center' };
          childCenter.type = 'heading';
          switch (modifiedElement.children[0].type) {
            case 'headingTwo':
              childCenter.level = 2;
              break;
            case 'headingThree':
              childCenter.level = 3;
              break;
            case 'headingFour':
              childCenter.level = 4;
              break;
            // Lägg till fler här...
            default:
              break;
          }
          return childCenter;
        case 'alignRight':
          const childRight = { ...modifiedElement.children[0], textAlign: 'end' };
          childRight.type = 'heading';
          switch (modifiedElement.children[0].type) {
            case 'headingTwo':
              childRight.level = 2;
              break;
            case 'headingThree':
              childRight.level = 3;
              break;
            case 'headingFour':
              childRight.level = 4;
              break;
            // Lägg till fler här...
            default:
              break;
          }
          return childRight;

        case 'table':
          if (modifiedElement.columns === 2) {
            const newElement = {
              type: 'layout',
              layout: [1, 1],
              children: modifiedElement.children[0].children.map((cell) => ({
                type: 'layout-area',
                children: cell.children,
              })),
            };
            return newElement;
          }

          if (modifiedElement.columns === 3) {
            const newElement = {
              type: 'layout',
              layout: [1, 1, 1],
              children: modifiedElement.children[0].children.map((cell) => ({
                type: 'layout-area',
                children: cell.children,
              })),
            };
            return newElement;
          }
          break;

        case 'spotify':
          if (modifiedElement.type === 'spotify') {
            const url = modifiedElement.url;
            const newElement = {
              type: 'component-block',
              component: 'spotifyPlayer',
              props: {
                url: url,
                altText: 'Spotify player',
              },
              children: [
                {
                  type: 'component-inline-prop',
                  children: [
                    {
                      text: '',
                    },
                  ],
                },
              ],
            };
            return newElement;
          }

          break;
        case 'video': {
          if (modifiedElement.type === 'video') {
            const url = modifiedElement.url;

            const newElement = {
              type: 'component-block',
              component: 'youtubePlayer',
              props: {
                url: url,
                altText: 'Youtube player',
              },
              children: [
                {
                  type: 'component-inline-prop',
                  children: [
                    {
                      text: '',
                    },
                  ],
                },
              ],
            };
            return newElement;
          }
          break;
        }
        default:
          break;
      }

      return modifiedElement;
    });
    console.log('modifiedElement', modifiedValue);
    setValue(modifiedValue);
    onSetPreamble(modifiedValue);
  };

  // Om man lägger till textAlign center eller right på en heading så blir det så här:
  // [{
  //   type: 'headingTwo', textAlign: center, children: [{text: 'Heading'}]
  // }]
  // Det ska bli så här:
  // [{
  //   type: 'heading', level: 2, textAlign: center, children: [{text: 'Heading'}]

  // [{type 'alignCenter', children: [{type: 'headingTwo', children: [{text: 'Heading'}]}]

  const renderElement = useCallback((props) => <Element {...props} />, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate editor={editor} initialValue={value} onChange={handleEditorChange}>
      <div
        className='editor-wrapper'
        style={{
          minHeight: height ? `${height.toString()}px` : extended ? '600px' : '300px',

          border: '1px solid #e1e5e9',
          borderRadius: '7px',
          padding: '0px',
        }}
      >
        <Toolbar extended={extended} />
        <Editable
          className='editor'
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          style={{
            minHeight: height ? `${height.toString()}px` : extended ? '600px' : '300px',
            borderTop: '1px solid #e1e5e9',
            paddingLeft: '10px',
          }}
        />
      </div>
    </Slate>
  );
};

export default Wysiwyg;
