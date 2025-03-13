import { useState, useCallback, useMemo } from "react";

const useTaskManager = () => {
  const [tasks, setTasks] = useState([]);

  // useCallback for functions that are passed as props
  const addTask = useCallback((task) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        id: Date.now(),
        text: task,
        completed: false,
      },
    ]);
  }, []);

  const toggleTask = useCallback((taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  // useMemo for expensive calculations
  const statistics = useMemo(() => {
    console.log("Calculating statistics...");
    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.completed).length,
      pending: tasks.filter((task) => !task.completed).length,
    };
  }, [tasks]);

  return {
    tasks,
    addTask,
    toggleTask,
    statistics,
  };
};

export default useTaskManager;
