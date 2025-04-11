import DashboardCard from "../components/DashboardCard";

const Dashboard = () => {
  return (
    <div className="ml-64 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
};

export default Dashboard;
