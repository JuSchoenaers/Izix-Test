'use client';

import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import { CancelReservationDialog } from "./CancelReservationDialog";

type ReservationConfirmationProps = Readonly<{
    onCancel: () => void;
    isCancelling: boolean;
}>;

export function ReservationConfirmation({ onCancel, isCancelling }: ReservationConfirmationProps) {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    return (
        <Box sx={{ mt: 3 }}>
            <Card
                variant="outlined"
                sx={{
                    textAlign: 'center',
                    py: 2,
                }}
            >
                <CardContent>
                    <Typography 
                        variant="h6" 
                        component="p"
                        sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                        }}
                    >
                        Your parking spot is reserved
                    </Typography>
                </CardContent>
            </Card>

            <Box sx={{ textAlign: 'center', mt: 1.5 }}>
                <Button
                    variant="text"
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={isCancelling}
                    sx={{
                        color: 'error.main',
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline',
                        },
                    }}
                >
                    Cancel reservation
                </Button>
            </Box>

            <CancelReservationDialog
                open={showCancelConfirm}
                onClose={() => setShowCancelConfirm(false)}
                onConfirm={onCancel}
                isCancelling={isCancelling}
            />
        </Box>
    );
}
