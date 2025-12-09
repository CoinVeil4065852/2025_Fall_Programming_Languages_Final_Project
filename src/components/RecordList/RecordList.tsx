import { Button, Group, ScrollArea, Stack, Table, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import InfoCard, { InfoCardProps } from '../InfoCard/InfoCard';

type RecordItem = { id: string; [key: string]: any };

type RecordListProps = Omit<InfoCardProps, 'children'> & {
  title?: string;
  records: RecordItem[];
 
  onEdit?: (r: RecordItem) => void;
  onDelete?: (r: RecordItem) => void;
  onAddClick?: () => void;
};

const RecordList = ({ title, records, onEdit, onDelete, onAddClick, ...infoCardProps }: RecordListProps) => {
  const keys: string[] = records[0] ? Object.keys(records[0]).filter((k) => k !== 'id') : [];
  const { t } = useTranslation();

  return (
    <InfoCard
      title={title}
      {...infoCardProps}
      rightHeader={
        onAddClick ? (
          <Button size="xs" onClick={onAddClick}>
            {t('add')}
          </Button>
        ) : undefined
      }
    >
      {records.length === 0 ? (
        <Stack align="center" gap="xs" mt="md">
          <Text c="dimmed">{t('no_records_yet')}</Text>
        </Stack>
      ) : (
      
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {keys.map((k) => {
                  const map: Record<string, string> = {
                    date: 'date',
                    time: 'time',
                    amountMl: 'amount_ml',
                    amount: 'amount_ml',
                    hours: 'hours',
                    minutes: 'minutes',
                    intensity: 'intensity',
                  };
                  const keyForT = map[k] ?? k;
                  return (
                    <Table.Th key={k}>{t(keyForT)}</Table.Th>
                  );
                })}
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {records.map((r) => (
                <Table.Tr key={r.id}>
                  {keys.map((k) => {
                    const value: any = r[k] ?? '';
                    return (
                      <Table.Td key={k}>
                        <Text size="sm">{String(value)}</Text>
                      </Table.Td>
                    );
                  })}
                  <Table.Td>
                    <Group gap={6} justify="right">
                      {onEdit ? (
                        <Button size="xs" variant="outline" onClick={() => onEdit(r)}>
                          {t('edit')}
                        </Button>
                      ) : null}
                      {onDelete ? (
                        <Button size="xs" color="red" onClick={() => onDelete(r)}>
                          {t('delete')}
                        </Button>
                      ) : null}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
       
      )}
    </InfoCard>
  );
};

export default RecordList;
