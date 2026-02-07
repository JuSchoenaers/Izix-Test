import { Box } from '@mui/material';
import { ReactNode } from 'react';

export default function MobileLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    width: '100%',
                    maxWidth: 480,
                    mx: 'auto',
                    px: 2.5,
                    py: 2.5,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
