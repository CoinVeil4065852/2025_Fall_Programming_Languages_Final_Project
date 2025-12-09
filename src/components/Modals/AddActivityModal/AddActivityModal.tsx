import React from 'react';
import { NumberInput, Select, TextInput, Stack } from '@mantine/core';
import BaseAddRecordModal from '../BaseAddRecordModal/BaseAddRecordModal';

type Values = {
  duration: number | '';
  time: string;
  intensity: 'low' | 'medium' | 'high' | '';
};

type Props = {
  opened: boolean;
  onClose: () => void;
  onAdd: (values: { duration: number; time: string; intensity?: string }) => Promise<void> | void;
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

const AddActivityModal: React.FC<Props> = ({ opened, onClose, onAdd }) => {
  const initialValues: Values = {
    duration: 30,
    time: toLocalDatetimeInput(new Date()),
    intensity: 'medium',
  };

  return (
    <BaseAddRecordModal<Values>
      opened={opened}
      onClose={onClose}
      title="Add activity"
      initialValues={initialValues}
      onSubmit={async (values) => {
        const dur = typeof values.duration === 'number' ? values.duration : Number(values.duration);
        await onAdd({ duration: dur, time: values.time, intensity: values.intensity || undefined });
      }}
      submitLabel="Add"
    >
      {(form) => (
        <Stack>
          <NumberInput label="Duration (minutes)" min={0} {...form.getInputProps('duration')} />
          <TextInput label="Time" type="datetime-local" {...form.getInputProps('time')} />
          <Select label="Intensity" data={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} {...form.getInputProps('intensity')} />
        </Stack>
      )}
    </BaseAddRecordModal>
  );
};

export default AddActivityModal;
