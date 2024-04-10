import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';
import Email from '../utils/email.js';

const sessionSecret = process.env.SESSION_SECRET;
// const sessionMaxAge = process.env.SESSION_MAX_AGE;

const { withAuth } = createAuth({
  listKey: 'User',
  // Ett identity field på usern.
  identityField: 'email',
  secretField: 'password',
  magicAuthLink: {
    sendToken: async ({ itemId, identity, token, context }) => {
      const fromEmail = process.env.EMAIL_FROM;
      const url = `${process.env.BASE_URL}validate-token?token=${token}&email=${identity}`;
      // Identity är email.
      const mailData = {
        targetEmail: identity,
      };

      await new Email(fromEmail, mailData, url).sendOneTimeAuthenticationLink();
    },
    tokensValidForMins: 10,
  },
  initFirstItem: {
    fields: ['fullName', 'email', 'password'],

    // Följande data sparas som default på den första användaren.
    itemData: {
      role: {
        create: {
          name: 'Admin Role',
          canCreateItems: true,
          canCreateChapters: true, // Ny
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
    fullName
    email
    chapters {
      id
      title
      slug
    }
    role {
      id
      name
      canCreateItems
      canCreateChapters
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
  secret: process.env.SESSION_SECRET,
});

export { withAuth, session };
