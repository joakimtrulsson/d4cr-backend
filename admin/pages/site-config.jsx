/** @jsxRuntime classic */
/** @jsxRuntime classic */
/** @jsx jsx */

import Link from 'next/link';
import { jsx } from '@keystone-ui/core';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';

export default function SiteConfig() {
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
    <PageContainer header={<Heading type='h3'>Site configuration</Heading>}>
      <h3
        css={{
          width: '100%',
          textAlign: 'left',
        }}
      >
        Manage site configuration
      </h3>

      <p
        css={{
          ...containerStyle,
          backgroundColor: '#f3f4f6',
          ':hover': { backgroundColor: '#eff6ff' },
        }}
      >
        <Link css={{ ...linkStyle, ':hover': hoverStyle }} href='/front-page/1'>
          Frontpage
        </Link>
      </p>
      <p
        css={{
          ...containerStyle,
          ':hover': { backgroundColor: '#eff6ff' },
        }}
      >
        <Link css={{ ...linkStyle, ':hover': hoverStyle }} href='/form-email/1'>
          Forms
        </Link>
      </p>
      <p
        css={{
          ...containerStyle,
          backgroundColor: '#f3f4f6',
          ':hover': { backgroundColor: '#eff6ff' },
        }}
      >
        <Link css={{ ...linkStyle, ':hover': hoverStyle }} href='/footer-banner/1'>
          Footer - Banner
        </Link>
      </p>
      <p
        css={{
          ...containerStyle,
          ':hover': { backgroundColor: '#eff6ff' },
        }}
      >
        <Link css={{ ...linkStyle, ':hover': hoverStyle }} href='/footer-join-us/1'>
          Footer - Join us
        </Link>
      </p>
    </PageContainer>
  );
}
