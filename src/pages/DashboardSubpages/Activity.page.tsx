import React, { useEffect, useState } from 'react';
import { Grid, Group } from '@mantine/core';
import ActivityProgressCard from '@/components/InfoCard/ActivityProgressCard/ActivityProgressCard';
import ActivityWeeklyCard from '@/components/InfoCard/ActivityWeeklyCard/ActivityWeeklyCard';
import AddActivityModal from '@/components/Modals/AddActivityModal/AddActivityModal';
import RecordList from '../../components/RecordList/RecordList';

type ActivityRecord = { id: string; date: string; duration: number; intensity?: string };

const ActivityPage = () => {
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch('/activity/list', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('no backend');
        const data = await res.json();
        setRecords(data || []);
      } catch (err) {
        setRecords([
          { id: '1', date: '2025-11-20', duration: 45, intensity: 'medium' },
          { id: '2', date: '2025-11-22', duration: 30, intensity: 'low' },
        ]);
      }
    };
    load();
  }, []);

  const totalMinutes = records.reduce((s, r) => s + (r.duration || 0), 0);

  return (
    <Group gap="md" align="stretch" justify="start">
      <ActivityProgressCard
        calories={Math.round(totalMinutes * 5)}
        caloriesGoal={600}
        steps={0}
        durationMinutes={totalMinutes}
      />
      <ActivityWeeklyCard data={records.slice(0, 7).map((r) => r.duration)} />
      <RecordList
        title="Activity Records"
        records={records as any}
        fields={['date', 'duration', 'intensity']}
        onEdit={(r) => console.log('edit', r)}
        onDelete={(r) => console.log('delete', r)}
        style={{ width: '100%' }}
        onAddClick={() => setAddOpen(true)}
      />

      <AddActivityModal
        opened={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={async ({ duration, time, intensity }) => {
          const rec: ActivityRecord = {
            id: String(Date.now()),
            date: time.split('T')[0],
            duration,
            intensity,
          };
          setRecords((s) => [rec, ...s]);
          setAddOpen(false);
        }}
      />
    </Group>
  );
};

export default ActivityPage;
