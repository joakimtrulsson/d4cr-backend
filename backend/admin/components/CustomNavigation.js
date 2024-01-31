import React from 'react';

import {
  NavigationContainer,
  NavItem,
  ListNavItems,
} from '@keystone-6/core/admin-ui/components';

import { FieldLabel, FieldDescription } from '@keystone-ui/fields';

export function CustomNavigation({ authenticatedItem, lists }) {
  // Glöm inte att lägga till nya innehållstyper i listan nedan
  const aboveTaxonomyLists = ['User', 'Role', 'Chapter', 'Page', 'Resource', 'Test'];
  const underTaxonomyLists = ['ResourceType', 'ResourceCategory'];
  const underMediaLibraryLists = ['Image'];

  const aboveTaxonomy = lists.filter((list) => aboveTaxonomyLists.includes(list.key));
  const underTaxonomy = lists.filter((list) => underTaxonomyLists.includes(list.key));
  const underMediaLibrary = lists.filter((list) =>
    underMediaLibraryLists.includes(list.key)
  );

  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <NavItem href='/'>Dashboard</NavItem>
      {/* <ListNavItems lists={lists} /> */}
      <ListNavItems lists={aboveTaxonomy} />
      <NavItem href='/site-config'>Site Config</NavItem>
      <FieldLabel
        style={{
          marginLeft: '1.5rem',
          marginRight: '1.5rem',
          marginTop: '1.5rem',
          borderBottom: '1px solid #e1e5e9',
        }}
      >
        Taxonomy
      </FieldLabel>
      <ListNavItems lists={underTaxonomy} />

      <FieldLabel
        style={{
          marginLeft: '1.5rem',
          marginRight: '1.5rem',
          marginTop: '1.5rem',
          borderBottom: '1px solid #e1e5e9',
        }}
      >
        Media Library
      </FieldLabel>
      <ListNavItems lists={underMediaLibrary} />
      <FieldDescription style={{ marginLeft: '1.5rem' }}>Files</FieldDescription>
      <FieldDescription style={{ marginLeft: '1.5rem' }}>Videos</FieldDescription>
    </NavigationContainer>
  );
}
