import { list } from '@keystone-6/core';
import { allOperations, denyAll } from '@keystone-6/core/access';
import { password, relationship, text } from '@keystone-6/core/fields';

import { isSignedIn, permissions, rules } from '../auth/access.js';

export const userSchema = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canManageUsers,
      delete: permissions.canManageUsers,
      query: () => true,
    },
    filter: {
      query: rules.canReadUsers,
      update: rules.canUpdateUsers,
    },
  },
  ui: {
    // isHidden: (args) => {
    //   return !permissions?.canManageRoles(args);
    // },
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
    labelField: 'email',
    listView: {
      initialColumns: ['email', 'fullName', 'role'],
    },
    itemView: {
      defaultFieldMode: ({ session, item }) => {
        // canEditOtherUsers kan redigera andra användare
        if (session?.data.role?.canEditOtherUsers) return 'edit';

        // Redigera sin egna användare
        if (session?.itemId === item.id) return 'edit';
        // Annars read mode
        return 'read';
      },
    },
  },
  fields: {
    fullName: text({
      isFilterable: false,
      isOrderable: false,
      // isIndexed: 'unique',
      validation: {
        isRequired: true,
      },
    }),

    email: text({
      isIndexed: 'unique',
      validation: {
        isRequired: true,
      },
    }),

    password: password({
      access: {
        read: denyAll,
        update: ({ session, item }) =>
          permissions.canManageUsers({ session }) || session?.itemId === item.id,
      },
      validation: { isRequired: true },
    }),

    chapters: relationship({
      ref: 'Chapter.contentOwner',
      many: true,
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
      ui: {
        hideCreate: true,
        itemView: {
          fieldMode: (args) => (permissions.canManageUsers(args) ? 'edit' : 'read'),
        },
      },
    }),
    //  Rolen som är kopplad till användare.
    role: relationship({
      ref: 'Role.assignedTo',
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
      ui: {
        itemView: {
          fieldMode: (args) => (permissions.canManageUsers(args) ? 'edit' : 'read'),
        },
      },
    }),
  },
});
