const Card = () => {
  return (
    <div className="min-w-64 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="bg-gray-800 text-white text-center py-3 px-4 font-semibold text-md tracking-wide">
        Maths - MidTerm Exam
      </div>
      <div className="flex flex-col gap-3 p-4 text-gray-700">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Duration:</span>
          <span>2 Hours</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Marks:</span>
          <span>100</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Date:</span>
          <span>12/12/2023</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Time:</span>
          <span>10:00 AM</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Status:</span>
          <span className="text-yellow-600 font-semibold">Upcoming</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Class:</span>
          <span>10</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="font-medium">View Exam:</span>
          <span className="btn text-white font-semibold py-1 px-3 rounded-xl bg-gray-700 cursor-pointer hover:bg-gray-800 transition duration-200">
            View
          </span>
        </div>
      </div>
    </div>
  );
};

export default function UpcomingExams() {
  return (
    <div className="bg-[#e9ecf6] p-8 rounded-lg w-full">
      <span className="menu-title font-semibold text-lg block mb-3">
        Upcoming Exams
      </span>
      <div className="border-1 border-gray-300"></div>
      <div className="flex gap-16 mt-8 flex-wrap justify-center">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}
