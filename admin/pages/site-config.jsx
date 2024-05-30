/** @jsxRuntime classic */
/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@keystone-ui/core';
import {
  PageContainer,
  CellContainer,
  CellLink,
} from '@keystone-6/core/admin-ui/components';
import { Heading, Divider } from '@keystone-ui/core';
import { FieldLabel, FieldDescription } from '@keystone-ui/fields';

export default function SiteConfig() {
  return (
    <PageContainer
      title='Site Configuration'
      header={<Heading type='h3'>Manage Site configuration</Heading>}
    >
      <CellContainer>
        <FieldLabel>Choose the content you want to mange</FieldLabel>
        <FieldDescription>
          The following content fields cannot be left empty. The site will not function
          properly without them. <br />
          For example, if no emails are provided in the form-email section, the forms will
          not be able to send any emails.
        </FieldDescription>

        <CellLink href='/front-page/1'>Frontpage</CellLink>
        <Divider />
        <CellLink href='/footer-banner/1'>Footer - Banner</CellLink>
        <Divider />
        <CellLink href='/form-email/1'>Forms - Email</CellLink>
        <Divider />
        <CellLink href='/footer-join-us/1'>Footer - Social Media Links</CellLink>
        <Divider />
        <CellLink href='/revalidate-frontend'>Update Frontend application</CellLink>
      </CellContainer>
    </PageContainer>
  );
}
