import React, { memo } from "react";

const Statistics = memo(({ stats }) => {
  console.log("Statistics rendered");

  return (
    <div className="statistics">
      <h3>Task Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Total Tasks:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending:</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
      </div>
    </div>
  );
});

export default Statistics;
