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

export default function Navigations() {
  return (
    <PageContainer
      title='Navigation Configuration'
      header={<Heading type='h3'>Manage site navigation</Heading>}
    >
      <CellContainer>
        <FieldLabel>Choose the content you want to mange</FieldLabel>
        <FieldDescription>
          Main menu and Footer menu are the two main navigations that are required for the
          site to function properly.
          <br />
          Main menu will be used in the top navigation and in the footer. <br />
          Footer menu is placed beneath the Social Media links in the footer. <br />
          Example of the footer menu: Cookies | Integrity policy
        </FieldDescription>

        <CellLink href='/main-menu/1'>Main Menu</CellLink>
        <Divider />
        <CellLink href='/footer-menu/1'>Footer Menu</CellLink>
        <Divider />
      </CellContainer>
    </PageContainer>
  );
}
