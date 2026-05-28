import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import type { Paper, ReadingStage, ResearchDomain, ImpactScore, DateFilter, SortField, SortOrder } from '../types';
import type { Page } from '../App';
import API from '../services/api';

const DOMAINS: ResearchDomain[] = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Social Sciences'];
const STAGES: ReadingStage[] = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
const IMPACTS: ImpactScore[] = ['High Impact', 'Medium Impact', 'Low Impact', 'Unknown'];
const DATE_FILTERS: DateFilter[] = ['This Week', 'This Month', 'Last 3 Months', 'All Time'];

interface Props { papers: Paper[]; onDelete: (id: string) => void; onUpdate: (paper: Paper) => void; onNavigate: (page: Page) => void; }

function isWithinDateFilter(dateStr: string, filter: string) {
    if (filter === 'All Time') return true;

    const date = new Date(dateStr);
    const now = new Date();

    if (filter === 'This Week') {
        const w = new Date(now);
        w.setDate(now.getDate() - 7);
        return date >= w;
    }

    if (filter === 'This Month') {
        const m = new Date(now);
        m.setMonth(now.getMonth() - 1);
        return date >= m;
    }

    if (filter === 'Last 3 Months') {
        const t = new Date(now);
        t.setMonth(now.getMonth() - 3);
        return date >= t;
    }

    return true;
}

export default function LibraryPage({ onDelete, onNavigate }: any) {

    const [papers, setPapers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [selectedImpacts, setSelectedImpacts] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState('All Time');

    const [sortField, setSortField] = useState('dateAdded');
    const [sortOrder, setSortOrder] = useState('desc');

    const [showFilters, setShowFilters] = useState(false);

    const fetchPapers = async () => {
        try {

            const res = await API.get('/papers');

            const formatted = res.data.data.map((paper: any) => ({
                id: paper._id,
                title: paper.title,
                firstAuthor: paper.firstAuthor,
                domain: paper.domain,
                stage: paper.readingStage,
                citationCount: paper.citationCount,
                impact: paper.impactScore,
                dateAdded: paper.dateAdded,
            }));

            setPapers(formatted);

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPapers();
    }, [onDelete]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const filtered = useMemo(() => {

        let result = papers;

        if (search.trim()) {
            const q = search.toLowerCase();

            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.firstAuthor.toLowerCase().includes(q)
            );
        }

        if (selectedDomains.length) {
            result = result.filter((p) =>
                selectedDomains.includes(p.domain)
            );
        }

        if (selectedStages.length) {
            result = result.filter((p) =>
                selectedStages.includes(p.stage)
            );
        }

        if (selectedImpacts.length) {
            result = result.filter((p) =>
                selectedImpacts.includes(p.impact)
            );
        }

        result = result.filter((p) =>
            isWithinDateFilter(p.dateAdded, dateFilter)
        );

        return [...result].sort((a, b) => {

            let cmp = 0;

            if (sortField === 'citationCount') {
                cmp = a.citationCount - b.citationCount;
            } else if (sortField === 'dateAdded') {
                cmp =
                    new Date(a.dateAdded).getTime() -
                    new Date(b.dateAdded).getTime();
            } else {
                cmp = a.title.localeCompare(b.title);
            }

            return sortOrder === 'asc' ? cmp : -cmp;
        });

    }, [
        papers,
        search,
        selectedDomains,
        selectedStages,
        selectedImpacts,
        dateFilter,
        sortField,
        sortOrder,
    ]);

    const hasActiveFilters =
        selectedDomains.length +
        selectedStages.length +
        selectedImpacts.length >
        0 || dateFilter !== 'All Time';

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography>Loading papers...</Typography>
            </Box>
        );
    }

    return (
        <Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                }}
            >
                <Box>
                    <Typography variant="h5">
                        Paper Library
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {filtered.length} of {papers.length} papers
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => onNavigate('add')}
                >
                    Add Paper
                </Button>
            </Box>

            <Card sx={{ mb: 2 }}>
                <CardContent>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                        }}
                    >

                        <TextField
                            placeholder="Search by title or author..."
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ flex: 1, minWidth: 200 }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),

                                    endAdornment: search ? (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => setSearch('')}
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null,
                                },
                            }}
                        />

                        <FormControl size="small" sx={{ minWidth: 130 }}>
                            <InputLabel>Date</InputLabel>

                            <Select
                                value={dateFilter}
                                label="Date"
                                onChange={(e) =>
                                    setDateFilter(e.target.value)
                                }
                            >
                                {DATE_FILTERS.map((d) => (
                                    <MenuItem key={d} value={d}>
                                        {d}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant={showFilters ? 'contained' : 'outlined'}
                            startIcon={<FilterListIcon />}
                            onClick={() => setShowFilters((v) => !v)}
                            size="small"
                        >
                            Filters
                        </Button>

                        {hasActiveFilters && (
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setSelectedDomains([]);
                                    setSelectedStages([]);
                                    setSelectedImpacts([]);
                                    setDateFilter('All Time');
                                }}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>

                    <Collapse in={showFilters}>

                        <Grid container spacing={2} sx={{ mt: 1 }}>

                            <Grid size={{ xs: 12, sm: 4 }}>

                                <FormControl fullWidth size="small">

                                    <InputLabel>Domain</InputLabel>

                                    <Select
                                        multiple
                                        value={selectedDomains}
                                        onChange={(e) =>
                                            setSelectedDomains(e.target.value as string[])
                                        }
                                        input={<OutlinedInput label="Domain" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {(selected as string[]).map((value) => (
                                                    <Chip
                                                        key={value}
                                                        label={value}
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {DOMAINS.map((domain) => (
                                            <MenuItem key={domain} value={domain}>
                                                {domain}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                </FormControl>

                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>

                                <FormControl fullWidth size="small">

                                    <InputLabel>Stage</InputLabel>

                                    <Select
                                        multiple
                                        value={selectedStages}
                                        onChange={(e) =>
                                            setSelectedStages(e.target.value as string[])
                                        }
                                        input={<OutlinedInput label="Stage" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {(selected as string[]).map((value) => (
                                                    <Chip
                                                        key={value}
                                                        label={value}
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {STAGES.map((stage) => (
                                            <MenuItem key={stage} value={stage}>
                                                {stage}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                </FormControl>

                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>

                                <FormControl fullWidth size="small">

                                    <InputLabel>Impact</InputLabel>

                                    <Select
                                        multiple
                                        value={selectedImpacts}
                                        onChange={(e) =>
                                            setSelectedImpacts(e.target.value as string[])
                                        }
                                        input={<OutlinedInput label="Impact" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {(selected as string[]).map((value) => (
                                                    <Chip
                                                        key={value}
                                                        label={value}
                                                        size="small"
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {IMPACTS.map((impact) => (
                                            <MenuItem key={impact} value={impact}>
                                                {impact}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                </FormControl>

                            </Grid>

                        </Grid>

                    </Collapse>


                </CardContent>
            </Card>

            <Card>
                <TableContainer>

                    <Table size="small">

                        <TableHead>
                            <TableRow>

                                <TableCell>
                                    <TableSortLabel
                                        active={sortField === 'title'}
                                        direction={sortOrder as any}
                                        onClick={() => handleSort('title')}
                                    >
                                        Title
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell>Author</TableCell>
                                <TableCell>Domain</TableCell>
                                <TableCell>Stage</TableCell>
                                <TableCell>Impact</TableCell>

                                <TableCell>
                                    <TableSortLabel
                                        active={sortField === 'citationCount'}
                                        direction={sortOrder as any}
                                        onClick={() => handleSort('citationCount')}
                                    >
                                        Citations
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell>
                                    <TableSortLabel
                                        active={sortField === 'dateAdded'}
                                        direction={sortOrder as any}
                                        onClick={() => handleSort('dateAdded')}
                                    >
                                        Date
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell align="right">
                                    Action
                                </TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {filtered.map((p) => (

                                <TableRow key={p._id || p.id} hover> 

                                    <TableCell>
                                        {p.title}
                                    </TableCell>

                                    <TableCell>
                                        {p.firstAuthor}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={p.domain}
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={p.stage}
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={p.impact}
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {p.citationCount}
                                    </TableCell>

                                    <TableCell>
                                        {new Date(
                                            p.dateAdded
                                        ).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell align="right">

                                        <Tooltip title="Delete">

                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => onDelete(p._id || p.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>

                                        </Tooltip>

                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                </TableContainer>
            </Card>

        </Box>
    );
}
