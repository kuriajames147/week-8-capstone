import { useState } from 'react';
import api from '../../services/api';

const TaskItem = ({ task }) => {
  const [status, setStatus] = useState(task.status);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await api.put(`/tasks/${task._id}/status`, { status: newStatus });
      setStatus(newStatus);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="task-item">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <select value={status} onChange={handleStatusChange}>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
};

export default TaskItem;