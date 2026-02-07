'use client';

import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

type ParkingToggleProps = Readonly<{
    value: 'yes' | 'no' | null;
    onChange: (value: 'yes' | 'no') => void;
    disabled?: boolean;
}>;

export function ParkingToggle({ value, onChange, disabled = false }: ParkingToggleProps) {
    const yesColor = '#35EECB';
    const noColor = '#E5484D';
    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newValue: 'yes' | 'no' | null
    ) => {
        if (newValue !== null) {
            onChange(newValue);
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="body2"
                sx={{
                    mb: 1.5,
                    color: 'text.secondary',
                    fontWeight: 600,
                }}
            >
                Do you need parking for this event?
            </Typography>

            <ToggleButtonGroup
                value={value}
                exclusive
                onChange={handleChange}
                disabled={disabled}
                fullWidth
                sx={{
                    borderRadius: 999,
                    overflow: 'hidden',
                    backgroundColor: 'common.white',
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: '50%',
                        width: '1px',
                        backgroundColor: 'divider',
                        pointerEvents: 'none',
                    },
                    '& .MuiToggleButton-root': {
                        flex: 1,
                        py: 1.25,
                        fontWeight: 700,
                        textTransform: 'none',
                        backgroundColor: 'transparent',
                        border: 0,
                        color: 'text.secondary',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                        },
                        '&.Mui-selected': {
                            backgroundColor: 'transparent',
                            zIndex: 1,
                        },
                    },
                    '& .MuiToggleButton-root[value="yes"]': {
                        borderTopLeftRadius: 999,
                        borderBottomLeftRadius: 999,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    },
                    '& .MuiToggleButton-root[value="no"]': {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderTopRightRadius: 999,
                        borderBottomRightRadius: 999,
                    },
                    '& .MuiToggleButton-root[value="yes"].Mui-selected': {
                        color: yesColor,
                        boxShadow: `inset 0 0 0 1px ${yesColor}`,
                    },
                    '& .MuiToggleButton-root[value="no"].Mui-selected': {
                        color: noColor,
                        boxShadow: `inset 0 0 0 1px ${noColor}`,
                    },
                    '& .MuiToggleButton-root[value="yes"].Mui-selected:hover': {
                        backgroundColor: 'transparent',
                        boxShadow: `inset 0 0 0 1px ${yesColor}`,
                    },
                    '& .MuiToggleButton-root[value="no"].Mui-selected:hover': {
                        backgroundColor: 'transparent',
                        boxShadow: `inset 0 0 0 1px ${noColor}`,
                    },
                }}
            >
                <ToggleButton value="yes" aria-label="Yes, I need parking">
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                        <CheckIcon sx={{ fontSize: 18, color: 'currentColor' }} />
                        Yes
                    </Box>
                </ToggleButton>
                <ToggleButton value="no" aria-label="No, I don't need parking">
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                        <CloseIcon sx={{ fontSize: 18, color: 'currentColor' }} />
                        No
                    </Box>
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}
