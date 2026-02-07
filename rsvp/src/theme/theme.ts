import {alpha, createTheme} from '@mui/material/styles';

const IZIX = {
    brand: {
        500: '#35EECB',
        600: '#2DCAAD',
        700: '#25A78E',
    },
    gray: {
        0: '#FFFFFF',
        25: '#FCFCFD',
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        900: '#111827',
    },
};

const STATE = {
    hover: alpha('#000', .06),
    pressed: alpha('#000', .1),
    selected: alpha('#000', .08),
    focusRing: alpha(IZIX.brand[500], .35),
};

export const theme = createTheme({
    cssVariables: true,

    palette: {
        mode: 'light',
        primary: {
            main: IZIX.brand[500],
            dark: IZIX.brand[600],
            contrastText: IZIX.gray[900],
        },
        background: {
            default: IZIX.gray[50],
            paper: IZIX.gray[0],
        },
        text: {
            primary: IZIX.gray[900],
            secondary: IZIX.gray[600],
        },
        divider: IZIX.gray[200],
        action: {
            hover: STATE.hover,
            selected: STATE.selected,
            disabledOpacity: 0.45,
        },
    },

    typography: {
        fontFamily: [
            'Inter',
            'system-ui',
            '-apple-system',
            'Segoe UI',
            'Roboto',
            'Arial',
            'sans-serif',
        ].join(','),
        h5: {fontWeight: 700, fontSize: '1.25rem'},
        h6: {fontWeight: 700, fontSize: '1.125rem'},
        subtitle1: {fontWeight: 600},
        button: {textTransform: 'none', fontWeight: 600},
    },

    shape: {
        borderRadius: 14,
    },

    shadows: new Array(25).fill('none') as any,

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: IZIX.gray[0],
                    color: IZIX.gray[900],
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                outlined: {
                    borderColor: IZIX.gray[200],
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    border: `1px solid ${IZIX.gray[200]}`,
                    borderRadius: 16,
                },
            },
        },

        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: 20,
                    '&:last-child': {paddingBottom: 20},
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: IZIX.gray[0],
                    color: IZIX.gray[900],
                    boxShadow: 'none',
                    borderBottom: `1px solid ${IZIX.gray[200]}`,
                },
            },
        },

        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: 72,
                    paddingLeft: 24,
                    paddingRight: 24,
                },
            },
        },

        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    paddingLeft: 16,
                    paddingRight: 16,
                    height: 40,
                    boxShadow: 'none',
                    '&.Mui-focusVisible': {
                        boxShadow: `0 0 0 4px ${STATE.focusRing}`,
                    },
                },

                containedPrimary: {
                    backgroundColor: IZIX.brand[500],
                    color: IZIX.gray[900],
                    '&:hover': {
                        backgroundColor: IZIX.brand[600],
                    },
                    '&:active': {
                        backgroundColor: IZIX.brand[700],
                    },
                    '&.Mui-disabled': {
                        backgroundColor: IZIX.gray[200],
                        color: IZIX.gray[500],
                    },
                },

                outlined: {
                    borderColor: IZIX.brand[500],
                    color: IZIX.brand[600],
                    '&:hover': {
                        borderColor: IZIX.brand[600],
                        backgroundColor: STATE.hover,
                    },
                },
                outlinedError: {
                    borderColor: '#E5484D',
                    color: '#E5484D',
                    '&:hover': {
                        borderColor: '#D64045',
                        backgroundColor: STATE.hover,
                    },
                },

                text: {
                    color: IZIX.gray[900],
                    '&:hover': {
                        backgroundColor: STATE.hover,
                    },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 2,
                    fontWeight: 600,
                    backgroundColor: IZIX.gray[50],
                    border: `1px solid ${IZIX.gray[200]}`,
                },
                label: {
                    paddingLeft: 10,
                    paddingRight: 10,
                },
            },
        },

        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                fullWidth: true,
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backgroundColor: IZIX.gray[0],
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: IZIX.gray[300],
                    },
                    '&.Mui-focused': {
                        boxShadow: `0 0 0 4px ${STATE.focusRing}`,
                    },
                    '&.Mui-error.Mui-focused': {
                        boxShadow: `0 0 0 4px ${alpha('#EF4444', .25)}`,
                    },
                },
                notchedOutline: {
                    borderColor: IZIX.gray[200],
                },
                input: {
                    paddingTop: 12,
                    paddingBottom: 12,
                },
            },
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: IZIX.gray[600],
                    '&.Mui-focused': {
                        color: IZIX.gray[700],
                    },
                },
            },
        },

        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginLeft: 0,
                    marginRight: 0,
                    color: IZIX.gray[600],
                },
            },
        },

        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                    border: `1px solid ${IZIX.gray[200]}`,
                    boxShadow: 'none',
                },
            },
        },

        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    padding: 20,
                    paddingBottom: 12,
                },
            },
        },

        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: 20,
                    paddingTop: 0,
                },
            },
        },

        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: 20,
                    paddingTop: 12,
                    gap: 12,
                },
            },
        },

        MuiToggleButtonGroup: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    overflow: 'hidden',
                    border: `1px solid ${IZIX.gray[200]}`,
                    backgroundColor: IZIX.gray[0],
                },
            },
        },

        MuiToggleButton: {
            styleOverrides: {
                root: {
                    border: 0,
                    borderRadius: 0,
                    height: 44,
                    fontWeight: 700,
                    color: IZIX.gray[700],
                    '&:hover': {
                        backgroundColor: STATE.hover,
                    },
                    '&.Mui-selected': {
                        backgroundColor: IZIX.brand[500],
                        color: IZIX.gray[900],
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: IZIX.brand[600],
                    },
                    '&.Mui-focusVisible': {
                        boxShadow: `0 0 0 4px ${STATE.focusRing}`,
                    },
                },
            },
        },

        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: IZIX.gray[100],
                },
                bar: {
                    borderRadius: 999,
                    backgroundColor: IZIX.brand[500],
                },
            },
        },

        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: IZIX.gray[200],
                },
            },
        },

        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    '&:hover': {
                        backgroundColor: STATE.hover,
                    },
                    '&.Mui-selected': {
                        backgroundColor: STATE.selected,
                    },
                },
            },
        },
    },
});
