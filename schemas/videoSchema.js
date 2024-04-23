import { list } from '@keystone-6/core';
import { text, file, timestamp, integer } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

export const videoSchema = list({
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
    title: text({
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          // console.log('resolvedData', resolvedData);
          if (operation === 'create' && !inputData.title) {
            return resolvedData.file.filename;
          }

          if (operation === 'update' && !resolvedData.title) {
            return resolvedData.file.filename;
          }

          return resolvedData.title;
        },
      },
      ui: {
        description:
          'This field specifies the title of the video, which is automatically generated from the uploaded video URL.',
        itemView: {
          fieldMode: 'read',
        },
      },
    }),

    altText: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This required field specifies the alternative text for the video. Alt text provides a textual description of the video, which is essential for accessibility and SEO purpose.',
      },
    }),

    file: file({
      storage: 'videoStorage',
    }),

    createdAt: timestamp({ isRequired: true, defaultValue: { kind: 'now' } }),

    size: integer({
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create') {
            return resolvedData.file.filesize;
          }
        },
      },
    }),

    thumbnailUrl: text({}),

    url: text({
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          let url = process.env.MEDIA_URL;

          if (operation === 'create') {
            return `${url}/${resolvedData.file.filename}`;
          }
        },
      },
    }),
  },
});
