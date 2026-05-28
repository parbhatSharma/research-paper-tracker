import React from 'react';
import { useMemo, Suspense, lazy, useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ArticleIcon from '@mui/icons-material/Article';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import type { Paper, ReadingStage, ResearchDomain, ImpactScore } from '../types';
import { STAGE_CHART_COLORS, IMPACT_CHART_COLORS, DOMAIN_CHART_COLORS, getImpactColor } from '../utils/colors';
import API from "../services/api";
import {
    ResponsiveContainer,
    FunnelChart,
    Funnel,
    Tooltip,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar,
    Legend,
  } from 'recharts';
const ChartsContent = lazy(() => import('./ChartsContent'));

const STAGES: ReadingStage[] = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
const DOMAINS: ResearchDomain[] = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Social Sciences'];
const IMPACTS: ImpactScore[] = ['High Impact', 'Medium Impact', 'Low Impact', 'Unknown'];

interface Props { papers: Paper[]; }

interface SummaryCardProps { title: string; value: string | number; subtitle: string; icon: React.ReactNode; color: string; }

function SummaryCard({
    title,
    value,
    subtitle,
    icon,
    color,
  }: any) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
  
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
  
            <Box
              sx={{
                p: 0.75,
                borderRadius: 1.5,
                bgcolor: `${color}18`,
                color,
              }}
            >
              {icon}
            </Box>
          </Box>
  
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
  
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
  
        </CardContent>
      </Card>
    );
  }
  
  export default function AnalyticsPage() {
  
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    const fetchAnalytics = async () => {
  
      try {
  
        const res = await API.get('/papers/analytics');
  
        setAnalytics(res.data);
  
      } catch (error) {
  
        console.log(error);
  
      } finally {
  
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchAnalytics();
    }, []);
  
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 10,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
  
    if (!analytics) {
      return (
        <Typography>
          Failed to load analytics
        </Typography>
      );
    }
  
    const {
        summary,
        stageCounts,
        averages,
        scatterData,
        stackedData,
      } = analytics;
      
      const funnelColors = [
        '#4dabf7',
        '#66bb6a',
        '#ffa726',
        '#ef5350',
        '#5c6bc0',
        '#26a69a',
      ];
      
      const stages = [
        'Abstract Read',
        'Introduction Done',
        'Methodology Done',
        'Results Analyzed',
        'Fully Read',
        'Notes Completed',
      ];
      
      const funnelData = stages.map((stage, index) => ({
        name: stage,
        value: stageCounts[stage] || 0,
        fill: funnelColors[index],
      }));
      
      const impactColors: any = {
        'High Impact': '#ef5350',
        'Medium Impact': '#ffa726',
        'Low Impact': '#ab47bc',
        'Unknown': '#bdbdbd',
      };
      
      const groupedScatterData = [
        'High Impact',
        'Medium Impact',
        'Low Impact',
        'Unknown',
      ].map((impact) => ({
        impact,
        color: impactColors[impact],
        data: scatterData
          .filter((p: any) => p.impact === impact)
          .map((paper: any, index: number) => ({
            x: paper.citations,
            y: index + 1,
          })),
      }));
      
      const domains = [
        'Computer Science',
        'Biology',
        'Physics',
        'Chemistry',
        'Mathematics',
        'Social Sciences',
      ];
      
      const stackedChartData = domains.map((domain) => {
      
        const row: any = {
          domain:
            domain === 'Computer Science'
              ? 'CS'
              : domain === 'Social Sciences'
              ? 'Social'
              : domain,
        };
      
        stages.forEach((stage) => {
      
          row[stage] = stackedData.filter(
            (p: any) =>
              p.domain === domain &&
              p.stage === stage
          ).length;
      
        });
      
        return row;
      });
      
      const totalCitations = scatterData.reduce(
        (sum: number, item: any) =>
          sum + item.citations,
        0
      );
      
      return (
        <Box>
      
          <Typography
            variant="h5"
            sx={{ mb: 0.5 }}
          >
            Analytics Dashboard
          </Typography>
      
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Insights across {summary.totalPapers} tracked papers
          </Typography>
      
          {/* SUMMARY CARDS */}
      
          <Grid container spacing={2} sx={{ mb: 3 }}>
      
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <SummaryCard
                title="Total Papers"
                value={summary.totalPapers}
                subtitle="in your library"
                icon={<ArticleIcon sx={{ fontSize: 20 }} />}
                color="#1976d2"
              />
            </Grid>
      
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <SummaryCard
                title="Fully Read"
                value={summary.fullyRead}
                subtitle="completed papers"
                icon={<CheckCircleIcon sx={{ fontSize: 20 }} />}
                color="#2e7d32"
              />
            </Grid>
      
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <SummaryCard
                title="Completion Rate"
                value={`${summary.completionRate}%`}
                subtitle="Fully Read / Total"
                icon={<TrendingUpIcon sx={{ fontSize: 20 }} />}
                color="#f57c00"
              />
            </Grid>
      
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <SummaryCard
                title="Total Citations"
                value={totalCitations.toLocaleString()}
                subtitle="across all papers"
                icon={<BarChartIcon sx={{ fontSize: 20 }} />}
                color="#c62828"
              />
            </Grid>
      
          </Grid>
      
          {/* PROGRESS SECTION */}
      
          <Grid container spacing={2} sx={{ mb: 3 }}>
      
            <Grid size={{ xs: 12, md: 5 }}>
      
              <Card>
      
                <CardContent>
      
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2.5,
                    }}
                  >
                    Papers by Reading Stage
                  </Typography>
      
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
      
                    {funnelData.map((item) => (
      
                      <Box key={item.name}>
      
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          
                          }}
                        >
      
                          <Typography variant="subtitle1">
                            {item.name}
                          </Typography>
      
                          <Typography
                            variant="h6"
                            // sx={{ fontWeight: 300 }}
                          >
                            {item.value}
                          </Typography>
      
                        </Box>
      
                        <Box
                          sx={{
                            height: 12,
                            borderRadius: 6,
                            bgcolor: 'action.hover',
                            overflow: 'hidden',
                          }}
                        >
      
                          <Box
                            sx={{
                              height: '100%',
                              width: `${
                                (item.value /
                                  summary.totalPapers) *
                                100
                              }%`,
                              bgcolor: item.fill,
                              borderRadius: 6,
                            }}
                          />
      
                        </Box>
      
                      </Box>
                    ))}
      
                  </Box>
      
                </CardContent>
      
              </Card>
      
            </Grid>
      
            <Grid size={{ xs: 12, md: 7 }}>
      
              <Card>
      
                <CardContent>
      
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2.5,
                    }}
                  >
                    Avg Citations per Domain
                  </Typography>
      
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                    }}
                  >
      
                    {averages.map((item: any, index: number) => (
      
                      <Box key={item.domain}>
      
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
      
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 1,
                              alignItems: 'center',
                            }}
                          >
      
                            <Typography variant="subtitle1" >
                              {item.domain}
                            </Typography>
      
                            <Chip
                              label={
                                stackedData.filter(
                                  (p: any) =>
                                    p.domain === item.domain
                                ).length
                              }
                              size="small"
                            />
      
                          </Box>
      
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 500 }}
                          >
                            {Math.round(
                              item.average
                            ).toLocaleString()}
                          </Typography>
      
                        </Box>
      
                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 6,
                            bgcolor: 'action.hover',
                            overflow: 'hidden',
                          }}
                        >
      
                          <Box
                            sx={{
                              height: '100%',
                              width: `${Math.min(
                                item.average / 700,
                                100
                              )}%`,
                              bgcolor:
                                funnelColors[index],
                              borderRadius: 6,
                            }}
                          />
      
                        </Box>
      
                      </Box>
                    ))}
      
                  </Box>
      
                </CardContent>
      
              </Card>
      
            </Grid>
      
          </Grid>
      
          {/* CHARTS */}
      
          <ChartsContent
            funnelData={funnelData}
            scatterData={groupedScatterData}
            stackedData={stackedChartData}
          />
      
        </Box>
      );
      }
    