import { useState, useEffect } from 'react';
import api from '../services/api';
import useSocket from './useSocket';

const useTasks = (teamId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { socket } = useSocket({
    taskCreated: (newTask) => {
      if (!teamId || newTask.team === teamId) {
        setTasks(prev => [newTask, ...prev]);
      }
    },
    taskUpdated: (updatedTask) => {
      setTasks(prev => prev.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      ));
    }
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const endpoint = teamId ? `/tasks/team/${teamId}` : '/tasks';
        const res = await api.get(endpoint);
        setTasks(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Join team room if teamId is provided
    if (teamId && socket) {
      socket.emit('joinTeams', [teamId]);
    }
  }, [teamId, socket]);

  const createTask = async (taskData) => {
    const res = await api.post('/tasks', taskData);
    return res.data;
  };

  const updateTaskStatus = async (taskId, status) => {
    const res = await api.put(`/tasks/${taskId}/status`, { status });
    return res.data;
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTaskStatus
  };
};

export default useTasks;