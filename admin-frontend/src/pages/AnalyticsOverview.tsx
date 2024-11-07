import React from "react";
import PageTemplate from "../components/PageTemplate";

const AnalyticsOverview: React.FC = () => {
  return (
    <PageTemplate title="Analytics Overview">
      <div className="analytics-overview-section space-y-6 p-6 bg-white rounded-lg shadow-lg">
        {/* Summary Section */}
        <div className="summary-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg">
          {/* Summary Cards with Icons */}
          {[
            { title: "Total Users", value: "1,234", color: "blue", icon: "👥" },
            {
              title: "Active Users",
              value: "567",
              color: "yellow",
              icon: "🟡",
            },
            { title: "New Sign-Ups", value: "89", color: "purple", icon: "🆕" },
            {
              title: "Total Revenue",
              value: "$45,678",
              color: "green",
              icon: "💰",
            },
            { title: "Orders", value: "2,345", color: "red", icon: "📦" },
          ].map(({ title, value, color, icon }) => (
            <div
              key={title}
              className={`summary-card bg-white shadow-md rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100`}
            >
              <span className="text-3xl">{icon}</span>
              <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
              <p className={`text-3xl font-bold text-${color}-500`}>{value}</p>
            </div>
          ))}
        </div>

        {/* User Engagement Section */}
        <div className="user-engagement-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-indigo-400 to-pink-500 rounded-lg shadow-lg">
          {[
            {
              title: "Daily Active Users",
              value: "1,200",
              color: "blue",
              icon: "📅",
            },
            {
              title: "Monthly Active Users",
              value: "3,500",
              color: "yellow",
              icon: "📈",
            },
            {
              title: "Retention Rate",
              value: "85%",
              color: "green",
              icon: "🔄",
            },
            {
              title: "Avg. Session Duration",
              value: "15 min",
              color: "purple",
              icon: "⏳",
            },
            {
              title: "Top Activities",
              value: "Watching Videos",
              color: "red",
              icon: "🎥",
            },
          ].map(({ title, value, color, icon }) => (
            <div
              key={title}
              className={`engagement-card bg-white shadow-md rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100`}
            >
              <span className="text-3xl">{icon}</span>
              <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
              <p className={`text-3xl font-bold text-${color}-500`}>{value}</p>
            </div>
          ))}
        </div>

        {/* User Feedback Section */}
        <div className="user-feedback-section grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg">
          {[
            {
              title: "Positive Feedback",
              value: "95%",
              color: "green",
              icon: "👍",
            },
            {
              title: "Negative Feedback",
              value: "5%",
              color: "red",
              icon: "👎",
            },
          ].map(({ title, value, color, icon }) => (
            <div
              key={title}
              className={`feedback-card bg-white shadow-md rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100`}
            >
              <span className="text-3xl">{icon}</span>
              <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
              <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Content Engagement Section */}
        <div className="content-engagement-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-purple-400 to-blue-600 rounded-lg shadow-lg">
          {[
            { title: "Total Posts", value: "300", color: "blue", icon: "📝" },
            { title: "Comments", value: "1,500", color: "yellow", icon: "💬" },
            { title: "Shares", value: "800", color: "red", icon: "🔗" },
          ].map(({ title, value, color, icon }) => (
            <div
              key={title}
              className={`content-card bg-white shadow-md rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100`}
            >
              <span className="text-3xl">{icon}</span>
              <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
              <p className={`text-3xl font-bold text-${color}-500`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Conversion Rates Section */}
        <div className="conversion-rates-section grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-green-500 to-teal-400 rounded-lg shadow-lg">
          {[
            {
              title: "Conversion Rate",
              value: "10%",
              color: "blue",
              icon: "📊",
            },
            {
              title: "Goal Completions",
              value: "200",
              color: "yellow",
              icon: "✅",
            },
          ].map(({ title, value, color, icon }) => (
            <div
              key={title}
              className={`conversion-card bg-white shadow-md rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100`}
            >
              <span className="text-3xl">{icon}</span>
              <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
              <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};

export default AnalyticsOverview;
