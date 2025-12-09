import { Button, Group, ScrollArea, Stack, Table, Text } from '@mantine/core';
import InfoCard, { InfoCardProps } from '../InfoCard/InfoCard';

type RecordItem = { id: string; [key: string]: any };

type RecordListProps = Omit<InfoCardProps, 'children'> & {
  title?: string;
  records: RecordItem[];
  fields?: string[]; // keys to show in order
  onEdit?: (r: RecordItem) => void;
  onDelete?: (r: RecordItem) => void;
  onAddClick?: () => void;
};

const RecordList = ({
  title,
  records,
  fields,
  onEdit,
  onDelete,
  onAddClick,
  ...infoCardProps
}: RecordListProps) => {
  const keys = fields ?? (records[0] ? Object.keys(records[0]).filter((k) => k !== 'id') : []);

  return (
    <InfoCard
      title={title}
      {...infoCardProps}
      rightHeader={
        onAddClick ? (
          <Button size="xs" onClick={onAddClick}>
            Add
          </Button>
        ) : undefined
      }
    >
      <ScrollArea style={{ height: 360 }}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {keys.map((k) => (
                <Table.Th key={k}>{k}</Table.Th>
              ))}
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {records.map((r) => (
              <Table.Tr key={r.id}>
                {keys.map((k) => (
                  <Table.Td key={k}>
                    <Text size="sm">{String(r[k] ?? '')}</Text>
                  </Table.Td>
                ))}
                <Table.Td>
                  <Group gap={6} justify="right">
                    {onEdit ? (
                      <Button size="xs" variant="outline" onClick={() => onEdit(r)}>
                        Edit
                      </Button>
                    ) : null}
                    {onDelete ? (
                      <Button size="xs" color="red" onClick={() => onDelete(r)}>
                        Delete
                      </Button>
                    ) : null}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      {records.length === 0 ? (
        <Stack align="center" gap="xs" mt="md">
          <Text c="dimmed">No records yet.</Text>
        </Stack>
      ) : null}
    </InfoCard>
  );
};

export default RecordList;
