/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx, Box, Center, useTheme } from '@keystone-ui/core';
import { Head } from '@keystone-6/core/admin-ui/router';

export const SigninContainer = ({ children, title }) => {
  const { colors, shadow } = useTheme();
  return (
    <div>
      <Head>
        <title>{title || 'Keystone'}</title>
      </Head>
      <Center
        css={{
          minWidth: '100vw',
          minHeight: '100vh',
          backgroundColor: colors.backgroundMuted,
        }}
        rounding='medium'
      >
        <Box
          css={{
            background: colors.background,
            width: 600,
            boxShadow: shadow.s100,
          }}
          margin='medium'
          padding='xlarge'
          rounding='medium'
        >
          {children}
        </Box>
      </Center>
    </div>
  );
};
