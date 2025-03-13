import React, { memo } from "react";
import TaskItem from "./TaskItem";

const TaskList = memo(({ tasks, onToggle }) => {
  console.log("TaskList rendered");

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} />
      ))}
    </div>
  );
});

export default TaskList;
