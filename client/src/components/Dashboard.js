import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  useTheme,
  alpha,

  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  EmojiEvents as EmojiEventsIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";



const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    completedExams: 0,
    averageScore: 0,
    upcomingExams: 0,
    totalMarks: 0,
    obtainedMarks: 0,
  });

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [examsRes, resultsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/exam"),
          axios.get(
            `http://localhost:5000/api/result/${user.role === "student" ? "student" : "all"
            }`
          ),
        ]);

        setExams(examsRes.data);
        setResults(resultsRes.data);

        if (user.role === "student") {
          const completedExams = resultsRes.data.length;
          const totalMarks = resultsRes.data.reduce(
            (sum, result) => sum + result.exam.totalMarks,
            0
          );
          const obtainedMarks = resultsRes.data.reduce(
            (sum, result) => sum + result.score,
            0
          );
          const averageScore =
            completedExams > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
          const upcomingExams = examsRes.data.filter(
            (exam) =>
              !resultsRes.data.some((result) => result.exam._id === exam._id)
          ).length;

          setStats({
            totalExams: examsRes.data.length,
            completedExams,
            averageScore: Math.round(averageScore),
            upcomingExams,
            totalMarks,
            obtainedMarks,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.role]);

  const handleTakeExam = (examId) => {
    navigate(`/take-exam/${examId}`);
  };

  const handleViewDetails = (resultId) => {
    navigate(`/results/${resultId}`);
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(
          color,
          0.05
        )} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: 2,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              mr: 2,
            }}
          >
            {icon}
          </Avatar>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h4"
          component="div"
          sx={{ color: color, fontWeight: 600 }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const ExamCard = ({
    exam,
    isTeacher = false,
    examStats,
    studentResults = [],
  }) => {
    const result = results.find((r) => r.exam._id === exam._id);

    if (isTeacher) {
      return (
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            },
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {exam.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exam.subject}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    mb: 1,
                  }}
                >
                  <GroupIcon
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    {studentResults.length}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Attempts
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <TimerIcon
                    sx={{
                      fontSize: 20,
                      mr: 1,
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Typography variant="body2">
                    {exam.duration} minutes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <AssessmentIcon
                    sx={{
                      fontSize: 20,
                      mr: 1,
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Typography variant="body2">
                    {exam.totalMarks} marks
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Accordion
              elevation={0}
              sx={{
                "&:before": { display: "none" },
                bgcolor: "transparent",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: 0,
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                  },
                }}
              >
                <Typography color="primary" sx={{ fontWeight: 500 }}>
                  View Performance Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                {studentResults.length > 0 ? (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 1.5,
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              color="success.main"
                              sx={{ fontWeight: 600 }}
                            >
                              {examStats?.averageScore.toFixed(1)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Average Score
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 1.5,
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              color="info.main"
                              sx={{ fontWeight: 600 }}
                            >
                              {examStats?.highestScore}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Highest Score
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 1.5,
                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              color="warning.main"
                              sx={{ fontWeight: 600 }}
                            >
                              {examStats?.lowestScore}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Lowest Score
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box
                            sx={{
                              textAlign: "center",
                              p: 1.5,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              color="primary"
                              sx={{ fontWeight: 600 }}
                            >
                              {studentResults.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Attempts
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Student Name</TableCell>
                            <TableCell align="right">Score</TableCell>
                            <TableCell align="right">Percentage</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {studentResults.map((result) => (
                            <TableRow key={result._id}>
                              <TableCell>{result.student}</TableCell>
                              <TableCell align="right">
                                {result.score}/{exam.totalMarks}
                              </TableCell>
                              <TableCell align="right">
                                {(
                                  (result.score / exam.totalMarks) *
                                  100
                                ).toFixed(1)}
                                %
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    No attempts yet
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          },
          background: result
            ? alpha(theme.palette.success.light, 0.05)
            : "white",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {exam.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {exam.subject}
              </Typography>
            </Box>
            <Chip
              label={result ? "Completed" : "Available"}
              color={result ? "success" : "primary"}
              size="small"
              icon={result ? <CheckCircleIcon /> : undefined}
              sx={{
                borderRadius: "8px",
                "& .MuiChip-label": { px: 2 },
              }}
            />
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <TimerIcon
                  sx={{
                    fontSize: 20,
                    mr: 1,
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography variant="body2">{exam.duration} minutes</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <AssessmentIcon
                  sx={{
                    fontSize: 20,
                    mr: 1,
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography variant="body2">{exam.totalMarks} marks</Typography>
              </Box>
            </Grid>
          </Grid>

          {result && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  p: 2,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                }}
              >
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Score:
                </Typography>
                <Typography
                  variant="h6"
                  color="success.main"
                  sx={{ fontWeight: 600 }}
                >
                  {result.score}/{exam.totalMarks}
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleViewDetails(result._id)}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  py: 1,
                }}
              >
                View Details
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: theme.palette.primary.main,
              mr: 2,
            }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Welcome back, {user.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.role === "teacher"
                ? "Teacher Dashboard"
                : "Student Dashboard"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {user.role === "student" && (
        <>
          {/* Statistics Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Exams"
                value={stats.totalExams}
                icon={<AssessmentIcon />}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed"
                value={stats.completedExams}
                icon={<CheckCircleIcon />}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Average Score"
                value={`${stats.averageScore}%`}
                icon={<TrendingUpIcon />}
                color={theme.palette.info.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Upcoming"
                value={stats.upcomingExams}
                icon={<PendingIcon />}
                color={theme.palette.warning.main}
              />
            </Grid>
          </Grid>

          {/* Progress Section */}
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Overall Performance
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="body1" color="text.secondary">
                  Total Marks Obtained
                </Typography>
                <Typography
                  variant="h6"
                  color="primary.main"
                  sx={{ fontWeight: 600 }}
                >
                  {stats.obtainedMarks}/{stats.totalMarks}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(stats.obtainedMarks / stats.totalMarks) * 100}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 6,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  },
                }}
              />
            </Box>
          </Paper>
        </>
      )}

      {/* Exams Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                gap: 2
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {user.role === "teacher" ? "Created Exams" : "Available Exams"}
              </Typography>
              {user.role === "teacher" && (
                <Button
                  variant="contained"
                  startIcon={<AssessmentIcon />}
                  onClick={() => navigate("/create-exam")}
                >
                  Create Exam
                </Button>
              )}
            </Box>
            <Box>
              {exams.map((exam) => {
                const examResults = results.filter(
                  (r) => r.exam._id === exam._id
                );
                const examStats =
                  examResults.length > 0
                    ? {
                      totalAttempts: examResults.length,
                      averageScore:
                        examResults.reduce(
                          (sum, r) => sum + (r.score / exam.totalMarks) * 100,
                          0
                        ) / examResults.length,
                      highestScore: Math.max(
                        ...examResults.map((r) => r.score)
                      ),
                      lowestScore: Math.min(
                        ...examResults.map((r) => r.score)
                      ),
                    }
                    : undefined;

                return (
                  <ExamCard
                    key={exam._id}
                    exam={exam}
                    isTeacher={user.role === "teacher"}
                    examStats={examStats}
                    studentResults={examResults}
                  />
                );
              })}
              {exams.length === 0 && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ py: 4 }}
                >
                  No exams available at the moment
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Recent Results
            </Typography>
            <Box>
              {results.slice(0, 5).map((result) => (
                <Box
                  key={result._id}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {result.exam.title}
                    </Typography>
                    <Chip
                      label={`${result.score}/${result.exam.totalMarks}`}
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: "8px",
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        "& .MuiChip-label": { px: 2 },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {result.exam.subject}
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => handleViewDetails(result._id)}
                    sx={{
                      mt: 1,
                      textTransform: "none",
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              ))}
              {results.length === 0 && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ py: 4 }}
                >
                  No results available yet
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
