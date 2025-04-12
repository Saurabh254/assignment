import { useState } from "react";
import CreateExamSidebar from "../components/CreateExamSidebar";
import { Question } from "../types";
import CreateQuestion from "../components/CreateQuestion";
import { useNavigate } from "react-router-dom";
import { createExam } from "../services/api";

const CreateExam: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [examTitle, setExamTitle] = useState<string>("");
  const [examDescription, setExamDescription] = useState<string>("");
  const [examDuration, setExamDuration] = useState<number>(60);
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const navigate = useNavigate();

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleQuestionSubmit = (question: Question) => {
    const updatedQuestions = [...questions];
    if (currentQuestionIndex === -1) {
      // New question
      updatedQuestions.push(question);
      setQuestions(updatedQuestions);
      setCurrentQuestionIndex(updatedQuestions.length - 1);
    } else {
      // Update existing question
      updatedQuestions[currentQuestionIndex] = question;
      setQuestions(updatedQuestions);
    }
  };

  const handleExamSubmit = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    if (!examTitle) {
      alert("Please enter an exam title");
      return;
    }

    if (!examDescription) {
      alert("Please enter an exam description");
      return;
    }

    if (!startTime || !endTime) {
      alert("Please set exam start and end times");
      return;
    }

    try {
      const examData = {
        title: examTitle,
        description: examDescription,
        duration: examDuration,
        totalMarks: totalMarks,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
      };

      await createExam(examData);
      navigate("/teacher");
    } catch (error) {
      console.error("Failed to create exam:", error);
      alert("Failed to create exam. Please try again.");
    }
  };

  return (
    <div className="text-black h-full w-full">
      <div className="h-full w-full">
        <div className="w-full h-full flex">
          <CreateExamSidebar
            questions={questions}
            setQuestions={setQuestions}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={handleQuestionSelect}
            examTitle={examTitle}
            setExamTitle={setExamTitle}
            examDescription={examDescription}
            setExamDescription={setExamDescription}
            examDuration={examDuration}
            setExamDuration={setExamDuration}
            totalMarks={totalMarks}
            setTotalMarks={setTotalMarks}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            onSubmit={handleExamSubmit}
          />
          <div className="w-full h-full flex-1">
            <CreateQuestion
              question={
                currentQuestionIndex >= 0
                  ? questions[currentQuestionIndex]
                  : undefined
              }
              onSubmit={handleQuestionSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;
