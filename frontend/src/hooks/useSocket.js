import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import useSocket from '../hooks/useSocket';
import TaskList from '../components/tasks/TaskList';
import TeamList from '../components/teams/TeamList';
import TaskForm from '../components/tasks/TaskForm';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Socket.io for real-time updates
  const { socket } = useSocket({
    taskCreated: (newTask) => {
      if (!selectedTeam || newTask.team === selectedTeam) {
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
    const fetchData = async () => {
      try {
        const [tasksRes, teamsRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/teams')
        ]);
        setTasks(tasksRes.data);
        setTeams(teamsRes.data);
        
        // Join team rooms for real-time updates
        if (socket) {
          socket.emit('joinTeams', teamsRes.data.map(team => team._id));
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [socket]);

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h3>Your Teams</h3>
        <TeamList 
          teams={teams} 
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
        />
      </div>
      
      <div className="main-content">
        <div className="dashboard-header">
          <h2>{selectedTeam ? `${selectedTeam.name} Tasks` : 'All Tasks'}</h2>
          <TaskForm teamId={selectedTeam} onTaskCreated={handleTaskCreated} />
        </div>
        
        <TaskList 
          tasks={selectedTeam 
            ? tasks.filter(task => task.team === selectedTeam)
            : tasks
          } 
        />
      </div>
    </div>
  );
}