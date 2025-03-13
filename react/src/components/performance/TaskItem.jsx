import React, { memo } from "react";

const TaskItem = memo(({ task, onToggle }) => {
  console.log(`TaskItem ${task.id} rendered`);

  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""}`}
      onClick={() => onToggle(task.id)}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="task-checkbox"
      />
      <span className="task-text">{task.text}</span>
    </div>
  );
});

export default TaskItem;
