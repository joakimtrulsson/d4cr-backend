import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';

const sessionSecret = process.env.SESSION_SECRET;
// const sessionMaxAge = process.env.SESSION_MAX_AGE;

const { withAuth } = createAuth({
  listKey: 'User',
  // Ett identity field på usern.
  identityField: 'username',
  secretField: 'password',
  initFirstItem: {
    fields: ['username', 'password'],

    // Följande data sparas som default på den första användaren.
    itemData: {
      role: {
        create: {
          name: 'Admin Role',
          canCreateItems: true,
          canManageAllItems: true,
          canSeeOtherUsers: true,
          canEditOtherUsers: true,
          canManageUsers: true,
          canManageRoles: true,
        },
      },
    },
  },

  sessionData: `
    username
    role {
      id
      name
      canCreateItems
      canManageAllItems
      canSeeOtherUsers
      canEditOtherUsers
      canManageUsers
      canManageRoles
    }`,
});

const session = statelessSessions({
  // maxAge: sessionMaxAge,
  maxAge: 60 * 60 * 24 * 30,
  secret: sessionSecret,
});

export { withAuth, session };
