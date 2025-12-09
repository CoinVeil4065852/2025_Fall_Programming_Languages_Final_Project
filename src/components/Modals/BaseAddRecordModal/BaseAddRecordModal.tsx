import React from 'react';
import { Button, Group, Modal, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

type BaseAddRecordModalProps<T> = {
  opened: boolean;
  onClose: () => void;
  title?: string;
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  children: (form: ReturnType<typeof useForm>) => React.ReactNode;
  submitLabel?: string;
};

function BaseAddRecordModal<T extends Record<string, any>>({
  opened,
  onClose,
  title = 'Add',
  initialValues,
  onSubmit,
  children,
  submitLabel = 'Save',
}: BaseAddRecordModalProps<T>) {
  const form = useForm<T>({
    initialValues: initialValues as T,
    validateInputOnBlur: true,
  });

  const handleSubmit = form.onSubmit(async (values) => {
    await onSubmit(values);
    onClose();
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      withOverlay
      closeOnClickOutside={true}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Stack>
          {children(form as any)}
          <Group ml="auto" mt="md">
            <Button type="submit">{submitLabel}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default BaseAddRecordModal;
