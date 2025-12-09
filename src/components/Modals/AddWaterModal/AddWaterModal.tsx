import React from 'react';
import { NumberInput, Stack, TextInput } from '@mantine/core';
import BaseAddRecordModal from '../BaseAddRecordModal/BaseAddRecordModal';

type Values = {
  amount: number | '';
  time: string; // use datetime-local string
};

type Props = {
  opened: boolean;
  onClose: () => void;
  onAdd: (values: { amount: number; time: string }) => Promise<void> | void;
};

function toLocalDatetimeInput(date = new Date()) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

const AddWaterModal: React.FC<Props> = ({ opened, onClose, onAdd }) => {
  const initialValues: Values = {
    amount: 250,
    time: toLocalDatetimeInput(new Date()),
  };

  return (
    <BaseAddRecordModal<Values>
      opened={opened}
      onClose={onClose}
      title="Add water"
      initialValues={initialValues}
      onSubmit={async (values) => {
        const amt = typeof values.amount === 'number' ? values.amount : Number(values.amount);
        await onAdd({ amount: amt, time: values.time });
      }}
      submitLabel="Add"
    >
      {(form) => (
        <Stack>
          <NumberInput label="Amount (ml)" min={0} {...form.getInputProps('amount')} />

          <TextInput label="Time" type="datetime-local" {...form.getInputProps('time')} />
        </Stack>
      )}
    </BaseAddRecordModal>
  );
};

export default AddWaterModal;
