import { randomBytes } from 'crypto';
import { createAuth } from '@keystone-6/auth';

import { statelessSessions } from '@keystone-6/core/session';

let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret && process.env.NODE_ENV !== 'production') {
  sessionSecret = randomBytes(32).toString('hex');
}

const sessionMaxAge = process.env.SESSION_MAX_AGE;

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
  maxAge: sessionMaxAge,
  secret: sessionSecret,
});

export { withAuth, session };
