import React from 'react';
import { useState } from 'react';
import { FieldContainer } from '@keystone-ui/fields';
import { Field } from '@keystone-6/fields-document/views';
import { componentBlocks } from './components';

const emptyDocument = [
  {
    type: 'paragraph',
    children: [{ text: 'Start writing here!' }],
  },
];

const Editor = ({ onSetPreamble, extended, editData }) => {
  const [description, setDescription] = useState(editData ? editData : emptyDocument);

  const field = React.useMemo(
    () => ({
      componentBlocks: extended ? componentBlocks : [],
      relationships: {},
      documentFeatures: {
        formatting: {
          inlineMarks: {
            bold: true,
            italic: true,
            underline: true,
            strikethrough: true,
            code: false,
            keyboard: false,
            subscript: false,
            superscript: false,
          },
          alignment: {
            center: true,
            end: true,
          },
          blockTypes: {
            blockquote: false,
            code: false,
          },
          headingLevels: extended ? [2, 3, 4] : [],
          listTypes: extended
            ? { ordered: true, unordered: true }
            : { ordered: false, unordered: false },
          softBreaks: true,
        },
        layouts: extended
          ? [
              [1, 1],
              [1, 1, 1],
            ]
          : [],
        dividers: false,
        links: true,
      },
    }),
    [extended]
  );
  return (
    <div className='h-96 border-x border-gray-300 px-5'>
      <FieldContainer>
        <Field
          value={description}
          autoFocus={false}
          field={field}
          onChange={(document) => {
            setDescription(document);
            onSetPreamble(document);
          }}
        />
      </FieldContainer>
    </div>
  );
};

export default Editor;

// Fungerande version
// import React from 'react';
// import { useEffect, useState } from 'react';
// import { FieldContainer } from '@keystone-ui/fields';
// import { Field } from '@keystone-6/fields-document/views';
// import { componentBlocks } from './components';

// const emptyDocument = [
//   {
//     type: 'heading',
//     level: 1,
//     children: [{ text: 'Start here' }],
//   },
//   {
//     type: 'paragraph',
//     children: [{ text: 'Start writing there!' }],
//   },
// ];

// const Editor = ({ onChange, extended, value }) => {
//   const [description, setDescription] = useState(
//     value ? JSON.parse(value) : emptyDocument
//   );

//   useEffect(() => {
//     onChange(JSON.stringify(description));
//   }, [description]);

//   const field = React.useMemo(
//     () => ({
//       componentBlocks: extended ? componentBlocks : [],
//       relationships: {},
//       documentFeatures: {
//         formatting: {
//           inlineMarks: {
//             bold: true,
//             italic: true,
//             underline: true,
//             strikethrough: true,
//             code: false,
//             keyboard: false,
//             subscript: false,
//             superscript: false,
//           },
//           alignment: {
//             center: true,
//             end: true,
//           },
//           blockTypes: {
//             blockquote: false,
//             code: false,
//           },
//           headingLevels: extended ? [2, 3, 4] : [],
//           listTypes: extended
//             ? { ordered: true, unordered: true }
//             : { ordered: false, unordered: false },
//           softBreaks: true,
//         },
//         layouts: extended
//           ? [
//               [1, 1],
//               [1, 1, 1],
//             ]
//           : [],
//         dividers: false,
//         links: true,
//       },
//     }),
//     [extended]
//   );
//   return (
//     <div className='h-96 border-x border-gray-300 px-5'>
//       <FieldContainer>
//         <Field
//           value={description}
//           autoFocus={false}
//           field={field}
//           onChange={(document) => {
//             setDescription(document);
//           }}
//         />
//       </FieldContainer>
//     </div>
//   );
// };

// export default Editor
