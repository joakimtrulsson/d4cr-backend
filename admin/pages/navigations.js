/* eslint-disable react/no-unknown-property */
/** @jsxRuntime classic */
/** @jsxRuntime classic */
/** @jsx jsx */

import Link from 'next/link';
import { jsx } from '@keystone-ui/core';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';

export default function Navigations() {
  const containerStyle = {
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    margin: 0,
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#6b7280',
    fontWeight: '500',
  };

  const hoverStyle = {
    color: '#3b82f6',
    textDecoration: 'underline',
    cursor: 'pointer',
  };

  return (
    <PageContainer header={<Heading type='h3'>Navigation configuration</Heading>}>
      <h3
        css={{
          width: '100%',
          textAlign: 'left',
        }}
      >
        Manage site navigation
      </h3>

      <p
        css={{
          ...containerStyle,
          backgroundColor: '#f3f4f6',
          ':hover': { backgroundColor: '#eff6ff' },
        }}
      >
        <Link css={{ ...linkStyle, ':hover': hoverStyle }} href='/main-menu/1'>
          Main Menu
        </Link>
      </p>
      <p
        css={{
          ...containerStyle,
          ':hover': { backgroundColor: '#eff6ff' },
        }}
      >
        <Link css={{ ...linkStyle, ':hover': hoverStyle }} href='/footer-menu/1'>
          Footer Menu
        </Link>
      </p>
    </PageContainer>
  );
}
