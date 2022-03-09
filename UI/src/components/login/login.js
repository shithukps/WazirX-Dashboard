import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import history from '../../utils/history';
import { useLocation } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import { apiBaseURL } from '../../constants/appconstants';
import { logoutStatus } from '../../constants/globalconstants';
import Link from '@mui/material/Link';

const theme = createTheme();

export default function Login() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        history.replace({
            pathname: '/check_login',
            state: {
                progress: "Please Wait. Checking Keys."
            }
        });
        const payLoad = {
            "api_key": data.get('apikey'),
            "api_secret": data.get('secret'),
        };
        axios.post(apiBaseURL + '/login', payLoad).then((response) => {
            if (response.data["login"] == "success") {
                logoutStatus.done = false;
                history.replace({
                    pathname: '/check_login',
                    state: {
                        progress: "Authentication Success. Getting Data."
                    }
                });
                axios.post(apiBaseURL + '/get_funds', payLoad).then((response) => {
                    history.replace({
                        pathname: '/dashboard',
                        state: {
                            funds: response.data,
                            api_key: payLoad["api_key"],
                            api_secret: payLoad["api_secret"]
                        }
                    });
                }).catch((err) => {
                    history.replace("/");
                });
            } else {
                history.replace("/");
            }
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#2474f2' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="apikey"
                            label="API Key"
                            name="apikey"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="secret"
                            label="Secret"
                            id="secret"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Typography>
                            Get you API Key & Secret from <Link href="https://wazirx.com/blog/create-wazirx-api-key/">here</Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export function LoginCheck() {
    const location = useLocation();
    return (
        <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <Typography component="h1" variant="h5">
                {location.state.progress}
            </Typography>
            <LinearProgress />
        </div>
    );
}