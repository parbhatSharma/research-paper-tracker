import React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import TitleIcon from '@mui/icons-material/Title';
import PersonIcon from '@mui/icons-material/Person';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { Paper, ResearchDomain, ReadingStage, ImpactScore } from '../types';
import type { Page } from '../App';
import API from "../services/api";

const DOMAINS: ResearchDomain[] = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Social Sciences'];
const STAGES: ReadingStage[] = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
const IMPACTS: ImpactScore[] = ['High Impact', 'Medium Impact', 'Low Impact', 'Unknown'];

interface Props { onAdd: (paper: Omit<Paper, 'id'>) => void; onNavigate: (page: Page) => void; }

const EMPTY_FORM = { title: '', firstAuthor: '', domain: '' as ResearchDomain | '', stage: '' as ReadingStage | '', citationCount: '', impact: '' as ImpactScore | '', dateAdded: new Date().toISOString().split('T')[0] };

export default function AddPaperPage({ onAdd, onNavigate }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.firstAuthor.trim()) e.firstAuthor = 'Author is required';
    if (!form.domain) e.domain = 'Select a domain';
    if (!form.stage) e.stage = 'Select a stage';
    if (form.citationCount === '' || Number(form.citationCount) < 0) e.citationCount = 'Enter valid count';
    if (!form.impact) e.impact = 'Select impact';
    if (!form.dateAdded) e.dateAdded = 'Date required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const errs = validate();
  
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
  
    const paperData = {
      title: form.title.trim(),
      firstAuthor: form.firstAuthor.trim(),
      domain: form.domain,
      readingStage: form.stage,
      citationCount: Number(form.citationCount),
      impactScore: form.impact,
      dateAdded: form.dateAdded,
    };
  
    try {
      const response = await API.post("/papers", paperData);
  
      console.log("Saved Paper:", response.data);
  
      setSuccess(true);
      setErrors({});
      setForm(EMPTY_FORM);
  
      setTimeout(() => setSuccess(false), 4000);
  
    } catch (error) {
      console.log("Error saving paper:", error);
    }
  };

  const set = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(err => { const n = { ...err }; delete n[key]; return n; }); };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>Add New Paper</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Track a new research paper in your library.</Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }} action={<Button size="small" onClick={() => onNavigate('library')}>View Library</Button>}>Paper added!</Alert>}
      <Card><CardContent sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}><TextField label="Paper Title" fullWidth required value={form.title} onChange={set('title')} error={!!errors.title} helperText={errors.title} placeholder="e.g. Attention Is All You Need" slotProps={{ input: { startAdornment: <InputAdornment position="start"><TitleIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="First Author" fullWidth required value={form.firstAuthor} onChange={set('firstAuthor')} error={!!errors.firstAuthor} helperText={errors.firstAuthor} placeholder="e.g. Vaswani" slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Domain" fullWidth required select value={form.domain} onChange={set('domain')} error={!!errors.domain} helperText={errors.domain}><MenuItem value="" disabled>Select domain</MenuItem>{DOMAINS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}</TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Reading Stage" fullWidth required select value={form.stage} onChange={set('stage')} error={!!errors.stage} helperText={errors.stage}><MenuItem value="" disabled>Select stage</MenuItem>{STAGES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Impact" fullWidth required select value={form.impact} onChange={set('impact')} error={!!errors.impact} helperText={errors.impact}><MenuItem value="" disabled>Select impact</MenuItem>{IMPACTS.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}</TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Citations" fullWidth required type="number" value={form.citationCount} onChange={set('citationCount')} error={!!errors.citationCount} helperText={errors.citationCount} slotProps={{ input: { startAdornment: <InputAdornment position="start"><FormatQuoteIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }, htmlInput: { min: 0 } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Date Added" fullWidth required type="date" value={form.dateAdded} onChange={set('dateAdded')} error={!!errors.dateAdded} helperText={errors.dateAdded} slotProps={{ inputLabel: { shrink: true }, input: { startAdornment: <InputAdornment position="start"><CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment> } }} /></Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => { setForm(EMPTY_FORM); setErrors({}); }}>Reset</Button>
            <Button type="submit" variant="contained">Add Paper</Button>
          </Box>
        </Box>
      </CardContent></Card>
    </Box>
  );
}
