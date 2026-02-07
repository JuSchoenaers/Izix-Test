'use client';

import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import isEmail from "validator/lib/isEmail";
import type { SyntheticEvent } from 'react';
import { useState } from 'react';

type ParkingFormProps = Readonly<{
    name: string;
    licensePlate: string;
    onNameChange: (value: string) => void;
    onLicensePlateChange: (value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    emailLocked?: boolean;
    error?: string | null;
}>;

export function ParkingForm({
    name,
    licensePlate,
    onNameChange,
    onLicensePlateChange,
    onSubmit,
    isSubmitting,
    emailLocked = false,
    error,
}: ParkingFormProps) {
    const [touched, setTouched] = useState({ name: false, licensePlate: false });

    const trimmedEmail = name.trim();
    const nameError = !emailLocked && touched.name && !isEmail(trimmedEmail)
        ? 'Please enter a valid email'
        : null;
    
    const licensePlateError = touched.licensePlate && licensePlate.trim().length < 3 
        ? 'License plate must be at least 3 characters' 
        : null;

    const isEmailValid = emailLocked || isEmail(trimmedEmail);
    const isValid = isEmailValid && licensePlate.trim().length >= 3;

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setTouched({ name: !emailLocked, licensePlate: true });
        if (isValid) {
            onSubmit();
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 2.5 }}
        >
            <Stack spacing={2}>
                <TextField
                    label="Email"
                    placeholder="mail@example.com"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    onBlur={() => {
                        if (!emailLocked) {
                            setTouched(prev => ({ ...prev, name: true }));
                        }
                    }}
                    error={!!nameError}
                    helperText={nameError}
                    disabled={isSubmitting || emailLocked}
                    autoComplete="email"
                    slotProps={{
                        input: { readOnly: emailLocked },
                        htmlInput: { 'aria-label': 'Your email address' },
                    }}
                    sx={{
                        pointerEvents: emailLocked ? 'none' : 'auto',
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: emailLocked ? 'transparent' : undefined,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: emailLocked ? 'transparent' : undefined,
                        },
                        '& .MuiInputLabel-root': {
                            color: emailLocked ? 'text.secondary' : undefined,
                        },
                    }}
                />
                
                <TextField
                    label="License plate"
                    placeholder="1-PUZ-765"
                    value={licensePlate}
                    onChange={(e) => onLicensePlateChange(e.target.value.toUpperCase())}
                    onBlur={() => setTouched(prev => ({ ...prev, licensePlate: true }))}
                    error={!!licensePlateError}
                    helperText={licensePlateError ?? "License plate is needed for parking access"}
                    disabled={isSubmitting}
                    autoComplete="off"
                    required
                    slotProps={{
                        htmlInput: {
                            'aria-label': 'Your license plate',
                            style: { textTransform: 'uppercase' },
                        },
                    }}
                />

                {error && (
                    <Box 
                        sx={{ 
                            color: 'error.main', 
                            fontSize: '0.875rem',
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </Box>
                )}
                
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !isValid}
                    fullWidth
                    sx={{
                        mt: 0.5,
                        height: 44,
                        fontWeight: 700,
                    }}
                >
                    {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Reserve Parking spot'
                    )}
                </Button>
            </Stack>
        </Box>
    );
}
