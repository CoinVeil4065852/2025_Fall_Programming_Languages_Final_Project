import React from 'react';
import BarChartCard from '../BarChartCard/BarChartCard';
import { InfoCardProps } from '../InfoCard';

type Props = Omit<InfoCardProps, 'children' | 'title'> & {
  data?: number[];
  labels?: string[];
};

const WaterWeeklyCard: React.FC<Props> = ({ data, labels, ...infoCardProps }) => {
  return (
    <BarChartCard
      title="Weekly water"
      data={data}
      labels={labels}
      unitLabel="milliliters"
      {...infoCardProps}
    />
  );
};

export default WaterWeeklyCard;
