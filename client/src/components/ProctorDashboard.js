import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
    IconButton,
    AppBar,
    Toolbar,
    Divider,
    Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import WifiIcon from '@mui/icons-material/Wifi';

const ProctorDashboard = () => {
    const navigate = useNavigate();
    const [upcomingExams, setUpcomingExams] = useState([
        {
            id: 1,
            title: 'Applied Mechanics',
            course: 'MS- CS, Mid term',
            marks: 200,
            duration: '3 Hr',
            startTime: '10:00 AM',
            date: '20-09-2020',
            type: 'Online Exam'
        },
        {
            id: 2,
            title: 'Applied Mechanics',
            course: 'MS- CS, Mid term',
            marks: 200,
            duration: '3 Hr',
            startTime: '10:00 AM',
            date: '20-09-2020',
            type: 'Online Exam'
        }
    ]);

    const [completedExams, setCompletedExams] = useState([
        {
            id: 3,
            title: 'Applied Mechanics',
            course: 'MS- 1st Term, Mid Term Exam',
            type: 'Pen-Paper based',
            date: '20-09-2020',
            duration: '3 Hours',
            marks: 200,
            startTime: '10:00 AM'
        }
    ]);

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Top Navigation */}
            <AppBar position="static" color="transparent" elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton edge="start" color="inherit">
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="body1" sx={{ ml: 1 }}>
                                Back to Home
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button color="primary">Instructions</Button>
                            <Button color="primary">Report Issue</Button>
                            <Button
                                startIcon={<WifiIcon />}
                                color="primary"
                            >
                                Connectivity test
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Applied Mechanics, MS- CS, Mid term
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1">Marks: 200</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1">Duration: 3 Hr</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Upcoming Exams */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Upcoming Exams to Proctor</Typography>
                        <Chip
                            label="Exam 'Applied Mechanics' starts in: 10 minutes"
                            color="primary"
                            sx={{ ml: 2 }}
                        />
                    </Box>
                    <Grid container spacing={3}>
                        {upcomingExams.map((exam) => (
                            <Grid item xs={12} md={6} key={exam.id}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="h6">{exam.title}</Typography>
                                            <Chip
                                                label={exam.type}
                                                color="success"
                                                size="small"
                                                sx={{ bgcolor: '#e8f5e9' }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {exam.course}
                                        </Typography>
                                        <Grid container spacing={2} sx={{ mt: 1 }}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Date:</Typography>
                                                <Typography variant="body1">{exam.date}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Duration:</Typography>
                                                <Typography variant="body1">{exam.duration}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Marks:</Typography>
                                                <Typography variant="body1">{exam.marks}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Time:</Typography>
                                                <Typography variant="body1">{exam.startTime}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                            <Button variant="outlined" size="small">Verification</Button>
                                            <Button variant="contained" size="small">Start</Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Completed Proctoring */}
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Completed Proctoring
                    </Typography>
                    <Grid container spacing={3}>
                        {completedExams.map((exam) => (
                            <Grid item xs={12} md={6} key={exam.id}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="h6">{exam.title}</Typography>
                                            <Chip
                                                label={exam.type}
                                                color="info"
                                                size="small"
                                                sx={{ bgcolor: '#e3f2fd' }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {exam.course}
                                        </Typography>
                                        <Grid container spacing={2} sx={{ mt: 1 }}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Date:</Typography>
                                                <Typography variant="body1">{exam.date}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Duration:</Typography>
                                                <Typography variant="body1">{exam.duration}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Marks:</Typography>
                                                <Typography variant="body1">{exam.marks}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Time:</Typography>
                                                <Typography variant="body1">{exam.startTime}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ mt: 2 }}>
                                            <Button variant="outlined" size="small">Resume</Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default ProctorDashboard;