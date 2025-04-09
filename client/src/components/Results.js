import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    Card,
    CardContent,
    CircularProgress,
    Chip,
    Button,
    Avatar
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimerIcon from '@mui/icons-material/Timer';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Results = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/result/${resultId}`);
                setResult(response.data);
            } catch (err) {
                setError('Failed to load results');
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [resultId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !result) {
        return (
            <Alert severity="error" sx={{ mt: 4 }}>
                {error || 'Result not found'}
            </Alert>
        );
    }

    const topicData = result.weakTopics.map(topic => ({
        name: topic.topic,
        value: topic.score * 100
    }));

    const questionData = result.questionResults.map((q, index) => ({
        name: `Q${index + 1}`,
        time: q.timeTaken,
        correct: q.isCorrect ? 1 : 0
    }));

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mb: 3 }}
                >
                    Back to Dashboard
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Card elevation={3} sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                <AssessmentIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" component="h1" gutterBottom>
                                    Exam Results
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    {result.exam.title} - {result.exam.subject}
                                </Typography>
                            </Box>
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={4}>
                                <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                                    <Typography variant="h3" component="div">
                                        {result.score}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        out of {result.exam.totalMarks}
                                    </Typography>
                                    <Chip
                                        label={result.score >= result.exam.passingMarks ? "PASSED" : "FAILED"}
                                        color={result.score >= result.exam.passingMarks ? "success" : "error"}
                                        sx={{ mt: 1 }}
                                    />
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                        <TimerIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6">Time Taken</Typography>
                                    </Box>
                                    <Typography variant="h4">
                                        {formatTime(result.timeTaken)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        out of {result.exam.duration * 60} seconds
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                        <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6">Performance</Typography>
                                    </Box>
                                    <Typography variant="h4">
                                        {Math.round((result.score / result.exam.totalMarks) * 100)}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Passing: {result.exam.passingMarks} marks
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>

                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            Performance by Topic
                        </Typography>
                        <Box sx={{ height: 300, mb: 4 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={topicData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {topicData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>

                        <Typography variant="h5" gutterBottom>
                            Time per Question
                        </Typography>
                        <Box sx={{ height: 300, mb: 4 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={questionData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="time" name="Time (seconds)" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>

                        <Typography variant="h5" gutterBottom>
                            Weak Topics
                        </Typography>
                        <Card variant="outlined" sx={{ mb: 4 }}>
                            <List>
                                {result.weakTopics.length === 0 ? (
                                    <ListItem>
                                        <ListItemText primary="No weak topics identified. Great job!" />
                                    </ListItem>
                                ) : (
                                    result.weakTopics.map((topic, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={topic.topic}
                                                    secondary={`Score: ${(topic.score * 100).toFixed(1)}%`}
                                                />
                                                <Chip
                                                    label={topic.score < 0.5 ? "Needs Improvement" : "Fair"}
                                                    color={topic.score < 0.5 ? "error" : "warning"}
                                                />
                                            </ListItem>
                                            {index < result.weakTopics.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))
                                )}
                            </List>
                        </Card>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Results;