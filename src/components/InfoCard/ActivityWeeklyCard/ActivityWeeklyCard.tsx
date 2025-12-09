import React from 'react';
import BarChartCard from '../BarChartCard/BarChartCard';

type Props = {
  data?: number[]; // 7 numbers, one per day (minutes)
  labels?: string[];
};

const ActivityWeeklyCard: React.FC<Props> = ({ data, labels }) => {
  return (
    <BarChartCard title="Weekly activity" data={data} labels={labels} unitLabel="minutes" />
  );
};

export default ActivityWeeklyCard;
