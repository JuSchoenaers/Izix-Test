'use client';

import * as React from 'react';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import {theme} from './theme';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

export default function ThemeRegistry({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {children}
                </LocalizationProvider>
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
