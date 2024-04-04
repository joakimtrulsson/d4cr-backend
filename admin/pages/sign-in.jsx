/** @jsxRuntime classic */
/** @jsx jsx */

import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { jsx, Stack, H1 } from '@keystone-ui/core';
import { Notice } from '@keystone-ui/notice';
import { Button } from '@keystone-ui/button';
import { useRawKeystone, useReinitContext } from '@keystone-6/core/admin-ui/context';
import { useRouter } from '@keystone-6/core/admin-ui/router';
import { TextInput } from '@keystone-ui/fields';
import { useMutation, gql } from '@keystone-6/core/admin-ui/apollo';
import { SigninContainer } from '../components/SigninContainer';

function useRedirect() {
  return useMemo(() => '/', []);
}

function SigninPage() {
  const mutation = gql`
    mutation AuthenticateUserWithPassword($email: String!, $password: String!) {
      authenticateUserWithPassword(email: $email, password: $password) {
        ... on UserAuthenticationWithPasswordSuccess {
          sessionToken
          item {
            id
            email
          }
        }
        ... on UserAuthenticationWithPasswordFailure {
          message
        }
      }
    }
  `;
  const [state, setState] = useState({ identity: '', secret: '', errorMessage: null });
  const [submitted, setSubmitted] = useState(false);
  const [mutate, { loading, data }] = useMutation(mutation);
  const reinitContext = useReinitContext();
  const router = useRouter();
  const rawKeystone = useRawKeystone();
  const redirect = useRedirect();

  // Om inloggad, redirecta direkt
  useEffect(() => {
    if (submitted) return;
    if (rawKeystone.authenticatedItem.state === 'authenticated') {
      router.push(redirect);
    }
  }, [rawKeystone.authenticatedItem, router, redirect, submitted]);

  useEffect(() => {
    if (!submitted) return;

    if (rawKeystone.adminMeta?.error?.message === 'Access denied') {
      router.push('/no-access');
      return;
    }

    router.push(redirect);
  }, [rawKeystone.adminMeta, router, redirect, submitted]);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await mutate({
        variables: {
          email: state.identity,
          password: state.secret,
        },
      });
      if (
        data.authenticateUserWithPassword?.__typename !==
        'UserAuthenticationWithPasswordSuccess'
      ) {
        setState({ ...state, errorMessage: 'Authentication failed.' });
        return;
      }
    } catch (e) {
      console.error(e);
      return;
    }

    await reinitContext();
    setSubmitted(true);
  };

  return (
    <SigninContainer title='D4CR - Sign in'>
      <Stack gap='xlarge' as='form' onSubmit={onSubmit}>
        <H1>Sign In</H1>
        {state.errorMessage && (
          <Notice title='Error' tone='negative'>
            {state.errorMessage}
          </Notice>
        )}
        <Stack gap='medium'>
          <TextInput
            id='identity'
            name='identity'
            value={state.identity}
            onChange={(e) => setState({ ...state, identity: e.target.value })}
            placeholder='email'
          />

          <Fragment>
            <TextInput
              id='password'
              name='password'
              value={state.secret}
              onChange={(e) => setState({ ...state, secret: e.target.value })}
              placeholder='password'
              type='password'
            />
          </Fragment>
        </Stack>

        <Stack gap='medium' across>
          <Button
            weight='bold'
            tone='active'
            isLoading={
              loading ||
              data?.authenticateUserWithPassword?.__typename ===
                'UserAuthenticationWithPasswordSuccess'
            }
            type='submit'
          >
            Sign in
          </Button>
          <Button
            weight='none'
            tone='active'
            onClick={() => router.push('/forgot-password')}
          >
            Forgot your password?
          </Button>
        </Stack>
      </Stack>
    </SigninContainer>
  );
}

export default SigninPage;
