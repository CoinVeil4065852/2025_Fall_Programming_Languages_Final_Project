import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '@/services/types';
import { Badge, Grid, Group, RingProgress, Stack, Text, ThemeIcon } from '@mantine/core';
import ActivityProgressCard from '@/components/InfoCard/ActivityProgressCard/ActivityProgressCard';
import WaterProgressCard from '@/components/InfoCard/WaterProgressCard/WaterProgressCard';
import UserMetricsCard from '@/components/UserMetricsCard/UserMetricsCard';
import { useAppData } from '../../AppDataContext';
import SleepProgressCard from '../../components/InfoCard/SleepProgressCard/SleepProgressCard';

const OverviewPage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const { profile: appProfile, water, sleep, activity, error, bmi: apiBmi } = useAppData();

  useEffect(() => {
    setProfile(appProfile || null);
  }, [appProfile]);

  // Use server-provided BMI only; do not compute locally
  const bmi = apiBmi;

  // derive card metrics from app data
  const todayDate = new Date().toISOString().split('T')[0];

  // water: sum amountMl for records where date matches today (or datetime's date)
  const waterToday = (water || []).reduce((sum, r) => {
    const d = (r.datetime || '').split('T')[0];
    return sum + (d === todayDate ? r.amountMl || 0 : 0);
  }, 0);

  // sleep: average hours over last 7 sleep records (by datetime)
  const sleepSorted = (sleep || [])
    .slice()
    .sort((a, b) => (a.datetime || '').localeCompare(b.datetime || ''));
  const last7 = sleepSorted.slice(-7);
  const sleepAvg = last7.length ? last7.reduce((s, r) => s + (r.hours || 0), 0) / last7.length : 0;

  // activity: total minutes today and estimate calories using intensity mapping
  const intensityFactor: Record<string, number> = { low: 4, moderate: 6, high: 8 };
  const activityToday = (activity || []).reduce(
    (acc, r) => {
      const d = (r.datetime || '').split('T')[0];
      if (d !== todayDate) return acc;
      const mins = r.minutes || 0;
      const factor = intensityFactor[(r.intensity || '').toLowerCase()] || 5;
      acc.duration += mins;
      acc.calories += Math.round(mins * factor);
      return acc;
    },
    { duration: 0, calories: 0 }
  );

  const { t } = useTranslation();

  const bmiLabel = (v?: number) => {
    if (!v) return { label: '—', color: 'gray' };
    if (v < 18.5) return { label: t('bmi_underweight'), color: 'blue' };
    if (v < 25) return { label: t('bmi_normal'), color: 'green' };
    if (v < 30) return { label: t('bmi_overweight'), color: 'yellow' };
    return { label: t('bmi_obese'), color: 'red' };
  };

  const bmiInfo = bmiLabel(bmi);

  return (
    <Group gap="md" justify="start" align="stretch">
      <UserMetricsCard profile={profile} error={error} bmi={apiBmi} />

      <SleepProgressCard currentHours={Number((sleepAvg || 0).toFixed(1))} goalHours={8} />
      <WaterProgressCard currentMl={waterToday} goalMl={2000} />
      <ActivityProgressCard
        calories={activityToday.calories}
        caloriesGoal={600}
        durationMinutes={activityToday.duration}
      />
    </Group>
  );
};

export default OverviewPage;
