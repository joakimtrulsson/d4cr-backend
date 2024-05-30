/** @jsxRuntime classic */
/** @jsxRuntime classic */
/** @jsx jsx */

import { useState } from 'react';
import { jsx } from '@keystone-ui/core';
import { PageContainer, CellContainer } from '@keystone-6/core/admin-ui/components';
import { ToastProvider, useToasts } from '@keystone-ui/toast';
import { Heading } from '@keystone-ui/core';
import { FieldLabel, FieldDescription } from '@keystone-ui/fields';
import { Button } from '@keystone-ui/button';
import triggerRevalidation from '../../utils/triggerRevalidation';
import useFetchLinkOptions from '../../customViews/hooks/useFetchLinkOptions';

export default function RevalidateFrontend() {
  const [isLoading, setIsLoading] = useState(false);
  const pagesOptions = useFetchLinkOptions();
  const { addToast } = useToasts();

  const filteredOptions = pagesOptions
    .filter(
      (option) =>
        option.value !== '' && option.value !== 'share' && option.value !== 'slack'
    )
    .map(({ value }) => ({ value }))
    .concat({ value: '/' });

  const handleRevalidateData = async () => {
    setIsLoading(true);

    try {
      const results = await Promise.all(
        filteredOptions.map((option) => triggerRevalidation(option.value))
      );

      results.forEach(({ response, data }, index) => {
        if (response.status !== 200) {
          addToast({
            title: `Something went wrong with ${filteredOptions[index].value}!`,
            message:
              'Something went wrong when trying to revalidate the frontend application. Please try again.',
            tone: 'negative',
            preserve: false,
          });
        }
      });

      if (results.length > 0) {
        addToast({
          title: 'Data revalidated!',
          message: 'The frontend application has been successfully updated.',
          tone: 'positive',
          preserve: false,
        });
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: 'Something went wrong!',
        message:
          'Something went wrong when trying to revalidate the frontend application. Please try again.',
        tone: 'negative',
        preserve: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToastProvider>
      <PageContainer
        title='Update Frontend'
        header={<Heading type='h3'>Update the Frontend application</Heading>}
      >
        <CellContainer style={{ marginTop: '0.8rem', maxWidth: '600px' }}>
          <FieldLabel>
            Manually trigger an update of the data in the frontend application
          </FieldLabel>
          <FieldDescription style={{ marginBottom: '1rem' }}>
            If, for some reason, the frontend application is not updating automatically,
            you can manually trigger an update here. This will revalidate the data in the
            frontend application, which will update the data displayed to the user. It can
            take a few minutes for the changes to be reflected in the frontend
            application.
          </FieldDescription>
          <Button
            isLoading={isLoading}
            onClick={handleRevalidateData}
            tone='positive'
            weight='bold'
            size='medium'
          >
            Revalidate Data
          </Button>
        </CellContainer>
      </PageContainer>
    </ToastProvider>
  );
}
