import React from "react";
import DashboardCard from "../components/DashboardCard";
import UpcomingExams from "../components/UpcomingExams";
import Graph from "../components/AverageExamMarksGraph";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, Student!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your exam performance
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <DashboardCard
              icon="ri-time-line"
              title="Upcoming Exams"
              value={3}
              color="blue"
            />
            <DashboardCard
              icon="ri-file-list-3-line"
              title="Completed Exams"
              value={12}
              color="green"
            />
            <DashboardCard
              icon="ri-medal-line"
              title="Average Score"
              value="85%"
              color="yellow"
            />
          </div>

          {/* Analytics and Upcoming Exams Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Analytics Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Performance Analytics
              </h2>
              <Graph />
            </div>

            {/* Upcoming Exams Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Exams</h2>
              <UpcomingExams />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
