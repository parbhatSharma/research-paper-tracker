import React from "react";
import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { getTheme } from './theme';
import { usePapers } from './hooks/usePapers';
import AppHeader from './components/AppHeader';
import AddPaperPage from './pages/AddPaperPage';
import LibraryPage from './pages/LibraryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import API from "./services/api";
export type Page = 'add' | 'library' | 'analytics';

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [page, setPage] = useState<Page>('library');
  const theme = getTheme(mode);

  // const { papers, addPaper, deletePaper, updatePaper } = usePapers();
  const [papers, setPapers] = useState<any[]>([]);
  const toggleMode = () => setMode(m => m === 'light' ? 'dark' : 'light');
  const fetchPapers = async () => {

    try {

      const res = await API.get("/papers");

      setPapers(res.data.data);

    } catch (error) {

      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchPapers();
  }, [papers]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        <AppHeader mode={mode} page={page} setPage={setPage} toggleMode={toggleMode} paperCount={papers.length} />
        <Box component="main" sx={{ flex: 1, py: 3, px: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%', boxSizing: 'border-box' }}>
          {page === 'add' && <AddPaperPage
           onAdd={async (paper: any) => {

            try {
          
              const res = await API.post(
                "/papers",
                paper
              );
          
              // instant UI update
              setPapers((prev: any[]) => [
                res.data.data,
                ...prev,
              ]);
          
              setPage("library");
          
            } catch (error) {
          
              console.log(error);
            }
          }}
            onNavigate={setPage}
          />}
          {page === 'library' && <LibraryPage
            papers={papers}
            onDelete={async (id: string) => {

              try {
            
                // instant UI update
                setPapers((prev: any[]) =>
                  prev.filter(
                    (paper: any) =>
                      (paper._id || paper.id) !== id
                  )
                );
                // backend delete
                await API.delete(`/papers/${id}`);
              } catch (error) {
                console.log(error);
                // optional rollback
                fetchPapers();
              }
            }}
            onNavigate={setPage}
          />}
          {page === 'analytics' && <AnalyticsPage />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
