import { useState } from "react";
import CreateExamSidebar from "../components/CreateExamSidebar";
import { Question } from "../types";
import CreateQuestion from "../components/CreateQuestion";

const CreateExam: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  return (
    <div className="text-black h-full w-full">
      <div className="h-full w-full">
        <div className="w-full h-full flex">
          <CreateExamSidebar
            questions={questions}
            setQeustions={setQuestions}
          />
          <div className=" w-full h-full flex-1 ">
            <CreateQuestion />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;
