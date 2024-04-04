/** @jsxRuntime classic */
/** @jsx jsx */

import React, { useState } from 'react';
import { jsx, Stack, H1 } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';
import { FieldDescription, TextInput } from '@keystone-ui/fields';
import { ToastProvider, useToasts } from '@keystone-ui/toast';
import { useRouter } from '@keystone-6/core/admin-ui/router';
import { SigninContainer } from '../components/SigninContainer';
import { useMutation, gql } from '@keystone-6/core/admin-ui/apollo';

export default function ForgotPassword() {
  const mutation = gql`
    mutation SendUserMagicAuthLink($email: String!) {
      sendUserMagicAuthLink(email: $email)
    }
  `;
  const [data, setData] = useState({
    email: '',
    isLoading: false,
  });
  const { addToast } = useToasts();
  const router = useRouter();
  const [mutate] = useMutation(mutation);

  async function sendMagicLink(email) {
    try {
      const { data } = await mutate({
        variables: {
          email,
        },
      });

      addToast({
        title: 'Email sent!',
        message:
          'If the email address is registered, you will receive a magic link shortly.',
        tone: 'positive',
        preserve: false,
      });

      setData({
        email: '',
        isLoading: false,
      });
    } catch (error) {
      addToast({
        title: 'Something went wrong!',
        message: 'Something went wrong when trying to send the email. Please try again.',
        tone: 'negative',
        preserve: false,
      });
      console.error('Error:', error);
      setData({
        email: '',
        isLoadig: false,
      });
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setData({ ...data, isLoading: true });
    sendMagicLink(data.email);
  };

  return (
    <ToastProvider>
      <SigninContainer title='D4CR - Sign in'>
        <Stack gap='xlarge' as='form' onSubmit={onSubmit}>
          <H1>Forgot your password?</H1>
          <FieldDescription>
            Enter your email address and we will send you a one-time authentication link
            for instant login.
            <br />
            Don´t forget to update your password after you have logged in.
          </FieldDescription>
          <TextInput
            style={{ marginBottom: '1rem' }}
            value={data.email}
            onChange={(event) => setData({ ...data, email: event.target.value })}
            placeholder='Enter your email address'
          />
          <Stack gap='medium' across>
            <Button isLoading={data.isLoading} type='submit' tone='active' weight='bold'>
              Send
            </Button>
            <Button weight='none' tone='active' onClick={() => router.push('/sign-in')}>
              Go back
            </Button>
          </Stack>
        </Stack>
      </SigninContainer>
    </ToastProvider>
  );
}
