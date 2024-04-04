/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@keystone-ui/core';

export const CustomLogo = () => {
  const loc = window.location;
  const IMAGE_URL = `${loc.protocol}//${loc.host}/public/images/logo/D4CR_Logo.svg`;

  return <img src={IMAGE_URL} alt='logo' style={{ width: '175px', height: '50px' }} />;
};
