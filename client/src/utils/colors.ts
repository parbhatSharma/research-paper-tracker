import type { ReadingStage, ResearchDomain, ImpactScore } from '../types';

const STAGE_COLORS: Record<ReadingStage, { bg: string; color: string }> = {
  'Abstract Read': { bg: '#e3f2fd', color: '#1565c0' },
  'Introduction Done': { bg: '#e8f5e9', color: '#2e7d32' },
  'Methodology Done': { bg: '#fff8e1', color: '#f57f17' },
  'Results Analyzed': { bg: '#fce4ec', color: '#880e4f' },
  'Fully Read': { bg: '#e8eaf6', color: '#283593' },
  'Notes Completed': { bg: '#e0f2f1', color: '#004d40' },
};

export const getStageColor = (stage: ReadingStage) => STAGE_COLORS[stage];

const IMPACT_COLORS: Record<ImpactScore, { bg: string; color: string }> = {
  'High Impact': { bg: '#ffebee', color: '#c62828' },
  'Medium Impact': { bg: '#fff3e0', color: '#e65100' },
  'Low Impact': { bg: '#f3e5f5', color: '#7b1fa2' },
  'Unknown': { bg: '#f5f5f5', color: '#616161' },
};

export const getImpactColor = (impact: ImpactScore) => IMPACT_COLORS[impact];

const DOMAIN_COLORS: Record<ResearchDomain, { bg: string; color: string }> = {
  'Computer Science': { bg: '#e3f2fd', color: '#0d47a1' },
  'Biology': { bg: '#e8f5e9', color: '#1b5e20' },
  'Physics': { bg: '#fff3e0', color: '#bf360c' },
  'Chemistry': { bg: '#fce4ec', color: '#880e4f' },
  'Mathematics': { bg: '#e8eaf6', color: '#1a237e' },
  'Social Sciences': { bg: '#e0f2f1', color: '#004d40' },
};

export const getDomainColor = (domain: ResearchDomain) => DOMAIN_COLORS[domain];

export const STAGE_CHART_COLORS: Record<ReadingStage, string> = {
  'Abstract Read': '#42a5f5',
  'Introduction Done': '#66bb6a',
  'Methodology Done': '#ffa726',
  'Results Analyzed': '#ef5350',
  'Fully Read': '#5c6bc0',
  'Notes Completed': '#26a69a',
};

export const IMPACT_CHART_COLORS: Record<ImpactScore, string> = {
  'High Impact': '#ef5350',
  'Medium Impact': '#ff9800',
  'Low Impact': '#ab47bc',
  'Unknown': '#9e9e9e',
};

export const DOMAIN_CHART_COLORS: Record<ResearchDomain, string> = {
  'Computer Science': '#1976d2',
  'Biology': '#388e3c',
  'Physics': '#f4511e',
  'Chemistry': '#d81b60',
  'Mathematics': '#3949ab',
  'Social Sciences': '#00897b',
};
