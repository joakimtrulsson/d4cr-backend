import { list } from '@keystone-6/core';
import { text, json } from '@keystone-6/core/fields';
import { group } from '@keystone-6/core';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';
import { document } from '@keystone-6/fields-document';

export const testSchema = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true,
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems,
    },
  },
  fields: {
    ...group({
      label: 'Group label',
      description: 'Group description',
      fields: {
        someFieldName: text({
          /* ... */
        }),
        anotherFieldName: text({}),
        /* ... */
      },
    }),

    ...group({
      label: 'Sections',
      description: 'Sections description',
      fields: {
        sections: json({
          ui: {
            views: './customViews/AllSections.jsx',
            createView: { fieldMode: 'edit' },
            listView: { fieldMode: 'hidden' },
            itemView: { fieldMode: 'edit', fieldPosition: 'form' },
          },
        }),
        /* ... */
      },
    }),

    // content: document({
    //   layouts: [
    //     [1, 1],
    //     [1, 1, 1],
    //   ],
    //   formatting: {
    //     inlineMarks: {
    //       bold: true,
    //       italic: true,
    //       underline: true,
    //       strikethrough: true,
    //       code: true,
    //       superscript: true,
    //       subscript: true,
    //       keyboard: true,
    //     },
    //     listTypes: {
    //       ordered: true,
    //       unordered: true,
    //     },
    //     alignment: {
    //       center: true,
    //       end: true,
    //     },
    //     headingLevels: [1, 2, 3, 4, 5, 6],
    //     blockTypes: {
    //       blockquote: true,
    //       code: true,
    //     },
    //     softBreaks: true,
    //   },
    // }),

    // testwysiwyg: json({
    //   ui: {
    //     views: './customViews/TestWysiwyg.jsx',
    //     createView: { fieldMode: 'edit' },
    //     listView: { fieldMode: 'hidden' },
    //     itemView: { fieldMode: 'edit' },
    //   },
    // }),
    // sections: json({
    //   ui: {
    //     views: './customViews/AllSections.jsx',
    //     createView: { fieldMode: 'edit' },
    //     listView: { fieldMode: 'hidden' },
    //     itemView: { fieldMode: 'edit' },
    //   },
    // }),
    // principles: json({
    //   ui: {
    //     views: './customViews/Principles.jsx',
    //     createView: { fieldMode: 'edit' },
    //     listView: { fieldMode: 'hidden' },
    //     itemView: { fieldMode: 'edit' },
    //   },
    // }),
    // resources: json({
    //   ui: {
    //     views: './customViews/Resources.jsx',
    //     createView: { fieldMode: 'edit' },
    //     listView: { fieldMode: 'hidden' },
    //     itemView: { fieldMode: 'edit' },
    //   },
    // }),
  },
});
