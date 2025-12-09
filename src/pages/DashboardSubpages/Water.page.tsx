import { useEffect, useState } from 'react';
import { Group } from '@mantine/core';
import WaterProgressCard from '@/components/InfoCard/WaterProgressCard/WaterProgressCard';
import WaterWeeklyCard from '@/components/InfoCard/WaterWeeklyCard/WaterWeeklyCard';
import RecordList from '../../components/RecordList/RecordList';
import AddWaterModal from '@/components/Modals/AddWaterModal/AddWaterModal';

type WaterRecord = { id: string; date: string; amount: number };

const WaterPage = () => {
  const [records, setRecords] = useState<WaterRecord[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch('/water/list', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('no backend');
        const data = await res.json();
        setRecords(data || []);
      } catch (err) {
        setRecords([
          { id: '1', date: '2025-11-22', amount: 200 },
          { id: '2', date: '2025-11-23', amount: 900 },
        ]);
      }
    };
    load();
  }, []);

  const total = records.reduce((s, r) => s + (r.amount || 0), 0);

  return (
    <Group gap="md" justify="start" align="stretch">
      <WaterProgressCard currentMl={total} goalMl={2000} onAddClick={() => setAddOpen(true)} />
      <WaterWeeklyCard />
      <RecordList
        title="Water Records"
        records={records as any}
        fields={['date', 'amount']}
        onEdit={(r) => console.log('edit', r)}
        onDelete={(r) => console.log('delete', r)}
        style={{ width: '100%' }}
        onAddClick={() => setAddOpen(true)}
      />
      <AddWaterModal
        opened={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={async ({ amount, time }) => {
          const rec: WaterRecord = { id: String(Date.now()), date: time.split('T')[0], amount };
          setRecords((s) => [rec, ...s]);
          setAddOpen(false);
        }}
      />
    </Group>
  );
};

export default WaterPage;
