import React from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { toLocalDatetimeInput } from '@/utils/datetime';
import BaseAddRecordModal from '../BaseAddRecordModal/BaseAddRecordModal';

type Values = {
  duration: number | '';
  time: string;
  intensity: 'low' | 'moderate' | 'high' | '';
};

type Props = {
  opened: boolean;
  onClose: () => void;
  onAdd: (values: { duration: number; time: string; intensity?: string }) => Promise<void> | void;
  initialValues?: Values;
  submitLabel?: string;
};

const AddActivityModal: React.FC<Props> = ({
  opened,
  onClose,
  onAdd,
  initialValues,
  submitLabel,
}) => {
  const defaults: Values = {
    duration: 30,
    time: toLocalDatetimeInput(new Date()),
    intensity: 'moderate',
  };

  const { t } = useTranslation();

  return (
    <BaseAddRecordModal<Values>
      opened={opened}
      onClose={onClose}
      title={initialValues ? t('edit_activity') : t('add_activity')}
      initialValues={initialValues ?? defaults}
      onSubmit={async (values) => {
        const dur = typeof values.duration === 'number' ? values.duration : Number(values.duration);
        await onAdd({ duration: dur, time: values.time, intensity: values.intensity || undefined });
      }}
      submitLabel={submitLabel ?? (initialValues ? t('save') : t('add'))}
    >
      {(form) => (
        <Stack>
          <NumberInput label={t('duration_minutes')} min={0} {...form.getInputProps('duration')} />
          <TextInput label={t('time')} type="datetime-local" {...form.getInputProps('time')} />
          <Select
            label={t('intensity')}
            data={[
              { value: 'low', label: t('intensity_low') },
              { value: 'moderate', label: t('intensity_medium') },
              { value: 'high', label: t('intensity_high') },
            ]}
            {...form.getInputProps('intensity')}
          />
        </Stack>
      )}
    </BaseAddRecordModal>
  );
};

export default AddActivityModal;
