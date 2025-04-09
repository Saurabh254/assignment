import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    TextField,
    Alert,
    LinearProgress,
    Card,
    CardContent,
    Stepper,
    Step,
    StepLabel,
    Divider,
    Chip,
    CircularProgress
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TakeExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeTaken, setTimeTaken] = useState([]);
    const [error, setError] = useState('');
    const [remainingTime, setRemainingTime] = useState(null);
    const [examStartTime, setExamStartTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/exam/${examId}`);
                setExam(response.data);
                setAnswers(new Array(response.data.questions.length).fill(''));
                setTimeTaken(new Array(response.data.questions.length).fill(0));
                setExamStartTime(Date.now());
            } catch (err) {
                setError('Failed to load exam');
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [examId]);

    useEffect(() => {
        if (!exam || !examStartTime) return;

        const timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
            const remaining = exam.duration * 60 - elapsed;

            if (remaining <= 0) {
                clearInterval(timer);
                handleSubmit();
            } else {
                setRemainingTime(remaining);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [exam, examStartTime]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (value) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = value;
        setAnswers(newAnswers);

        const newTimeTaken = [...timeTaken];
        newTimeTaken[currentQuestion] = Math.floor((Date.now() - examStartTime) / 1000);
        setTimeTaken(newTimeTaken);
    };

    const handleNext = () => {
        if (currentQuestion < exam.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await axios.post('http://localhost:5000/api/result', {
                examId,
                answers,
                timeTaken
            });
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to submit exam');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!exam) {
        return (
            <Alert severity="error" sx={{ mt: 4 }}>
                Exam not found
            </Alert>
        );
    }

    const question = exam.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / exam.questions.length) * 100;

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Card elevation={3}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5" component="h1" gutterBottom>
                                {exam.title}
                            </Typography>
                            <Chip
                                icon={<TimerIcon />}
                                label={`Time: ${formatTime(remainingTime)}`}
                                color={remainingTime < 300 ? "error" : "primary"}
                                variant="outlined"
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Stepper activeStep={currentQuestion} alternativeLabel>
                                {exam.questions.map((_, index) => (
                                    <Step key={index}>
                                        <StepLabel>{index + 1}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                mb: 3,
                                backgroundColor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                }
                            }}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <Card variant="outlined" sx={{ mb: 3, p: 2, bgcolor: 'grey.50' }}>
                            <Typography variant="h6" gutterBottom>
                                Question {currentQuestion + 1} of {exam.questions.length}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body1" paragraph>
                                {question.questionText}
                            </Typography>
                            <Chip
                                label={question.topic}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                        </Card>

                        <Box sx={{ mb: 3 }}>
                            {question.questionType === 'mcq' ? (
                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <RadioGroup
                                        value={answers[currentQuestion] || ''}
                                        onChange={(e) => handleAnswerChange(e.target.value)}
                                    >
                                        {question.options.map((option, index) => (
                                            <FormControlLabel
                                                key={index}
                                                value={option}
                                                control={<Radio />}
                                                label={option}
                                                sx={{
                                                    mb: 1,
                                                    p: 1,
                                                    borderRadius: 1,
                                                    '&:hover': { bgcolor: 'action.hover' }
                                                }}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            ) : (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    value={answers[currentQuestion] || ''}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                    placeholder="Enter your answer here..."
                                />
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button
                                variant="outlined"
                                startIcon={<NavigateBeforeIcon />}
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                            >
                                Previous
                            </Button>

                            {currentQuestion === exam.questions.length - 1 ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    endIcon={<CheckCircleIcon />}
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Exam'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    endIcon={<NavigateNextIcon />}
                                    onClick={handleNext}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default TakeExam;