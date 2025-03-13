import React, { Suspense, lazy } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import useTaskManager from "../../hooks/useTaskManager";

// Lazy loading Statistics component
const Statistics = lazy(() => import("./Statistics"));

const PerformanceDemo = () => {
  const { tasks, addTask, toggleTask, statistics } = useTaskManager();

  return (
    <div className="performance-demo">
      <h1>Task Manager (Performance Optimized)</h1>
      <div className="demo-container">
        <div className="task-section">
          <h2>Add New Task</h2>
          <TaskForm onAddTask={addTask} />
          <TaskList tasks={tasks} onToggle={toggleTask} />
        </div>

        {/* Lazy loading with Suspense */}
        <Suspense
          fallback={<div className="loading">Loading statistics...</div>}
        >
          <Statistics stats={statistics} />
        </Suspense>
      </div>

      <div className="optimization-notes">
        <h3>Performance Optimization Techniques Used:</h3>
        <ul>
          <li>
            <strong>React.memo</strong>: Used in TaskForm, TaskItem, TaskList,
            and Statistics components to prevent unnecessary re-renders
          </li>
          <li>
            <strong>useMemo</strong>: Used for calculating statistics to memoize
            expensive calculations
          </li>
          <li>
            <strong>useCallback</strong>: Used for addTask and toggleTask
            functions to ensure stable function references
          </li>
          <li>
            <strong>Lazy Loading</strong>: Statistics component is loaded lazily
            to reduce initial bundle size
          </li>
          <li>
            <strong>Code Splitting</strong>: Implemented through lazy loading to
            improve initial load time
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceDemo;
