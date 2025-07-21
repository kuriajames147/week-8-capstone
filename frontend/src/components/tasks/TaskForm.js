import { useState } from 'react';
import api from '../../services/api';

export default function TaskForm({ teamId, onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    team: teamId || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/tasks', formData);
      onTaskCreated(response.data);
      setFormData({
        title: '',
        description: '',
        team: teamId || ''
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}