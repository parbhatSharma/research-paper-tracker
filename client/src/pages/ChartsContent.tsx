import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, FunnelChart, Funnel, Cell, LabelList,
} from 'recharts';
import type { ReadingStage } from '../types';
import { STAGE_CHART_COLORS } from '../utils/colors';

const STAGES: ReadingStage[] = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];

interface Props {
  funnelData: Array<{ name: string; value: number; fill: string }>;
  scatterData: Array<{ impact: string; data: Array<{ x: number; y: number }>; color: string }>;
  stackedData: Array<Record<string, string | number>>;
}

export default function ChartsContent({ funnelData, scatterData, stackedData }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = theme.palette.text.secondary;
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const tooltipStyle = { backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8, color: theme.palette.text.primary };

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, gap: 2, mb: 2 }}>
        <Card><CardContent>
          <Typography variant="h6" sx={{ mb: 0.5 }}>Reading Stage Funnel</Typography>
          <Typography variant="caption" color="text.secondary">Paper count by stage</Typography>
          <Box sx={{ mt: 2, height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip contentStyle={tooltipStyle} />
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  <LabelList position="right" fill={textColor} stroke="none" dataKey="name" fontSize={11} />
                  {funnelData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </Box>
        </CardContent></Card>
        <Card><CardContent>
          <Typography variant="h6" sx={{ mb: 0.5 }}>Citations by Impact Score</Typography>
          <Typography variant="caption" color="text.secondary">Scatter plot grouped by impact</Typography>
          <Box sx={{ mt: 2, height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                <XAxis dataKey="x" name="Citations" type="number" tick={{ fill: textColor, fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} label={{ value: 'Citation Count', position: 'insideBottom', offset: -10, fill: textColor, fontSize: 12 }} />
                <YAxis dataKey="y" name="Index" tick={{ fill: textColor, fontSize: 11 }} hide />
                <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} formatter={(v, n) => [n === 'Citations' ? Number(v).toLocaleString() : v, n]} />
                <Legend wrapperStyle={{ fontSize: 12, color: textColor }} formatter={v => v.replace(' Impact', '')} />
                {scatterData.map(({ impact, data, color }) => <Scatter key={impact} name={impact} data={data} fill={color} opacity={0.85} />)}
              </ScatterChart>
            </ResponsiveContainer>
          </Box>
        </CardContent></Card>
      </Box>

      <Card sx={{ mb: 2 }}><CardContent>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Research Domain vs Reading Stage</Typography>
        <Typography variant="caption" color="text.secondary">Stacked bar showing reading progress across domains</Typography>
        <Box sx={{ mt: 2, height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="domain" tick={{ fill: textColor, fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: textColor, paddingTop: 8 }} iconSize={10} />
              {STAGES.map(stage => <Bar key={stage} dataKey={stage} stackId="a" fill={STAGE_CHART_COLORS[stage]} maxBarSize={60} />)}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent></Card>
    </>
  );
}
