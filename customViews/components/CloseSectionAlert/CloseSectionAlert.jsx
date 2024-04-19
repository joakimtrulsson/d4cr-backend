import React from 'react';
import { AlertDialog } from '@keystone-ui/modals';

const CloseSectionAlert = ({ isOpen, handleCancel, handleConfirm }) => (
  <AlertDialog
    isOpen={isOpen}
    title='Confirm closing this section'
    actions={{
      confirm: {
        action: handleConfirm,
        label: 'Close',
        loading: false,
      },
      cancel: {
        action: handleCancel,
        label: 'Cancel',
      },
    }}
  >
    Are you sure you want to close? Any unsaved changes will be lost.
  </AlertDialog>
);

export default CloseSectionAlert;
