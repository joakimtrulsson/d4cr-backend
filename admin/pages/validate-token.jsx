/** @jsxRuntime classic */
/** @jsx jsx */

import React, { useEffect, useState } from 'react';
import { jsx, Stack, H1 } from '@keystone-ui/core';
import { Notice } from '@keystone-ui/notice';
import { Button } from '@keystone-ui/button';
import { SigninContainer } from '../components/SigninContainer';
import { useMutation, gql } from '@keystone-6/core/admin-ui/apollo';

export default function ValidateToken() {
  const mutation = gql`
    mutation RedeemMagicAuthToken($email: String!, $token: String!) {
      redeemUserMagicAuthToken(email: $email, token: $token) {
        ... on RedeemUserMagicAuthTokenFailure {
          code
        }
      }
    }
  `;
  const [mutate] = useMutation(mutation);
  const [data, setData] = useState({
    token: '',
    email: '',
    isValidating: false,
    validationMessage: '',
  });

  async function redeemToken(token, email) {
    try {
      const { data } = await mutate({
        variables: {
          email,
          token,
        },
      });

      if (data.redeemUserMagicAuthToken.code === 'FAILURE') {
        setData({
          ...data,
          isValidating: false,
          validationMessage: 'Invalid token',
        });
      } else if (data.redeemUserMagicAuthToken.code === 'TOKEN_REDEEMED') {
        setData({
          ...data,
          isValidating: false,
          validationMessage: 'Token already redeemed',
        });
      } else {
        setData({
          ...data,
          isValidating: false,
          validationMessage: 'Validation successful. Redirecting...',
        });

        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error:', error);
      setData({
        ...data,
        isValidating: false,
        validationMessage: 'An error occurred while validating the token.',
      });
    }
  }

  useEffect(() => {
    // Hämta query-parametrarna från URL:en
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get('token');
    const email = queryParams.get('email');
    if (urlToken && email) {
      setData({ token: urlToken, email: email });
    } else {
      setData({
        ...data,
        isValidating: false,
        validationMessage: 'Token or email is missing in the URL.',
      });
    }
  }, []);

  useEffect(() => {
    if (data.token && data.email) {
      setData((prevData) => ({ ...prevData, isValidating: true }));

      redeemToken(data.token, data.email);
    }
  }, [data.token, data.email]);

  return (
    <SigninContainer title='D4CR - Sign in'>
      <Stack gap='xlarge'>
        <H1>Token Validation</H1>

        {data.isValidating ? (
          <p>Validating token...</p>
        ) : (
          <Notice
            title={
              data.validationMessage === 'Validation successful. Redirecting...'
                ? 'Success'
                : 'Error'
            }
            tone={
              data.validationMessage === 'Validation successful. Redirecting...'
                ? 'positive'
                : 'negative'
            }
          >
            {data.validationMessage}
          </Notice>
        )}
        {data.isLoading && (
          <Button
            isLoading={data.isValidating}
            tone='active'
            weight='bold'
            style={{ width: '30%' }}
          ></Button>
        )}
      </Stack>
    </SigninContainer>
  );
}
