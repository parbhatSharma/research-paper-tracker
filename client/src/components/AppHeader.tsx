import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BarChartIcon from '@mui/icons-material/BarChart';
import type { Page } from '../App';

interface Props {
  mode: 'light' | 'dark';
  page: Page;
  setPage: (p: Page) => void;
  toggleMode: () => void;
  paperCount: number;
}

const PAGE_ORDER: Page[] = ['library', 'add', 'analytics'];

export default function AppHeader({ mode, page, setPage, toggleMode, paperCount }: Props) {
  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', color: 'text.primary' }}>
      <Toolbar sx={{ gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
          <MenuBookIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>PaperTracker</Typography>
          <Chip label={paperCount} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
        </Box>
        <Tabs value={PAGE_ORDER.indexOf(page)} onChange={(_, idx) => setPage(PAGE_ORDER[idx])} sx={{ flex: 1 }} indicatorColor="primary" textColor="primary">
          <Tab icon={<LibraryBooksIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Library" />
          <Tab icon={<AddCircleIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Add Paper" />
          <Tab icon={<BarChartIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Analytics" />
        </Tabs>
        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
          <IconButton onClick={toggleMode} color="inherit" size="small">{mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}</IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
